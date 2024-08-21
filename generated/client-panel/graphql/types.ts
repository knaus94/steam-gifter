import { LangEnum } from '../../../libs/core/common/src'
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: Date;
  /** The `Translations` Scalar type is used in GraphQL to represent a key-value pair where the key is a `String` representing a language code, and the value is also a `String`. This type of data is commonly used to store and transmit translations of text fragments into different languages. */
  Translations: Partial<Record<LangEnum, Maybe<string>>>;
};

export enum BotErrCodeEnumType {
  AccountLimitations = 'ACCOUNT_LIMITATIONS',
  AuthenticationFailed = 'AUTHENTICATION_FAILED',
  Disconnected = 'DISCONNECTED'
}

export enum BotPanelSortEnumType {
  Id = 'id'
}

export enum BotStatusEnumType {
  Error = 'ERROR',
  Running = 'RUNNING',
  Starting = 'STARTING',
  Stopped = 'STOPPED'
}

export enum DigisellerProductPanelSortEnumType {
  CreatedAt = 'createdAt',
  Id = 'id',
  UpdatedAt = 'updatedAt'
}

export type InputAuthLogInArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type InputAuthLogInDto = {
  expiresAt: Scalars['DateTime'];
  token: Scalars['String'];
  user: InputUserDto;
};

export type InputBotDto = {
  accountName: Scalars['String'];
  avatarUrl?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  region: RegionCodeEnumType;
  steamId64: Scalars['String'];
};

export type InputBotPanelArgs = {
  login?: InputMaybe<Scalars['String']>;
  skip: Scalars['Int'];
  sort: InputBotPanelSortArgs;
  status?: InputMaybe<BotStatusEnumType>;
  steamId64?: InputMaybe<Scalars['String']>;
  take: Scalars['Int'];
};

export type InputBotPanelCreateArgs = {
  accountName: Scalars['String'];
  avatarUrl?: InputMaybe<Scalars['String']>;
  login: Scalars['String'];
  password: Scalars['String'];
  proxyId?: InputMaybe<Scalars['Int']>;
  region: RegionCodeEnumType;
  sharedSecret: Scalars['String'];
  steamId64: Scalars['String'];
};

export type InputBotPanelDto = {
  accountName: Scalars['String'];
  avatarUrl?: InputMaybe<Scalars['String']>;
  balance: Scalars['Float'];
  errCode?: InputMaybe<BotErrCodeEnumType>;
  errMsg?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  login: Scalars['String'];
  password: Scalars['String'];
  proxy?: InputMaybe<InputProxyPanelDto>;
  region: RegionCodeEnumType;
  reservedBalance: Scalars['Float'];
  sharedSecret: Scalars['String'];
  status: BotStatusEnumType;
  steamId64: Scalars['String'];
};

export type InputBotPanelPaginatedDto = {
  records: Array<InputBotPanelDto>;
  total: Scalars['Int'];
};

export type InputBotPanelParseInfoDto = {
  accountName?: InputMaybe<Scalars['String']>;
  avatarUrl?: InputMaybe<Scalars['String']>;
};

export type InputBotPanelSortArgs = {
  field: BotPanelSortEnumType;
  type: SortEnumType;
};

export type InputBotPanelUpdateArgs = {
  accountName: Scalars['String'];
  avatarUrl?: InputMaybe<Scalars['String']>;
  login: Scalars['String'];
  password: Scalars['String'];
  proxyId?: InputMaybe<Scalars['Int']>;
  region: RegionCodeEnumType;
  sharedSecret: Scalars['String'];
  steamId64: Scalars['String'];
};

export type InputBotStatusEventDto = {
  botId: Scalars['Int'];
  errCode?: InputMaybe<BotErrCodeEnumType>;
  errMsg?: InputMaybe<Scalars['String']>;
  newStatus: BotStatusEnumType;
};

export type InputConfigDto = {
  discordLink?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  skypeLink?: InputMaybe<Scalars['String']>;
  supportLink?: InputMaybe<Scalars['String']>;
  telegramLogin?: InputMaybe<Scalars['String']>;
  vkLink?: InputMaybe<Scalars['String']>;
};

export type InputConfigPanelUpdateArgs = {
  discordLink?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  skypeLink?: InputMaybe<Scalars['String']>;
  supportLink?: InputMaybe<Scalars['String']>;
  telegramLogin?: InputMaybe<Scalars['String']>;
  vkLink?: InputMaybe<Scalars['String']>;
};

export type InputDigisellerConfigPanelDto = {
  apiKey?: InputMaybe<Scalars['String']>;
  editionSelectionFieldName: Scalars['Translations'];
  id: Scalars['Int'];
  profileLinkFieldName: Scalars['Translations'];
  regionFieldName: Scalars['Translations'];
  regions: Array<InputDigisellerRegionPanelDto>;
  sellerId?: InputMaybe<Scalars['Int']>;
};

export type InputDigisellerConfigUpdatePanelArgs = {
  apiKey?: InputMaybe<Scalars['String']>;
  editionSelectionFieldName: InputTranslationDto;
  profileLinkFieldName: InputTranslationDto;
  regionFieldName: InputTranslationDto;
  regions: Array<Scalars['String']>;
  sellerId?: InputMaybe<Scalars['Int']>;
};

export type InputDigisellerProductEditionBotPanelArgs = {
  botRegions: Array<RegionCodeEnumType>;
  regionId: Scalars['Int'];
};

export type InputDigisellerProductEditionBotPanelDto = {
  botRegions: Array<RegionCodeEnumType>;
  region: InputDigisellerRegionPanelDto;
};

export type InputDigisellerProductEditionPanelArgs = {
  bots: Array<InputDigisellerProductEditionBotPanelArgs>;
  isDefault?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  productId: Scalars['Int'];
};

export type InputDigisellerProductEditionPanelDto = {
  bots: Array<InputDigisellerProductEditionBotPanelDto>;
  id: Scalars['Int'];
  isDefault: Scalars['Boolean'];
  name?: InputMaybe<Scalars['String']>;
  product: InputProductPanelDto;
};

export type InputDigisellerProductInfoDto = {
  editionEnabled: Scalars['Boolean'];
  editions: Array<Scalars['String']>;
  name: Scalars['String'];
  preview?: InputMaybe<Scalars['String']>;
};

export type InputDigisellerProductPanelArgs = {
  digisellerId?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['Int']>;
  isDisabled?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  skip: Scalars['Int'];
  sort: InputDigisellerProductPanelSortArgs;
  take: Scalars['Int'];
};

export type InputDigisellerProductPanelCreateArgs = {
  digisellerId: Scalars['Int'];
  editionSelection: Scalars['Boolean'];
  editions: Array<InputDigisellerProductEditionPanelArgs>;
  isDisabled: Scalars['Boolean'];
  name: InputTranslationDto;
  previewUrl?: InputMaybe<Scalars['String']>;
  syncPrice?: InputMaybe<Scalars['Boolean']>;
  syncPricePercent: Scalars['Int'];
  syncPriceRegion: RegionCodeEnumType;
};

export type InputDigisellerProductPanelDto = {
  createdAt: Scalars['DateTime'];
  digisellerId: Scalars['Int'];
  editionSelection: Scalars['Boolean'];
  editions: Array<InputDigisellerProductEditionPanelDto>;
  id: Scalars['Int'];
  isDisabled: Scalars['Boolean'];
  name: Scalars['Translations'];
  previewUrl?: InputMaybe<Scalars['String']>;
  syncPrice: Scalars['Boolean'];
  syncPricePercent: Scalars['Int'];
  syncPriceRegion: RegionCodeEnumType;
  updatedAt: Scalars['DateTime'];
};

export type InputDigisellerProductPanelPaginatedDto = {
  records: Array<InputDigisellerProductPanelDto>;
  total: Scalars['Int'];
};

export type InputDigisellerProductPanelSortArgs = {
  field: DigisellerProductPanelSortEnumType;
  type: SortEnumType;
};

export type InputDigisellerProductPanelUpdateArgs = {
  digisellerId: Scalars['Int'];
  editionSelection: Scalars['Boolean'];
  editions: Array<InputDigisellerProductEditionPanelArgs>;
  isDisabled: Scalars['Boolean'];
  name: InputTranslationDto;
  previewUrl?: InputMaybe<Scalars['String']>;
  syncPrice: Scalars['Boolean'];
  syncPricePercent: Scalars['Int'];
  syncPriceRegion: RegionCodeEnumType;
};

