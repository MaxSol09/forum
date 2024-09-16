import {configureStore} from '@reduxjs/toolkit'
import { postsReducer } from './posts'
import { authReducer } from './auth'


const store = configureStore({
    reducer: {
        posts: postsReducer,
        auth: authReducer
    }, 
    devTools: true
})


export default store