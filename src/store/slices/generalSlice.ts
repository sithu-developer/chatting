import { Severity, SnackBarType } from "@/types/general";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GeneralInitialState {
    snackBar : SnackBarType
    isLoading : boolean
}

const initialState : GeneralInitialState = {
    isLoading :  false,
    snackBar : {
        isSnackBarOpen : false,
        message : "Happy Chatting",
        severity : Severity.success
    }
}

const generalSlice = createSlice({
    name : "GeneralSlice" ,
    initialState ,
    reducers : {
        changeIsLoading : ( state , action : PayloadAction<boolean> ) => {
            state.isLoading = action.payload;
        },
        changeSnackBar : ( state , action : PayloadAction<SnackBarType> ) => {
            state.snackBar = action.payload;
        },

    }
})

export const { changeIsLoading , changeSnackBar } = generalSlice.actions;

export default generalSlice.reducer;