/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `electionid` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" ADD COLUMN "description" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "role" TEXT;

-- CreateTable
CREATE TABLE "BooksElection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bookid" INTEGER NOT NULL,
    "electionid" INTEGER NOT NULL,
    CONSTRAINT "BooksElection_bookid_fkey" FOREIGN KEY ("bookid") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BooksElection_electionid_fkey" FOREIGN KEY ("electionid") REFERENCES "Election" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ActiveBook" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "wonElection" INTEGER NOT NULL,
    "bookid" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "ActiveBook_wonElection_fkey" FOREIGN KEY ("wonElection") REFERENCES "Election" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ActiveBook_bookid_fkey" FOREIGN KEY ("bookid") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ActiveBook" ("bookid", "id", "wonElection") SELECT "bookid", "id", "wonElection" FROM "ActiveBook";
DROP TABLE "ActiveBook";
ALTER TABLE "new_ActiveBook" RENAME TO "ActiveBook";
CREATE TABLE "new_Progress" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userid" INTEGER NOT NULL,
    "bookid" INTEGER NOT NULL,
    "chapter" INTEGER NOT NULL,
    CONSTRAINT "Progress_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Progress_bookid_fkey" FOREIGN KEY ("bookid") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Progress" ("bookid", "chapter", "id", "userid") SELECT "bookid", "chapter", "id", "userid" FROM "Progress";
DROP TABLE "Progress";
ALTER TABLE "new_Progress" RENAME TO "Progress";
CREATE TABLE "new_Vote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userid" INTEGER NOT NULL,
    "bookid" INTEGER NOT NULL,
    "electionid" INTEGER NOT NULL,
    CONSTRAINT "Vote_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Vote_bookid_fkey" FOREIGN KEY ("bookid") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Vote_electionid_fkey" FOREIGN KEY ("electionid") REFERENCES "Election" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Vote" ("bookid", "id", "userid") SELECT "bookid", "id", "userid" FROM "Vote";
DROP TABLE "Vote";
ALTER TABLE "new_Vote" RENAME TO "Vote";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Book_title_key" ON "Book"("title");