export type InputDigisellerRegionPanelDto = {
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type InputOkDto = {
  result?: Scalars['String'];
};

export type InputPaginationArgs = {
  skip: Scalars['Int'];
  take: Scalars['Int'];
};

export type InputProductPanelArgs = {
  name?: InputMaybe<Scalars['String']>;
  skip: Scalars['Int'];
  sort: InputProductPanelSortArgs;
  take: Scalars['Int'];
};

export type InputProductPanelCreateArgs = {
  identifier: Scalars['Int'];
  isBundle: Scalars['Boolean'];
};

export type InputProductPanelDto = {
  autoSync: Array<RegionCodeEnumType>;
  id: Scalars['Int'];
  identifier: Scalars['Int'];
  isBundle: Scalars['Boolean'];
  name: Scalars['String'];
};

export type InputProductPanelPaginatedDto = {
  records: Array<InputProductPanelDto>;
  total: Scalars['Int'];
};

export type InputProductPanelRegionPriceDto = {
  price: Scalars['Float'];
  region: RegionCodeEnumType;
};

export type InputProductPanelSortArgs = {
  field: ProductPanelSortEnumType;
  type: SortEnumType;
};

export type InputProductPanelSteamInfoDto = {
  name?: InputMaybe<Scalars['String']>;
  prices: Array<InputProductPanelRegionPriceDto>;
};

export type InputProductPanelUpdateArgs = {
  autoSync: Array<RegionCodeEnumType>;
  identifier: Scalars['Int'];
  isBundle: Scalars['Boolean'];
  name: Scalars['String'];
  prices: Array<InputProductPanelRegionPriceDto>;
};

export type InputProxyPanelArgs = {
  address?: InputMaybe<Scalars['String']>;
  isValid?: InputMaybe<Scalars['Boolean']>;
  skip: Scalars['Int'];
  sort: InputProxyPanelSortArgs;
  take: Scalars['Int'];
};

export type InputProxyPanelCreateArgs = {
  address: Scalars['String'];
  password?: InputMaybe<Scalars['String']>;
  port: Scalars['Int'];
  username?: InputMaybe<Scalars['String']>;
};

export type InputProxyPanelDto = {
  address: Scalars['String'];
  id: Scalars['Int'];
  isValid: Scalars['Boolean'];
  password?: InputMaybe<Scalars['String']>;
  port: Scalars['Int'];
  username?: InputMaybe<Scalars['String']>;
};

export type InputProxyPanelPaginatedDto = {
  records: Array<InputProxyPanelDto>;
  total: Scalars['Int'];
};

export type InputProxyPanelSortArgs = {
  field: ProxyPanelSortByEnumType;
  type: SortEnumType;
};

export type InputTelegramPanelConfigDto = {
  balanceChatId?: InputMaybe<Scalars['String']>;
  balanceNotification: Scalars['Boolean'];
  balanceThreshold: Scalars['Int'];
  botToken?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  productPricesUpdatedChatId?: InputMaybe<Scalars['String']>;
  productPricesUpdatedNotification: Scalars['Boolean'];
  statusChangeChatId?: InputMaybe<Scalars['String']>;
  statusChangeNotification: Scalars['Boolean'];
};

export type InputTelegramPanelConfigUpdateArgs = {
  balanceChatId?: InputMaybe<Scalars['String']>;
  balanceNotification: Scalars['Boolean'];
  balanceThreshold: Scalars['Int'];
  botToken?: InputMaybe<Scalars['String']>;
  productPricesUpdatedChatId?: InputMaybe<Scalars['String']>;
  productPricesUpdatedNotification: Scalars['Boolean'];
  statusChangeChatId?: InputMaybe<Scalars['String']>;
  statusChangeNotification: Scalars['Boolean'];
};

export type InputTransactionArgs = {
  uniqCode: Scalars['String'];
};

export type InputTransactionDto = {
  bot?: InputMaybe<InputBotDto>;
  createdAt: Scalars['DateTime'];
  edition: InputTransactionEditionDto;
  id: Scalars['Int'];
  logs: Array<InputTransactionStatusLogDto>;
  paymentDetails: InputTransactionPaymentDetailsDto;
  profileLink: Scalars['String'];
  region?: InputMaybe<Scalars['String']>;
  status: TransactionStatusEnumType;
  updatedAt: Scalars['DateTime'];
};

export type InputTransactionEditionDigisellerProductDto = {
  name: InputTranslationDto;
  previewUrl?: InputMaybe<Scalars['String']>;
};

export type InputTransactionEditionDto = {
  digisellerProduct: InputTransactionEditionDigisellerProductDto;
  name?: InputMaybe<Scalars['String']>;
};

export type InputTransactionPanelArgs = {
  id?: InputMaybe<Scalars['Int']>;
  invoice?: InputMaybe<Scalars['Int']>;
  skip: Scalars['Int'];
  sort: InputTransactionPanelSortArgs;
  status?: InputMaybe<TransactionStatusEnumType>;
  take: Scalars['Int'];
  uniqCode?: InputMaybe<Scalars['String']>;
};

export type InputTransactionPanelDto = {
  bot?: InputMaybe<InputBotPanelDto>;
  createdAt: Scalars['DateTime'];
  edition: InputDigisellerProductEditionPanelDto;
  id: Scalars['Int'];
  paymentDetails: InputTransactionPanelPaymentDetailsDto;
  profileLink: Scalars['String'];
  region?: InputMaybe<Scalars['String']>;
  sendAttempts: Scalars['Int'];
  status: TransactionStatusEnumType;
  steamId64?: InputMaybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
};

export type InputTransactionPanelPaginatedDto = {
  records: Array<InputTransactionPanelDto>;
  total: Scalars['Int'];
};

export type InputTransactionPanelPaymentDetailsDto = {
  invoice: Scalars['Int'];
  uniqCode: Scalars['String'];
};

export type InputTransactionPanelSortArgs = {
  field: TransactionPanelSortEnumType;
  type: SortEnumType;
};

export type InputTransactionPanelStatusLogDto = {
  createdAt: Scalars['DateTime'];
  errMsg?: InputMaybe<Scalars['String']>;
  event?: InputMaybe<TransactionEventEnumType>;
  id: Scalars['Int'];
  status: TransactionStatusEnumType;
};

export type InputTransactionPanelStatusLogPaginatedDto = {
  records: Array<InputTransactionPanelStatusLogDto>;
  total: Scalars['Int'];
};

export type InputTransactionPanelUpdateStatusArgs = {
  currentStatus: TransactionStatusEnumType;
  event?: InputMaybe<TransactionEventEnumType>;
  newStatus: TransactionStatusEnumType;
};

export type InputTransactionPaymentDetailsDto = {
  invoice: Scalars['Int'];
};

export type InputTransactionStatusLogDto = {
  createdAt: Scalars['DateTime'];
  errMsg?: InputMaybe<Scalars['String']>;
  event?: InputMaybe<TransactionEventEnumType>;
  id: Scalars['Int'];
  status: TransactionStatusEnumType;
  transaction: InputTransactionStatusLogTransactionDto;
};

export type InputTransactionStatusLogTransactionDto = {
  id: Scalars['Int'];
};

export type InputTransactionUpdateProfileLinkArgs = {
  profileLink: Scalars['String'];
  uniqCode: Scalars['String'];
};

export type InputTranslationDto = {
  en?: InputMaybe<Scalars['String']>;
  ru?: InputMaybe<Scalars['String']>;
};

export type InputUserDto = {
  email: Scalars['String'];
  id: Scalars['Int'];
};

export type InputUserPanelDto = {
  email: Scalars['String'];
  id: Scalars['Int'];
};

export type InputUserPanelUpdatePasswordArgs = {
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  panelBotCreate: ObjectBotPanelDto;
  panelBotRestart: ObjectOkDto;
  panelBotStart: ObjectOkDto;
  panelBotStop: ObjectOkDto;
  panelBotUpdate: ObjectBotPanelDto;
  panelConfigUpdate: ObjectOkDto;
  panelCreateProxy: ObjectProxyPanelDto;
  panelDeleteBot: ObjectOkDto;
  panelDeleteProxy: ObjectOkDto;
  panelDigisellerConfigUpdate: ObjectOkDto;
  panelDigisellerProductCreate: ObjectDigisellerProductPanelDto;
  panelDigisellerProductDelete: ObjectOkDto;
  panelDigisellerProductUpdate: ObjectDigisellerProductPanelDto;
  panelDigisellerSyncPrices: ObjectOkDto;
  panelLogIn: ObjectAuthLogInDto;
  panelProductCreate: ObjectProductPanelDto;
  panelProductDelete: ObjectOkDto;
  panelProductForceUpdatePrices: ObjectOkDto;
  panelProductUpdate: ObjectProductPanelDto;
  panelRestartAllBots: ObjectOkDto;
  panelStartAllBots: ObjectOkDto;
  panelStopAllBots: ObjectOkDto;
  panelTelegramConfigUpdate: ObjectOkDto;
  panelTransactionChangeBot: ObjectTransactionPanelDto;
  panelTransactionResetAttempts: ObjectOkDto;
  panelTransactionUpdateProfileLink: ObjectOkDto;
  panelTransactionUpdateStatus: ObjectOkDto;
  panelUpdatePassword: ObjectOkDto;
  resendTransaction: ObjectOkDto;
  updateTransactionProfileLink: ObjectOkDto;
};


export type MutationPanelBotCreateArgs = {
  args: InputBotPanelCreateArgs;
};


export type MutationPanelBotRestartArgs = {
  botId: Scalars['Int'];
};


export type MutationPanelBotStartArgs = {
  botId: Scalars['Int'];
};


export type MutationPanelBotStopArgs = {
  botId: Scalars['Int'];
};


export type MutationPanelBotUpdateArgs = {
  args: InputBotPanelUpdateArgs;
  id: Scalars['Int'];
};


export type MutationPanelConfigUpdateArgs = {
  args: InputConfigPanelUpdateArgs;
};


export type MutationPanelCreateProxyArgs = {
  args: InputProxyPanelCreateArgs;
};


export type MutationPanelDeleteBotArgs = {
  id: Scalars['Int'];
};


export type MutationPanelDeleteProxyArgs = {
  proxyId: Scalars['Int'];
};


export type MutationPanelDigisellerConfigUpdateArgs = {
  args: InputDigisellerConfigUpdatePanelArgs;
};


export type MutationPanelDigisellerProductCreateArgs = {
  args: InputDigisellerProductPanelCreateArgs;
};


export type MutationPanelDigisellerProductDeleteArgs = {
  id: Scalars['Int'];
};


export type MutationPanelDigisellerProductUpdateArgs = {
  args: InputDigisellerProductPanelUpdateArgs;
  id: Scalars['Int'];
};


export type MutationPanelLogInArgs = {
  args: InputAuthLogInArgs;
};


export type MutationPanelProductCreateArgs = {
  args: InputProductPanelCreateArgs;
};


export type MutationPanelProductDeleteArgs = {
  productId: Scalars['Int'];
};


export type MutationPanelProductUpdateArgs = {
  args: InputProductPanelUpdateArgs;
  productId: Scalars['Int'];
};


export type MutationPanelTelegramConfigUpdateArgs = {
  args: InputTelegramPanelConfigUpdateArgs;
};


export type MutationPanelTransactionChangeBotArgs = {
  botId: Scalars['Int'];
  transactionId: Scalars['Int'];
};


export type MutationPanelTransactionResetAttemptsArgs = {
  transactionId: Scalars['Int'];
};


export type MutationPanelTransactionUpdateProfileLinkArgs = {
  profileLink: Scalars['String'];
  transactionId: Scalars['Int'];
};


export type MutationPanelTransactionUpdateStatusArgs = {
  args: InputTransactionPanelUpdateStatusArgs;
  transactionId: Scalars['Int'];
};


export type MutationPanelUpdatePasswordArgs = {
  args: InputUserPanelUpdatePasswordArgs;
};


export type MutationResendTransactionArgs = {
  args: InputTransactionArgs;
};


export type MutationUpdateTransactionProfileLinkArgs = {
  args: InputTransactionUpdateProfileLinkArgs;
};

export type ObjectAuthLogInDto = {
  __typename?: 'ObjectAuthLogInDto';
  expiresAt: Scalars['DateTime'];
  token: Scalars['String'];
  user: ObjectUserDto;
};

export type ObjectBotDto = {
  __typename?: 'ObjectBotDto';
  accountName: Scalars['String'];
  avatarUrl?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  region: RegionCodeEnumType;
  steamId64: Scalars['String'];
};

export type ObjectBotPanelDto = {
  __typename?: 'ObjectBotPanelDto';
  accountName: Scalars['String'];
  avatarUrl?: Maybe<Scalars['String']>;
  balance: Scalars['Float'];
  errCode?: Maybe<BotErrCodeEnumType>;
  errMsg?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  login: Scalars['String'];
  password: Scalars['String'];
  proxy?: Maybe<ObjectProxyPanelDto>;
  region: RegionCodeEnumType;
  reservedBalance: Scalars['Float'];
  sharedSecret: Scalars['String'];
  status: BotStatusEnumType;
  steamId64: Scalars['String'];
};

export type ObjectBotPanelPaginatedDto = {
  __typename?: 'ObjectBotPanelPaginatedDto';
  records: Array<ObjectBotPanelDto>;
  total: Scalars['Int'];
};

export type ObjectBotPanelParseInfoDto = {
  __typename?: 'ObjectBotPanelParseInfoDto';
  accountName?: Maybe<Scalars['String']>;
  avatarUrl?: Maybe<Scalars['String']>;
};

export type ObjectBotPanelSortArgs = {
  __typename?: 'ObjectBotPanelSortArgs';
  field: BotPanelSortEnumType;
  type: SortEnumType;
};

export type ObjectBotStatusEventDto = {
  __typename?: 'ObjectBotStatusEventDto';
  botId: Scalars['Int'];
  errCode?: Maybe<BotErrCodeEnumType>;
  errMsg?: Maybe<Scalars['String']>;
  newStatus: BotStatusEnumType;
};

export type ObjectConfigDto = {
  __typename?: 'ObjectConfigDto';
  discordLink?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  skypeLink?: Maybe<Scalars['String']>;
  supportLink?: Maybe<Scalars['String']>;
  telegramLogin?: Maybe<Scalars['String']>;
  vkLink?: Maybe<Scalars['String']>;
};

export type ObjectDigisellerConfigPanelDto = {
  __typename?: 'ObjectDigisellerConfigPanelDto';
  apiKey?: Maybe<Scalars['String']>;
  editionSelectionFieldName: Scalars['Translations'];
  id: Scalars['Int'];
  profileLinkFieldName: Scalars['Translations'];
  regionFieldName: Scalars['Translations'];
  regions: Array<ObjectDigisellerRegionPanelDto>;
  sellerId?: Maybe<Scalars['Int']>;
};

export type ObjectDigisellerProductEditionBotPanelArgs = {
  __typename?: 'ObjectDigisellerProductEditionBotPanelArgs';
  botRegions: Array<RegionCodeEnumType>;
  regionId: Scalars['Int'];
};

export type ObjectDigisellerProductEditionBotPanelDto = {
  __typename?: 'ObjectDigisellerProductEditionBotPanelDto';
  botRegions: Array<RegionCodeEnumType>;
  region: ObjectDigisellerRegionPanelDto;
};

export type ObjectDigisellerProductEditionPanelArgs = {
  __typename?: 'ObjectDigisellerProductEditionPanelArgs';
  bots: Array<ObjectDigisellerProductEditionBotPanelArgs>;
  isDefault?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  productId: Scalars['Int'];
};

export type ObjectDigisellerProductEditionPanelDto = {
  __typename?: 'ObjectDigisellerProductEditionPanelDto';
  bots: Array<ObjectDigisellerProductEditionBotPanelDto>;
  id: Scalars['Int'];
  isDefault: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
  product: ObjectProductPanelDto;
};

export type ObjectDigisellerProductInfoDto = {
  __typename?: 'ObjectDigisellerProductInfoDto';
  editionEnabled: Scalars['Boolean'];
  editions: Array<Scalars['String']>;
  name: Scalars['String'];
  preview?: Maybe<Scalars['String']>;
};

export type ObjectDigisellerProductPanelDto = {
  __typename?: 'ObjectDigisellerProductPanelDto';
  createdAt: Scalars['DateTime'];
  digisellerId: Scalars['Int'];
  editionSelection: Scalars['Boolean'];
  editions: Array<ObjectDigisellerProductEditionPanelDto>;
  id: Scalars['Int'];
  isDisabled: Scalars['Boolean'];
  name: Scalars['Translations'];
  previewUrl?: Maybe<Scalars['String']>;
  syncPrice: Scalars['Boolean'];
  syncPricePercent: Scalars['Int'];
  syncPriceRegion: RegionCodeEnumType;
  updatedAt: Scalars['DateTime'];
};

export type ObjectDigisellerProductPanelPaginatedDto = {
  __typename?: 'ObjectDigisellerProductPanelPaginatedDto';
  records: Array<ObjectDigisellerProductPanelDto>;
  total: Scalars['Int'];
};

export type ObjectDigisellerProductPanelSortArgs = {
  __typename?: 'ObjectDigisellerProductPanelSortArgs';
  field: DigisellerProductPanelSortEnumType;
  type: SortEnumType;
};

export type ObjectDigisellerRegionPanelDto = {
  __typename?: 'ObjectDigisellerRegionPanelDto';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type ObjectOkDto = {
  __typename?: 'ObjectOKDto';
  result: Scalars['String'];
};

export type ObjectProductPanelDto = {
  __typename?: 'ObjectProductPanelDto';
  autoSync: Array<RegionCodeEnumType>;
  id: Scalars['Int'];
  identifier: Scalars['Int'];
  isBundle: Scalars['Boolean'];
  name: Scalars['String'];
  prices: Array<ObjectProductPanelRegionPriceDto>;
};

export type ObjectProductPanelPaginatedDto = {
  __typename?: 'ObjectProductPanelPaginatedDto';
  records: Array<ObjectProductPanelDto>;
  total: Scalars['Int'];
};

export type ObjectProductPanelRegionPriceDto = {
  __typename?: 'ObjectProductPanelRegionPriceDto';
  price: Scalars['Float'];
  region: RegionCodeEnumType;
};

export type ObjectProductPanelSortArgs = {
  __typename?: 'ObjectProductPanelSortArgs';
  field: ProductPanelSortEnumType;
  type: SortEnumType;
};

export type ObjectProductPanelSteamInfoDto = {
  __typename?: 'ObjectProductPanelSteamInfoDto';
  name?: Maybe<Scalars['String']>;
  prices: Array<ObjectProductPanelRegionPriceDto>;
};

export type ObjectProxyPanelDto = {
  __typename?: 'ObjectProxyPanelDto';
  address: Scalars['String'];
  countBots: Scalars['Int'];
  id: Scalars['Int'];
  isValid: Scalars['Boolean'];
  password?: Maybe<Scalars['String']>;
  port: Scalars['Int'];
  username?: Maybe<Scalars['String']>;
};

export type ObjectProxyPanelPaginatedDto = {
  __typename?: 'ObjectProxyPanelPaginatedDto';
  records: Array<ObjectProxyPanelDto>;
  total: Scalars['Int'];
};

export type ObjectProxyPanelSortArgs = {
  __typename?: 'ObjectProxyPanelSortArgs';
  field: ProxyPanelSortByEnumType;
  type: SortEnumType;
};

export type ObjectTelegramPanelConfigDto = {
  __typename?: 'ObjectTelegramPanelConfigDto';
  balanceChatId?: Maybe<Scalars['String']>;
  balanceNotification: Scalars['Boolean'];
  balanceThreshold: Scalars['Int'];
  botToken?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  productPricesUpdatedChatId?: Maybe<Scalars['String']>;
  productPricesUpdatedNotification: Scalars['Boolean'];
  statusChangeChatId?: Maybe<Scalars['String']>;
  statusChangeNotification: Scalars['Boolean'];
};

export type ObjectTransactionDto = {
  __typename?: 'ObjectTransactionDto';
  bot?: Maybe<ObjectBotDto>;
  createdAt: Scalars['DateTime'];
  edition: ObjectTransactionEditionDto;
  id: Scalars['Int'];
  logs: Array<ObjectTransactionStatusLogDto>;
  paymentDetails: ObjectTransactionPaymentDetailsDto;
  profileLink: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  status: TransactionStatusEnumType;
  updatedAt: Scalars['DateTime'];
};

export type ObjectTransactionEditionDigisellerProductDto = {
  __typename?: 'ObjectTransactionEditionDigisellerProductDto';
  name: ObjectTranslationDto;
  previewUrl?: Maybe<Scalars['String']>;
};

export type ObjectTransactionEditionDto = {
  __typename?: 'ObjectTransactionEditionDto';
  digisellerProduct: ObjectTransactionEditionDigisellerProductDto;
  name?: Maybe<Scalars['String']>;
};

export type ObjectTransactionPanelDto = {
  __typename?: 'ObjectTransactionPanelDto';
  bot?: Maybe<ObjectBotPanelDto>;
  createdAt: Scalars['DateTime'];
  edition: ObjectDigisellerProductEditionPanelDto;
  id: Scalars['Int'];
  paymentDetails: ObjectTransactionPanelPaymentDetailsDto;
  profileLink: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  sendAttempts: Scalars['Int'];
  status: TransactionStatusEnumType;
  steamId64?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
};

export type ObjectTransactionPanelPaginatedDto = {
  __typename?: 'ObjectTransactionPanelPaginatedDto';
  records: Array<ObjectTransactionPanelDto>;
  total: Scalars['Int'];
};

export type ObjectTransactionPanelPaymentDetailsDto = {
  __typename?: 'ObjectTransactionPanelPaymentDetailsDto';
  invoice: Scalars['Int'];
  uniqCode: Scalars['String'];
};

export type ObjectTransactionPanelSortArgs = {
  __typename?: 'ObjectTransactionPanelSortArgs';
  field: TransactionPanelSortEnumType;
  type: SortEnumType;
};

export type ObjectTransactionPanelStatusLogDto = {
  __typename?: 'ObjectTransactionPanelStatusLogDto';
  createdAt: Scalars['DateTime'];
  errMsg?: Maybe<Scalars['String']>;
  event?: Maybe<TransactionEventEnumType>;
  id: Scalars['Int'];
  status: TransactionStatusEnumType;
};

export type ObjectTransactionPanelStatusLogPaginatedDto = {
  __typename?: 'ObjectTransactionPanelStatusLogPaginatedDto';
  records: Array<ObjectTransactionPanelStatusLogDto>;
  total: Scalars['Int'];
};

export type ObjectTransactionPaymentDetailsDto = {
  __typename?: 'ObjectTransactionPaymentDetailsDto';
  invoice: Scalars['Int'];
};

export type ObjectTransactionStatusLogDto = {
  __typename?: 'ObjectTransactionStatusLogDto';
  createdAt: Scalars['DateTime'];
  errMsg?: Maybe<Scalars['String']>;
  event?: Maybe<TransactionEventEnumType>;
  id: Scalars['Int'];
  status: TransactionStatusEnumType;
  transaction: ObjectTransactionStatusLogTransactionDto;
};

export type ObjectTransactionStatusLogTransactionDto = {
  __typename?: 'ObjectTransactionStatusLogTransactionDto';
  id: Scalars['Int'];
};

export type ObjectTranslationDto = {
  __typename?: 'ObjectTranslationDto';
  en?: Maybe<Scalars['String']>;
  ru?: Maybe<Scalars['String']>;
};

export type ObjectUserDto = {
  __typename?: 'ObjectUserDto';
  email: Scalars['String'];
  id: Scalars['Int'];
};

export type ObjectUserPanelDto = {
  __typename?: 'ObjectUserPanelDto';
  email: Scalars['String'];
  id: Scalars['Int'];
};

export enum ProductPanelSortEnumType {
  Id = 'id'
}

export enum ProxyPanelSortByEnumType {
  Bots = 'bots',
  Id = 'id'
}

export type Query = {
  __typename?: 'Query';
  config: ObjectConfigDto;
  me: ObjectUserPanelDto;
  panelBot?: Maybe<ObjectBotPanelDto>;
  panelBots: ObjectBotPanelPaginatedDto;
  panelConfig: ObjectConfigDto;
  panelCountBotsOnline: Scalars['Int'];
  panelDigisellerConfig: ObjectDigisellerConfigPanelDto;
  panelDigisellerParseProductInfo: ObjectDigisellerProductInfoDto;
  panelDigisellerProduct?: Maybe<ObjectDigisellerProductPanelDto>;
  panelDigisellerProducts: ObjectDigisellerProductPanelPaginatedDto;
  panelDigisellerRegions: Array<ObjectDigisellerRegionPanelDto>;
  panelParseBotInfo: ObjectBotPanelParseInfoDto;
  panelProduct?: Maybe<ObjectProductPanelDto>;
  panelProductSteamBundleInfo: ObjectProductPanelSteamInfoDto;
  panelProductSteamPackageInfo: ObjectProductPanelSteamInfoDto;
  panelProducts: ObjectProductPanelPaginatedDto;
  panelProxies: ObjectProxyPanelPaginatedDto;
  panelTelegramConfig: ObjectTelegramPanelConfigDto;
  panelTransaction?: Maybe<ObjectTransactionPanelDto>;
  panelTransactionLogs: ObjectTransactionPanelStatusLogPaginatedDto;
  panelTransactions: ObjectTransactionPanelPaginatedDto;
  transaction: ObjectTransactionDto;
};


export type QueryPanelBotArgs = {
  id: Scalars['Int'];
};


export type QueryPanelBotsArgs = {
  args: InputBotPanelArgs;
};


export type QueryPanelDigisellerParseProductInfoArgs = {
  digisellerId: Scalars['Int'];
};


export type QueryPanelDigisellerProductArgs = {
  id: Scalars['Int'];
};


export type QueryPanelDigisellerProductsArgs = {
  args: InputDigisellerProductPanelArgs;
};


export type QueryPanelParseBotInfoArgs = {
  steamId64: Scalars['String'];
};


export type QueryPanelProductArgs = {
  productId: Scalars['Int'];
};


export type QueryPanelProductSteamBundleInfoArgs = {
  bundleId: Scalars['Int'];
};


export type QueryPanelProductSteamPackageInfoArgs = {
  packageId: Scalars['Int'];
};


export type QueryPanelProductsArgs = {
  args: InputProductPanelArgs;
};


export type QueryPanelProxiesArgs = {
  args: InputProxyPanelArgs;
};


export type QueryPanelTransactionArgs = {
  transactionId: Scalars['Int'];
};


export type QueryPanelTransactionLogsArgs = {
  args: InputPaginationArgs;
  transactionId: Scalars['Int'];
};


export type QueryPanelTransactionsArgs = {
  args: InputTransactionPanelArgs;
};


export type QueryTransactionArgs = {
  args: InputTransactionArgs;
};

export enum RegionCodeEnumType {
  Ar = 'AR',
  Eu = 'EU',
  Kz = 'KZ',
  Ru = 'RU',
  Tr = 'TR',
  Ua = 'UA',
  Us = 'US'
}

export enum SortEnumType {
  Asc = 'asc',
  Desc = 'desc'
}

export type Subscription = {
  __typename?: 'Subscription';
  PanelBotStatusStream: ObjectBotStatusEventDto;
  PanelTransactionStatusStream: ObjectTransactionStatusLogDto;
  TransactionStatusStream: ObjectTransactionStatusLogDto;
};


export type SubscriptionTransactionStatusStreamArgs = {
  args: InputTransactionArgs;
};

export enum TransactionEventEnumType {
  BotIsOffline = 'BOT_IS_OFFLINE',
  BotNotFound = 'BOT_NOT_FOUND',
  Fail = 'FAIL',
  FailedGetSteamId = 'FAILED_GET_STEAM_ID',
  FriendRequestCanceled = 'FRIEND_REQUEST_CANCELED',
  FriendRequestFail = 'FRIEND_REQUEST_FAIL',
  FriendTimeout = 'FRIEND_TIMEOUT',
  GiftDeclined = 'GIFT_DECLINED',
  ProfileLinkNotValid = 'PROFILE_LINK_NOT_VALID',
  PurchaseInfoIsNull = 'PURCHASE_INFO_IS_NULL',
  PurchaseInfoNotAvailable = 'PURCHASE_INFO_NOT_AVAILABLE',
  Resend = 'RESEND'
}

export enum TransactionPanelSortEnumType {
  CreatedA = 'createdA',
  Id = 'id',
  Status = 'status',
  UpdatedAt = 'updatedAt'
}

export enum TransactionStatusEnumType {
  Created = 'CREATED',
  Error = 'ERROR',
  FriendRequestSent = 'FRIEND_REQUEST_SENT',
  Process = 'PROCESS',
  SentGift = 'SENT_GIFT',
  Success = 'SUCCESS'
}

export type PanelBotRestartMutationVariables = Exact<{
  botId: Scalars['Int'];
}>;


export type PanelBotRestartMutation = { __typename?: 'Mutation', panelBotRestart: { __typename?: 'ObjectOKDto', result: string } };

export type PanelBotStartMutationVariables = Exact<{
  botId: Scalars['Int'];
}>;


export type PanelBotStartMutation = { __typename?: 'Mutation', panelBotStart: { __typename?: 'ObjectOKDto', result: string } };

export type PanelBotStopMutationVariables = Exact<{
  botId: Scalars['Int'];
}>;


export type PanelBotStopMutation = { __typename?: 'Mutation', panelBotStop: { __typename?: 'ObjectOKDto', result: string } };

export type PanelBotCreateMutationVariables = Exact<{
  args: InputBotPanelCreateArgs;
}>;


export type PanelBotCreateMutation = { __typename?: 'Mutation', panelBotCreate: { __typename?: 'ObjectBotPanelDto', steamId64: string, status: BotStatusEnumType, login: string, id: number, balance: number, errCode?: BotErrCodeEnumType | null, errMsg?: string | null } };

export type DeleteBotMutationVariables = Exact<{
  deleteBotId: Scalars['Int'];
}>;


export type DeleteBotMutation = { __typename?: 'Mutation', panelDeleteBot: { __typename?: 'ObjectOKDto', result: string } };

export type PanelBotUpdateMutationVariables = Exact<{
  panelBotUpdateId: Scalars['Int'];
  args: InputBotPanelUpdateArgs;
}>;


export type PanelBotUpdateMutation = { __typename?: 'Mutation', panelBotUpdate: { __typename?: 'ObjectBotPanelDto', steamId64: string, status: BotStatusEnumType, login: string, id: number, balance: number, errCode?: BotErrCodeEnumType | null, errMsg?: string | null } };

export type PanelBotQueryVariables = Exact<{
  panelBotId: Scalars['Int'];
}>;


export type PanelBotQuery = { __typename?: 'Query', panelBot?: { __typename?: 'ObjectBotPanelDto', id: number, status: BotStatusEnumType, steamId64: string, sharedSecret: string, reservedBalance: number, region: RegionCodeEnumType, password: string, login: string, errMsg?: string | null, errCode?: BotErrCodeEnumType | null, balance: number, avatarUrl?: string | null, accountName: string, proxy?: { __typename?: 'ObjectProxyPanelDto', address: string, port: number, username?: string | null, password?: string | null } | null } | null };

export type PanelBotsQueryVariables = Exact<{
  args: InputBotPanelArgs;
}>;


export type PanelBotsQuery = { __typename?: 'Query', panelBots: { __typename?: 'ObjectBotPanelPaginatedDto', total: number, records: Array<{ __typename?: 'ObjectBotPanelDto', steamId64: string, status: BotStatusEnumType, login: string, id: number, balance: number, errCode?: BotErrCodeEnumType | null, errMsg?: string | null, proxy?: { __typename?: 'ObjectProxyPanelDto', address: string, port: number, username?: string | null, password?: string | null, isValid: boolean } | null }> } };

export type ParseBotInfoQueryVariables = Exact<{
  steamId64: Scalars['String'];
}>;


export type ParseBotInfoQuery = { __typename?: 'Query', panelParseBotInfo: { __typename?: 'ObjectBotPanelParseInfoDto', accountName?: string | null, avatarUrl?: string | null } };

export type PanelRestartAllBotsMutationVariables = Exact<{ [key: string]: never; }>;


export type PanelRestartAllBotsMutation = { __typename?: 'Mutation', panelRestartAllBots: { __typename?: 'ObjectOKDto', result: string } };

export type PanelStartAllBotsMutationVariables = Exact<{ [key: string]: never; }>;


export type PanelStartAllBotsMutation = { __typename?: 'Mutation', panelStartAllBots: { __typename?: 'ObjectOKDto', result: string } };

export type PanelStopAllBotsMutationVariables = Exact<{ [key: string]: never; }>;


export type PanelStopAllBotsMutation = { __typename?: 'Mutation', panelStopAllBots: { __typename?: 'ObjectOKDto', result: string } };

export type BotStatusStreamSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type BotStatusStreamSubscription = { __typename?: 'Subscription', PanelBotStatusStream: { __typename?: 'ObjectBotStatusEventDto', botId: number, errCode?: BotErrCodeEnumType | null, errMsg?: string | null, newStatus: BotStatusEnumType } };

export type PanelUpdatePasswordMutationVariables = Exact<{
  args: InputUserPanelUpdatePasswordArgs;
}>;


export type PanelUpdatePasswordMutation = { __typename?: 'Mutation', panelUpdatePassword: { __typename?: 'ObjectOKDto', result: string } };

export type PanelConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type PanelConfigQuery = { __typename?: 'Query', panelConfig: { __typename?: 'ObjectConfigDto', id: number, email?: string | null, discordLink?: string | null, skypeLink?: string | null, supportLink?: string | null, telegramLogin?: string | null, vkLink?: string | null } };

export type PanelConfigUpdateMutationVariables = Exact<{
  args: InputConfigPanelUpdateArgs;
}>;


export type PanelConfigUpdateMutation = { __typename?: 'Mutation', panelConfigUpdate: { __typename?: 'ObjectOKDto', result: string } };

export type PanelCreateProxyMutationVariables = Exact<{
  args: InputProxyPanelCreateArgs;
}>;


export type PanelCreateProxyMutation = { __typename?: 'Mutation', panelCreateProxy: { __typename?: 'ObjectProxyPanelDto', username?: string | null, port: number, password?: string | null, id: number, countBots: number, address: string, isValid: boolean } };

export type PanelDeleteProxyMutationVariables = Exact<{
  proxyId: Scalars['Int'];
}>;


export type PanelDeleteProxyMutation = { __typename?: 'Mutation', panelDeleteProxy: { __typename?: 'ObjectOKDto', result: string } };

export type PanelDigisellerConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type PanelDigisellerConfigQuery = { __typename?: 'Query', panelDigisellerConfig: { __typename?: 'ObjectDigisellerConfigPanelDto', apiKey?: string | null, editionSelectionFieldName: Partial<Record<LangEnum, Maybe<string>>>, id: number, profileLinkFieldName: Partial<Record<LangEnum, Maybe<string>>>, regionFieldName: Partial<Record<LangEnum, Maybe<string>>>, sellerId?: number | null, regions: Array<{ __typename?: 'ObjectDigisellerRegionPanelDto', id: number, name: string }> } };

export type PanelDigisellerRegionsQueryVariables = Exact<{ [key: string]: never; }>;


export type PanelDigisellerRegionsQuery = { __typename?: 'Query', panelDigisellerRegions: Array<{ __typename?: 'ObjectDigisellerRegionPanelDto', id: number, name: string }> };

export type PanelDigisellerConfigUpdateMutationVariables = Exact<{
  args: InputDigisellerConfigUpdatePanelArgs;
}>;


export type PanelDigisellerConfigUpdateMutation = { __typename?: 'Mutation', panelDigisellerConfigUpdate: { __typename?: 'ObjectOKDto', result: string } };

export type GetPanelProxiesQueryVariables = Exact<{
  args: InputProxyPanelArgs;
}>;


export type GetPanelProxiesQuery = { __typename?: 'Query', panelProxies: { __typename?: 'ObjectProxyPanelPaginatedDto', total: number, records: Array<{ __typename?: 'ObjectProxyPanelDto', address: string, countBots: number, id: number, password?: string | null, port: number, username?: string | null, isValid: boolean }> } };

export type CreateGiftMutationVariables = Exact<{
  args: InputDigisellerProductPanelCreateArgs;
}>;


export type CreateGiftMutation = { __typename?: 'Mutation', panelDigisellerProductCreate: { __typename?: 'ObjectDigisellerProductPanelDto', previewUrl?: string | null, name: Partial<Record<LangEnum, Maybe<string>>>, isDisabled: boolean, editionSelection: boolean, digisellerId: number, syncPrice: boolean, syncPricePercent: number, syncPriceRegion: RegionCodeEnumType, editions: Array<{ __typename?: 'ObjectDigisellerProductEditionPanelDto', name?: string | null, isDefault: boolean, bots: Array<{ __typename?: 'ObjectDigisellerProductEditionBotPanelDto', botRegions: Array<RegionCodeEnumType>, region: { __typename?: 'ObjectDigisellerRegionPanelDto', id: number, name: string } }>, product: { __typename?: 'ObjectProductPanelDto', autoSync: Array<RegionCodeEnumType>, id: number, identifier: number, isBundle: boolean, name: string, prices: Array<{ __typename?: 'ObjectProductPanelRegionPriceDto', price: number, region: RegionCodeEnumType }> } }> } };

export type DeleteGiftMutationVariables = Exact<{
  digisellerProductDeleteId: Scalars['Int'];
}>;


export type DeleteGiftMutation = { __typename?: 'Mutation', panelDigisellerProductDelete: { __typename?: 'ObjectOKDto', result: string } };

export type GetGiftByIdQueryVariables = Exact<{
  digisellerProductId: Scalars['Int'];
}>;


export type GetGiftByIdQuery = { __typename?: 'Query', panelDigisellerProduct?: { __typename?: 'ObjectDigisellerProductPanelDto', previewUrl?: string | null, name: Partial<Record<LangEnum, Maybe<string>>>, isDisabled: boolean, createdAt: Date, updatedAt: Date, id: number, editionSelection: boolean, digisellerId: number, syncPrice: boolean, syncPricePercent: number, syncPriceRegion: RegionCodeEnumType, editions: Array<{ __typename?: 'ObjectDigisellerProductEditionPanelDto', id: number, name?: string | null, isDefault: boolean, bots: Array<{ __typename?: 'ObjectDigisellerProductEditionBotPanelDto', botRegions: Array<RegionCodeEnumType>, region: { __typename?: 'ObjectDigisellerRegionPanelDto', id: number, name: string } }>, product: { __typename?: 'ObjectProductPanelDto', id: number, name: string } }> } | null };

export type GetGiftsQueryVariables = Exact<{
  args: InputDigisellerProductPanelArgs;
}>;


export type GetGiftsQuery = { __typename?: 'Query', panelDigisellerProducts: { __typename?: 'ObjectDigisellerProductPanelPaginatedDto', total: number, records: Array<{ __typename?: 'ObjectDigisellerProductPanelDto', digisellerId: number, editionSelection: boolean, id: number, isDisabled: boolean, name: Partial<Record<LangEnum, Maybe<string>>>, previewUrl?: string | null, createdAt: Date, updatedAt: Date, editions: Array<{ __typename?: 'ObjectDigisellerProductEditionPanelDto', id: number, name?: string | null, bots: Array<{ __typename?: 'ObjectDigisellerProductEditionBotPanelDto', botRegions: Array<RegionCodeEnumType>, region: { __typename?: 'ObjectDigisellerRegionPanelDto', id: number, name: string } }>, product: { __typename?: 'ObjectProductPanelDto', autoSync: Array<RegionCodeEnumType>, id: number, identifier: number, isBundle: boolean, name: string, prices: Array<{ __typename?: 'ObjectProductPanelRegionPriceDto', price: number, region: RegionCodeEnumType }> } }> }> } };

export type ParseDigisellerProductInfoQueryVariables = Exact<{
  digisellerId: Scalars['Int'];
}>;


export type ParseDigisellerProductInfoQuery = { __typename?: 'Query', panelDigisellerParseProductInfo: { __typename?: 'ObjectDigisellerProductInfoDto', name: string, preview?: string | null, editionEnabled: boolean, editions: Array<string> } };

export type PanelDigisellerSyncPricesMutationVariables = Exact<{ [key: string]: never; }>;


export type PanelDigisellerSyncPricesMutation = { __typename?: 'Mutation', panelDigisellerSyncPrices: { __typename?: 'ObjectOKDto', result: string } };

export type UpdateGiftMutationVariables = Exact<{
  digisellerProductUpdateId: Scalars['Int'];
  args: InputDigisellerProductPanelUpdateArgs;
}>;


export type UpdateGiftMutation = { __typename?: 'Mutation', panelDigisellerProductUpdate: { __typename?: 'ObjectDigisellerProductPanelDto', id: number, name: Partial<Record<LangEnum, Maybe<string>>> } };

export type PanelLogInMutationVariables = Exact<{
  args: InputAuthLogInArgs;
}>;


export type PanelLogInMutation = { __typename?: 'Mutation', panelLogIn: { __typename?: 'ObjectAuthLogInDto', expiresAt: Date, token: string, user: { __typename?: 'ObjectUserDto', email: string, id: number } } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'ObjectUserPanelDto', id: number } };

export type PanelProductCreateMutationVariables = Exact<{
  args: InputProductPanelCreateArgs;
}>;


export type PanelProductCreateMutation = { __typename?: 'Mutation', panelProductCreate: { __typename?: 'ObjectProductPanelDto', name: string, isBundle: boolean, identifier: number, id: number, autoSync: Array<RegionCodeEnumType>, prices: Array<{ __typename?: 'ObjectProductPanelRegionPriceDto', price: number, region: RegionCodeEnumType }> } };

export type PanelProductDeleteMutationVariables = Exact<{
  productId: Scalars['Int'];
}>;


export type PanelProductDeleteMutation = { __typename?: 'Mutation', panelProductDelete: { __typename?: 'ObjectOKDto', result: string } };

export type GetPricesForBundleQueryVariables = Exact<{
  bundleId: Scalars['Int'];
}>;


export type GetPricesForBundleQuery = { __typename?: 'Query', panelProductSteamBundleInfo: { __typename?: 'ObjectProductPanelSteamInfoDto', name?: string | null, prices: Array<{ __typename?: 'ObjectProductPanelRegionPriceDto', region: RegionCodeEnumType, price: number }> } };

export type GetPricesForPackageQueryVariables = Exact<{
  packageId: Scalars['Int'];
}>;


export type GetPricesForPackageQuery = { __typename?: 'Query', panelProductSteamPackageInfo: { __typename?: 'ObjectProductPanelSteamInfoDto', name?: string | null, prices: Array<{ __typename?: 'ObjectProductPanelRegionPriceDto', region: RegionCodeEnumType, price: number }> } };

export type PanelProductQueryVariables = Exact<{
  productId: Scalars['Int'];
}>;


export type PanelProductQuery = { __typename?: 'Query', panelProduct?: { __typename?: 'ObjectProductPanelDto', autoSync: Array<RegionCodeEnumType>, id: number, identifier: number, isBundle: boolean, name: string, prices: Array<{ __typename?: 'ObjectProductPanelRegionPriceDto', region: RegionCodeEnumType, price: number }> } | null };

export type PanelProductsQueryVariables = Exact<{
  args: InputProductPanelArgs;
}>;


export type PanelProductsQuery = { __typename?: 'Query', panelProducts: { __typename?: 'ObjectProductPanelPaginatedDto', total: number, records: Array<{ __typename?: 'ObjectProductPanelDto', autoSync: Array<RegionCodeEnumType>, id: number, identifier: number, isBundle: boolean, name: string, prices: Array<{ __typename?: 'ObjectProductPanelRegionPriceDto', price: number, region: RegionCodeEnumType }> }> } };

export type PanelProductForceUpdatePricesMutationVariables = Exact<{ [key: string]: never; }>;


export type PanelProductForceUpdatePricesMutation = { __typename?: 'Mutation', panelProductForceUpdatePrices: { __typename?: 'ObjectOKDto', result: string } };

export type PanelProductUpdateMutationVariables = Exact<{
  productId: Scalars['Int'];
  args: InputProductPanelUpdateArgs;
}>;


export type PanelProductUpdateMutation = { __typename?: 'Mutation', panelProductUpdate: { __typename?: 'ObjectProductPanelDto', autoSync: Array<RegionCodeEnumType>, id: number, identifier: number, isBundle: boolean, name: string, prices: Array<{ __typename?: 'ObjectProductPanelRegionPriceDto', region: RegionCodeEnumType, price: number }> } };

export type PanelTelegramConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type PanelTelegramConfigQuery = { __typename?: 'Query', panelTelegramConfig: { __typename?: 'ObjectTelegramPanelConfigDto', statusChangeNotification: boolean, statusChangeChatId?: string | null, id: number, botToken?: string | null, balanceThreshold: number, balanceNotification: boolean, balanceChatId?: string | null, productPricesUpdatedNotification: boolean, productPricesUpdatedChatId?: string | null } };

export type PanelTelegramConfigUpdateMutationVariables = Exact<{
  args: InputTelegramPanelConfigUpdateArgs;
}>;


export type PanelTelegramConfigUpdateMutation = { __typename?: 'Mutation', panelTelegramConfigUpdate: { __typename?: 'ObjectOKDto', result: string } };

export type PanelTransactionChangeBotMutationVariables = Exact<{
  botId: Scalars['Int'];
  transactionId: Scalars['Int'];
}>;


export type PanelTransactionChangeBotMutation = { __typename?: 'Mutation', panelTransactionChangeBot: { __typename?: 'ObjectTransactionPanelDto', bot?: { __typename?: 'ObjectBotPanelDto', accountName: string, id: number } | null } };

export type PanelTransactionUpdateStatusMutationVariables = Exact<{
  transactionId: Scalars['Int'];
  args: InputTransactionPanelUpdateStatusArgs;
}>;


export type PanelTransactionUpdateStatusMutation = { __typename?: 'Mutation', panelTransactionUpdateStatus: { __typename?: 'ObjectOKDto', result: string } };

export type PanelTransactionLogsQueryVariables = Exact<{
  transactionId: Scalars['Int'];
  args: InputPaginationArgs;
}>;


export type PanelTransactionLogsQuery = { __typename?: 'Query', panelTransactionLogs: { __typename?: 'ObjectTransactionPanelStatusLogPaginatedDto', total: number, records: Array<{ __typename?: 'ObjectTransactionPanelStatusLogDto', status: TransactionStatusEnumType, id: number, event?: TransactionEventEnumType | null, errMsg?: string | null, createdAt: Date }> } };

export type PanelTransactionQueryVariables = Exact<{
  transactionId: Scalars['Int'];
}>;


export type PanelTransactionQuery = { __typename?: 'Query', panelTransaction?: { __typename?: 'ObjectTransactionPanelDto', updatedAt: Date, steamId64?: string | null, status: TransactionStatusEnumType, sendAttempts: number, region?: string | null, profileLink: string, id: number, createdAt: Date, paymentDetails: { __typename?: 'ObjectTransactionPanelPaymentDetailsDto', uniqCode: string, invoice: number }, edition: { __typename?: 'ObjectDigisellerProductEditionPanelDto', name?: string | null, product: { __typename?: 'ObjectProductPanelDto', name: string } }, bot?: { __typename?: 'ObjectBotPanelDto', id: number, accountName: string, login: string, steamId64: string } | null } | null };

export type GetPanelTransactionsQueryVariables = Exact<{
  args: InputTransactionPanelArgs;
}>;


export type GetPanelTransactionsQuery = { __typename?: 'Query', panelTransactions: { __typename?: 'ObjectTransactionPanelPaginatedDto', total: number, records: Array<{ __typename?: 'ObjectTransactionPanelDto', updatedAt: Date, steamId64?: string | null, status: TransactionStatusEnumType, sendAttempts: number, region?: string | null, profileLink: string, id: number, createdAt: Date, paymentDetails: { __typename?: 'ObjectTransactionPanelPaymentDetailsDto', uniqCode: string, invoice: number }, edition: { __typename?: 'ObjectDigisellerProductEditionPanelDto', id: number, name?: string | null, bots: Array<{ __typename?: 'ObjectDigisellerProductEditionBotPanelDto', botRegions: Array<RegionCodeEnumType>, region: { __typename?: 'ObjectDigisellerRegionPanelDto', id: number, name: string } }>, product: { __typename?: 'ObjectProductPanelDto', name: string } }, bot?: { __typename?: 'ObjectBotPanelDto', accountName: string, login: string } | null }> } };

export type ResetAttempMutationVariables = Exact<{
  transactionId: Scalars['Int'];
}>;


export type ResetAttempMutation = { __typename?: 'Mutation', panelTransactionResetAttempts: { __typename?: 'ObjectOKDto', result: string } };

export type PanelTransactionStatusStreamSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type PanelTransactionStatusStreamSubscription = { __typename?: 'Subscription', PanelTransactionStatusStream: { __typename?: 'ObjectTransactionStatusLogDto', createdAt: Date, errMsg?: string | null, event?: TransactionEventEnumType | null, id: number, status: TransactionStatusEnumType, transaction: { __typename?: 'ObjectTransactionStatusLogTransactionDto', id: number } } };

export type PanelTransactionUpdateProfileLinkMutationVariables = Exact<{
  transactionId: Scalars['Int'];
  profileLink: Scalars['String'];
}>;


export type PanelTransactionUpdateProfileLinkMutation = { __typename?: 'Mutation', panelTransactionUpdateProfileLink: { __typename?: 'ObjectOKDto', result: string } };


export const PanelBotRestartDocument = gql`
    mutation PanelBotRestart($botId: Int!) {
  panelBotRestart(botId: $botId) {
    result
  }
}
    `;
export type PanelBotRestartMutationFn = Apollo.MutationFunction<PanelBotRestartMutation, PanelBotRestartMutationVariables>;

/**
 * __usePanelBotRestartMutation__
 *
 * To run a mutation, you first call `usePanelBotRestartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePanelBotRestartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [panelBotRestartMutation, { data, loading, error }] = usePanelBotRestartMutation({
 *   variables: {
 *      botId: // value for 'botId'
 *   },
 * });
 */
export function usePanelBotRestartMutation(baseOptions?: Apollo.MutationHookOptions<PanelBotRestartMutation, PanelBotRestartMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PanelBotRestartMutation, PanelBotRestartMutationVariables>(PanelBotRestartDocument, options);
      }
export type PanelBotRestartMutationHookResult = ReturnType<typeof usePanelBotRestartMutation>;
export type PanelBotRestartMutationResult = Apollo.MutationResult<PanelBotRestartMutation>;
export type PanelBotRestartMutationOptions = Apollo.BaseMutationOptions<PanelBotRestartMutation, PanelBotRestartMutationVariables>;
export const PanelBotStartDocument = gql`
    mutation PanelBotStart($botId: Int!) {
  panelBotStart(botId: $botId) {
    result
  }
}
    `;
export type PanelBotStartMutationFn = Apollo.MutationFunction<PanelBotStartMutation, PanelBotStartMutationVariables>;

/**
 * __usePanelBotStartMutation__
 *
 * To run a mutation, you first call `usePanelBotStartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePanelBotStartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [panelBotStartMutation, { data, loading, error }] = usePanelBotStartMutation({
 *   variables: {
 *      botId: // value for 'botId'
 *   },
 * });
 */
export function usePanelBotStartMutation(baseOptions?: Apollo.MutationHookOptions<PanelBotStartMutation, PanelBotStartMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PanelBotStartMutation, PanelBotStartMutationVariables>(PanelBotStartDocument, options);
      }
export type PanelBotStartMutationHookResult = ReturnType<typeof usePanelBotStartMutation>;
export type PanelBotStartMutationResult = Apollo.MutationResult<PanelBotStartMutation>;
export type PanelBotStartMutationOptions = Apollo.BaseMutationOptions<PanelBotStartMutation, PanelBotStartMutationVariables>;
export const PanelBotStopDocument = gql`
    mutation PanelBotStop($botId: Int!) {
  panelBotStop(botId: $botId) {
    result
  }
}
    `;
export type PanelBotStopMutationFn = Apollo.MutationFunction<PanelBotStopMutation, PanelBotStopMutationVariables>;

/**
 * __usePanelBotStopMutation__
 *
 * To run a mutation, you first call `usePanelBotStopMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePanelBotStopMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [panelBotStopMutation, { data, loading, error }] = usePanelBotStopMutation({
 *   variables: {
 *      botId: // value for 'botId'
 *   },
 * });
 */
export function usePanelBotStopMutation(baseOptions?: Apollo.MutationHookOptions<PanelBotStopMutation, PanelBotStopMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PanelBotStopMutation, PanelBotStopMutationVariables>(PanelBotStopDocument, options);
      }
export type PanelBotStopMutationHookResult = ReturnType<typeof usePanelBotStopMutation>;
export type PanelBotStopMutationResult = Apollo.MutationResult<PanelBotStopMutation>;
export type PanelBotStopMutationOptions = Apollo.BaseMutationOptions<PanelBotStopMutation, PanelBotStopMutationVariables>;
export const PanelBotCreateDocument = gql`
    mutation PanelBotCreate($args: InputBotPanelCreateArgs!) {
  panelBotCreate(args: $args) {
    steamId64
    status
    login
    id
    balance
    errCode
    errMsg
  }
}
    `;
export type PanelBotCreateMutationFn = Apollo.MutationFunction<PanelBotCreateMutation, PanelBotCreateMutationVariables>;

/**
 * __usePanelBotCreateMutation__
 *
 * To run a mutation, you first call `usePanelBotCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePanelBotCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [panelBotCreateMutation, { data, loading, error }] = usePanelBotCreateMutation({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function usePanelBotCreateMutation(baseOptions?: Apollo.MutationHookOptions<PanelBotCreateMutation, PanelBotCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PanelBotCreateMutation, PanelBotCreateMutationVariables>(PanelBotCreateDocument, options);
      }
export type PanelBotCreateMutationHookResult = ReturnType<typeof usePanelBotCreateMutation>;
export type PanelBotCreateMutationResult = Apollo.MutationResult<PanelBotCreateMutation>;
export type PanelBotCreateMutationOptions = Apollo.BaseMutationOptions<PanelBotCreateMutation, PanelBotCreateMutationVariables>;
export const DeleteBotDocument = gql`
    mutation DeleteBot($deleteBotId: Int!) {
  panelDeleteBot(id: $deleteBotId) {
    result
  }
}
    `;
export type DeleteBotMutationFn = Apollo.MutationFunction<DeleteBotMutation, DeleteBotMutationVariables>;

/**
 * __useDeleteBotMutation__
 *
 * To run a mutation, you first call `useDeleteBotMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBotMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBotMutation, { data, loading, error }] = useDeleteBotMutation({
 *   variables: {
 *      deleteBotId: // value for 'deleteBotId'
 *   },
 * });
 */
export function useDeleteBotMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBotMutation, DeleteBotMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteBotMutation, DeleteBotMutationVariables>(DeleteBotDocument, options);
      }
