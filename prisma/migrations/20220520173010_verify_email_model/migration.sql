/*
  Warnings:

  - You are about to drop the column `code` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "code";

-- CreateTable
CREATE TABLE "VerifyEmail" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "VerifyEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VerifyEmail_userId_key" ON "VerifyEmail"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerifyEmail_code_key" ON "VerifyEmail"("code");

-- AddForeignKey
ALTER TABLE "VerifyEmail" ADD CONSTRAINT "VerifyEmail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
