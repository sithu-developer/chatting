import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteChat, updateChat } from "@/store/slices/chatsSlice";
import { ConfirmationItemsType } from "@/types/chats";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { User } from "@prisma/client";

interface Props {
    confirmationItems : ConfirmationItemsType,
    setConfirmationItems : (value : ConfirmationItemsType) => void,
}

const Confirmation = ( { confirmationItems , setConfirmationItems } : Props ) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(store => store.userSlice.user) as User;

    const handleDeleteChat = () => {
       if(confirmationItems.chatToDelete) {
            dispatch(deleteChat({ id : confirmationItems.chatToDelete.id , isSuccess : () => {
                setConfirmationItems({ open : false , chatToDelete : undefined });
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
        <Dialog open={confirmationItems.open} onClose={() => setConfirmationItems({ open : false , chatToDelete : undefined , chatToPin : undefined })} slotProps={{ paper : { sx : { backgroundColor : "secondary.main"}}}} >
            <DialogTitle >
                {confirmationItems.chatToPin && <Typography sx={{ fontSize : 21}} >Pin message</Typography>}
                {confirmationItems.chatToDelete && <Typography sx={{ fontSize : 21}} >Delete Message</Typography>}
            </DialogTitle>
            <DialogContent >
                {confirmationItems.chatToPin && <Typography>Do you want to pin this message to the top of the chat?</Typography>}
                {confirmationItems.chatToDelete && <Typography>Are you sure you want to delete this Message?</Typography>}
            </DialogContent>
            <DialogActions >
                <Button color="info" onClick={() => setConfirmationItems({ open : false , chatToDelete : undefined , chatToPin : undefined })} >Cancel</Button>
                {confirmationItems.chatToPin && <Button color="info" onClick={handlePinMessage} >Pin</Button>}
                {confirmationItems.chatToDelete && <Button color="error" onClick={handleDeleteChat} >Delete</Button>}
            </DialogActions>
        </Dialog>
    )
}

export default Confirmation;