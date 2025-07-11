import { Box, AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { useRouter } from "next/router";

interface Props {
  open : boolean,
  setOpen : (value : boolean) => void,
}

const TopBar = ( { open , setOpen } : Props ) => {
    const router = useRouter();
    const path = router.asPath;
    const isLogin = path.includes("/happy-chatting/login")

    return (
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar sx={{ bgcolor : "secondary.main"}}>
              {!isLogin && <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() => setOpen(true)}
              >
                <MenuRoundedIcon />
              </IconButton>}
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 , textAlign : isLogin ? "center" : "start" }}>
                Happy Chatting
              </Typography>
              {!isLogin && <span></span>}
            </Toolbar>
          </AppBar>
        </Box>
    )
}

export default TopBar;