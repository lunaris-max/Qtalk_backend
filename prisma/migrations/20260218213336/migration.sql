/*
  Warnings:

  - You are about to alter the column `reason` on the `RoomReport` table. The data in that column could be lost. The data in that column will be cast from `VarChar(500)` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE "RoomReport" ALTER COLUMN "reason" SET DATA TYPE VARCHAR(100);
