import { useAppSelector } from "@/store/hooks";
import { Chats, User, UserIdAndFriendId } from "@prisma/client";

interface Props {
    currentFriend : User | undefined;
    selectedChats : Chats[]
    userIdAndFriendIds : UserIdAndFriendId[]
    user : User
}

export const copyTexts = ( { currentFriend , selectedChats , userIdAndFriendIds , user } : Props ) => {
  
    let tempId = 0;
    if(currentFriend && selectedChats.length > 1) {
        navigator.clipboard.writeText(selectedChats.sort((a , b) => a.id - b.id).map(selectedChat => {
            const eachUserIdAndFriendId = userIdAndFriendIds.find(each => each.id === selectedChat.userAndFriendRelationId) as UserIdAndFriendId;
            if(eachUserIdAndFriendId.userId === user.id) {
                if(tempId !== user.id) {
                    tempId = user.id;
                    return user.firstName + " " + user.lastName + ":\n" + selectedChat.message;
                } else {
                    return selectedChat.message
                }
            } else {
                if(tempId !== currentFriend.id) {
                    tempId = currentFriend.id;
                    return currentFriend.firstName + " " + currentFriend.lastName + ":\n" + selectedChat.message;
                } else {
                    return selectedChat.message;
                }
            }
        }).join("\n\n"));
    } else {
        navigator.clipboard.writeText(selectedChats.sort((a , b) => a.id - b.id).map(selectedChat => selectedChat.message).join("\n\n"))
    }
}