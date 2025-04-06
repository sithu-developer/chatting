import { Box, Dialog, DialogContent, DialogTitle, Divider, FormControl, FormHelperText, Input, InputAdornment, TextField, Typography } from "@mui/material";

interface Props {
    editInfoOpen : boolean,
    setEditInfoOpen : (value : boolean) => void
}

const EditProfileInfo = ( {  editInfoOpen , setEditInfoOpen } : Props ) => {
    return (
        <Dialog open={editInfoOpen} onClose={() => setEditInfoOpen(false)}> 
            <DialogTitle sx={{ bgcolor : "secondary.main"}}>
                <Typography sx={{ fontSize : "17px"}}>Profile Info</Typography>
            </DialogTitle>
            <DialogContent sx={{ bgcolor : "primary.main" , width : "240px" , display : "flex" , flexDirection : "column" , gap : "20px"}}>
                <Box sx={{ display : "flex" , flexDirection : "column" , mt : "10px"}}>
                    <Typography sx={{ color : "info.main" , mb : "5px"}}>Your Name</Typography>
                    <TextField variant="standard" size="small" color="info" label="First name" />
                    <TextField variant="standard" size="small" color="info" label="Last name" />
                </Box>
                <Box>
                    <Typography sx={{ color : "info.main"}}>Your bio</Typography>
                    <FormControl variant="standard" >
                      <Input 
                        placeholder="Write about yourself..."
                        endAdornment={<InputAdornment position="end">70</InputAdornment>}
                      />
                    </FormControl>
                </Box>

            </DialogContent>
        </Dialog>
    )
}
// here start useState some thing is changed in branch first 
// this is second change 

export default EditProfileInfo;