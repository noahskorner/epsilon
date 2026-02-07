-- CreateTable
CREATE TABLE "search_index" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "db_name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "search_index_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "search_index_name_key" ON "search_index"("name");

-- CreateIndex
CREATE UNIQUE INDEX "search_index_db_name_key" ON "search_index"("db_name");
