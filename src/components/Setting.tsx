import { OpenSideBarComponent } from "@/types/sideBarComponent";
import { Box, Dialog } from "@mui/material";

interface Props {
    openSideBarComponent : OpenSideBarComponent,
    setOpenSideBarComponent : (value : OpenSideBarComponent ) => void
}

const Setting = ({ openSideBarComponent , setOpenSideBarComponent} : Props) => {
    return (
        <Dialog open={openSideBarComponent.id === 4 && openSideBarComponent.open} onClose={() => {
            setOpenSideBarComponent({...openSideBarComponent , open : false })
        }} >
            <Box sx={{ bgcolor : "secondary.main"}}>Setting</Box>
            
        </Dialog>
    )
}

export default Setting;