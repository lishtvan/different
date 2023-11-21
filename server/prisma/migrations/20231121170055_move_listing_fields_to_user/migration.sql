-- Was edited to avoid data loss
ALTER TABLE "User" ADD COLUMN     "cardNumber" TEXT,
ADD COLUMN     "email" TEXT;

UPDATE "User" 
SET "cardNumber" = "Listing"."cardNumber", 
    phone = "Listing".phone
FROM "Listing"
WHERE "User".id = "Listing"."userId";

ALTER TABLE "Listing" DROP COLUMN "cardNumber",
DROP COLUMN "phone";