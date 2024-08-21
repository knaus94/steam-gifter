-- CreateEnum
CREATE TYPE "BotStatusEnum" AS ENUM ('STARTING', 'RUNNING', 'STOPPED', 'ERROR');

-- CreateEnum
CREATE TYPE "BotErrCodeEnum" AS ENUM ('AUTHENTICATION_FAILED', 'DISCONNECTED', 'ACCOUNT_LIMITATIONS');

-- CreateEnum
CREATE TYPE "RegionCodeEnum" AS ENUM ('UA', 'RU', 'KZ', 'TR', 'US', 'EU', 'AR');

-- CreateEnum
CREATE TYPE "TransactionEventEnum" AS ENUM ('FAIL', 'FRIEND_TIMEOUT', 'FRIEND_REQUEST_CANCELED', 'PURCHASE_INFO_IS_NULL', 'PURCHASE_INFO_NOT_AVAILABLE', 'BOT_IS_OFFLINE', 'GIFT_DECLINED', 'PROFILE_LINK_NOT_VALID', 'FAILED_GET_STEAM_ID', 'BOT_NOT_FOUND', 'FRIEND_REQUEST_FAIL', 'RESEND');

-- CreateEnum
CREATE TYPE "TransactionStatusEnum" AS ENUM ('CREATED', 'FRIEND_REQUEST_SENT', 'PROCESS', 'SENT_GIFT', 'SUCCESS', 'ERROR');