export type DeleteBotMutationHookResult = ReturnType<typeof useDeleteBotMutation>;
export type DeleteBotMutationResult = Apollo.MutationResult<DeleteBotMutation>;
export type DeleteBotMutationOptions = Apollo.BaseMutationOptions<DeleteBotMutation, DeleteBotMutationVariables>;
export const PanelBotUpdateDocument = gql`
    mutation PanelBotUpdate($panelBotUpdateId: Int!, $args: InputBotPanelUpdateArgs!) {
  panelBotUpdate(id: $panelBotUpdateId, args: $args) {
    steamId64
    status
    login
    id
    balance
    errCode
    errMsg
  }
}
    `;
export type PanelBotUpdateMutationFn = Apollo.MutationFunction<PanelBotUpdateMutation, PanelBotUpdateMutationVariables>;

/**
 * __usePanelBotUpdateMutation__
 *
 * To run a mutation, you first call `usePanelBotUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePanelBotUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [panelBotUpdateMutation, { data, loading, error }] = usePanelBotUpdateMutation({
 *   variables: {
 *      panelBotUpdateId: // value for 'panelBotUpdateId'
 *      args: // value for 'args'
 *   },
 * });
 */
export function usePanelBotUpdateMutation(baseOptions?: Apollo.MutationHookOptions<PanelBotUpdateMutation, PanelBotUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PanelBotUpdateMutation, PanelBotUpdateMutationVariables>(PanelBotUpdateDocument, options);
      }
