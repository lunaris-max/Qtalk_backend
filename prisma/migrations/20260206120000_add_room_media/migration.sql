-- CreateTable
CREATE TABLE "RoomMedia" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "originalName" TEXT,
    "resourceType" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "bytes" INTEGER NOT NULL,
    "publicId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "secureUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoomMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RoomMedia_roomId_idx" ON "RoomMedia"("roomId");

-- CreateIndex
CREATE INDEX "RoomMedia_publicId_idx" ON "RoomMedia"("publicId");

-- AddForeignKey
ALTER TABLE "RoomMedia" ADD CONSTRAINT "RoomMedia_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
