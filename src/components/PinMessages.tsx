import { Box, IconButton, Typography } from "@mui/material";
import { Chats } from "@prisma/client";
import { RefObject, useEffect, useRef, useState } from "react";
import FormatAlignRightOutlinedIcon from '@mui/icons-material/FormatAlignRightOutlined';
import AllPinMessages from "./AllPinMessages";

interface Props {
    pinChats : Chats[];
    messageRef :  RefObject<{
        [key: number]: HTMLDivElement | null;
    }>
}

const PinMessages = ({ pinChats , messageRef } : Props ) => {
    const nextPinMessageRef = useRef<{[key: number]: HTMLDivElement | null}>({});
    const [ allPinOpen , setAllPinOpen ] = useState<boolean>(false);

    useEffect(() => {
        const firstShowPinChat = nextPinMessageRef.current[pinChats.length - 1];
        if(firstShowPinChat) {
            firstShowPinChat.scrollIntoView({behavior : "instant"})
        }
    } , [nextPinMessageRef.current])

    return (
        <Box sx={{display : "flex" , flexDirection : "column-reverse" , gap : "5px" , bgcolor : "secondary.main" , mt : "0.5px" , height : "43px" , overflow : "hidden" }} >
            {pinChats.map(item => {
                return (
                    <Box key={item.id} ref={(el : HTMLDivElement | null) => { nextPinMessageRef.current[pinChats.indexOf(item)] = el}} sx={{ px : "15px" , cursor : "pointer" , display : "flex" , justifyContent : "space-between" , alignItems : "center" }} onClick={() => {
                        const currentChat = messageRef.current[item.id];
                        const nextPinChat = nextPinMessageRef.current[pinChats.indexOf(item) - 1 === -1 ? pinChats.length - 1 : pinChats.indexOf(item) - 1];
                        if(currentChat && nextPinChat ) {
                            currentChat.scrollIntoView({behavior : "smooth" , block : "center"});
                            nextPinChat.scrollIntoView({behavior : "smooth"});
                            currentChat.style.backgroundColor = "rgba(206, 212, 224, 0.15)";
                            setTimeout(() => {
                                currentChat.style.backgroundColor = "";
                            } , 1000)
                        }
                    }} >
                        <Box>
                            <Typography color="info" sx={{ fontSize : "14px" , userSelect : "none" }} >Pinned Message {pinChats.indexOf(item) + 1}#</Typography>
                            <Typography sx={{ color : "GrayText" , fontSize : "14px" , userSelect : "none"}} >{item.message}</Typography>
                        </Box>
                        <IconButton onClick={(e) => {
                            e.stopPropagation();
                            setAllPinOpen(true)
                        }} >
                            <FormatAlignRightOutlinedIcon sx={{ color : "GrayText"}} />
                        </IconButton>
                    </Box>
                )
            })}
            <AllPinMessages  pinChats={pinChats} messageRef={messageRef} allPinOpen={allPinOpen} setAllPinOpen={setAllPinOpen} />
        </Box>
    )
}

export default PinMessages;