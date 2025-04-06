import TopBar from "@/components/TopBar";
import { useAppDispatch } from "@/store/hooks";
import { changeStatus } from "@/store/slices/userSlice";
import { Status } from "@/types/user";
import { Box, Button, Typography } from "@mui/material"
import { signOut, useSession } from "next-auth/react";

const ChatsPage = () => {
    const {data} = useSession();
    const dispatch = useAppDispatch();

    return (
        <Box sx={{ bgcolor : "primary.main" , height : "95vh"}}>
            <Typography sx={{ color : "text.primary"}}>{data?.user?.email}</Typography>
            <Button variant="contained" onClick={() => {
                signOut({ callbackUrl : "/"});
                dispatch(changeStatus(Status.offline));
            }} >Sign out</Button>
        </Box>
    )
}

export default ChatsPage;