import TopBar from "@/components/TopBar";
import { Box, Button, Typography } from "@mui/material"
import { signOut, useSession } from "next-auth/react";

const ChatsPage = () => {
    const {data} = useSession();
    return (
        <Box sx={{ bgcolor : "primary.main" , height : "95vh"}}>
            <Typography sx={{ color : "text.primary"}}>{data?.user?.email}</Typography>
            <Button variant="contained" onClick={() => signOut({ callbackUrl : "/"})} >Sign out</Button>
        </Box>
    )
}

export default ChatsPage;