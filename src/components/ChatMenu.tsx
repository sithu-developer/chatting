import { Menu, MenuItem, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { UserIdAndFriendId } from "@prisma/client";
import { ConfirmationItemsType } from "@/types/chats";


interface Props {
    chatMenuOpen : boolean;
    setChatMenuOpen : (value : boolean) => void;
    setConfirmationItems : (value : ConfirmationItemsType ) => void;
    relationToDelete : UserIdAndFriendId;
    setSearchListOpen : (value : boolean) => void;
}

const ChatMenu = ({ chatMenuOpen , setChatMenuOpen , setConfirmationItems , relationToDelete  , setSearchListOpen } : Props) => {
    return (
        <Menu 
        open={chatMenuOpen}
        onClose={() => setChatMenuOpen(false)}  
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
            paper : {
                sx : {
                    backgroundColor : "secondary.main",
                    width : "170px"
                }
            },
            list : {
                disablePadding : true
            }
        }}>
            <MenuItem onClick={() => {
                setSearchListOpen( true)
                setChatMenuOpen(false)
            }} >
                <SearchIcon sx={{  mr : "15px" , color : "GrayText" }} />
                <Typography>Search</Typography>
            </MenuItem>
            <MenuItem onClick={() => {
                setChatMenuOpen(false);
                setConfirmationItems({ open : true , relationsToDelete : [ relationToDelete ] });
            }}>
                <DeleteOutlineRoundedIcon sx={{  mr : "15px" , color : "GrayText" }} />
                <Typography>Delete chat</Typography>
            </MenuItem>
        </Menu>
    )
}

export default ChatMenu;