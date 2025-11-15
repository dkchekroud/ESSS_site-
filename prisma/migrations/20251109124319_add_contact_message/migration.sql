/*
  Warnings:

  - You are about to drop the column `created_at` on the `contactmessage` table. All the data in the column will be lost.
  - You are about to drop the column `full_name` on the `contactmessage` table. All the data in the column will be lost.
  - Added the required column `fullName` to the `ContactMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `contactmessage` DROP COLUMN `created_at`,
    DROP COLUMN `full_name`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `fullName` VARCHAR(191) NOT NULL;
