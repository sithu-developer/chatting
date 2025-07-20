import { OpenSideBarComponent } from "@/types/sideBarComponent";
import { Box, Dialog, Divider, IconButton, ListItemButton, Typography } from "@mui/material";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

interface Props {
    openSideBarComponent : OpenSideBarComponent,
    setOpenSideBarComponent : (value : OpenSideBarComponent ) => void
}

const Setting = ({ openSideBarComponent , setOpenSideBarComponent} : Props) => {
    const user = useAppSelector(store => store.userSlice.user);
    const dispatch = useAppDispatch();

    if(!user) return null;
    return (
        <Dialog open={openSideBarComponent.id === 4 && openSideBarComponent.open} onClose={() => {
            setOpenSideBarComponent({...openSideBarComponent , open : false })
        }} >
            <Box sx={{ bgcolor : "secondary.dark" , width : "300px"}}>
                <Box sx={{ bgcolor : "secondary.main", p : "5px 10px" , display : "flex" , justifyContent : "space-between" , alignItems : "center"}}>
                    <Typography sx={{ fontSize : "21px" , ml : "10px" }}>Settings</Typography>
                    <IconButton onClick={() => setOpenSideBarComponent({...openSideBarComponent , open : false})} >
                        <CloseRoundedIcon sx={{ color : "white"}} />
                    </IconButton>
                </Box>
                <Box sx={{ display : "flex" , flexDirection : "column" , p : "10px 25px"}}>
                    <Typography sx={{ fontSize : "14px" }}>{user.firstName + " " + user.lastName}</Typography>
                    <Typography sx={{ fontSize : "13px" , color : "GrayText" }}>name</Typography>
                </Box>
                <Box sx={{ display : "flex" , flexDirection : "column" , p : "10px 25px"}}>
                    <Typography sx={{ fontSize : "14px" }}>{user.email}</Typography>
                    <Typography sx={{ fontSize : "13px" , color : "GrayText" }}>email</Typography>
                </Box>
                <Divider variant="middle" />
                <ListItemButton sx={{ display : "flex" , gap : "10px" , alignItems : "center"}} onClick={() => {
                    signOut({callbackUrl : "/"});
                }}>
                    <IconButton>
                        <LogoutIcon sx={{ color : "GrayText"}} />
                    </IconButton>
                    <Typography>Log Out</Typography>
                </ListItemButton>
            </Box>
            
        </Dialog>
    )
}

export default Setting;