export type PanelBotUpdateMutationHookResult = ReturnType<typeof usePanelBotUpdateMutation>;
export type PanelBotUpdateMutationResult = Apollo.MutationResult<PanelBotUpdateMutation>;
export type PanelBotUpdateMutationOptions = Apollo.BaseMutationOptions<PanelBotUpdateMutation, PanelBotUpdateMutationVariables>;
export const PanelBotDocument = gql`
    query PanelBot($panelBotId: Int!) {
  panelBot(id: $panelBotId) {
    id
    status
    steamId64
    sharedSecret
    reservedBalance
    region
    proxy {
      address
      port
      username
      password
    }
    password
    login
    errMsg
    errCode
    balance
    avatarUrl
    accountName
  }
}
    `;

/**
 * __usePanelBotQuery__
 *
 * To run a query within a React component, call `usePanelBotQuery` and pass it any options that fit your needs.
 * When your component renders, `usePanelBotQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePanelBotQuery({
 *   variables: {
 *      panelBotId: // value for 'panelBotId'
 *   },
 * });
 */
export function usePanelBotQuery(baseOptions: Apollo.QueryHookOptions<PanelBotQuery, PanelBotQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PanelBotQuery, PanelBotQueryVariables>(PanelBotDocument, options);
      }
export function usePanelBotLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PanelBotQuery, PanelBotQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PanelBotQuery, PanelBotQueryVariables>(PanelBotDocument, options);
        }
