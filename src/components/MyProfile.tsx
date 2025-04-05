import { useAppSelector } from "@/store/hooks";
import { OpenSideBarComponent } from "@/types/sideBarComponent";
import { Box, Dialog, Divider, Fab, Typography } from "@mui/material"
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import EditProfileInfo from "./EditProfileInfo";
import { useState } from "react";

interface Props {
    openSideBarComponent : OpenSideBarComponent,
    setOpenSideBarComponent : (value : OpenSideBarComponent) => void,
}

const MyProfile = ( { openSideBarComponent , setOpenSideBarComponent } : Props) => {
    const user = useAppSelector(store => store.userSliceReducer.user);
    const userStatus = useAppSelector(store => store.userSliceReducer.status);
    const [ editInfoOpen , setEditInfoOpen ] = useState<boolean>(false);

    if(user)
    return (
        <Dialog  open={openSideBarComponent.id===1 && openSideBarComponent.open} onClose={() => setOpenSideBarComponent({...openSideBarComponent , open : false }) } >
            <Box sx={{ bgcolor : "primary.main"  }}>
                <Box sx={{ position : "relative"}}>
                    <Box sx={{ width : "260px" , height : "230px" , overflow : "hidden" , display : "flex" , justifyContent : "center" , alignItems : "center"}}>
                        <img src={"/defaultProfile.jpg"} style={{ width : "260px"}} />
                    </Box>
                    <Box sx={{ position : "absolute" , top : "8px" , right : "5px" , display : "flex" , alignItems : "center" , gap : "5px"}} >
                        <EditRoundedIcon fontSize="small" sx={{ cursor : "pointer" }} onClick={() => setEditInfoOpen(true) } />
                        <CloseRoundedIcon sx={{ cursor : "pointer"}} onClick={() => setOpenSideBarComponent({...openSideBarComponent , open : false })} />
                    </Box>
                    <Box sx={{ position : "absolute" , bottom : "8px" , left : "10px"}}>
                        <Typography sx={{ fontWeight : "bold" , fontSize : "17px"}}>{user.name}</Typography>
                        <Typography sx={{ fontSize : "14px" }}>{userStatus}</Typography>
                    </Box>
                    <Fab sx={{ position : "absolute" , bottom : "-20px" , right : "10px" , width : "45px" , height : "45px" , bgcolor : "info.main"}}>
                        <AddAPhotoOutlinedIcon />
                        <input type="file" hidden />
                    </Fab>
                    <EditProfileInfo editInfoOpen={editInfoOpen} setEditInfoOpen={setEditInfoOpen} />
                </Box>
                <Box sx={{ p : "10px" , display : "flex" , flexDirection : "column" , gap : "5px"}}>
                    <Typography fontWeight={700} sx={{ fontSize : "14px" , color : "info.main" }} >Info</Typography>
                    <Box>
                        <Typography fontSize={"14px"}>{user.email}</Typography>
                        <Typography sx={{ color : "lightgray"}} fontSize={"13px"}>email</Typography>
                    </Box>
                    <Divider />
                    <Box> 
                        <Typography fontSize={"14px"}>{user.bio ? user.bio : ""}</Typography>
                        <Typography sx={{ color : "lightgray"}} fontSize={"13px"}>Bio</Typography>
                    </Box>
                    <Divider />
                    <Box>
                        <Typography fontSize={"14px"}>{user.name}</Typography>
                        <Typography sx={{ color : "lightgray"}} fontSize={"13px"}>User Name</Typography>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    )
}

export default MyProfile;