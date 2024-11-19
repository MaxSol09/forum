import {configureStore} from '@reduxjs/toolkit'
import { postsReducer } from './posts.ts'
import { authReducer } from './auth.ts'
import { themeReducer } from './theme.ts'


const store = configureStore({
    reducer: {
        posts: postsReducer,
        auth: authReducer,
        theme: themeReducer
    }, 
    devTools: true
})

export type AppStore = ReturnType<typeof store.getState>
export type AppDispacth = typeof store.dispatch

export default store