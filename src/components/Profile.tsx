import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { OpenSideBarComponent } from "@/types/sideBarComponent";
import { Box, Dialog, Divider, Fab, IconButton, Typography } from "@mui/material"
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import EditProfileInfo from "./EditProfileInfo";
import { useState } from "react";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import { useRouter } from "next/router";
import Image from "next/image";
import { updateUser } from "@/store/slices/userSlice";
import { changeSnackBar } from "@/store/slices/generalSlice";
import { Severity } from "@/types/general";
import { uploadToBlob } from "@/util/upload";
import { VisuallyHiddenInput } from "@/util/general";

interface Props {
    openSideBarComponent : OpenSideBarComponent,
    setOpenSideBarComponent : (value : OpenSideBarComponent) => void,
}

const Profile = ( { openSideBarComponent , setOpenSideBarComponent } : Props) => {
    const user = useAppSelector(store => store.userSlice.user);
    const friend = useAppSelector(store => store.userSlice.friends).find(item => item.id === openSideBarComponent.friendId);
    const [ editInfoOpen , setEditInfoOpen ] = useState<boolean>(false);
    const months = [ "Jan" , "Fab" , "Mar" , "Apr" , "May" , "Jun" , "Jul" , "Aug" , "Sep" , "Oct" , "Nov" , "Dec" ];
    const router = useRouter();
    const dispatch = useAppDispatch();

    if(!user) return null;

    const handleChangeProfilePhoto = async(files : FileList | null) => {
        const file = files?.[0];
        if(file) {
            const url = await uploadToBlob(file);
            if(url) {
                dispatch(updateUser({...user , profileUrl : url , isSuccess : () => {
                    dispatch(changeSnackBar({message : "Profile photo successfully changed" , isSnackBarOpen : true , severity : Severity.success}))
                } }));
            }
        }
    }
    

    return (
        <Dialog  open={openSideBarComponent.id===1 && openSideBarComponent.open} onClose={() => setOpenSideBarComponent({ id : 0 , friendId : undefined , open : false }) } >
            <Box sx={{ bgcolor : "primary.main"  }}>
                <Box sx={{ position : "relative"}}>
                    <Box sx={{ width : "330px" , height : "300px" , overflow : "hidden" , display : "flex" , justifyContent : "center" , alignItems : "center"}}>
                        <Image src={friend ? (friend.profileUrl ? friend.profileUrl : "/defaultProfile.jpg") : (user.profileUrl ? user.profileUrl : "/defaultProfile.jpg")} alt="profile photo" width={1000} height={1000} style={{ maxWidth : "330px" , height : "auto" , minHeight : "300px"}} />
                    </Box>
                    <Box sx={{ position : "absolute" , top : "8px" , right : "5px" , display : "flex" , alignItems : "center" , gap : "5px"}} >
                        {!friend && <IconButton>
                            <EditRoundedIcon sx={{ color : "white" }} fontSize="small" onClick={() => setEditInfoOpen(true) } />
                        </IconButton>}
                        <IconButton>
                            <CloseRoundedIcon sx={{ color : "white" }} onClick={() => setOpenSideBarComponent({ id : 0 , friendId : undefined , open : false })} />
                        </IconButton>
                    </Box>
                    <Box sx={{ position : "absolute" , bottom : "8px" , left : "10px"}}>
                        <Typography sx={{ fontWeight : "bold" , fontSize : "17px"}}>{friend ? (friend.firstName + " " + friend.lastName) : (user.firstName + " " + user.lastName)}</Typography>
                        <Typography sx={{ fontSize : "14px" , color : "lightgray" }}>{friend ? (friend.isOnline ? "online" : "offline" ) : (user.isOnline ? "online" : "offline")}</Typography>
                    </Box>
                    {friend ? (
                    <Fab sx={{ position : "absolute" , bottom : "-20px" , right : "10px" , width : "45px" , height : "45px" , bgcolor : "info.main" , ":hover" : { bgcolor : "Highlight"}  }}>
                        <Box  sx={{width : "45px" , height : "45px" , borderRadius : "50px" , display : "flex" , justifyContent : "center" , alignItems : "center"}} onClick={() => {
                            setOpenSideBarComponent({ id : 0 , open : false , friendId : undefined });
                            router.push(`/happy-chatting/chats/${friend.id}`)
                        }} >
                            <ChatOutlinedIcon sx={{ color : "white" , fontSize : "23px" , mt : "4px"}} />
                        </Box >
                    </Fab>
                    )
                    :(
                    <Fab 
                        component="label"
                        role={undefined}
                        tabIndex={-1}
                        sx={{ position : "absolute" , bottom : "-20px" , right : "10px" , width : "45px" , height : "45px" , bgcolor : "info.main" , ":hover" : { bgcolor : "Highlight"}  }}
                    >
                        <Box sx={{ mt : "5px"}}>
                            <VisuallyHiddenInput
                              type="file"
                              onChange={(event) => {
                                handleChangeProfilePhoto(event.target.files)
                                event.target.value = "";
                              }}
                            />
                            <AddAPhotoOutlinedIcon sx={{ color : "white"}} />
                        </Box>
                    </Fab>)}
                    <EditProfileInfo editInfoOpen={editInfoOpen} setEditInfoOpen={setEditInfoOpen} />
                </Box>
                <Box sx={{ p : "10px" , display : "flex" , flexDirection : "column" , gap : "10px"}}>
                    <Typography fontWeight={700} sx={{ fontSize : "14px" , color : "info.main" }} >Info</Typography>
                    <Box>
                        <Typography fontSize={"14px"}>{friend ? friend.email : user.email}</Typography>
                        <Typography sx={{ color : "GrayText"}} fontSize={"13px"}>email</Typography>
                    </Box>
                    <Divider />
                    <Box  sx={{ maxWidth : "310px" , overflow : "hidden"}}> 
                        <Typography fontSize={"14px"} >{friend ? (friend.bio ? friend.bio : "...") : (user.bio ? user.bio : "...")}</Typography>
                        <Typography sx={{ color : "GrayText"}} fontSize={"13px"}>Bio</Typography>
                    </Box>
                    <Divider />
                    <Box>
                        <Typography fontSize={"14px"}>{friend ? (friend.firstName + " " + friend.lastName) : (user.firstName + " " + user.lastName)}</Typography>
                        <Typography sx={{ color : "GrayText"}} fontSize={"13px"}>User Name</Typography>
                    </Box>
                    <Divider />
                    <Box>
                        <Typography fontSize={"14px"}>{friend ? (months[friend.month-1] + " " + friend.day + ", " + friend.year) : (months[user.month-1] + " " + user.day + ", " + user.year)}</Typography>
                        <Typography sx={{ color : "GrayText"}} fontSize={"13px"}>Birthday</Typography>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    )
}

export default Profile;