-- CreateTable
CREATE TABLE "Bot" (
    "id" SERIAL NOT NULL,
    "accountName" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "steamId64" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "sharedSecret" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "reservedBalance" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "region" "RegionCodeEnum" NOT NULL DEFAULT 'RU',
    "proxyId" INTEGER,
    "status" "BotStatusEnum" NOT NULL DEFAULT 'STOPPED',
    "errCode" "BotErrCodeEnum",
    "errMsg" TEXT,

    CONSTRAINT "PK_BOT" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Config" (
    "id" SERIAL NOT NULL,
    "skypeLink" TEXT,
    "supportLink" TEXT,
    "telegramLogin" TEXT,
    "vkLink" TEXT,
    "email" TEXT,
    "discordLink" TEXT,

    CONSTRAINT "PK_CONFIG" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelegramConfig" (
    "id" SERIAL NOT NULL,
    "botToken" TEXT,
    "balanceNotification" BOOLEAN NOT NULL DEFAULT false,
    "balanceChatId" TEXT,
    "balanceThreshold" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "statusChangeNotification" BOOLEAN NOT NULL DEFAULT false,
    "statusChangeChatId" TEXT,
    "productPricesUpdatedNotification" BOOLEAN NOT NULL DEFAULT false,
    "productPricesUpdatedChatId" TEXT,

    CONSTRAINT "PK_TELEGRAM_CONFIG" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DigisellerConfig" (
    "id" SERIAL NOT NULL,
    "profileLinkFieldName" JSONB NOT NULL,
    "regionFieldName" JSONB NOT NULL,
    "editionSelectionFieldName" JSONB NOT NULL,
    "apiKey" TEXT,
    "sellerId" INTEGER,
    "token" TEXT,
    "tokenUpdatedAt" TIMESTAMP(3),

    CONSTRAINT "PK_DIGISELLER_CONFIG" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DigisellerRegion" (
    "id" SERIAL NOT NULL,
    "configId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PK_DIGISELLER_REGION" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DigisellerProduct" (
    "id" SERIAL NOT NULL,
    "isDisabled" BOOLEAN NOT NULL DEFAULT false,
    "digisellerId" INTEGER NOT NULL,
    "editionSelection" BOOLEAN NOT NULL DEFAULT false,
    "name" JSONB NOT NULL,
    "previewUrl" TEXT,
    "syncPrice" BOOLEAN NOT NULL DEFAULT false,
    "syncPricePercent" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "syncPriceRegion" "RegionCodeEnum" NOT NULL DEFAULT 'RU',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_DIGISELLER_PRODUCT" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DigisellerProductEdition" (
    "id" SERIAL NOT NULL,
    "digisellerProductId" INTEGER NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT,
    "productId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PK_DIGISELLER_PRODUCT_PACKAGE_EDITION" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DigisellerProductEditionBots" (
    "id" SERIAL NOT NULL,
    "editionId" INTEGER NOT NULL,
    "regionId" INTEGER NOT NULL,
    "botRegions" "RegionCodeEnum"[],

    CONSTRAINT "PK_DIGISELLER_PRODUCT_PACKAGE_EDITION_BOTS" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isBundle" BOOLEAN NOT NULL DEFAULT false,
    "identifier" INTEGER NOT NULL,
    "prices" JSONB NOT NULL,
    "autoSync" "RegionCodeEnum"[],

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proxy" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "username" TEXT,
    "password" TEXT,
    "isValid" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PK_PROXY" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionPaymentDetails" (
    "id" SERIAL NOT NULL,
    "uniqCode" TEXT NOT NULL,
    "invoice" INTEGER NOT NULL,

    CONSTRAINT "PK_TRANSACTION_PAYMENT_DETAILS" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionStatusLogs" (
    "id" SERIAL NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "status" "TransactionStatusEnum" NOT NULL,
    "event" "TransactionEventEnum",
    "errMsg" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_TRANSACTION_STATUS_LOG" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "paymentDetailsId" INTEGER NOT NULL,
    "editionId" INTEGER NOT NULL,
    "profileLink" TEXT NOT NULL,
    "steamId64" TEXT,
    "botId" INTEGER,
    "reservedSum" DOUBLE PRECISION NOT NULL,
    "region" TEXT,
    "purchaseInfo" JSONB,
    "status" "TransactionStatusEnum" NOT NULL DEFAULT 'CREATED',
    "sendAttempts" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_TRANSACTION" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLoginLogs" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_USER_LOGIN_LOGS" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PK_USER" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UQ_BOT__LOGIN" ON "Bot"("login");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_BOT__STEAM_ID_64" ON "Bot"("steamId64");

-- CreateIndex
CREATE INDEX "IDX_BOT__ACCOUNT_NAME" ON "Bot"("accountName");

-- CreateIndex
CREATE INDEX "IDX_BOT__LOGIN" ON "Bot"("login");

-- CreateIndex
CREATE INDEX "IDX_BOT__STEAM_ID_64" ON "Bot"("steamId64");

-- CreateIndex
CREATE INDEX "IDX_BOT__REGION" ON "Bot"("region");

-- CreateIndex
CREATE INDEX "IDX_BOT__BALANCE" ON "Bot"("balance");

-- CreateIndex
CREATE INDEX "IDX_BOT__RESERVED_BALANCE" ON "Bot"("reservedBalance");

-- CreateIndex
CREATE INDEX "IDX_BOT__STATUS" ON "Bot"("status");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_DIGISELLER_CONFIG__API_KEY_WITH_SELLER_ID" ON "DigisellerConfig"("apiKey", "sellerId");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_DIGISELLER_REGION__CONFIG_ID_WITH_NAME" ON "DigisellerRegion"("configId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_DIGISELLER_PRODUCT__DIGISELLER_ID" ON "DigisellerProduct"("digisellerId");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_PRODUCT__IS_BUNDLE_WITH_IDENTIFIER" ON "Product"("isBundle", "identifier");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_PROXY__ADDRESS_WITH_PORT" ON "Proxy"("address", "port");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_TRANSACTION_PAYMENT_DETAILS__UNIQ_CODE" ON "TransactionPaymentDetails"("uniqCode");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_TRANSACTION_PAYMENT_DETAILS__INVOICE" ON "TransactionPaymentDetails"("invoice");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_TRANSACTION__PAYMENT_DETAILS_ID" ON "Transaction"("paymentDetailsId");

-- CreateIndex
CREATE INDEX "IDX_USER_LOGIN_LOGS__USER_ID" ON "UserLoginLogs"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_USER__EMAIL" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Bot" ADD CONSTRAINT "FX_BOT__PROXY_ID" FOREIGN KEY ("proxyId") REFERENCES "Proxy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigisellerRegion" ADD CONSTRAINT "FK_DIGISELLER_REGION__CONFIG_ID" FOREIGN KEY ("configId") REFERENCES "DigisellerConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigisellerProductEdition" ADD CONSTRAINT "FK_DIGISELLER_PRODUCT_PACKAGE_EDITION__DIGISELLER_PRODUCT_ID" FOREIGN KEY ("digisellerProductId") REFERENCES "DigisellerProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigisellerProductEdition" ADD CONSTRAINT "FK_DIGISELLER_PRODUCT_PACKAGE_EDITION__PRODUCT_ID" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigisellerProductEditionBots" ADD CONSTRAINT "FK_DIGISELLER_PRODUCT_PACKAGE_EDITION_BOTS__EDITION_ID" FOREIGN KEY ("editionId") REFERENCES "DigisellerProductEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigisellerProductEditionBots" ADD CONSTRAINT "FK_DIGISELLER_PRODUCT_PACKAGE_EDITION_BOTS__REGION_ID" FOREIGN KEY ("regionId") REFERENCES "DigisellerRegion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionStatusLogs" ADD CONSTRAINT "FK_TRANSACTION_STATUS_LOG__TRANSACTION_ID" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "FK_TRANSACTION__PAYMENT_DETAILS_ID" FOREIGN KEY ("paymentDetailsId") REFERENCES "TransactionPaymentDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "FK_TRANSACTION__EDITION_ID" FOREIGN KEY ("editionId") REFERENCES "DigisellerProductEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "FK_TRANSACTION__BOT_ID" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLoginLogs" ADD CONSTRAINT "FK_USER_LOGIN_LOGS__USER_ID" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
