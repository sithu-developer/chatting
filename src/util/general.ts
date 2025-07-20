import { useAppSelector } from "@/store/hooks";
import { styled } from "@mui/material";
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

export const timeCalcFunction = ( currentChat : Chats) => {
    const months = [ "Jan" , "Feb" , "Mar" , "Apr" , "May" , "Jun" , "Jul" , "Aug" , "Sep" , "Oct" , "Nov" , "Dec" ];
    const days = [ "Sun" , "Mon" , "Tue" , "Wed" , "Thu" , "Fri" , "Sat" ];

    const nowTime = new Date();
    const createdTime = new Date(currentChat.createdAt);

    if(createdTime.getFullYear() !== nowTime.getFullYear()) {
        return (createdTime.getDate() + "." + createdTime.getMonth() + "." + createdTime.getFullYear() );
    }else if( (createdTime.getDate() === nowTime.getDate()) && (createdTime.getMonth() === nowTime.getMonth() ) ){
        return (createdTime.getHours() <= 12 ? (createdTime.getHours() === 0 ? 12 : createdTime.getHours()) :  (createdTime.getHours() - 12) ) + ":" + createdTime.getMinutes() + (createdTime.getHours() <= 12 ? " AM" : " PM" )
    } else if( (createdTime.getMonth() === nowTime.getMonth()) && (nowTime.getDate() - nowTime.getDate() < 7) ) {
        return days[createdTime.getDay()];
    } else {
        return (months[createdTime.getMonth()] + " " + createdTime.getDate());
    }
}

export const timeCalcFunctionForMessage = ( currentChat : Chats) => {
    const months = [ "Jan" , "Feb" , "Mar" , "Apr" , "May" , "Jun" , "Jul" , "Aug" , "Sep" , "Oct" , "Nov" , "Dec" ];
    const days = [ "Sun" , "Mon" , "Tue" , "Wed" , "Thu" , "Fri" , "Sat" ];

    const nowTime = new Date();
    const createdTime = new Date(currentChat.createdAt);
    const updatedTime = new Date(currentChat.updatedAt)

    let returnedDateString = (createdTime.getTime() === updatedTime.getTime() ? "" : "edited " );

    if(createdTime.getFullYear() !== nowTime.getFullYear()) {
        returnedDateString += (createdTime.getDate() + "." + createdTime.getMonth() + "." + createdTime.getFullYear() + " at " );
    } else if( (createdTime.getDate() === nowTime.getDate()) && (createdTime.getMonth() === nowTime.getMonth() ) ){
        returnedDateString += "";
    } else if( (createdTime.getMonth() === nowTime.getMonth()) && (nowTime.getDate() - nowTime.getDate() === 1) ) {
        returnedDateString += "yesterday at ";
    } else {
        returnedDateString += (months[createdTime.getMonth()] + " " + createdTime.getDate() + " at ");
    }

    returnedDateString += (createdTime.getHours() <= 12 ? (createdTime.getHours() === 0 ? 12 : createdTime.getHours()) :  (createdTime.getHours() - 12) ) + ":" + createdTime.getMinutes() + (createdTime.getHours() <= 12 ? " AM" : " PM" );

    return returnedDateString;
}

export const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export const emojiList = [
  "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
  "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
  "😋", "😜", "😝", "😛", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐",
  "🤨", "😐", "😑", "😶", "🙄", "😏", "😥", "😮", "😯",
  "😪", "😴", "🤤", "😓", "😔", "😕", "😬", "😵", "😎","😤",
  "😠", "😡", "🤬", "😭", "😢", "😖", "😣", "😩", "😫",
  "😱", "😨", "😰", "😳", "🥵", "🥶", "😷", "🤒", "🤕", "🤧",
  "🖐", "✋", "🤚", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🫰",
  "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "☝️", "🫵", "👍",
  "👎", "👊", "✊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🙏",
  "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💘",
  "💝", "💖", "💗", "💓", "💞", "💕", "💟", "❣️", "💌", "💋",
];

