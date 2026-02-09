-- Rename table
ALTER TABLE "RoomMedia" RENAME TO "Media";

-- Rename indexes
ALTER INDEX "RoomMedia_roomId_idx" RENAME TO "Media_roomId_idx";
ALTER INDEX "RoomMedia_publicId_idx" RENAME TO "Media_publicId_idx";

-- Rename constraints
ALTER TABLE "Media" RENAME CONSTRAINT "RoomMedia_pkey" TO "Media_pkey";
ALTER TABLE "Media" RENAME CONSTRAINT "RoomMedia_roomId_fkey" TO "Media_roomId_fkey";
