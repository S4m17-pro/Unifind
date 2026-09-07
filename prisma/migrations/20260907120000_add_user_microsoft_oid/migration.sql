-- AlterTable
ALTER TABLE "users" ADD COLUMN "microsoftOid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_microsoftOid_key" ON "users"("microsoftOid");
