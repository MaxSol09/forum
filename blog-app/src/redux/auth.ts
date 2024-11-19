import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export const loginFetch = createAsyncThunk(
    'login/Fetch',
    async(userData: {password: string, email: string}) => {
        const {data} = await axios.post('http://localhost:4444/auth/login', userData)
    
        return data
    }
)

export const registerFetch = createAsyncThunk(
    'register/Fetch',
    async(user: {email: string, password: string, fullName: string}) => {
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

export const getUser = createAsyncThunk('getUser/fetch', async (userData: {id: string}) => {
    console.log(userData)
    const {data} = await axios.get(`http://localhost:4444/user/${userData.id}`)

    return data
})

export const subscribeChanel = createAsyncThunk('subcribe/fetch', async(dataSub: {chanelID: string, userID: string}) => {
    const {data} = await axios.post('http://localhost:4444/chanel/subcribe', dataSub)

    return data
})

export const unSubscribeChanel = createAsyncThunk('unscribe/fetch', async(dataSub: {chanelID: string, userID: string}) => {

    const {data} = await axios.post('http://localhost:4444/chanel/unsubcribe', dataSub)

    return data
})

export const changeTextFun = createAsyncThunk('text/fetch', async (textData: {userID: string, text: string}) => {
    const {data} = await axios.post('http://localhost:4444/user/text', textData)

    return data
})

export const changeAvatar = createAsyncThunk('change/avatar', async (dataAvatar: {id: string, avatar: string}) => {
    const {data} = await axios.post('http://localhost:4444/user/img', dataAvatar)

    return data
})

export const sendAvatar = createAsyncThunk( 'avatar/fetch', async (formData: object) => {
    const {data} = await axios.post('http://localhost:4444/upload', formData)

    return data
})

export const changeBackground = createAsyncThunk('changeBackground/fecth', async(backData: {id: string, backgroundProfile: string}) => {
    const {data} = await axios.post('http://localhost:4444/user/backgroundProfile', backData)

    console.log(data)
    
    return data
})

export const sendBackground = createAsyncThunk('background/fetch', async(formData: object) => {
    const {data} = await axios.post('http://localhost:4444/upload', formData)

    return data
})

type Message = {
    text: string,
    fullName: string, 
    userID?: string,
    avatar?: string,
    status: string
}

export const sendMessage = createAsyncThunk('send/message', async (info: Message) => {
    const {userID, text, fullName, status} = info 

    console.log(info)

    if(userID && fullName) {
        const {data} = await axios.post('http://localhost:4444/send/message', info)

        return data
    }
    
    const {data} = await axios.post('http://localhost:4444/send/message', {
        text,
        status
    })


    return data 
})


type Subscribe = {
    fullName: string,
    avatarUrl?: string,
    userID: string
}

export type UserData = {
    avatarUrl?: string,
    backgroundProfile?: string,
    subscribes: Subscribe[],
    fullName: string,
    countSubs: number,
    createdAt: string,
    email: string,
    text: string,
    updatedAt: string,
    __v: number,
    _id: string,
    token: string,
    chat: Message[]
}

type State = {
    state: UserData | {},
    status: 'loading' | 'success' | 'errors',
    user: {
        value: UserData | {},
        status: 'loading' | 'success' | 'errors'
    },
    userAvatar: {
        status: 'loading' | 'success' | 'errors',
        img: {
            status: 'loading' | 'success' | 'errors',
            value: string | null 
        }
    }
    userBackground: {
        status: 'loading' | 'success' | 'errors',
        img: {
            status: 'loading' | 'success' | 'errors',
            value: string | null
        }
    },
    subscribe: {
        status: 'none' | 'success'
    }
}

const initialState: State = {
    state: {},
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

const authSlice = createSlice({
    name: 'auth/Slice',
    initialState,
    reducers: {
        logout: (state) => {
            state.state = {} 
        },
        resetUser: (state) => {
            state.userBackground.img.value = null
            state.userBackground.img.status = 'loading'
            state.userBackground.status = 'loading'
            state.userAvatar.img.value = null
            state.userAvatar.img.status = 'loading'
            state.userAvatar.status = 'loading'
            state.user.value = []
            state.user.status = 'loading'
        },
        checkSubscribe: (state, action: PayloadAction<{id: string}> ) => {
                if('subscribes' in state.state){ // проверяем есть ли поле subscribes в state
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
            if('subscribes' in state.user.value){
                state.user.value.subscribes.push(action.payload)
                state.user.value.countSubs += 1
            }

            state.subscribe.status = 'success'
        })
        .addCase(unSubscribeChanel.fulfilled, (state) => {
            if('countSubs' in state.user.value){
                state.user.value.countSubs -= 1
            }

            state.subscribe.status = 'none'    
        })
        .addCase(changeTextFun.fulfilled, (state, action) => {
            if('text' in state.user.value){
                state.user.value.text = action.payload.text
            }
        })
        .addCase(sendAvatar.pending, (state) => {
            state.userAvatar.img.status = 'loading'
        })    
        .addCase(sendAvatar.fulfilled, (state, action) => {
            console.log(action.payload)
            state.userAvatar.img.status = 'success'
            state.userAvatar.img.value = action.payload.path

            if('avatarUrl' in state.state){
                state.state.avatarUrl = action.payload.path
            }
            
        })      
        .addCase(sendAvatar.rejected, (state) => {
            state.userAvatar.img.status = 'errors'
        }) 
        .addCase(sendBackground.pending, (state) => {
            console.log('payload', 'test')
            state.userBackground.img.status = 'loading'
            state.userBackground.img.value = null
        })
        .addCase(sendBackground.fulfilled, (state, action) => {
            console.log('payload', action.payload)
            state.userBackground.img.status = 'success'
            state.userBackground.img.value = action.payload.path

            if('backgroundProfile' in state.state){
                state.state.backgroundProfile = action.payload.path
            }

        })
        .addCase(sendBackground.rejected, (state, action) => {
            console.log('payload', action.payload)
            state.userBackground.img.status = 'errors'
        })
        .addCase(sendMessage.fulfilled, (state, action) => {
            if('chat' in state.state){
                state.state.chat = action.payload.chat
            }         
        })
    }
})

export const {logout, resetUser, checkSubscribe}  = authSlice.actions
export const authReducer = authSlice.reducer