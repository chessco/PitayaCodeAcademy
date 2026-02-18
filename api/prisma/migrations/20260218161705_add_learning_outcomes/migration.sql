/*
  Warnings:

  - You are about to add the `learningOutcomes` column to the `Course` table. 
  - Other columns like `thumbnail`, `category`, `level` might be needed too.
  - Adding minimal required changes first to unblock.
*/

-- AlterTable
ALTER TABLE `Course` ADD COLUMN `learningOutcomes` TEXT NULL;
