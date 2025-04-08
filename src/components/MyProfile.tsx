import { useAppSelector } from "@/store/hooks";
import { OpenSideBarComponent } from "@/types/sideBarComponent";
import { Box, Dialog, Divider, Fab, IconButton, styled, Typography } from "@mui/material"
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import EditProfileInfo from "./EditProfileInfo";
import { useState } from "react";

const VisuallyHiddenInput = styled('input')({
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

interface Props {
    openSideBarComponent : OpenSideBarComponent,
    setOpenSideBarComponent : (value : OpenSideBarComponent) => void,
}

const MyProfile = ( { openSideBarComponent , setOpenSideBarComponent } : Props) => {
    const user = useAppSelector(store => store.userSlice.user);
    const userStatus = useAppSelector(store => store.userSlice.status);
    const [ editInfoOpen , setEditInfoOpen ] = useState<boolean>(false);
    const months = [ "Jan" , "Fab" , "Mar" , "Apr" , "May" , "Jun" , "Jul" , "Aug" , "Sep" , "Oct" , "Nov" , "Dec" ];

    if(!user) return null;

    return (
        <Dialog  open={openSideBarComponent.id===1 && openSideBarComponent.open} onClose={() => setOpenSideBarComponent({...openSideBarComponent , open : false }) } >
            <Box sx={{ bgcolor : "primary.main"  }}>
                <Box sx={{ position : "relative"}}>
                    <Box sx={{ width : "330px" , height : "300px" , overflow : "hidden" , display : "flex" , justifyContent : "center" , alignItems : "center"}}>
                        <img src={user.profileUrl ? user.profileUrl : "/defaultProfile.jpg"} alt="profile photo" style={{ width : "330px"}} />
                    </Box>
                    <Box sx={{ position : "absolute" , top : "8px" , right : "5px" , display : "flex" , alignItems : "center" , gap : "5px"}} >
                        <IconButton>
                            <EditRoundedIcon sx={{ color : "white" }} fontSize="small" onClick={() => setEditInfoOpen(true) } />
                        </IconButton>
                        <IconButton>
                            <CloseRoundedIcon sx={{ color : "white" }} onClick={() => setOpenSideBarComponent({...openSideBarComponent , open : false })} />
                        </IconButton>
                    </Box>
                    <Box sx={{ position : "absolute" , bottom : "8px" , left : "10px"}}>
                        <Typography sx={{ fontWeight : "bold" , fontSize : "17px"}}>{user.firstName + " " + user.lastName}</Typography>
                        <Typography sx={{ fontSize : "14px" , color : "lightgray" }}>{userStatus}</Typography>
                    </Box>
                    <Fab 
                        component="label"
                        role={undefined}
                        tabIndex={-1}
                        sx={{ position : "absolute" , bottom : "-20px" , right : "10px" , width : "45px" , height : "45px" , bgcolor : "info.main" , ":hover" : { bgcolor : "Highlight"} }}
                    >
                        <VisuallyHiddenInput
                          type="file"
                          onChange={(event) => console.log(event.target.files)}
                        />
                        <AddAPhotoOutlinedIcon sx={{ color : "white"}} />
                    </Fab>
                    <EditProfileInfo editInfoOpen={editInfoOpen} setEditInfoOpen={setEditInfoOpen} />
                </Box>
                <Box sx={{ p : "10px" , display : "flex" , flexDirection : "column" , gap : "10px"}}>
                    <Typography fontWeight={700} sx={{ fontSize : "14px" , color : "info.main" }} >Info</Typography>
                    <Box>
                        <Typography fontSize={"14px"}>{user.email}</Typography>
                        <Typography sx={{ color : "GrayText"}} fontSize={"13px"}>email</Typography>
                    </Box>
                    <Divider />
                    <Box  sx={{ maxWidth : "310px" , overflow : "hidden"}}> 
                        <Typography fontSize={"14px"} >{user.bio ? user.bio : "..."}</Typography>
                        <Typography sx={{ color : "GrayText"}} fontSize={"13px"}>Bio</Typography>
                    </Box>
                    <Divider />
                    <Box>
                        <Typography fontSize={"14px"}>{user.firstName + " " + user.lastName}</Typography>
                        <Typography sx={{ color : "GrayText"}} fontSize={"13px"}>User Name</Typography>
                    </Box>
                    <Divider />
                    <Box>
                        <Typography fontSize={"14px"}>{months[user.month-1]} {user.day}, {user.year} </Typography>
                        <Typography sx={{ color : "GrayText"}} fontSize={"13px"}>Birthday</Typography>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    )
}

export default MyProfile;