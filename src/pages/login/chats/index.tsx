import { Box } from "@mui/material"
import { useSession } from "next-auth/react";

const ChatsPage = () => {
    const {data} = useSession();
    return (
        <Box>
            Success
            {data?.user?.email}
        </Box>
    )
}

export default ChatsPage;