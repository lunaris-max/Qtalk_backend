-- Drop indexes first to avoid dependency issues
DROP INDEX "RoomMember_roomId_lastActivityAt_idx";
DROP INDEX "Room_lastActivityAt_idx";

ALTER TABLE "RoomMember" DROP COLUMN "lastActivityAt";
ALTER TABLE "Room" DROP COLUMN "lastActivityAt";
