import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteChat, updateChat } from "@/store/slices/chatsSlice";
import { ConfirmationItemsType } from "@/types/chats";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { Chats, User } from "@prisma/client";

interface Props {
    confirmationItems : ConfirmationItemsType,
    setConfirmationItems : (value : ConfirmationItemsType) => void,
    setSelectedChats : (value : Chats[]) => void;
}

const Confirmation = ( { confirmationItems , setConfirmationItems , setSelectedChats } : Props ) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(store => store.userSlice.user) as User;

    const handleDeleteChat = () => {
       if(confirmationItems.chatsToDelete !== undefined) {
            const deletedIds = confirmationItems.chatsToDelete.map(item => item.id);
            dispatch(deleteChat({ deletedIds  , isSuccess : () => {
                setConfirmationItems({ open : false , chatsToDelete : undefined });
                if(setSelectedChats) {
                    setSelectedChats([]);
                }
            } }))
       } 
    }

    const handlePinMessage = () => {
        if(confirmationItems.chatToPin) {
            dispatch(updateChat({...confirmationItems.chatToPin , isPin : true , isSuccess : () => {
                setConfirmationItems({ open : false , chatToPin : undefined })
            } }))
        }
    }

    return (
        <Dialog open={confirmationItems.open} onClose={() => setConfirmationItems({ open : false , chatsToDelete : undefined , chatToPin : undefined })} slotProps={{ paper : { sx : { backgroundColor : "secondary.main"}}}} >
            <DialogTitle >
                {confirmationItems.chatToPin && <Typography sx={{ fontSize : 21}} >Pin message</Typography>}
                {confirmationItems.chatsToDelete && <Typography sx={{ fontSize : 21}} >Delete Message</Typography>}
            </DialogTitle>
            <DialogContent >
                {confirmationItems.chatToPin && <Typography>Do you want to pin this message to the top of the chat?</Typography>}
                {confirmationItems.chatsToDelete && <Typography>Are you sure you want to delete this Message?</Typography>}
            </DialogContent>
            <DialogActions >
                <Button color="info" onClick={() => setConfirmationItems({ open : false , chatsToDelete : undefined , chatToPin : undefined })} >Cancel</Button>
                {confirmationItems.chatToPin && <Button color="info" onClick={handlePinMessage} >Pin</Button>}
                {confirmationItems.chatsToDelete && <Button color="error" onClick={handleDeleteChat} >Delete</Button>}
            </DialogActions>
        </Dialog>
    )
}

export default Confirmation;