export type PanelBotQueryHookResult = ReturnType<typeof usePanelBotQuery>;
export type PanelBotLazyQueryHookResult = ReturnType<typeof usePanelBotLazyQuery>;
export type PanelBotQueryResult = Apollo.QueryResult<PanelBotQuery, PanelBotQueryVariables>;
export const PanelBotsDocument = gql`
    query PanelBots($args: InputBotPanelArgs!) {
  panelBots(args: $args) {
    total
    records {
      steamId64
      status
      login
      id
      balance
      errCode
      errMsg
      proxy {
        address
        port
        username
        password
        isValid
      }
    }
  }
}
    `;

/**
 * __usePanelBotsQuery__
 *
 * To run a query within a React component, call `usePanelBotsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePanelBotsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePanelBotsQuery({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function usePanelBotsQuery(baseOptions: Apollo.QueryHookOptions<PanelBotsQuery, PanelBotsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PanelBotsQuery, PanelBotsQueryVariables>(PanelBotsDocument, options);
      }
export function usePanelBotsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PanelBotsQuery, PanelBotsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PanelBotsQuery, PanelBotsQueryVariables>(PanelBotsDocument, options);
        }
export type PanelBotsQueryHookResult = ReturnType<typeof usePanelBotsQuery>;
export type PanelBotsLazyQueryHookResult = ReturnType<typeof usePanelBotsLazyQuery>;
export type PanelBotsQueryResult = Apollo.QueryResult<PanelBotsQuery, PanelBotsQueryVariables>;
export const ParseBotInfoDocument = gql`
    query ParseBotInfo($steamId64: String!) {
  panelParseBotInfo(steamId64: $steamId64) {
    accountName
    avatarUrl
  }
}
    `;

/**
 * __useParseBotInfoQuery__
 *
 * To run a query within a React component, call `useParseBotInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useParseBotInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useParseBotInfoQuery({
 *   variables: {
 *      steamId64: // value for 'steamId64'
 *   },
 * });
 */
export function useParseBotInfoQuery(baseOptions: Apollo.QueryHookOptions<ParseBotInfoQuery, ParseBotInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ParseBotInfoQuery, ParseBotInfoQueryVariables>(ParseBotInfoDocument, options);
      }
export function useParseBotInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ParseBotInfoQuery, ParseBotInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ParseBotInfoQuery, ParseBotInfoQueryVariables>(ParseBotInfoDocument, options);
        }
export type ParseBotInfoQueryHookResult = ReturnType<typeof useParseBotInfoQuery>;
export type ParseBotInfoLazyQueryHookResult = ReturnType<typeof useParseBotInfoLazyQuery>;
export type ParseBotInfoQueryResult = Apollo.QueryResult<ParseBotInfoQuery, ParseBotInfoQueryVariables>;
export const PanelRestartAllBotsDocument = gql`
    mutation PanelRestartAllBots {
  panelRestartAllBots {
    result
  }
}
    `;
export type PanelRestartAllBotsMutationFn = Apollo.MutationFunction<PanelRestartAllBotsMutation, PanelRestartAllBotsMutationVariables>;

/**
 * __usePanelRestartAllBotsMutation__
 *
 * To run a mutation, you first call `usePanelRestartAllBotsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePanelRestartAllBotsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [panelRestartAllBotsMutation, { data, loading, error }] = usePanelRestartAllBotsMutation({
 *   variables: {
 *   },
 * });
 */
export function usePanelRestartAllBotsMutation(baseOptions?: Apollo.MutationHookOptions<PanelRestartAllBotsMutation, PanelRestartAllBotsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PanelRestartAllBotsMutation, PanelRestartAllBotsMutationVariables>(PanelRestartAllBotsDocument, options);
      }
export type PanelRestartAllBotsMutationHookResult = ReturnType<typeof usePanelRestartAllBotsMutation>;
export type PanelRestartAllBotsMutationResult = Apollo.MutationResult<PanelRestartAllBotsMutation>;
export type PanelRestartAllBotsMutationOptions = Apollo.BaseMutationOptions<PanelRestartAllBotsMutation, PanelRestartAllBotsMutationVariables>;
export const PanelStartAllBotsDocument = gql`
    mutation PanelStartAllBots {
  panelStartAllBots {
    result
  }
}
    `;
export type PanelStartAllBotsMutationFn = Apollo.MutationFunction<PanelStartAllBotsMutation, PanelStartAllBotsMutationVariables>;

/**
 * __usePanelStartAllBotsMutation__
 *
 * To run a mutation, you first call `usePanelStartAllBotsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePanelStartAllBotsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [panelStartAllBotsMutation, { data, loading, error }] = usePanelStartAllBotsMutation({
 *   variables: {
 *   },
 * });
 */
export function usePanelStartAllBotsMutation(baseOptions?: Apollo.MutationHookOptions<PanelStartAllBotsMutation, PanelStartAllBotsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PanelStartAllBotsMutation, PanelStartAllBotsMutationVariables>(PanelStartAllBotsDocument, options);
      }
export type PanelStartAllBotsMutationHookResult = ReturnType<typeof usePanelStartAllBotsMutation>;
export type PanelStartAllBotsMutationResult = Apollo.MutationResult<PanelStartAllBotsMutation>;
export type PanelStartAllBotsMutationOptions = Apollo.BaseMutationOptions<PanelStartAllBotsMutation, PanelStartAllBotsMutationVariables>;
export const PanelStopAllBotsDocument = gql`
    mutation PanelStopAllBots {
  panelStopAllBots {
    result
  }
}
    `;
export type PanelStopAllBotsMutationFn = Apollo.MutationFunction<PanelStopAllBotsMutation, PanelStopAllBotsMutationVariables>;

/**
 * __usePanelStopAllBotsMutation__
 *
 * To run a mutation, you first call `usePanelStopAllBotsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePanelStopAllBotsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [panelStopAllBotsMutation, { data, loading, error }] = usePanelStopAllBotsMutation({
 *   variables: {
 *   },
 * });
 */
export function usePanelStopAllBotsMutation(baseOptions?: Apollo.MutationHookOptions<PanelStopAllBotsMutation, PanelStopAllBotsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PanelStopAllBotsMutation, PanelStopAllBotsMutationVariables>(PanelStopAllBotsDocument, options);
      }
export type PanelStopAllBotsMutationHookResult = ReturnType<typeof usePanelStopAllBotsMutation>;
export type PanelStopAllBotsMutationResult = Apollo.MutationResult<PanelStopAllBotsMutation>;
export type PanelStopAllBotsMutationOptions = Apollo.BaseMutationOptions<PanelStopAllBotsMutation, PanelStopAllBotsMutationVariables>;
export const BotStatusStreamDocument = gql`
    subscription BotStatusStream {
  PanelBotStatusStream {
    botId
    errCode
    errMsg
    newStatus
  }
}
    `;

/**
 * __useBotStatusStreamSubscription__
 *
 * To run a query within a React component, call `useBotStatusStreamSubscription` and pass it any options that fit your needs.
 * When your component renders, `useBotStatusStreamSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBotStatusStreamSubscription({
 *   variables: {
 *   },
 * });
 */
export function useBotStatusStreamSubscription(baseOptions?: Apollo.SubscriptionHookOptions<BotStatusStreamSubscription, BotStatusStreamSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<BotStatusStreamSubscription, BotStatusStreamSubscriptionVariables>(BotStatusStreamDocument, options);
      }
export type BotStatusStreamSubscriptionHookResult = ReturnType<typeof useBotStatusStreamSubscription>;
export type BotStatusStreamSubscriptionResult = Apollo.SubscriptionResult<BotStatusStreamSubscription>;
export const PanelUpdatePasswordDocument = gql`
    mutation PanelUpdatePassword($args: InputUserPanelUpdatePasswordArgs!) {
  panelUpdatePassword(args: $args) {
    result
  }
}
    `;
export type PanelUpdatePasswordMutationFn = Apollo.MutationFunction<PanelUpdatePasswordMutation, PanelUpdatePasswordMutationVariables>;

/**
 * __usePanelUpdatePasswordMutation__
 *
 * To run a mutation, you first call `usePanelUpdatePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePanelUpdatePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [panelUpdatePasswordMutation, { data, loading, error }] = usePanelUpdatePasswordMutation({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function usePanelUpdatePasswordMutation(baseOptions?: Apollo.MutationHookOptions<PanelUpdatePasswordMutation, PanelUpdatePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PanelUpdatePasswordMutation, PanelUpdatePasswordMutationVariables>(PanelUpdatePasswordDocument, options);
      }
export type PanelUpdatePasswordMutationHookResult = ReturnType<typeof usePanelUpdatePasswordMutation>;
export type PanelUpdatePasswordMutationResult = Apollo.MutationResult<PanelUpdatePasswordMutation>;
export type PanelUpdatePasswordMutationOptions = Apollo.BaseMutationOptions<PanelUpdatePasswordMutation, PanelUpdatePasswordMutationVariables>;
export const PanelConfigDocument = gql`
    query PanelConfig {
  panelConfig {
    id
    email
    discordLink
    skypeLink
    supportLink
    telegramLogin
    vkLink
  }
}
    `;

/**
 * __usePanelConfigQuery__
 *
 * To run a query within a React component, call `usePanelConfigQuery` and pass it any options that fit your needs.
 * When your component renders, `usePanelConfigQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePanelConfigQuery({
 *   variables: {
 *   },
 * });
 */
export function usePanelConfigQuery(baseOptions?: Apollo.QueryHookOptions<PanelConfigQuery, PanelConfigQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PanelConfigQuery, PanelConfigQueryVariables>(PanelConfigDocument, options);
      }
export function usePanelConfigLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PanelConfigQuery, PanelConfigQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PanelConfigQuery, PanelConfigQueryVariables>(PanelConfigDocument, options);
        }
export type PanelConfigQueryHookResult = ReturnType<typeof usePanelConfigQuery>;
export type PanelConfigLazyQueryHookResult = ReturnType<typeof usePanelConfigLazyQuery>;
export type PanelConfigQueryResult = Apollo.QueryResult<PanelConfigQuery, PanelConfigQueryVariables>;
export const PanelConfigUpdateDocument = gql`
    mutation PanelConfigUpdate($args: InputConfigPanelUpdateArgs!) {
  panelConfigUpdate(args: $args) {
    result
  }
}
    `;
