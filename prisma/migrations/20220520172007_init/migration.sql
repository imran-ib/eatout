/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `birthDay` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `nickname` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `thumbURL` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('OWNER', 'CLIENT', 'DELIVERY');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_userId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "birthDay",
DROP COLUMN "gender",
DROP COLUMN "nickname",
DROP COLUMN "phone",
DROP COLUMN "thumbURL",
DROP COLUMN "verified",
ADD COLUMN     "IsVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "code" TEXT,
ADD COLUMN     "role" "ROLE" NOT NULL DEFAULT E'CLIENT',
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "password" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "photoURL" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "Profile";

-- DropEnum
DROP TYPE "AuthType";

-- DropEnum
DROP TYPE "Gender";

-- RenameIndex
ALTER INDEX "User.email_unique" RENAME TO "User_email_key";
