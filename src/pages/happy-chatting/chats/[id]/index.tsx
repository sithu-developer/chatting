import { Box } from "@mui/material";
import { useRouter } from "next/router";

const ChattingPage = () => {
    const router = useRouter();
    const { id } = router.query;
    // stoped here
    
    return (
        <Box>
            
        </Box>
    )
}

export default ChattingPage;