export type PanelConfigUpdateMutationFn = Apollo.MutationFunction<PanelConfigUpdateMutation, PanelConfigUpdateMutationVariables>;

/**
 * __usePanelConfigUpdateMutation__
 *
 * To run a mutation, you first call `usePanelConfigUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePanelConfigUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [panelConfigUpdateMutation, { data, loading, error }] = usePanelConfigUpdateMutation({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function usePanelConfigUpdateMutation(baseOptions?: Apollo.MutationHookOptions<PanelConfigUpdateMutation, PanelConfigUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PanelConfigUpdateMutation, PanelConfigUpdateMutationVariables>(PanelConfigUpdateDocument, options);
      }
export type PanelConfigUpdateMutationHookResult = ReturnType<typeof usePanelConfigUpdateMutation>;
export type PanelConfigUpdateMutationResult = Apollo.MutationResult<PanelConfigUpdateMutation>;
export type PanelConfigUpdateMutationOptions = Apollo.BaseMutationOptions<PanelConfigUpdateMutation, PanelConfigUpdateMutationVariables>;
export const PanelCreateProxyDocument = gql`
    mutation PanelCreateProxy($args: InputProxyPanelCreateArgs!) {
  panelCreateProxy(args: $args) {
    username
    port
    password
    id
    countBots
    address
    isValid
  }
}
    `;
export type PanelCreateProxyMutationFn = Apollo.MutationFunction<PanelCreateProxyMutation, PanelCreateProxyMutationVariables>;

/**
 * __usePanelCreateProxyMutation__
 *
 * To run a mutation, you first call `usePanelCreateProxyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePanelCreateProxyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [panelCreateProxyMutation, { data, loading, error }] = usePanelCreateProxyMutation({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function usePanelCreateProxyMutation(baseOptions?: Apollo.MutationHookOptions<PanelCreateProxyMutation, PanelCreateProxyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PanelCreateProxyMutation, PanelCreateProxyMutationVariables>(PanelCreateProxyDocument, options);
      }
export type PanelCreateProxyMutationHookResult = ReturnType<typeof usePanelCreateProxyMutation>;
export type PanelCreateProxyMutationResult = Apollo.MutationResult<PanelCreateProxyMutation>;
export type PanelCreateProxyMutationOptions = Apollo.BaseMutationOptions<PanelCreateProxyMutation, PanelCreateProxyMutationVariables>;
export const PanelDeleteProxyDocument = gql`
    mutation PanelDeleteProxy($proxyId: Int!) {
  panelDeleteProxy(proxyId: $proxyId) {
    result
  }
}
    `;
export type PanelDeleteProxyMutationFn = Apollo.MutationFunction<PanelDeleteProxyMutation, PanelDeleteProxyMutationVariables>;

/**
 * __usePanelDeleteProxyMutation__
 *
 * To run a mutation, you first call `usePanelDeleteProxyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePanelDeleteProxyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [panelDeleteProxyMutation, { data, loading, error }] = usePanelDeleteProxyMutation({
 *   variables: {
 *      proxyId: // value for 'proxyId'
 *   },
 * });
 */
export function usePanelDeleteProxyMutation(baseOptions?: Apollo.MutationHookOptions<PanelDeleteProxyMutation, PanelDeleteProxyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PanelDeleteProxyMutation, PanelDeleteProxyMutationVariables>(PanelDeleteProxyDocument, options);
      }
export type PanelDeleteProxyMutationHookResult = ReturnType<typeof usePanelDeleteProxyMutation>;
export type PanelDeleteProxyMutationResult = Apollo.MutationResult<PanelDeleteProxyMutation>;
export type PanelDeleteProxyMutationOptions = Apollo.BaseMutationOptions<PanelDeleteProxyMutation, PanelDeleteProxyMutationVariables>;
export const PanelDigisellerConfigDocument = gql`
    query PanelDigisellerConfig {
  panelDigisellerConfig {
    apiKey
    editionSelectionFieldName
    id
    profileLinkFieldName
    regionFieldName
    sellerId
    regions {
      id
      name
    }
  }
}
    `;

/**
 * __usePanelDigisellerConfigQuery__
 *
 * To run a query within a React component, call `usePanelDigisellerConfigQuery` and pass it any options that fit your needs.
 * When your component renders, `usePanelDigisellerConfigQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePanelDigisellerConfigQuery({
 *   variables: {
 *   },
 * });
 */
export function usePanelDigisellerConfigQuery(baseOptions?: Apollo.QueryHookOptions<PanelDigisellerConfigQuery, PanelDigisellerConfigQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PanelDigisellerConfigQuery, PanelDigisellerConfigQueryVariables>(PanelDigisellerConfigDocument, options);
      }
export function usePanelDigisellerConfigLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PanelDigisellerConfigQuery, PanelDigisellerConfigQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PanelDigisellerConfigQuery, PanelDigisellerConfigQueryVariables>(PanelDigisellerConfigDocument, options);
        }
export type PanelDigisellerConfigQueryHookResult = ReturnType<typeof usePanelDigisellerConfigQuery>;
export type PanelDigisellerConfigLazyQueryHookResult = ReturnType<typeof usePanelDigisellerConfigLazyQuery>;
export type PanelDigisellerConfigQueryResult = Apollo.QueryResult<PanelDigisellerConfigQuery, PanelDigisellerConfigQueryVariables>;
export const PanelDigisellerRegionsDocument = gql`
    query PanelDigisellerRegions {
  panelDigisellerRegions {
    id
    name
  }
}
    `;

/**
 * __usePanelDigisellerRegionsQuery__
 *
 * To run a query within a React component, call `usePanelDigisellerRegionsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePanelDigisellerRegionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePanelDigisellerRegionsQuery({
 *   variables: {
 *   },
 * });
 */
export function usePanelDigisellerRegionsQuery(baseOptions?: Apollo.QueryHookOptions<PanelDigisellerRegionsQuery, PanelDigisellerRegionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PanelDigisellerRegionsQuery, PanelDigisellerRegionsQueryVariables>(PanelDigisellerRegionsDocument, options);
      }
export function usePanelDigisellerRegionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PanelDigisellerRegionsQuery, PanelDigisellerRegionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PanelDigisellerRegionsQuery, PanelDigisellerRegionsQueryVariables>(PanelDigisellerRegionsDocument, options);
        }
export type PanelDigisellerRegionsQueryHookResult = ReturnType<typeof usePanelDigisellerRegionsQuery>;
export type PanelDigisellerRegionsLazyQueryHookResult = ReturnType<typeof usePanelDigisellerRegionsLazyQuery>;
export type PanelDigisellerRegionsQueryResult = Apollo.QueryResult<PanelDigisellerRegionsQuery, PanelDigisellerRegionsQueryVariables>;
export const PanelDigisellerConfigUpdateDocument = gql`
    mutation PanelDigisellerConfigUpdate($args: InputDigisellerConfigUpdatePanelArgs!) {
  panelDigisellerConfigUpdate(args: $args) {
    result
  }
}
    `;
export type PanelDigisellerConfigUpdateMutationFn = Apollo.MutationFunction<PanelDigisellerConfigUpdateMutation, PanelDigisellerConfigUpdateMutationVariables>;

/**
 * __usePanelDigisellerConfigUpdateMutation__
 *
 * To run a mutation, you first call `usePanelDigisellerConfigUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePanelDigisellerConfigUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [panelDigisellerConfigUpdateMutation, { data, loading, error }] = usePanelDigisellerConfigUpdateMutation({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function usePanelDigisellerConfigUpdateMutation(baseOptions?: Apollo.MutationHookOptions<PanelDigisellerConfigUpdateMutation, PanelDigisellerConfigUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PanelDigisellerConfigUpdateMutation, PanelDigisellerConfigUpdateMutationVariables>(PanelDigisellerConfigUpdateDocument, options);
      }
export type PanelDigisellerConfigUpdateMutationHookResult = ReturnType<typeof usePanelDigisellerConfigUpdateMutation>;
export type PanelDigisellerConfigUpdateMutationResult = Apollo.MutationResult<PanelDigisellerConfigUpdateMutation>;
export type PanelDigisellerConfigUpdateMutationOptions = Apollo.BaseMutationOptions<PanelDigisellerConfigUpdateMutation, PanelDigisellerConfigUpdateMutationVariables>;
export const GetPanelProxiesDocument = gql`
    query GetPanelProxies($args: InputProxyPanelArgs!) {
  panelProxies(args: $args) {
    total
    records {
      address
      countBots
      id
      password
      port
      username
      isValid
    }
  }
}
    `;

/**
 * __useGetPanelProxiesQuery__
 *
 * To run a query within a React component, call `useGetPanelProxiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPanelProxiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPanelProxiesQuery({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function useGetPanelProxiesQuery(baseOptions: Apollo.QueryHookOptions<GetPanelProxiesQuery, GetPanelProxiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPanelProxiesQuery, GetPanelProxiesQueryVariables>(GetPanelProxiesDocument, options);
      }
export function useGetPanelProxiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPanelProxiesQuery, GetPanelProxiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPanelProxiesQuery, GetPanelProxiesQueryVariables>(GetPanelProxiesDocument, options);
        }
export type GetPanelProxiesQueryHookResult = ReturnType<typeof useGetPanelProxiesQuery>;
export type GetPanelProxiesLazyQueryHookResult = ReturnType<typeof useGetPanelProxiesLazyQuery>;
export type GetPanelProxiesQueryResult = Apollo.QueryResult<GetPanelProxiesQuery, GetPanelProxiesQueryVariables>;
export const CreateGiftDocument = gql`
    mutation CreateGift($args: InputDigisellerProductPanelCreateArgs!) {
  panelDigisellerProductCreate(args: $args) {
    previewUrl
    name
    isDisabled
    editions {
      bots {
        region {
          id
          name
        }
        botRegions
      }
      name
      isDefault
      product {
        autoSync
        id
        identifier
        isBundle
        name
        prices {
          price
          region
        }
      }
    }
    editionSelection
    digisellerId
    syncPrice
    syncPricePercent
    syncPriceRegion
  }
}
    `;
export type CreateGiftMutationFn = Apollo.MutationFunction<CreateGiftMutation, CreateGiftMutationVariables>;

/**
 * __useCreateGiftMutation__
 *
 * To run a mutation, you first call `useCreateGiftMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGiftMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGiftMutation, { data, loading, error }] = useCreateGiftMutation({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function useCreateGiftMutation(baseOptions?: Apollo.MutationHookOptions<CreateGiftMutation, CreateGiftMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateGiftMutation, CreateGiftMutationVariables>(CreateGiftDocument, options);
      }
export type CreateGiftMutationHookResult = ReturnType<typeof useCreateGiftMutation>;
export type CreateGiftMutationResult = Apollo.MutationResult<CreateGiftMutation>;
export type CreateGiftMutationOptions = Apollo.BaseMutationOptions<CreateGiftMutation, CreateGiftMutationVariables>;
export const DeleteGiftDocument = gql`
    mutation DeleteGift($digisellerProductDeleteId: Int!) {
  panelDigisellerProductDelete(id: $digisellerProductDeleteId) {
    result
  }
}
    `;
export type DeleteGiftMutationFn = Apollo.MutationFunction<DeleteGiftMutation, DeleteGiftMutationVariables>;

/**
 * __useDeleteGiftMutation__
 *
 * To run a mutation, you first call `useDeleteGiftMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteGiftMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteGiftMutation, { data, loading, error }] = useDeleteGiftMutation({
 *   variables: {
 *      digisellerProductDeleteId: // value for 'digisellerProductDeleteId'
 *   },
 * });
 */
export function useDeleteGiftMutation(baseOptions?: Apollo.MutationHookOptions<DeleteGiftMutation, DeleteGiftMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteGiftMutation, DeleteGiftMutationVariables>(DeleteGiftDocument, options);
      }
export type DeleteGiftMutationHookResult = ReturnType<typeof useDeleteGiftMutation>;
export type DeleteGiftMutationResult = Apollo.MutationResult<DeleteGiftMutation>;
export type DeleteGiftMutationOptions = Apollo.BaseMutationOptions<DeleteGiftMutation, DeleteGiftMutationVariables>;
export const GetGiftByIdDocument = gql`
    query GetGiftById($digisellerProductId: Int!) {
  panelDigisellerProduct(id: $digisellerProductId) {
    previewUrl
    name
    isDisabled
    createdAt
    updatedAt
    id
    editions {
      bots {
        botRegions
        region {
          id
          name
        }
      }
      id
      name
      isDefault
      product {
        id
        name
      }
    }
    editionSelection
    digisellerId
    syncPrice
    syncPricePercent
    syncPriceRegion
  }
}
    `;

/**
 * __useGetGiftByIdQuery__
 *
 * To run a query within a React component, call `useGetGiftByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGiftByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGiftByIdQuery({
 *   variables: {
 *      digisellerProductId: // value for 'digisellerProductId'
 *   },
 * });
 */
export function useGetGiftByIdQuery(baseOptions: Apollo.QueryHookOptions<GetGiftByIdQuery, GetGiftByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGiftByIdQuery, GetGiftByIdQueryVariables>(GetGiftByIdDocument, options);
      }
export function useGetGiftByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGiftByIdQuery, GetGiftByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGiftByIdQuery, GetGiftByIdQueryVariables>(GetGiftByIdDocument, options);
        }
export type GetGiftByIdQueryHookResult = ReturnType<typeof useGetGiftByIdQuery>;
export type GetGiftByIdLazyQueryHookResult = ReturnType<typeof useGetGiftByIdLazyQuery>;
export type GetGiftByIdQueryResult = Apollo.QueryResult<GetGiftByIdQuery, GetGiftByIdQueryVariables>;
export const GetGiftsDocument = gql`
    query GetGifts($args: InputDigisellerProductPanelArgs!) {
  panelDigisellerProducts(args: $args) {
    total
    records {
      digisellerId
      editionSelection
      editions {
        bots {
          botRegions
          region {
            id
            name
          }
        }
        id
        name
        product {
          autoSync
          id
          identifier
          isBundle
          name
          prices {
            price
            region
          }
        }
      }
      id
      isDisabled
      name
      previewUrl
      createdAt
      updatedAt
    }
  }
}
    `;

/**
 * __useGetGiftsQuery__
 *
 * To run a query within a React component, call `useGetGiftsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGiftsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGiftsQuery({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function useGetGiftsQuery(baseOptions: Apollo.QueryHookOptions<GetGiftsQuery, GetGiftsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGiftsQuery, GetGiftsQueryVariables>(GetGiftsDocument, options);
      }
export function useGetGiftsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGiftsQuery, GetGiftsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGiftsQuery, GetGiftsQueryVariables>(GetGiftsDocument, options);
        }
export type GetGiftsQueryHookResult = ReturnType<typeof useGetGiftsQuery>;
export type GetGiftsLazyQueryHookResult = ReturnType<typeof useGetGiftsLazyQuery>;
export type GetGiftsQueryResult = Apollo.QueryResult<GetGiftsQuery, GetGiftsQueryVariables>;
export const ParseDigisellerProductInfoDocument = gql`
    query ParseDigisellerProductInfo($digisellerId: Int!) {
  panelDigisellerParseProductInfo(digisellerId: $digisellerId) {
    name
    preview
    editionEnabled
    editions
  }
}
    `;

/**
 * __useParseDigisellerProductInfoQuery__
 *
 * To run a query within a React component, call `useParseDigisellerProductInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useParseDigisellerProductInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useParseDigisellerProductInfoQuery({
 *   variables: {
 *      digisellerId: // value for 'digisellerId'
 *   },
 * });
 */
