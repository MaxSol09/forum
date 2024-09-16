import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    state: [],
    status: 'loading',
    user: {
        value: [],
        status: 'loading'
    },
    userAvatar: {
        status: 'loading',
        img: {
            status: 'loading',
            value: null
        }
    },
    userBackground: {
        status: 'loading',
        img: {
            status: 'loading',
            value: null
        }
    },
    subscribe: {
        status: 'none'
    }
}

export const loginFetch = createAsyncThunk(
    'login/Fetch',
    async(userData) => {
        const {data} = await axios.post('http://localhost:4444/auth/login', userData)
    
        return data
    }
)

export const registerFetch = createAsyncThunk(
    'register/Fetch',
    async(user) => {
        const {data} = await axios.post('http://localhost:4444/auth/register', user)

        return data
    }
)

export const meFetch = createAsyncThunk(
    'me/Fetch',
    async() => {
        const token = localStorage.getItem('JWTtoken')

        const {data} = await axios.get('http://localhost:4444/auth/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    
        return data
    }
)

export const getUser = createAsyncThunk('getUser/fetch', async ({id}) => {
    const {data} = await axios.get(`http://localhost:4444/user/${id}`)

    return data
})

export const subscribeChanel = createAsyncThunk('subcribe/fetch', async(dataSub) => {
    const {data} = await axios.post('http://localhost:4444/chanel/subcribe', dataSub)

    return data
})

export const unSubscribeChanel = createAsyncThunk('unscribe/fetch', async(dataSub) => {
    const {data} = axios.post('http://localhost:4444/chanel/unsubcribe', dataSub)

    return data
})

export const changeTextFun = createAsyncThunk('text/fetch', async (textData) => {
    const {data} = await axios.post('http://localhost:4444/user/text', textData)

    return data
})

export const changeAvatar = createAsyncThunk('avatar/fetch', async (dataAvatar) => {
    const {data} = await axios.post('http://localhost:4444/user/img', dataAvatar)

    return data
})

export const sendAvatar = createAsyncThunk( 'avatar/fetch', async (formData) => {
    const {data} = await axios.post('http://localhost:4444/upload', formData)

    return data
})

export const changeBackground = createAsyncThunk('changeBackground/fecth', async(backData) => {
    const {data} = await axios.post('http://localhost:4444/user/backgroundProfile', backData)
    
    return data
})

export const sendBackground = createAsyncThunk('background/fetch', async(formData) => {
    const {data} = await axios.post('http://localhost:4444/upload', formData)

    return data
})

const authSlice = createSlice({
    name: 'auth/Slice',
    initialState,
    reducers: {
        logout: (state) => {
            state.state = []
        },
        resetUser: (state) => {
            state.user.value = []
            state.user.status = 'loading'
        },
        checkSubscribe: (state, action) => {
            console.log('st >', state.state.subscribes)
            if(state.state.subscribes){
                console.log(true)
                const check = state.state.subscribes.find(el => el.userID === action.payload.id)

                if(check){
                    state.subscribe.status = 'success'
                }
                else{
                    state.subscribe.status = 'none'
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginFetch.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(loginFetch.fulfilled, (state, action) => {
            console.log(action.payload)
            state.status = 'success'
            state.state = action.payload
        })
        .addCase(loginFetch.rejected, (state) => {
            state.status = 'errors'
        })
        .addCase(meFetch.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(meFetch.fulfilled, (state, action) => {
            state.status = 'success'
            state.state = action.payload
        })
        .addCase(meFetch.rejected, (state) => {
            state.status = 'errors'
        })
        .addCase(registerFetch.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(registerFetch.fulfilled, (state, action) => {
            state.status = 'success'
            state.state = action.payload
        })
        .addCase(registerFetch.rejected, (state) => {
            state.status = 'errors'
        })
        .addCase(getUser.fulfilled, (state, action) => {
            state.user.value = action.payload
            state.user.status = 'success'
        })
        .addCase(subscribeChanel.fulfilled, (state, action) => {
            if(state.user.subscribes){
                state.user.subscribes.push(action.payload)
            }

            console.log('ssss', state.user.countSubs)

            state.subscribe.status = 'success'
            state.user.value.countSubs += 1
        })
        .addCase(unSubscribeChanel.fulfilled, (state) => {

            state.subscribe.status = 'none'
            state.user.value.countSubs -= 1
        })
        .addCase(changeTextFun.fulfilled, (state, action) => {
            state.user.value.text = action.payload.text
        })
        .addCase(sendAvatar.pending, (state) => {
            state.userAvatar.img.status = 'loading'
        })    
        .addCase(sendAvatar.fulfilled, (state, action) => {
            state.userAvatar.img.status = 'success'
            state.userAvatar.img.value = action.payload
        })      
        .addCase(sendAvatar.rejected, (state) => {
            state.userAvatar.img.status = 'errors'
        }) 
        .addCase(sendBackground.fulfilled, (state, action) => {
            console.log('payload', action.payload)
            state.userBackground.img.status = 'success'
            state.userBackground.img.value = action.payload.path
        })
    }
})

export const {logout, resetUser, checkSubscribe}  = authSlice.actions
export const authReducer = authSlice.reducer