import { useAppSelector } from "@/store/hooks";
import { OpenSideBarComponent } from "@/types/sideBarComponent";
import { Box, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material"

interface Props {
    openSideBarComponent : OpenSideBarComponent,
    setOpenSideBarComponent : (value : OpenSideBarComponent) => void,
}

const MyProfile = ( { openSideBarComponent , setOpenSideBarComponent } : Props) => {
    const user = useAppSelector(store => store.userSliceReducer.user);

    if(user)
    return (
        <Dialog open={openSideBarComponent.id===1 && openSideBarComponent.open} onClose={() => setOpenSideBarComponent({...openSideBarComponent , open : false }) } >
            <img src={"/defaultProfile.jpg"} style={{ width : "250px" , height : "230px" }} />
            <DialogContent sx={{ bgcolor : "primary.main" , display : "flex" , flexDirection : "column" , gap : "10px"}}>
                <Typography fontWeight={700} sx={{ fontSize : "14px" , color : "text.secondary" }} >Info</Typography>
                <Box>
                    <Typography fontSize={"14px"}>{user.email}</Typography>
                    <Typography sx={{ color : "lightgray"}} fontSize={"13px"}>email</Typography>
                </Box>
                <Box> 
                    <Typography fontSize={"14px"}>{}</Typography>
                    <Typography sx={{ color : "lightgray"}} fontSize={"13px"}>Bio</Typography>
                </Box>
                <Box>
                    <Typography fontSize={"14px"}>@{user.name}</Typography>
                    <Typography sx={{ color : "lightgray"}} fontSize={"13px"}>Mention</Typography>
                </Box>
            </DialogContent>
        </Dialog>
    )
}//here

export default MyProfile;