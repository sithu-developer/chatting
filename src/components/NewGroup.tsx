import { OpenSideBarComponent } from "@/types/sideBarComponent";
import { Dialog, DialogTitle, Typography } from "@mui/material";

interface Props {
    openSideBarComponent : OpenSideBarComponent,
    setOpenSideBarComponent : (value : OpenSideBarComponent) => void,
}

const NewGroup = ( { openSideBarComponent , setOpenSideBarComponent } : Props ) => {
    return (
        <Dialog open={openSideBarComponent.id === 2 && openSideBarComponent.open} onClose={() => setOpenSideBarComponent({...openSideBarComponent , open : false})} >
            <DialogTitle><Typography>New Group</Typography></DialogTitle>
        </Dialog>
    )
}

export default NewGroup;