import { Nullable } from '@libs/core/common';
import { RegionCodeEnum } from '@prisma/client';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import * as Cheerio from 'cheerio';
import { randomBytes } from 'crypto';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { EPurchaseResultDetail } from 'steam-user';
import { EResult } from 'steamcommunity';
import SteamID from 'steamid';
import { SteamStoreWebApiError } from './steam-store-web-api-errors/steam-store-web-api-error';
import { SteamStoreWebApiErrorsEnum } from './steam-store-web-api-errors/steam-store-web-api-errors.enum';
import { PurchaseResultTranslations, TransactionStatusEnum } from './steam-store-web-api-types/steam-store-web-api.types';

interface SteamStoreWebApiConfig {
  httpProxy?: string;
  userAgent?: string;
  timeout?: number;
}

export default class SteamStoreWebApi {
  private readonly client: AxiosInstance;
  private readonly cookiesMap = new Map<string, string>();

  constructor(config?: SteamStoreWebApiConfig) {
    this.client = axios.create({
      proxy: false,
      httpsAgent: config?.httpProxy ? new HttpsProxyAgent(config.httpProxy) : undefined,
      headers: {
        'User-Agent':
          config?.userAgent ??
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
      },
      timeout: config?.timeout ?? 50000,
      withCredentials: true,
    });

    this.client.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error: AxiosError) {
        if (error.response) {
          const response = error.response;

          if (response.status >= 300 && response.status <= 399 && response.headers.location.indexOf('/login') !== -1) {
            return Promise.reject(new SteamStoreWebApiError(SteamStoreWebApiErrorsEnum.NotLoggedIn, error.message));
          }

          if (response.status >= 400) {
            return Promise.reject(new SteamStoreWebApiError(SteamStoreWebApiErrorsEnum.HttpError, error.message));
          }
        } else if (error.request) {
          return Promise.reject(new SteamStoreWebApiError(SteamStoreWebApiErrorsEnum.NoResponseReceived, error.message));
        }

        return Promise.reject(new SteamStoreWebApiError(SteamStoreWebApiErrorsEnum.UnknownError, error.message));
      },
    );

    // English && UTC
    this.setCookies(['Steam_Language=english', 'timezoneOffset=0,0', 'birthtime=0', 'lastagecheckage=1-0-1988']);
  }

  private get api() {
    return {
      cart: 'https://store.steampowered.com/cart/',
      inittransaction: 'https://checkout.steampowered.com/checkout/inittransaction/',
      getfinalprice: 'https://checkout.steampowered.com/checkout/getfinalprice/',
      finalizetransaction: 'https://checkout.steampowered.com/checkout/finalizetransaction/',
      transactionstatus: 'https://checkout.steampowered.com/checkout/transactionstatus/',
      helpWithMyPurchase: 'https://help.steampowered.com/ru/wizard/HelpWithMyPurchase',
    };
  }

  private updateCookieHeader() {
    this.client.defaults.headers.Cookie = Array.from(this.cookiesMap, ([key, value]) => `${key}=${value}`).join('; ');
  }

  public setCookies(cookies: string[]) {
    cookies.forEach((cookie) => {
      const regex = cookie.match(/(?:^|;)\s*([^=;]*)=([^;]*)/);

      if (regex) {
        const [, key, value] = regex;

        this.cookiesMap.set(key.trim(), value.trim());
      }
    });

    this.updateCookieHeader();
  }

  private setResponseCookies(headers: AxiosResponse['headers']) {
    const cookies = headers['set-cookie'];

    if (cookies) {
      this.setCookies(cookies);
    }
  }

  private get sessionID() {
    const sessionId = this.cookiesMap.get('sessionid');
    if (!sessionId) {
      const newSessionId = randomBytes(12).toString('hex');
      this.setCookies([`sessionid=${newSessionId}`]);

      return newSessionId;
    }

    return sessionId;
  }

  public forgetCart() {
    this.cookiesMap.delete('shoppingCartGID');
    this.cookiesMap.delete('beginCheckoutCart');

    this.updateCookieHeader();
  }

  private get cartID() {
    const cartID = this.cookiesMap.get('shoppingCartGID');
    if (!cartID) {
      throw new SteamStoreWebApiError(SteamStoreWebApiErrorsEnum.CartIdNotFound);
    }

    return cartID;
  }

  public async addToCart(isBundle: boolean, identifier: number) {
    return this.client
      .request<string>({
        method: 'post',
        url: this.api.cart,
        data: {
          sessionid: this.sessionID,
          action: 'add_to_cart',
          snr: '1_5_9__403',
          originating_snr: '1_store-navigation__',
          [isBundle ? 'bundleid' : 'subid']: identifier.toString(),
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(({ data, headers }) => {
        this.setResponseCookies(headers);

        const $ = Cheerio.load(data);

        if (!$('.cart_item_list').children().length) {
          throw new SteamStoreWebApiError(SteamStoreWebApiErrorsEnum.CartIsEmpty);
        }
      });
  }

  public async initTransaction(region: RegionCodeEnum, steamId64: string, gifteeName: string, giftMessage: string, giftSignature: string) {
    return this.client
      .request<{ success: EResult; transid?: string; purchaseresultdetail?: EPurchaseResultDetail }>({
        method: 'post',
        url: this.api.inittransaction,
        data: {
          sessionid: this.sessionID,
          gidShoppingCart: this.cartID,
          gidReplayOfTransID: '-1',
          PaymentMethod: 'steamaccount',
          abortPendingTransactions: 0,
          bUseAccountCart: 0,
          bHasCardInfo: 0,
          Country: region,
          bIsGift: 1,
          GifteeAccountID: new SteamID(steamId64).accountid.toString(),
          ScheduledSendOnDate: 0,
          bSaveBillingAddress: 0,
          bUseRemainingSteamAccount: 1,
          bPreAuthOnly: 0,
          GifteeName: gifteeName,
          GiftMessage: giftMessage,
          Sentiment: 'С наилучшими пожеланиями',
          Signature: giftSignature,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(({ data }) => {
        if (data.success !== EResult.OK) {
          throw new SteamStoreWebApiError(
            SteamStoreWebApiErrorsEnum.InitTransactionFail,
            data.purchaseresultdetail !== undefined ? PurchaseResultTranslations[data.purchaseresultdetail] : JSON.stringify(data),
          );
        }

        if (!data.transid) {
          throw new SteamStoreWebApiError(SteamStoreWebApiErrorsEnum.UnknownTransid);
        }

        return data.transid;
      });
  }

  public async getFinalPrice(transId: string) {
    return this.client
      .request({
        method: 'get',
        url: this.api.getfinalprice,
        params: {
          count: 1,
          transid: transId,
          purchasetype: 'gift',
          microtxnid: -1,
          cart: this.cartID,
          gidReplayOfTransID: -1,
        },
      })
      .then(() => true);
  }

  public async finalizeTransaction(transId: string) {
    return this.client
      .request<{ success: EResult; purchaseresultdetail?: EPurchaseResultDetail }>({
        method: 'post',
        url: this.api.finalizetransaction,
        params: {
          transid: transId,
          CardCVV2: '',
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(async ({ data }) => {
        if (data.success == EResult.OK) {
          return true;
        }

        if (data.success == EResult.Pending) {
          const status = await this.purchasestatus(transId)
          if (!status) {
            throw new SteamStoreWebApiError(
              SteamStoreWebApiErrorsEnum.FailedBuy,
              data.purchaseresultdetail !== undefined ? PurchaseResultTranslations[data.purchaseresultdetail] : JSON.stringify(data),
            );
          }

          if (status?.success == EResult.Fail) {
            throw new SteamStoreWebApiError(
              SteamStoreWebApiErrorsEnum.FailedBuy,
              data.purchaseresultdetail !== undefined ? PurchaseResultTranslations[status.purchasereceipt.resultdetail] : JSON.stringify(status),
            );
          }

          return true
        }

        throw new SteamStoreWebApiError(
          SteamStoreWebApiErrorsEnum.FailedBuy,
          data.purchaseresultdetail !== undefined ? PurchaseResultTranslations[data.purchaseresultdetail] : JSON.stringify(data),
        );
      });
  }

  public async purchasestatus(transId: string) {
    return this.client
      .request<{ success: number, purchasereceipt: { purchasestatus: number, resultdetail: number } }>({
        method: 'get',
        url: this.api.transactionstatus,
        params: {
          count: 1,
          transid: transId,
        },
      })
      .then(({ data }) => {
        // if (data.purchasestatus == EResult.Fail) return false;

        // return true

        return data

      })
      .catch(() => {
        return null
      });
  }

  public async getTransactionStatus(transId: string) {
    return this.client
      .request<{ success: EResult }>({
        method: 'post',
        url: this.api.transactionstatus,
        params: {
          count: 1,
          transid: transId,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(({ data }) => {
        switch (data.success) {
          case EResult.Fail:
            return TransactionStatusEnum.Declined;

          case EResult.OK:
            return TransactionStatusEnum.None;

          default:
            return TransactionStatusEnum.Invalid;
        }
      })
      .catch(() => {
        return TransactionStatusEnum.Invalid;
      });
  }

  async getTransactionAssetID(transId: string, lineItem?: string): Promise<Nullable<string>> {
    try {
      const { data, status, headers } = await this.client.request<string>({
        method: 'get',
        url: this.api.helpWithMyPurchase,
        params: {
          transid: transId,
          line_item: lineItem,
        },
      });

      let html = data;

      if (status === 302 && headers['location']) {
        const redirectedResponse = await this.client.get(headers['location']);

        if (redirectedResponse.status === 200) {
          html = redirectedResponse.data;
        } else {
          return null;
        }
      }

      const href = this.extractHrefFromHTML(html);

      if (href === null && lineItem === undefined) {
        const lineItemParam = this.extractLineItemParamFromHTML(html);

        if (lineItemParam) {
          return this.getTransactionAssetID(transId, lineItemParam);
        }
      }

      if (href) {
        return this.extractAssetIDFromHref(href);
      }

      return null;
    } catch (e) {
      return null;
    }
  }

  private extractHrefFromHTML(html: string): string | null {
    const $ = Cheerio.load(html);
    return (
      $('.wizard_content_wrapper .purchase_line_items div a')?.attr('href') ??
      $('.wizard_content_wrapper .purchase_line_items a')?.attr('href') ??
      null
    );
  }

  private extractLineItemParamFromHTML(html: string): string | null {
    const $ = Cheerio.load(html);
    const purchaseUrl = $('.wizard_content_wrapper .help_purchases a').first().attr('href');

    if (purchaseUrl) {
      const parsedUrl = new URL(purchaseUrl);
      return parsedUrl.searchParams.get('line_item');
    }

    return null;
  }

  private extractAssetIDFromHref(href: string): string | null {
    return href.split('https://steamcommunity.com/my/inventory/#753_1_')[1] ?? null;
  }
}
