import { useAppSelector } from "@/store/hooks";
import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SvgIconProps, Typography } from "@mui/material";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Profile from "./Profile";
import { useState } from "react";
import { OpenSideBarComponent } from "@/types/sideBarComponent";
import NewFriends from "./NewFriends";
import { useRouter } from "next/router";
import Image from "next/image";
import Setting from "./Setting";

interface Props {
    open : boolean,
    setOpen : (value : boolean ) => void,
}


const SideBar = ({ open , setOpen } : Props) => {
   const user = useAppSelector(store => store.userSlice.user);
   const [ openSideBarComponent , setOpenSideBarComponent ] = useState<OpenSideBarComponent>({id : 1 , open : false});
   const router = useRouter();

   if(user)
    return (
        <Box>
            <Drawer open={open} onClose={() => setOpen(false)} >
                <Box sx={{ width : "300px"}}>
                    <Box  sx={{ bgcolor : "secondary.main" , p : "10px" , display : "flex" , flexDirection : "column" , gap : "10px"}}>
                        <Box sx={{ cursor : "pointer" , width : "80px" , height : "80px" , overflow : "hidden" , borderRadius : "50px" , display : "flex", justifyContent : "center" , alignItems : "center" }} onClick={() => {
                          setOpen(false);
                          setOpenSideBarComponent({ id : 1 , open : true});
                        }}>
                          <Image src={user.profileUrl ? user.profileUrl : "/defaultProfile.jpg"} alt="profile photo" width={500} height={500} style={{ width : "80px" , height : "auto" , minHeight : "80px"}}/>
                        </Box>
                        <Box>
                            <Typography fontWeight={600} sx={{ fontSize : "17px" }} >{ user.firstName + " " + user.lastName }</Typography>
                            <Typography fontWeight={100} sx={{ fontSize : "14px" }} >{ user && user.email }</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ bgcolor : "primary.main" , height : "83vh"}} >
                        {sliderComponents.slice(0 , 1).map(item => <List key={item.id} sx={{ ":hover" : { bgcolor : "#3b4044"}}} >
                            <ListItem disablePadding >
                              <ListItemButton onClick={() => {
                                setOpen(false);
                                setOpenSideBarComponent({ id : item.id , open : true});
                              }}>
                                <ListItemIcon sx={{ color : "lightgray" }} >
                                  <item.icon/>
                                </ListItemIcon>
                                <ListItemText primary={item.name} />
                              </ListItemButton>
                            </ListItem>
                        </List>
                        )}
                        <Divider sx={{ width : "280px" , ml : "10px"}} />
                        {sliderComponents.slice(1 , -1).map(item => <List key={item.id} sx={{ ":hover" : { bgcolor : "#3b4044"}}} >
                            <ListItem  disablePadding>
                              <ListItemButton onClick={() => {  
                                setOpen(false);
                                if(item.id === 3) {
                                  router.push(`/happy-chatting/chats/${user.id}`)
                                } else {
                                  setOpenSideBarComponent({ id : item.id , open : true});
                                }
                              }}>
                                <ListItemIcon sx={{ color : "lightgray" }}>
                                  <item.icon/>
                                </ListItemIcon>
                                <ListItemText primary={item.name} />
                              </ListItemButton>
                            </ListItem>
                        </List>
                        )}
                        <Divider />
                        {sliderComponents.slice(-1 , sliderComponents.length).map(item => <List key={item.id} sx={{ ":hover" : { bgcolor : "#3b4044"}}} >
                            <ListItem disablePadding>
                              <ListItemButton onClick={() => {
                                setOpen(false);
                                setOpenSideBarComponent({ id : item.id , open : true});
                              }}>
                                <ListItemIcon sx={{ color : "lightgray" }}>
                                  <item.icon/>
                                </ListItemIcon>
                                <ListItemText primary={item.name} />
                              </ListItemButton>
                            </ListItem>
                        </List>
                        )}
                    </Box>
                </Box>
            </Drawer>
            <Setting openSideBarComponent={openSideBarComponent} setOpenSideBarComponent={setOpenSideBarComponent} />
            <Profile openSideBarComponent={openSideBarComponent} setOpenSideBarComponent={setOpenSideBarComponent} />
            <NewFriends openSideBarComponent={openSideBarComponent} setOpenSideBarComponent={setOpenSideBarComponent} />
        </Box>
    )
}

export default SideBar;

interface SliderComponents {
    id : number,
    icon : React.ComponentType<SvgIconProps>,
    name : string,
}

const sliderComponents : SliderComponents[] = [
    {   
        id : 1,
        icon : AccountCircleOutlinedIcon,
        name : "My Profile",
    },
    {
        id : 2,
        icon : PersonOutlineOutlinedIcon,
        name : "Friends",
    },
    {
        id : 3,
        icon : BookmarkBorderOutlinedIcon,
        name : "Saved Messages",
    },
    {
        id : 4,
        icon : SettingsOutlinedIcon ,
        name : "Settings",
    }
]