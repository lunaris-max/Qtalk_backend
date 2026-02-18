-- CreateTable
CREATE TABLE "RoomReport" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "reason" VARCHAR(500) NOT NULL,
    "details" VARCHAR(1000),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoomReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RoomReport_reporterId_createdAt_idx" ON "RoomReport"("reporterId", "createdAt");

-- CreateIndex
CREATE INDEX "RoomReport_roomId_idx" ON "RoomReport"("roomId");

-- AddForeignKey
ALTER TABLE "RoomReport" ADD CONSTRAINT "RoomReport_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomReport" ADD CONSTRAINT "RoomReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
