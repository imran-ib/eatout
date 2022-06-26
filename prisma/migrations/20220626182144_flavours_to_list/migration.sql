/*
  Warnings:

  - The `flavour` column on the `DishOptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "DishOptions" DROP COLUMN "flavour",
ADD COLUMN     "flavour" TEXT[];
