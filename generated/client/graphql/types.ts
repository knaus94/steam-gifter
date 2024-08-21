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

export type GetTransactionQueryVariables = Exact<{
  args: InputTransactionArgs;
}>;


export type GetTransactionQuery = { __typename?: 'Query', transaction: { __typename?: 'ObjectTransactionDto', id: number, createdAt: Date, profileLink: string, region?: string | null, bot?: { __typename?: 'ObjectBotDto', id: number, accountName: string, avatarUrl?: string | null } | null, logs: Array<{ __typename?: 'ObjectTransactionStatusLogDto', id: number, event?: TransactionEventEnumType | null, status: TransactionStatusEnumType, createdAt: Date }>, edition: { __typename?: 'ObjectTransactionEditionDto', digisellerProduct: { __typename?: 'ObjectTransactionEditionDigisellerProductDto', previewUrl?: string | null, name: { __typename?: 'ObjectTranslationDto', en?: string | null, ru?: string | null } } }, paymentDetails: { __typename?: 'ObjectTransactionPaymentDetailsDto', invoice: number } }, config: { __typename?: 'ObjectConfigDto', telegramLogin?: string | null, discordLink?: string | null, email?: string | null, skypeLink?: string | null, supportLink?: string | null, vkLink?: string | null } };

export type ResendTransactionMutationVariables = Exact<{
  args: InputTransactionArgs;
}>;


export type ResendTransactionMutation = { __typename?: 'Mutation', resendTransaction: { __typename?: 'ObjectOKDto', result: string } };

export type TransactionStatusStreamSubscriptionVariables = Exact<{
  args: InputTransactionArgs;
}>;


export type TransactionStatusStreamSubscription = { __typename?: 'Subscription', TransactionStatusStream: { __typename?: 'ObjectTransactionStatusLogDto', createdAt: Date, event?: TransactionEventEnumType | null, id: number, status: TransactionStatusEnumType } };

export type UpdateTransactionProfileLinkMutationVariables = Exact<{
  args: InputTransactionUpdateProfileLinkArgs;
}>;


export type UpdateTransactionProfileLinkMutation = { __typename?: 'Mutation', updateTransactionProfileLink: { __typename?: 'ObjectOKDto', result: string } };


export const GetTransactionDocument = gql`
    query GetTransaction($args: InputTransactionArgs!) {
  transaction(args: $args) {
    id
    createdAt
    bot {
      id
      accountName
      avatarUrl
    }
    logs {
      id
      event
      status
      createdAt
    }
    edition {
      digisellerProduct {
        name {
          en
          ru
        }
        previewUrl
      }
    }
    profileLink
    region
    paymentDetails {
      invoice
    }
  }
  config {
    telegramLogin
    discordLink
    email
    skypeLink
    supportLink
    vkLink
  }
}
    `;

/**
 * __useGetTransactionQuery__
 *
 * To run a query within a React component, call `useGetTransactionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTransactionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTransactionQuery({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function useGetTransactionQuery(baseOptions: Apollo.QueryHookOptions<GetTransactionQuery, GetTransactionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTransactionQuery, GetTransactionQueryVariables>(GetTransactionDocument, options);
      }
export function useGetTransactionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTransactionQuery, GetTransactionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTransactionQuery, GetTransactionQueryVariables>(GetTransactionDocument, options);
        }
export type GetTransactionQueryHookResult = ReturnType<typeof useGetTransactionQuery>;
export type GetTransactionLazyQueryHookResult = ReturnType<typeof useGetTransactionLazyQuery>;
export type GetTransactionQueryResult = Apollo.QueryResult<GetTransactionQuery, GetTransactionQueryVariables>;
export const ResendTransactionDocument = gql`
    mutation ResendTransaction($args: InputTransactionArgs!) {
  resendTransaction(args: $args) {
    result
  }
}
    `;
export type ResendTransactionMutationFn = Apollo.MutationFunction<ResendTransactionMutation, ResendTransactionMutationVariables>;

/**
 * __useResendTransactionMutation__
 *
 * To run a mutation, you first call `useResendTransactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResendTransactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resendTransactionMutation, { data, loading, error }] = useResendTransactionMutation({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function useResendTransactionMutation(baseOptions?: Apollo.MutationHookOptions<ResendTransactionMutation, ResendTransactionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResendTransactionMutation, ResendTransactionMutationVariables>(ResendTransactionDocument, options);
      }
export type ResendTransactionMutationHookResult = ReturnType<typeof useResendTransactionMutation>;
export type ResendTransactionMutationResult = Apollo.MutationResult<ResendTransactionMutation>;
export type ResendTransactionMutationOptions = Apollo.BaseMutationOptions<ResendTransactionMutation, ResendTransactionMutationVariables>;
export const TransactionStatusStreamDocument = gql`
    subscription TransactionStatusStream($args: InputTransactionArgs!) {
  TransactionStatusStream(args: $args) {
    createdAt
    event
    id
    status
  }
}
    `;

/**
 * __useTransactionStatusStreamSubscription__
 *
 * To run a query within a React component, call `useTransactionStatusStreamSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTransactionStatusStreamSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransactionStatusStreamSubscription({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function useTransactionStatusStreamSubscription(baseOptions: Apollo.SubscriptionHookOptions<TransactionStatusStreamSubscription, TransactionStatusStreamSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<TransactionStatusStreamSubscription, TransactionStatusStreamSubscriptionVariables>(TransactionStatusStreamDocument, options);
      }
export type TransactionStatusStreamSubscriptionHookResult = ReturnType<typeof useTransactionStatusStreamSubscription>;
export type TransactionStatusStreamSubscriptionResult = Apollo.SubscriptionResult<TransactionStatusStreamSubscription>;
export const UpdateTransactionProfileLinkDocument = gql`
    mutation UpdateTransactionProfileLink($args: InputTransactionUpdateProfileLinkArgs!) {
  updateTransactionProfileLink(args: $args) {
    result
  }
}
    `;
export type UpdateTransactionProfileLinkMutationFn = Apollo.MutationFunction<UpdateTransactionProfileLinkMutation, UpdateTransactionProfileLinkMutationVariables>;

/**
 * __useUpdateTransactionProfileLinkMutation__
 *
 * To run a mutation, you first call `useUpdateTransactionProfileLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTransactionProfileLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTransactionProfileLinkMutation, { data, loading, error }] = useUpdateTransactionProfileLinkMutation({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function useUpdateTransactionProfileLinkMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTransactionProfileLinkMutation, UpdateTransactionProfileLinkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTransactionProfileLinkMutation, UpdateTransactionProfileLinkMutationVariables>(UpdateTransactionProfileLinkDocument, options);
      }
export type UpdateTransactionProfileLinkMutationHookResult = ReturnType<typeof useUpdateTransactionProfileLinkMutation>;
export type UpdateTransactionProfileLinkMutationResult = Apollo.MutationResult<UpdateTransactionProfileLinkMutation>;
export type UpdateTransactionProfileLinkMutationOptions = Apollo.BaseMutationOptions<UpdateTransactionProfileLinkMutation, UpdateTransactionProfileLinkMutationVariables>;