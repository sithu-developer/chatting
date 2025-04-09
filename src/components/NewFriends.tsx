import { useAppSelector } from "@/store/hooks";
import { Box, Dialog, Divider, IconButton, TextField, Typography } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { OpenSideBarComponent } from "@/types/sideBarComponent";
import { useState } from "react";
import { User } from "@prisma/client";

interface Props {
    openSideBarComponent : OpenSideBarComponent,
    setOpenSideBarComponent : (value : OpenSideBarComponent ) => void
}

const NewFriends = ( { openSideBarComponent , setOpenSideBarComponent } : Props ) => {
    const friends = useAppSelector(store => store.userSlice.friends);
    const user = useAppSelector(store => store.userSlice.user) as User;
    const userIdAndFriendIds = useAppSelector(store => store.userIdAndFriendIdSlice.userIdAndFriendIds);
    const [ searchOpen , setSearchOpen ] = useState<boolean>(false);
    const [ searchValue , setSearchValue ] = useState<string>("");
    const relationIdsOfFriendIds = userIdAndFriendIds.map(item => item.friendId);
    const relationIdsOfUserIds = userIdAndFriendIds.map(item => item.userId);
    const yourFriendIds = [...relationIdsOfFriendIds , ...relationIdsOfUserIds].filter(item => item !== user.id)
    const yourFriends = friends.filter(item => yourFriendIds.includes(item.id));
    const newFriends = friends.filter(item => !yourFriendIds.includes(item.id));
    const filteredYourFriends = yourFriends.filter(item => (item.firstName.toLowerCase() + " " + item.lastName.toLowerCase()).includes(searchValue.toLowerCase()));
    const filteredNewFriends = newFriends.filter(item => (item.firstName.toLowerCase() + " " + item.lastName.toLowerCase()).includes(searchValue.toLowerCase()));


    return (
        <Dialog open={ openSideBarComponent.id === 3 && openSideBarComponent.open } onClose={() => {
            setOpenSideBarComponent({ ...openSideBarComponent , open : false});
            setSearchOpen(false);
        }} >
            <Box sx={{ bgcolor : "secondary.main" , display : "flex" , justifyContent : "space-between" , alignItems : "center" , p : "5px 5px 5px 20px"}} >
                {searchOpen ? <TextField variant="standard" autoFocus placeholder="Search" value={searchValue} onChange={(event) => setSearchValue(event.target.value)} />
                : <Typography >Friends</Typography>}
                <Box sx={{ display : "flex" , alignItems : "center" , gap : "2px"}} >
                    {!searchOpen && <IconButton onClick={() => setSearchOpen(true) } >
                        <SearchIcon sx={{ color : "white"}} />
                    </IconButton>}
                    <IconButton onClick={() => {
                        setOpenSideBarComponent({ ...openSideBarComponent , open : false});
                        setSearchOpen(false);
                    }} >
                        <CloseRoundedIcon  sx={{ color : "white"}}  />
                    </IconButton>
                </Box>
            </Box>
            <Box sx={{ bgcolor : "primary.main" , width : "320px" , height : "500px" , display : "flex" , flexDirection : "column" , gap : "10px" }} >
                {userIdAndFriendIds.length ? <Box>
                    <Typography sx={{ px : "20px" , py : "5px" , color : "info.main" }}>Your Friends</Typography>
                    {filteredYourFriends.length ? filteredYourFriends.map(item => (
                        <Box key={item.id} sx={{ display : "flex" , gap : "10px" , alignItems : "center" , px : "10px" , py : "5px" , ":hover" : { bgcolor : "#3b4044"} , cursor : "pointer" }} >
                            <Box sx={{ display : "flex" , justifyContent : "center" , alignItems : "center" , height : "45px" , width : "45px" , borderRadius : "30px" , overflow : "hidden" }} >
                                <img src={item.profileUrl ? item.profileUrl : "/defaultProfile.jpg"} style={{ width : "45px"}} />
                            </Box>
                            <Box sx={{ display : "flex"  , flexGrow : 1 }} >
                                <Typography>{item.firstName} {item.lastName}</Typography>
                            </Box>
                        </Box>
                    ))
                    : <Typography sx={{ textAlign : "center" , p : "10px"}}>No Result</Typography> }
                </Box> 
                :<Box>
                    <Typography sx={{ px : "20px" , py : "5px" , color : "info.main" }}>Your Friends</Typography>
                    <Typography sx={{ textAlign : "center" , p : "10px"}}>No Friends yet</Typography>
                </Box> }
                <Divider variant="middle" />
                <Box>
                    <Typography sx={{ px : "20px" , py : "5px" , color : "info.main" }}>New Friends</Typography>
                    {filteredNewFriends.length ? filteredNewFriends.map(item => (
                        <Box key={item.id} sx={{ display : "flex" , gap : "10px" , alignItems : "center" , px : "10px" , py : "5px" , ":hover" : { bgcolor : "#3b4044"} , cursor : "pointer" }} >
                            <Box sx={{ display : "flex" , justifyContent : "center" , alignItems : "center" , height : "45px" , width : "45px" , borderRadius : "30px" , overflow : "hidden" }} >
                                <img src={item.profileUrl ? item.profileUrl : "/defaultProfile.jpg"} style={{ width : "45px"}} />
                            </Box>
                            <Box sx={{ display : "flex" , flexGrow : 1 }} >
                                <Typography>{item.firstName} {item.lastName}</Typography>
                            </Box>
                        </Box>
                    ))
                    : <Typography sx={{ textAlign : "center" , p : "10px"}}>No Result</Typography>}
                </Box>
            </Box>
        </Dialog>
    )
}

export default NewFriends;