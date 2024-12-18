-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Submitted', 'Approved', 'Details_Requested', 'Rejected');

-- CreateTable
CREATE TABLE "ReturnRequests" (
    "id" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "AIGeneratedDescription" TEXT NOT NULL,
    "AIProcessed" BOOLEAN NOT NULL,
    "OrderNumber" TEXT NOT NULL,
    "AIProcessedOrderNumber" TEXT NOT NULL,
    "Status" "OrderStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedBy" TEXT,

    CONSTRAINT "ReturnRequests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Files" (
    "id" TEXT NOT NULL,
    "Filename" TEXT NOT NULL,
    "MimeType" TEXT NOT NULL,
    "Size" DECIMAL(65,30) NOT NULL,
    "Data" BYTEA NOT NULL,
    "returnRequestsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "modifiedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "modifiedBy" TEXT,

    CONSTRAINT "Files_pkey" PRIMARY KEY ("id")
);
