import { Box, AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import SearchIcon from '@mui/icons-material/Search';

interface Props {
  open : boolean,
  setOpen : (value : boolean) => void,
}

const TopBar = ( { open , setOpen } : Props ) => {
    return (
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar sx={{ bgcolor : "secondary.main"}}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() => setOpen(true)}
              >
                <MenuRoundedIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Happy Chatting
              </Typography>
              <IconButton color="inherit" >
                <SearchIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </Box>
    )
}

export default TopBar;