export function useParseDigisellerProductInfoQuery(baseOptions: Apollo.QueryHookOptions<ParseDigisellerProductInfoQuery, ParseDigisellerProductInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ParseDigisellerProductInfoQuery, ParseDigisellerProductInfoQueryVariables>(ParseDigisellerProductInfoDocument, options);
      }
export function useParseDigisellerProductInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ParseDigisellerProductInfoQuery, ParseDigisellerProductInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ParseDigisellerProductInfoQuery, ParseDigisellerProductInfoQueryVariables>(ParseDigisellerProductInfoDocument, options);
        }
export type ParseDigisellerProductInfoQueryHookResult = ReturnType<typeof useParseDigisellerProductInfoQuery>;
export type ParseDigisellerProductInfoLazyQueryHookResult = ReturnType<typeof useParseDigisellerProductInfoLazyQuery>;
export type ParseDigisellerProductInfoQueryResult = Apollo.QueryResult<ParseDigisellerProductInfoQuery, ParseDigisellerProductInfoQueryVariables>;
export const PanelDigisellerSyncPricesDocument = gql`
    mutation panelDigisellerSyncPrices {
  panelDigisellerSyncPrices {
    result
  }
}
    `;
export type PanelDigisellerSyncPricesMutationFn = Apollo.MutationFunction<PanelDigisellerSyncPricesMutation, PanelDigisellerSyncPricesMutationVariables>;

/**
 * __usePanelDigisellerSyncPricesMutation__
 *
 * To run a mutation, you first call `usePanelDigisellerSyncPricesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePanelDigisellerSyncPricesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [panelDigisellerSyncPricesMutation, { data, loading, error }] = usePanelDigisellerSyncPricesMutation({
 *   variables: {
 *   },
 * });
 */
export function usePanelDigisellerSyncPricesMutation(baseOptions?: Apollo.MutationHookOptions<PanelDigisellerSyncPricesMutation, PanelDigisellerSyncPricesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PanelDigisellerSyncPricesMutation, PanelDigisellerSyncPricesMutationVariables>(PanelDigisellerSyncPricesDocument, options);
      }
export type PanelDigisellerSyncPricesMutationHookResult = ReturnType<typeof usePanelDigisellerSyncPricesMutation>;
export type PanelDigisellerSyncPricesMutationResult = Apollo.MutationResult<PanelDigisellerSyncPricesMutation>;
export type PanelDigisellerSyncPricesMutationOptions = Apollo.BaseMutationOptions<PanelDigisellerSyncPricesMutation, PanelDigisellerSyncPricesMutationVariables>;
export const UpdateGiftDocument = gql`
    mutation UpdateGift($digisellerProductUpdateId: Int!, $args: InputDigisellerProductPanelUpdateArgs!) {
  panelDigisellerProductUpdate(id: $digisellerProductUpdateId, args: $args) {
    id
    name
  }
}
    `;
export type UpdateGiftMutationFn = Apollo.MutationFunction<UpdateGiftMutation, UpdateGiftMutationVariables>;

/**
 * __useUpdateGiftMutation__
 *
 * To run a mutation, you first call `useUpdateGiftMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateGiftMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateGiftMutation, { data, loading, error }] = useUpdateGiftMutation({
 *   variables: {
 *      digisellerProductUpdateId: // value for 'digisellerProductUpdateId'
 *      args: // value for 'args'
 *   },
 * });
 */
export function useUpdateGiftMutation(baseOptions?: Apollo.MutationHookOptions<UpdateGiftMutation, UpdateGiftMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateGiftMutation, UpdateGiftMutationVariables>(UpdateGiftDocument, options);
      }
export type UpdateGiftMutationHookResult = ReturnType<typeof useUpdateGiftMutation>;
export type UpdateGiftMutationResult = Apollo.MutationResult<UpdateGiftMutation>;
export type UpdateGiftMutationOptions = Apollo.BaseMutationOptions<UpdateGiftMutation, UpdateGiftMutationVariables>;
export const PanelLogInDocument = gql`
    mutation PanelLogIn($args: InputAuthLogInArgs!) {
  panelLogIn(args: $args) {
    expiresAt
    token
    user {
      email
      id
    }
  }
}
    `;
export type PanelLogInMutationFn = Apollo.MutationFunction<PanelLogInMutation, PanelLogInMutationVariables>;

/**
 * __usePanelLogInMutation__
 *
 * To run a mutation, you first call `usePanelLogInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePanelLogInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [panelLogInMutation, { data, loading, error }] = usePanelLogInMutation({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function usePanelLogInMutation(baseOptions?: Apollo.MutationHookOptions<PanelLogInMutation, PanelLogInMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PanelLogInMutation, PanelLogInMutationVariables>(PanelLogInDocument, options);
      }
export type PanelLogInMutationHookResult = ReturnType<typeof usePanelLogInMutation>;
export type PanelLogInMutationResult = Apollo.MutationResult<PanelLogInMutation>;
export type PanelLogInMutationOptions = Apollo.BaseMutationOptions<PanelLogInMutation, PanelLogInMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const PanelProductCreateDocument = gql`
    mutation PanelProductCreate($args: InputProductPanelCreateArgs!) {
  panelProductCreate(args: $args) {
    prices {
      price
      region
    }
    name
    isBundle
    identifier
    id
    autoSync
  }
}
    `;
export type PanelProductCreateMutationFn = Apollo.MutationFunction<PanelProductCreateMutation, PanelProductCreateMutationVariables>;

/**
 * __usePanelProductCreateMutation__
 *
 * To run a mutation, you first call `usePanelProductCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePanelProductCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [panelProductCreateMutation, { data, loading, error }] = usePanelProductCreateMutation({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function usePanelProductCreateMutation(baseOptions?: Apollo.MutationHookOptions<PanelProductCreateMutation, PanelProductCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PanelProductCreateMutation, PanelProductCreateMutationVariables>(PanelProductCreateDocument, options);
      }
export type PanelProductCreateMutationHookResult = ReturnType<typeof usePanelProductCreateMutation>;
export type PanelProductCreateMutationResult = Apollo.MutationResult<PanelProductCreateMutation>;
export type PanelProductCreateMutationOptions = Apollo.BaseMutationOptions<PanelProductCreateMutation, PanelProductCreateMutationVariables>;
export const PanelProductDeleteDocument = gql`
    mutation PanelProductDelete($productId: Int!) {
  panelProductDelete(productId: $productId) {
    result
  }
}
    `;
export type PanelProductDeleteMutationFn = Apollo.MutationFunction<PanelProductDeleteMutation, PanelProductDeleteMutationVariables>;

/**
 * __usePanelProductDeleteMutation__
 *
 * To run a mutation, you first call `usePanelProductDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePanelProductDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [panelProductDeleteMutation, { data, loading, error }] = usePanelProductDeleteMutation({
 *   variables: {
 *      productId: // value for 'productId'
 *   },
 * });
 */
export function usePanelProductDeleteMutation(baseOptions?: Apollo.MutationHookOptions<PanelProductDeleteMutation, PanelProductDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PanelProductDeleteMutation, PanelProductDeleteMutationVariables>(PanelProductDeleteDocument, options);
      }
export type PanelProductDeleteMutationHookResult = ReturnType<typeof usePanelProductDeleteMutation>;
export type PanelProductDeleteMutationResult = Apollo.MutationResult<PanelProductDeleteMutation>;
export type PanelProductDeleteMutationOptions = Apollo.BaseMutationOptions<PanelProductDeleteMutation, PanelProductDeleteMutationVariables>;
export const GetPricesForBundleDocument = gql`
    query GetPricesForBundle($bundleId: Int!) {
  panelProductSteamBundleInfo(bundleId: $bundleId) {
    name
    prices {
      region
      price
    }
  }
}
    `;

/**
 * __useGetPricesForBundleQuery__
 *
 * To run a query within a React component, call `useGetPricesForBundleQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPricesForBundleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPricesForBundleQuery({
 *   variables: {
 *      bundleId: // value for 'bundleId'
 *   },
 * });
 */
export function useGetPricesForBundleQuery(baseOptions: Apollo.QueryHookOptions<GetPricesForBundleQuery, GetPricesForBundleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPricesForBundleQuery, GetPricesForBundleQueryVariables>(GetPricesForBundleDocument, options);
      }
export function useGetPricesForBundleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPricesForBundleQuery, GetPricesForBundleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPricesForBundleQuery, GetPricesForBundleQueryVariables>(GetPricesForBundleDocument, options);
        }
export type GetPricesForBundleQueryHookResult = ReturnType<typeof useGetPricesForBundleQuery>;
export type GetPricesForBundleLazyQueryHookResult = ReturnType<typeof useGetPricesForBundleLazyQuery>;
export type GetPricesForBundleQueryResult = Apollo.QueryResult<GetPricesForBundleQuery, GetPricesForBundleQueryVariables>;
export const GetPricesForPackageDocument = gql`
    query GetPricesForPackage($packageId: Int!) {
  panelProductSteamPackageInfo(packageId: $packageId) {
    name
    prices {
      region
      price
    }
  }
}
    `;

/**
 * __useGetPricesForPackageQuery__
 *
 * To run a query within a React component, call `useGetPricesForPackageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPricesForPackageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPricesForPackageQuery({
 *   variables: {
 *      packageId: // value for 'packageId'
 *   },
 * });
 */
export function useGetPricesForPackageQuery(baseOptions: Apollo.QueryHookOptions<GetPricesForPackageQuery, GetPricesForPackageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPricesForPackageQuery, GetPricesForPackageQueryVariables>(GetPricesForPackageDocument, options);
      }
export function useGetPricesForPackageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPricesForPackageQuery, GetPricesForPackageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPricesForPackageQuery, GetPricesForPackageQueryVariables>(GetPricesForPackageDocument, options);
        }
export type GetPricesForPackageQueryHookResult = ReturnType<typeof useGetPricesForPackageQuery>;
export type GetPricesForPackageLazyQueryHookResult = ReturnType<typeof useGetPricesForPackageLazyQuery>;
export type GetPricesForPackageQueryResult = Apollo.QueryResult<GetPricesForPackageQuery, GetPricesForPackageQueryVariables>;
export const PanelProductDocument = gql`
    query PanelProduct($productId: Int!) {
  panelProduct(productId: $productId) {
    autoSync
    id
    identifier
    isBundle
    name
    prices {
      region
      price
    }
  }
}
    `;

/**
 * __usePanelProductQuery__
 *
 * To run a query within a React component, call `usePanelProductQuery` and pass it any options that fit your needs.
 * When your component renders, `usePanelProductQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePanelProductQuery({
 *   variables: {
 *      productId: // value for 'productId'
 *   },
 * });
 */
export function usePanelProductQuery(baseOptions: Apollo.QueryHookOptions<PanelProductQuery, PanelProductQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PanelProductQuery, PanelProductQueryVariables>(PanelProductDocument, options);
      }
export function usePanelProductLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PanelProductQuery, PanelProductQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PanelProductQuery, PanelProductQueryVariables>(PanelProductDocument, options);
        }
export type PanelProductQueryHookResult = ReturnType<typeof usePanelProductQuery>;
export type PanelProductLazyQueryHookResult = ReturnType<typeof usePanelProductLazyQuery>;
export type PanelProductQueryResult = Apollo.QueryResult<PanelProductQuery, PanelProductQueryVariables>;
export const PanelProductsDocument = gql`
    query PanelProducts($args: InputProductPanelArgs!) {
  panelProducts(args: $args) {
    total
    records {
      autoSync
      id
      identifier
      isBundle
      name
      prices {
        price
        region
      }
    }
  }
}
    `;

/**
 * __usePanelProductsQuery__
 *
 * To run a query within a React component, call `usePanelProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePanelProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePanelProductsQuery({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function usePanelProductsQuery(baseOptions: Apollo.QueryHookOptions<PanelProductsQuery, PanelProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PanelProductsQuery, PanelProductsQueryVariables>(PanelProductsDocument, options);
      }
export function usePanelProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PanelProductsQuery, PanelProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PanelProductsQuery, PanelProductsQueryVariables>(PanelProductsDocument, options);
        }
export type PanelProductsQueryHookResult = ReturnType<typeof usePanelProductsQuery>;
export type PanelProductsLazyQueryHookResult = ReturnType<typeof usePanelProductsLazyQuery>;
export type PanelProductsQueryResult = Apollo.QueryResult<PanelProductsQuery, PanelProductsQueryVariables>;
export const PanelProductForceUpdatePricesDocument = gql`
    mutation PanelProductForceUpdatePrices {
  panelProductForceUpdatePrices {
    result
  }
}
    `;
export type PanelProductForceUpdatePricesMutationFn = Apollo.MutationFunction<PanelProductForceUpdatePricesMutation, PanelProductForceUpdatePricesMutationVariables>;

/**
 * __usePanelProductForceUpdatePricesMutation__
 *
 * To run a mutation, you first call `usePanelProductForceUpdatePricesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePanelProductForceUpdatePricesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [panelProductForceUpdatePricesMutation, { data, loading, error }] = usePanelProductForceUpdatePricesMutation({
 *   variables: {
 *   },
 * });
 */
export function usePanelProductForceUpdatePricesMutation(baseOptions?: Apollo.MutationHookOptions<PanelProductForceUpdatePricesMutation, PanelProductForceUpdatePricesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PanelProductForceUpdatePricesMutation, PanelProductForceUpdatePricesMutationVariables>(PanelProductForceUpdatePricesDocument, options);
      }
export type PanelProductForceUpdatePricesMutationHookResult = ReturnType<typeof usePanelProductForceUpdatePricesMutation>;
export type PanelProductForceUpdatePricesMutationResult = Apollo.MutationResult<PanelProductForceUpdatePricesMutation>;
export type PanelProductForceUpdatePricesMutationOptions = Apollo.BaseMutationOptions<PanelProductForceUpdatePricesMutation, PanelProductForceUpdatePricesMutationVariables>;
export const PanelProductUpdateDocument = gql`
    mutation PanelProductUpdate($productId: Int!, $args: InputProductPanelUpdateArgs!) {
  panelProductUpdate(productId: $productId, args: $args) {
    autoSync
    id
    identifier
    isBundle
    name
    prices {
      region
      price
    }
  }
}
    `;
export type PanelProductUpdateMutationFn = Apollo.MutationFunction<PanelProductUpdateMutation, PanelProductUpdateMutationVariables>;

/**
 * __usePanelProductUpdateMutation__
 *
 * To run a mutation, you first call `usePanelProductUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePanelProductUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [panelProductUpdateMutation, { data, loading, error }] = usePanelProductUpdateMutation({
 *   variables: {
 *      productId: // value for 'productId'
 *      args: // value for 'args'
 *   },
 * });
 */
export function usePanelProductUpdateMutation(baseOptions?: Apollo.MutationHookOptions<PanelProductUpdateMutation, PanelProductUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PanelProductUpdateMutation, PanelProductUpdateMutationVariables>(PanelProductUpdateDocument, options);
      }
