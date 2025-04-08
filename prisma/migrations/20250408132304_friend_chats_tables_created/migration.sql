-- CreateTable
CREATE TABLE "UserIdAndFriendId" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "friendId" INTEGER NOT NULL,

    CONSTRAINT "UserIdAndFriendId_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chats" (
    "id" SERIAL NOT NULL,
    "userAndFriendRelationId" INTEGER NOT NULL,
    "chat" TEXT NOT NULL,
    "fromUser" BOOLEAN NOT NULL,
    "sendTime" TEXT NOT NULL,

    CONSTRAINT "Chats_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserIdAndFriendId" ADD CONSTRAINT "UserIdAndFriendId_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserIdAndFriendId" ADD CONSTRAINT "UserIdAndFriendId_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chats" ADD CONSTRAINT "Chats_userAndFriendRelationId_fkey" FOREIGN KEY ("userAndFriendRelationId") REFERENCES "UserIdAndFriendId"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
