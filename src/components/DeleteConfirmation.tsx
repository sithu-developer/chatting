import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteChat } from "@/store/slices/chatsSlice";
import { DeleteConfirmationItemsType } from "@/types/chats";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { User } from "@prisma/client";

interface Props {
    deleteItemType : string,
    deleteConfirmationItems : DeleteConfirmationItemsType,
    setDeleteConfirmationItems : (value : DeleteConfirmationItemsType) => void,
}

const DeleteConfirmation = ( { deleteItemType , deleteConfirmationItems , setDeleteConfirmationItems } : Props ) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(store => store.userSlice.user) as User;

    const handleDeleteChat = () => {
       if(deleteConfirmationItems.chatToDelete) {
            dispatch(deleteChat({ id : deleteConfirmationItems.chatToDelete.id , isSuccess : () => {
                setDeleteConfirmationItems({ open : false , chatToDelete : undefined });
            } }))
       } 
    }

    return (
        <Dialog open={deleteConfirmationItems.open} onClose={() => setDeleteConfirmationItems({ open : false , chatToDelete : undefined })} slotProps={{ paper : { sx : { backgroundColor : "secondary.main"}}}} >
            <DialogTitle >
                <Typography variant="h6" >Delete {deleteItemType}</Typography>
            </DialogTitle>
            <DialogContent >
                <Typography>Are you sure you want to delete this {deleteItemType} ?</Typography>
            </DialogContent>
            <DialogActions >
                <Button color="info" onClick={() =>setDeleteConfirmationItems({ open : false , chatToDelete : undefined })} >Cancel</Button>
                <Button color="error" onClick={handleDeleteChat} >Delete</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteConfirmation;