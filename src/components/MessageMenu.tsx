import { Menu, MenuItem, Typography } from "@mui/material";
import KeyboardReturnRoundedIcon from '@mui/icons-material/KeyboardReturnRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import ShortcutOutlinedIcon from '@mui/icons-material/ShortcutOutlined';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { ChatMenuType, NewChat } from "@/types/chats";
import { Chats } from "@prisma/client";

interface Props {
    chatMenu : ChatMenuType
    setChatMenu : ( value : ChatMenuType ) => void;
    setReplyChat : (value : Chats | null) => void;
    setNewChat : (value : NewChat) => void;
    newChat : NewChat;
}

const MessageMenu = ({ chatMenu , setChatMenu , setReplyChat , setNewChat , newChat } : Props) => {
    const open = Boolean(chatMenu.anchorEl);

    return (
        <Menu
        anchorEl={chatMenu.anchorEl}
        open={open}
        onClose={() => setChatMenu({anchorEl : null , chat : null})}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
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
        }}
      >
        <MenuItem onClick={() => {
            setReplyChat(chatMenu.chat) 
            setChatMenu({anchorEl : null , chat : null});
            setNewChat({...newChat , replyId : (chatMenu.chat as Chats).id });
        }}>
           <KeyboardReturnRoundedIcon sx={{ transform : "scaleY(-1)" , mr : "15px" , color : "GrayText" }} />
           <Typography>Reply</Typography>
        </MenuItem>
        <MenuItem  >
           <ContentCopyRoundedIcon sx={{ transform : "scaleY(-1)" , mr : "15px" , color : "GrayText" }} />
           <Typography>Copy</Typography>
        </MenuItem>
        <MenuItem >
           <ShortcutOutlinedIcon sx={{  mr : "15px" , color : "GrayText" }} />
           <Typography>Forward</Typography>
        </MenuItem>
        <MenuItem >
           <PushPinOutlinedIcon sx={{  mr : "15px" , transform : "rotate(45deg)" , color : "GrayText" }} />
           <Typography>Pin</Typography>
        </MenuItem>
        <MenuItem >
           <EditOutlinedIcon sx={{  mr : "15px" , color : "GrayText" }} />
           <Typography>Edit</Typography>
        </MenuItem>
        <MenuItem >
           <DeleteOutlineRoundedIcon sx={{  mr : "15px" , color : "GrayText" }} />
           <Typography>Delete</Typography>
        </MenuItem>
      </Menu>
    )
}

export default MessageMenu;