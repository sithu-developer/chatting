import { Backdrop, Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, Input, InputAdornment, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import dayjs, { Dayjs } from "dayjs";
import { updateUser } from "@/store/slices/userSlice";
import { changeIsLoading, changeSnackBar } from "@/store/slices/generalSlice";
import { Severity } from "@/types/general";

interface Props {
    editInfoOpen : boolean,
    setEditInfoOpen : (value : boolean) => void
}

const defaultUser : User = {
    id : 0 , email : "" , firstName : "" , lastName : "" , bio : "" , day : 1 , month : 1 , year : 2000 , profileUrl : null , isOnline : false
}

const EditProfileInfo = ( {  editInfoOpen , setEditInfoOpen } : Props ) => {
    const [ updatedUser , setUpdatedUser ] = useState<User>(defaultUser);
    const [birthday, setBirthday] = useState<Dayjs | null>(null);
    const user = useAppSelector(store => store.userSlice.user);
    const [ bioCount , setBioCount ] = useState<number>(70);
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector(store => store.general.isLoading);
    
    
    useEffect(() => {
        if(user) {
            setUpdatedUser(user);
            
            setBioCount(user.bio ? ( 70- user.bio.length ): 70);
            setBirthday(dayjs(user.year + "-" + ( user.month ) + "-" + user.day))
        }
    } , [ user ] );


    if(!user) return null;

    const handleUpdateUser = () => {
        dispatch(updateUser({...updatedUser , isSuccess : () => {
            setEditInfoOpen(false);
            dispatch(changeIsLoading(false));
            dispatch(changeSnackBar({isSnackBarOpen : true , message : "Successfully updated" , severity : Severity.success }));
        }}));
        dispatch(changeIsLoading(true));
    }

    return (
        <Dialog open={editInfoOpen} onClose={() => {
            setEditInfoOpen(false);
            setUpdatedUser(user);
        }}>
            <DialogTitle sx={{ bgcolor : "secondary.main"}}>
                <Typography sx={{ fontSize : "19px" , textAlign : "center" }}>Profile Info</Typography>
            </DialogTitle>
            <DialogContent sx={{ bgcolor : "primary.main" , width : "300px" , display : "flex" , flexDirection : "column" , gap : "20px"}}>
                <Box sx={{ display : "flex" , flexDirection : "column" , gap : "10px" , mt : "10px"}}>
                    <Typography sx={{ color : "info.main" , mb : "5px"}}>Your Name</Typography>
                    <TextField value={updatedUser.firstName} onChange={(event) => setUpdatedUser({...updatedUser , firstName : event.target.value}) } variant="standard" size="small" color="info" label="First name" />
                    <TextField value={updatedUser.lastName} onChange={(event) => setUpdatedUser({...updatedUser , lastName : event.target.value})} variant="standard" size="small" color="info" label="Last name" />
                </Box>
                <Box>
                    <Typography sx={{ color : "info.main" , mb : "5px"}}>Your bio</Typography>
                    <FormControl variant="standard" >
                      <Input 
                        value={updatedUser.bio}
                        onChange={(event) => {
                            if( bioCount || event.target.value.length === 69 ) {
                                setUpdatedUser({...updatedUser , bio : event.target.value});
                                setBioCount(( 70 - event.target.value.length ))
                            }
                        }}
                        color="info"
                        placeholder="Write about yourself..."
                        endAdornment={<InputAdornment position="end"><Typography sx={{ color : (bioCount ? "text.primary": "red") , fontSize : "17px"}} >{bioCount}</Typography></InputAdornment>}
                      />
                    </FormControl>
                </Box>
                <Box>
                    <Typography sx={{ color : "info.main" , mb : "5px"}} >Your birthday</Typography>
                    <DatePicker
                        value={birthday}
                      onChange={( event ) => {
                        if(event) {
                            setUpdatedUser({...updatedUser , day : event.date() , month : event.month() + 1 , year : event.year() });
                            setBirthday(event);
                        }
                      }}
                      slotProps={{
                        mobilePaper: {
                          sx: {
                            border: '1px solid gray',
                            borderRadius: '10px',
                            backgroundColor: 'secondary.main',
                            color: '#fff',
                          },
                        },
                        desktopPaper : {
                            sx: {
                              border: '1px solid gray',
                              borderRadius: '10px',
                              backgroundColor: 'secondary.main',
                              color: '#fff',
                            },
                        },
                        actionBar : {
                            actions : ['cancel' , 'accept'],
                            sx : {
                                '& .MuiButton-text': {
                                  color: 'info.main'
                                },
                            }
                        }
                      }}
                    />
                </Box>
                <Backdrop
                  sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                  open={isLoading}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
            </DialogContent>
            <DialogActions sx={{bgcolor : "primary.main"}} >
                <IconButton  sx={{ bgcolor : "secondary.main" , ":hover" : { bgcolor : "secondary.light" }}}
                    onClick={() => {
                        setUpdatedUser(user);
                        setEditInfoOpen(false);
                    }}
                >
                    <CloseRoundedIcon sx={{ color : "white"}} />
                </IconButton>
                <IconButton onClick={handleUpdateUser} disabled={!updatedUser.firstName && !updatedUser.lastName} sx={{ bgcolor : "secondary.main" , ":hover" : { bgcolor : "secondary.light" } }} >
                    <CheckRoundedIcon color={(!updatedUser.firstName && !updatedUser.lastName) ? "error" : "success"}  />
                </IconButton>
            </DialogActions>
        </Dialog>
    )
}


export default EditProfileInfo;