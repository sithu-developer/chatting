import { useAppSelector } from "@/store/hooks";
import { Box, Dialog, IconButton, TextField, Typography } from "@mui/material";
import MapsUgcRoundedIcon from '@mui/icons-material/MapsUgcRounded';
import SearchIcon from '@mui/icons-material/Search';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { OpenSideBarComponent } from "@/types/sideBarComponent";
import { useEffect, useState } from "react";

interface Props {
    openSideBarComponent : OpenSideBarComponent,
    setOpenSideBarComponent : (value : OpenSideBarComponent ) => void
}

const NewFriends = ( { openSideBarComponent , setOpenSideBarComponent } : Props ) => {
    const friends = useAppSelector(store => store.userSlice.friends);
    const [ searchOpen , setSearchOpen ] = useState<boolean>(false);
    const [ searchValue , setSearchValue ] = useState<string>("");
    const filteredFriends = friends.filter(item => item.firstName.toLowerCase().includes(searchValue.toLowerCase()) || item.lastName.toLowerCase().includes(searchValue.toLowerCase()))

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
            <Box sx={{ bgcolor : "primary.main" , width : "320px" , height : "500px" }} >
                {filteredFriends.map(item => (
                    <Box key={item.id} sx={{ display : "flex" , gap : "10px" , alignItems : "center" , px : "10px" , py : "5px"}} >
                        <Box sx={{ display : "flex" , justifyContent : "center" , alignItems : "center" , height : "45px" , width : "45px" , borderRadius : "30px" , overflow : "hidden" }} >
                            <img src={item.profileUrl ? item.profileUrl : "/defaultProfile.jpg"} style={{ width : "45px"}} />
                        </Box>
                        <Box sx={{ display : "flex" , justifyContent : "space-between" , flexGrow : 1 }} >
                            <Typography>{item.firstName} {item.lastName}</Typography>
                            <MapsUgcRoundedIcon />
                        </Box>
                    </Box>
                ))}
            </Box>
        </Dialog>
    )
}

export default NewFriends;