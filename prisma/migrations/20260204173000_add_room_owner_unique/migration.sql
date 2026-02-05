-- Ensure only one OWNER per room in RoomMember
CREATE UNIQUE INDEX "room_member_owner_unique"
ON "RoomMember" ("roomId")
WHERE "role" = 'OWNER';
