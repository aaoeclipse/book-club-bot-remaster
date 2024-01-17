-- CreateTable
CREATE TABLE "Book" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "createdBy" INTEGER NOT NULL,
    "chapters" INTEGER,
    CONSTRAINT "Book_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Election" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startedBy" INTEGER NOT NULL,
    "finish" BOOLEAN NOT NULL DEFAULT false,
    "finishDate" DATETIME,
    CONSTRAINT "Election_startedBy_fkey" FOREIGN KEY ("startedBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ActiveBook" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "wonElection" INTEGER NOT NULL,
    "bookid" INTEGER NOT NULL,
    CONSTRAINT "ActiveBook_wonElection_fkey" FOREIGN KEY ("wonElection") REFERENCES "Election" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ActiveBook_wonElection_fkey" FOREIGN KEY ("wonElection") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Progress" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userid" INTEGER NOT NULL,
    "bookid" INTEGER NOT NULL,
    "chapter" INTEGER NOT NULL,
    CONSTRAINT "Progress_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Progress_bookid_fkey" FOREIGN KEY ("bookid") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userid" INTEGER NOT NULL,
    "bookid" INTEGER NOT NULL,
    CONSTRAINT "Vote_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Vote_bookid_fkey" FOREIGN KEY ("bookid") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
