import { createSlice } from "@reduxjs/toolkit";

interface State {
    theme: boolean
}

const initialState: State = {
    theme: false
}


const themeSlice = createSlice({
    name: 'theme-slice',
    initialState,
    reducers: {
        changeTheme: (state) => {
            state.theme = !state.theme
        }
    }
})

export const themeReducer = themeSlice.reducer
export const {changeTheme} = themeSlice.actions