export type PanelProductUpdateMutationHookResult = ReturnType<typeof usePanelProductUpdateMutation>;
export type PanelProductUpdateMutationResult = Apollo.MutationResult<PanelProductUpdateMutation>;
export type PanelProductUpdateMutationOptions = Apollo.BaseMutationOptions<PanelProductUpdateMutation, PanelProductUpdateMutationVariables>;
export const PanelTelegramConfigDocument = gql`
    query PanelTelegramConfig {
  panelTelegramConfig {
    statusChangeNotification
    statusChangeChatId
    id
    botToken
    balanceThreshold
    balanceNotification
    balanceChatId
    productPricesUpdatedNotification
    productPricesUpdatedChatId
  }
}
    `;

/**
 * __usePanelTelegramConfigQuery__
 *
 * To run a query within a React component, call `usePanelTelegramConfigQuery` and pass it any options that fit your needs.
 * When your component renders, `usePanelTelegramConfigQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePanelTelegramConfigQuery({
 *   variables: {
 *   },
 * });
 */
export function usePanelTelegramConfigQuery(baseOptions?: Apollo.QueryHookOptions<PanelTelegramConfigQuery, PanelTelegramConfigQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PanelTelegramConfigQuery, PanelTelegramConfigQueryVariables>(PanelTelegramConfigDocument, options);
      }
export function usePanelTelegramConfigLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PanelTelegramConfigQuery, PanelTelegramConfigQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PanelTelegramConfigQuery, PanelTelegramConfigQueryVariables>(PanelTelegramConfigDocument, options);
        }
export type PanelTelegramConfigQueryHookResult = ReturnType<typeof usePanelTelegramConfigQuery>;
export type PanelTelegramConfigLazyQueryHookResult = ReturnType<typeof usePanelTelegramConfigLazyQuery>;
export type PanelTelegramConfigQueryResult = Apollo.QueryResult<PanelTelegramConfigQuery, PanelTelegramConfigQueryVariables>;
export const PanelTelegramConfigUpdateDocument = gql`
    mutation PanelTelegramConfigUpdate($args: InputTelegramPanelConfigUpdateArgs!) {
  panelTelegramConfigUpdate(args: $args) {
    result
  }
}
    `;
export type PanelTelegramConfigUpdateMutationFn = Apollo.MutationFunction<PanelTelegramConfigUpdateMutation, PanelTelegramConfigUpdateMutationVariables>;

/**
 * __usePanelTelegramConfigUpdateMutation__
 *
 * To run a mutation, you first call `usePanelTelegramConfigUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePanelTelegramConfigUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [panelTelegramConfigUpdateMutation, { data, loading, error }] = usePanelTelegramConfigUpdateMutation({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function usePanelTelegramConfigUpdateMutation(baseOptions?: Apollo.MutationHookOptions<PanelTelegramConfigUpdateMutation, PanelTelegramConfigUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PanelTelegramConfigUpdateMutation, PanelTelegramConfigUpdateMutationVariables>(PanelTelegramConfigUpdateDocument, options);
      }
export type PanelTelegramConfigUpdateMutationHookResult = ReturnType<typeof usePanelTelegramConfigUpdateMutation>;
export type PanelTelegramConfigUpdateMutationResult = Apollo.MutationResult<PanelTelegramConfigUpdateMutation>;
export type PanelTelegramConfigUpdateMutationOptions = Apollo.BaseMutationOptions<PanelTelegramConfigUpdateMutation, PanelTelegramConfigUpdateMutationVariables>;
export const PanelTransactionChangeBotDocument = gql`
    mutation PanelTransactionChangeBot($botId: Int!, $transactionId: Int!) {
  panelTransactionChangeBot(botId: $botId, transactionId: $transactionId) {
    bot {
      accountName
      id
    }
  }
}
    `;
export type PanelTransactionChangeBotMutationFn = Apollo.MutationFunction<PanelTransactionChangeBotMutation, PanelTransactionChangeBotMutationVariables>;

/**
 * __usePanelTransactionChangeBotMutation__
 *
 * To run a mutation, you first call `usePanelTransactionChangeBotMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePanelTransactionChangeBotMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [panelTransactionChangeBotMutation, { data, loading, error }] = usePanelTransactionChangeBotMutation({
 *   variables: {
 *      botId: // value for 'botId'
 *      transactionId: // value for 'transactionId'
 *   },
 * });
 */
export function usePanelTransactionChangeBotMutation(baseOptions?: Apollo.MutationHookOptions<PanelTransactionChangeBotMutation, PanelTransactionChangeBotMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PanelTransactionChangeBotMutation, PanelTransactionChangeBotMutationVariables>(PanelTransactionChangeBotDocument, options);
      }
export type PanelTransactionChangeBotMutationHookResult = ReturnType<typeof usePanelTransactionChangeBotMutation>;
export type PanelTransactionChangeBotMutationResult = Apollo.MutationResult<PanelTransactionChangeBotMutation>;
export type PanelTransactionChangeBotMutationOptions = Apollo.BaseMutationOptions<PanelTransactionChangeBotMutation, PanelTransactionChangeBotMutationVariables>;
export const PanelTransactionUpdateStatusDocument = gql`
    mutation PanelTransactionUpdateStatus($transactionId: Int!, $args: InputTransactionPanelUpdateStatusArgs!) {
  panelTransactionUpdateStatus(transactionId: $transactionId, args: $args) {
    result
  }
}
    `;
export type PanelTransactionUpdateStatusMutationFn = Apollo.MutationFunction<PanelTransactionUpdateStatusMutation, PanelTransactionUpdateStatusMutationVariables>;

/**
 * __usePanelTransactionUpdateStatusMutation__
 *
 * To run a mutation, you first call `usePanelTransactionUpdateStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePanelTransactionUpdateStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [panelTransactionUpdateStatusMutation, { data, loading, error }] = usePanelTransactionUpdateStatusMutation({
 *   variables: {
 *      transactionId: // value for 'transactionId'
 *      args: // value for 'args'
 *   },
 * });
 */
export function usePanelTransactionUpdateStatusMutation(baseOptions?: Apollo.MutationHookOptions<PanelTransactionUpdateStatusMutation, PanelTransactionUpdateStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PanelTransactionUpdateStatusMutation, PanelTransactionUpdateStatusMutationVariables>(PanelTransactionUpdateStatusDocument, options);
      }
export type PanelTransactionUpdateStatusMutationHookResult = ReturnType<typeof usePanelTransactionUpdateStatusMutation>;
export type PanelTransactionUpdateStatusMutationResult = Apollo.MutationResult<PanelTransactionUpdateStatusMutation>;
export type PanelTransactionUpdateStatusMutationOptions = Apollo.BaseMutationOptions<PanelTransactionUpdateStatusMutation, PanelTransactionUpdateStatusMutationVariables>;
export const PanelTransactionLogsDocument = gql`
    query PanelTransactionLogs($transactionId: Int!, $args: InputPaginationArgs!) {
  panelTransactionLogs(transactionId: $transactionId, args: $args) {
    records {
      status
      id
      event
      errMsg
      createdAt
    }
    total
  }
}
    `;

/**
 * __usePanelTransactionLogsQuery__
 *
 * To run a query within a React component, call `usePanelTransactionLogsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePanelTransactionLogsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePanelTransactionLogsQuery({
 *   variables: {
 *      transactionId: // value for 'transactionId'
 *      args: // value for 'args'
 *   },
 * });
 */
export function usePanelTransactionLogsQuery(baseOptions: Apollo.QueryHookOptions<PanelTransactionLogsQuery, PanelTransactionLogsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PanelTransactionLogsQuery, PanelTransactionLogsQueryVariables>(PanelTransactionLogsDocument, options);
      }
export function usePanelTransactionLogsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PanelTransactionLogsQuery, PanelTransactionLogsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PanelTransactionLogsQuery, PanelTransactionLogsQueryVariables>(PanelTransactionLogsDocument, options);
        }
export type PanelTransactionLogsQueryHookResult = ReturnType<typeof usePanelTransactionLogsQuery>;
export type PanelTransactionLogsLazyQueryHookResult = ReturnType<typeof usePanelTransactionLogsLazyQuery>;
export type PanelTransactionLogsQueryResult = Apollo.QueryResult<PanelTransactionLogsQuery, PanelTransactionLogsQueryVariables>;
export const PanelTransactionDocument = gql`
    query PanelTransaction($transactionId: Int!) {
  panelTransaction(transactionId: $transactionId) {
    updatedAt
    steamId64
    status
    sendAttempts
    region
    profileLink
    paymentDetails {
      uniqCode
      invoice
    }
    id
    edition {
      product {
        name
      }
      name
    }
    createdAt
    bot {
      id
      accountName
      login
      steamId64
    }
  }
}
    `;

/**
 * __usePanelTransactionQuery__
 *
 * To run a query within a React component, call `usePanelTransactionQuery` and pass it any options that fit your needs.
 * When your component renders, `usePanelTransactionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePanelTransactionQuery({
 *   variables: {
 *      transactionId: // value for 'transactionId'
 *   },
 * });
 */
export function usePanelTransactionQuery(baseOptions: Apollo.QueryHookOptions<PanelTransactionQuery, PanelTransactionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PanelTransactionQuery, PanelTransactionQueryVariables>(PanelTransactionDocument, options);
      }
export function usePanelTransactionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PanelTransactionQuery, PanelTransactionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PanelTransactionQuery, PanelTransactionQueryVariables>(PanelTransactionDocument, options);
        }
export type PanelTransactionQueryHookResult = ReturnType<typeof usePanelTransactionQuery>;
export type PanelTransactionLazyQueryHookResult = ReturnType<typeof usePanelTransactionLazyQuery>;
export type PanelTransactionQueryResult = Apollo.QueryResult<PanelTransactionQuery, PanelTransactionQueryVariables>;
export const GetPanelTransactionsDocument = gql`
    query GetPanelTransactions($args: InputTransactionPanelArgs!) {
  panelTransactions(args: $args) {
    total
    records {
      updatedAt
      steamId64
      status
      sendAttempts
      region
      profileLink
      paymentDetails {
        uniqCode
        invoice
      }
      id
      edition {
        bots {
          region {
            id
            name
          }
          botRegions
        }
        id
        name
        product {
          name
        }
      }
      createdAt
      bot {
        accountName
        login
      }
    }
  }
}
    `;

/**
 * __useGetPanelTransactionsQuery__
 *
 * To run a query within a React component, call `useGetPanelTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPanelTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPanelTransactionsQuery({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function useGetPanelTransactionsQuery(baseOptions: Apollo.QueryHookOptions<GetPanelTransactionsQuery, GetPanelTransactionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPanelTransactionsQuery, GetPanelTransactionsQueryVariables>(GetPanelTransactionsDocument, options);
      }
export function useGetPanelTransactionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPanelTransactionsQuery, GetPanelTransactionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPanelTransactionsQuery, GetPanelTransactionsQueryVariables>(GetPanelTransactionsDocument, options);
        }
export type GetPanelTransactionsQueryHookResult = ReturnType<typeof useGetPanelTransactionsQuery>;
export type GetPanelTransactionsLazyQueryHookResult = ReturnType<typeof useGetPanelTransactionsLazyQuery>;
export type GetPanelTransactionsQueryResult = Apollo.QueryResult<GetPanelTransactionsQuery, GetPanelTransactionsQueryVariables>;
export const ResetAttempDocument = gql`
    mutation ResetAttemp($transactionId: Int!) {
  panelTransactionResetAttempts(transactionId: $transactionId) {
    result
  }
}
    `;
export type ResetAttempMutationFn = Apollo.MutationFunction<ResetAttempMutation, ResetAttempMutationVariables>;

/**
 * __useResetAttempMutation__
 *
 * To run a mutation, you first call `useResetAttempMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetAttempMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetAttempMutation, { data, loading, error }] = useResetAttempMutation({
 *   variables: {
 *      transactionId: // value for 'transactionId'
 *   },
 * });
 */
export function useResetAttempMutation(baseOptions?: Apollo.MutationHookOptions<ResetAttempMutation, ResetAttempMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetAttempMutation, ResetAttempMutationVariables>(ResetAttempDocument, options);
      }
export type ResetAttempMutationHookResult = ReturnType<typeof useResetAttempMutation>;
export type ResetAttempMutationResult = Apollo.MutationResult<ResetAttempMutation>;
export type ResetAttempMutationOptions = Apollo.BaseMutationOptions<ResetAttempMutation, ResetAttempMutationVariables>;
export const PanelTransactionStatusStreamDocument = gql`
    subscription PanelTransactionStatusStream {
  PanelTransactionStatusStream {
    createdAt
    errMsg
    event
    id
    status
    transaction {
      id
    }
  }
}
    `;

/**
 * __usePanelTransactionStatusStreamSubscription__
 *
 * To run a query within a React component, call `usePanelTransactionStatusStreamSubscription` and pass it any options that fit your needs.
 * When your component renders, `usePanelTransactionStatusStreamSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePanelTransactionStatusStreamSubscription({
 *   variables: {
 *   },
 * });
 */
export function usePanelTransactionStatusStreamSubscription(baseOptions?: Apollo.SubscriptionHookOptions<PanelTransactionStatusStreamSubscription, PanelTransactionStatusStreamSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<PanelTransactionStatusStreamSubscription, PanelTransactionStatusStreamSubscriptionVariables>(PanelTransactionStatusStreamDocument, options);
      }
export type PanelTransactionStatusStreamSubscriptionHookResult = ReturnType<typeof usePanelTransactionStatusStreamSubscription>;
export type PanelTransactionStatusStreamSubscriptionResult = Apollo.SubscriptionResult<PanelTransactionStatusStreamSubscription>;
export const PanelTransactionUpdateProfileLinkDocument = gql`
    mutation PanelTransactionUpdateProfileLink($transactionId: Int!, $profileLink: String!) {
  panelTransactionUpdateProfileLink(
    transactionId: $transactionId
    profileLink: $profileLink
  ) {
    result
  }
}
    `;
export type PanelTransactionUpdateProfileLinkMutationFn = Apollo.MutationFunction<PanelTransactionUpdateProfileLinkMutation, PanelTransactionUpdateProfileLinkMutationVariables>;

/**
 * __usePanelTransactionUpdateProfileLinkMutation__
 *
 * To run a mutation, you first call `usePanelTransactionUpdateProfileLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePanelTransactionUpdateProfileLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [panelTransactionUpdateProfileLinkMutation, { data, loading, error }] = usePanelTransactionUpdateProfileLinkMutation({
 *   variables: {
 *      transactionId: // value for 'transactionId'
 *      profileLink: // value for 'profileLink'
 *   },
 * });
 */
export function usePanelTransactionUpdateProfileLinkMutation(baseOptions?: Apollo.MutationHookOptions<PanelTransactionUpdateProfileLinkMutation, PanelTransactionUpdateProfileLinkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PanelTransactionUpdateProfileLinkMutation, PanelTransactionUpdateProfileLinkMutationVariables>(PanelTransactionUpdateProfileLinkDocument, options);
      }
export type PanelTransactionUpdateProfileLinkMutationHookResult = ReturnType<typeof usePanelTransactionUpdateProfileLinkMutation>;
export type PanelTransactionUpdateProfileLinkMutationResult = Apollo.MutationResult<PanelTransactionUpdateProfileLinkMutation>;
export type PanelTransactionUpdateProfileLinkMutationOptions = Apollo.BaseMutationOptions<PanelTransactionUpdateProfileLinkMutation, PanelTransactionUpdateProfileLinkMutationVariables>;