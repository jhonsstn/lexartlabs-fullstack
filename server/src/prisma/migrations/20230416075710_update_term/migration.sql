/*
  Warnings:

  - A unique constraint covering the columns `[term]` on the table `Term` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Term_term_key" ON "Term"("term");
