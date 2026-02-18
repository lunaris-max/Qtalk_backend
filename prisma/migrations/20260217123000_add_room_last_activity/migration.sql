ALTER TABLE "Room" ADD COLUMN "lastActivityAt" TIMESTAMP(3);
ALTER TABLE "RoomMember" ADD COLUMN "lastActivityAt" TIMESTAMP(3);

CREATE INDEX "Room_lastActivityAt_idx" ON "Room"("lastActivityAt");
CREATE INDEX "RoomMember_roomId_lastActivityAt_idx" ON "RoomMember"("roomId", "lastActivityAt");
