import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteChat, updateChat } from "@/store/slices/chatsSlice";
import { ConfirmationItemsType, NewChat } from "@/types/chats";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { Chats, User } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import { deleteRelations } from "@/store/slices/userIdAndFriendIdSlice";
import { changeIsLoading, changeSnackBar } from "@/store/slices/generalSlice";
import { Severity } from "@/types/general";


interface Props {
    confirmationItems : ConfirmationItemsType,
    setConfirmationItems : (value : ConfirmationItemsType) => void,
    setSelectedChats ?: (value : Chats[]) => void;
    setSelectedFriends ?: (value : User[]) => void;
    setReplyChat ?: (value : Chats | null) => void;
    setNewChat ?: (value : NewChat) => void;
    setEditedChat ?: (value : Chats | null ) => void;
    newChat ?: NewChat;
    replyChat ?: Chats | null;
    editedChat ?: Chats | null;
}

const Confirmation = ( { confirmationItems , setConfirmationItems , setSelectedChats , setSelectedFriends , setEditedChat , setNewChat , setReplyChat , newChat , editedChat , replyChat } : Props ) => {
    const dispatch = useAppDispatch();
    const friends = useAppSelector(store => store.userSlice.friends);
    const user = useAppSelector(store => store.userSlice.user);
    const [ firstFriend , setFirstFriend ] = useState<User>()

    useEffect(() => {
        if(confirmationItems.relationsToDelete && (confirmationItems.relationsToDelete.length === 1) && friends.length) {
            const firstRelation = confirmationItems.relationsToDelete[0];
            const firstFriend = friends.find(item => item.id === firstRelation.friendId)
            setFirstFriend(firstFriend);
        }
    } , [confirmationItems.relationsToDelete , friends])

    const handleDeleteChat = () => {
       if(confirmationItems.chatsToDelete !== undefined) {
            const deletedIds = confirmationItems.chatsToDelete.map(item => item.id);
            dispatch(changeIsLoading(true))
            dispatch(deleteChat({ deletedIds  , isSuccess : () => {
                dispatch(changeIsLoading(false))
                setConfirmationItems({ open : false , chatsToDelete : undefined });
                if(setSelectedChats) {
                    setSelectedChats([]);
                }
                // close reply chat or edit chat , if there is include in deletedChats and are opened
                if(setReplyChat && replyChat && deletedIds.includes(replyChat.id)) {
                    setReplyChat(null);
                }
                if(setNewChat && newChat && newChat.replyId && deletedIds.includes(newChat.replyId)){
                    setNewChat({...newChat , replyId : null });
                }
                if(setEditedChat && editedChat && deletedIds.includes(editedChat.id)) {
                    setEditedChat(null);
                }
            } }))
       } 
    }

    const handleDeleteRelations = () => {
        if(confirmationItems.relationsToDelete) {
            dispatch(changeIsLoading(true));
            const deletedRelationIds = confirmationItems.relationsToDelete.map(item => item.id);
            dispatch(deleteRelations({ deletedRelationIds , isSuccess : () => {
                dispatch(changeIsLoading(false));
                setConfirmationItems({ open : false , relationsToDelete : undefined });
                setFirstFriend(undefined)
                if(setSelectedFriends) {
                    setSelectedFriends([])
                }
            } }))
        }
    }

    const handlePinMessage = () => {
        if(confirmationItems.chatToPin) {
            dispatch(changeIsLoading(true))
            dispatch(updateChat({...confirmationItems.chatToPin , imageMessageUrl : undefined , isPin : true , isSuccess : () => {
                setConfirmationItems({ open : false , chatToPin : undefined })
                dispatch(changeSnackBar({isSnackBarOpen : true , message : "Message pinned." , severity : Severity.success}))
                dispatch(changeIsLoading(false));
            } }));
        }
    }

    if(!user) return null;
    return (
        <Dialog open={confirmationItems.open} onClose={() => {
            setConfirmationItems({ open : false , chatsToDelete : undefined , chatToPin : undefined , relationsToDelete : undefined });
            setFirstFriend(undefined);
        }} slotProps={{ paper : { sx : { backgroundColor : "secondary.main"}}}} >
            <DialogTitle >
                {confirmationItems.chatToPin && <Typography sx={{ fontSize : 21}} >Pin message</Typography>}
                {confirmationItems.chatsToDelete && <Typography sx={{ fontSize : 21}} >Delete {confirmationItems.chatsToDelete.length > 1 ? confirmationItems.chatsToDelete.length + " messages" : "message" } </Typography>}
                {confirmationItems.relationsToDelete && <Box sx={{ display : "flex" , alignItems : "center" , gap : "10px"}}>
                    {firstFriend ? <Box sx={{ width : "45px" , height : "45px" , borderRadius : "30px" , display : "flex" , justifyContent : "center" , alignItems : "center" , overflow : "hidden" }}>
                        <Image alt="friend profile" src={firstFriend.profileUrl ? firstFriend.profileUrl : "/defaultProfile.jpg"} width={200} height={200} style={{ width : "45px" , height : "auto" , minHeight : "45px"}} ></Image> 
                    </Box>
                    : undefined}
                    {(confirmationItems.relationsToDelete.length === 1 && confirmationItems.relationsToDelete[0].friendId === user.id) ? <Box sx={{ bgcolor : "info.main" , display : "flex" , justifyContent : "center" , alignItems : "center" ,  width : "45px" , height : "45px" , borderRadius : "30px" }} >
                        <BookmarkBorderRoundedIcon sx={{ fontSize : "30px" , color : "white"}} />
                    </Box>
                    : undefined} 
                    <Typography sx={{ fontSize : 21}} >Delete {confirmationItems.relationsToDelete.length > 1 ? confirmationItems.relationsToDelete.length + " chats" : "chat"}</Typography>
                </Box>}
            </DialogTitle>
            <DialogContent >
                {confirmationItems.chatToPin && <Typography>Do you want to pin this message to the top of the chat?</Typography>}
                {confirmationItems.chatsToDelete && <Typography>Are you sure you want to delete {confirmationItems.chatsToDelete.length > 1 ? "these Messages" : "this Message" }?</Typography>}
                {confirmationItems.relationsToDelete && <Typography>{firstFriend ? "Permanently delete the chat with " + firstFriend.firstName + " " + firstFriend.lastName : "Are you sure you want to delete " + (confirmationItems.relationsToDelete.length === 1 ? "Saved Message" : "these chats")} ?</Typography>}
            </DialogContent>
            <DialogActions >
                <Button color="info" sx={{ textTransform : "none" , fontWeight : "bold" }} 
                onClick={() => {
                    setConfirmationItems({ open : false , chatsToDelete : undefined , chatToPin : undefined ,  relationsToDelete : undefined });
                    setFirstFriend(undefined)
                }}>Cancel</Button>
                {confirmationItems.chatToPin && <Button color="info" onClick={handlePinMessage} sx={{ textTransform : "none" , fontWeight : "bold"}} >Pin</Button>}
                {confirmationItems.chatsToDelete && <Button color="error" onClick={handleDeleteChat} sx={{ textTransform : "none" , fontWeight : "bold"}} >Delete</Button>}
                {confirmationItems.relationsToDelete && <Button color="error" onClick={handleDeleteRelations} sx={{ textTransform : "none" , fontWeight : "bold"}} >Delete {confirmationItems.relationsToDelete.length > 1 ? "Chats" : "Chat"}</Button>}
            </DialogActions>
        </Dialog>
    )
}

export default Confirmation;