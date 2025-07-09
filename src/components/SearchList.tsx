import { Box, Dialog, IconButton, TextField } from "@mui/material";
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

interface Props {
    searchListOpen : boolean
    setSearchListOpen : (value : boolean) => void;
}

const SearchList = ( { searchListOpen , setSearchListOpen } : Props) => {
    return (
        <Dialog fullScreen open={searchListOpen}  >
            <Box sx={{ bgcolor : "secondary.main" , p : "10px" , py : "14px" , display : "flex" , alignItems : "center" , gap : "10px" }} >
                <IconButton onClick={() => setSearchListOpen(false)} >
                    <ArrowBackRoundedIcon sx={{ color : "white"}} />
                </IconButton>
                <TextField variant="standard" placeholder="Search" color="secondary" />
            </Box>
        </Dialog>
    )
}

export default SearchList;