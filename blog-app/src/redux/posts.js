import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from 'axios'


export const fetchPosts = createAsyncThunk('fetch/posts', async() => {
    const {data} = await axios.get('http://localhost:4444/posts')

    return data
})

export const fetchTags = createAsyncThunk('tags/posts', async() => {
    const {data} = await axios.get('http://localhost:4444/tags')

    return data
})

export const createPost = createAsyncThunk('fetch/postCreate', async(postData) => {

    const {data} = await axios.post('http://localhost:4444/posts', postData)

    return data
})

export const sendImg = createAsyncThunk( 'img/fetch', async (formData) => {
    const {data} = await axios.post('http://localhost:4444/upload', formData)

    return data
})


export const deletePost = createAsyncThunk('delete/Post', async (id) => {
    
    await axios.delete(`http://localhost:4444/posts/${id}`)

    return id
}
)

export const updatePost = createAsyncThunk('update/Post', async ({id, text}) => {

    const {data} = await axios.patch(`http://localhost:4444/posts/${id}`, {text})

    return data
})

export const getPost = createAsyncThunk(
    'getPost/fetch',
    async (id) => {
        const {data} = await axios.get(`http://localhost:4444/posts/${id}`)

        return data
    }
)



export const createComment = createAsyncThunk('createComment/fetch', async (commentData) => {

    const {data} = await axios.post('http://localhost:4444/create/comment', commentData)

    return data.comments
})

export const deleteComment = createAsyncThunk('delete/comment', async (commentData) => {

    const {data} = await axios.post('http://localhost:4444/delete/comment', commentData)

    return data
})




const initialState = {
    posts: {
        items: [],
        status: 'loading'
    },
    postsArr: {
        items: []
    },
    myPosts: {
        items: [],
        status: 'loading'
    },
    post: {
        items: [],
        status: 'loading'
    },
    tags: {
        items: [],
        status: 'loading'
    },
    createTag: {
        items: []
    },
    postChanges: {
        status: 'loading',
        img: {
            status: 'loading',
            value: null
        }
    },
    commentCreate: {
        items: []
    },
    getComments: {
        status: 'loading',
        comments: []
    }
}



const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        createTag: (state, action) => {
            state.createTag.items = [...state.createTag.items, action.payload]
        },
        deleteTag: (state, action) => {
            state.createTag.items = state.createTag.items.filter(el => el.id !== action.payload)
        },
        deleteImg: (state) => {
            state.postChanges.img.value = null
        },
        getMyPosts: (state, action) => {
            if(state.posts.items.length){
                state.myPosts.items = state.posts.items.filter(el => el.user._id === action.payload.id)
            }

            state.myPosts.status = 'success'
        },
        resetCreatePost: (state) => {
            state.createTag.items = []
            state.postChanges.img.value = null
        },
        resetPost: (state) => {
            state.post.items = []
        },
        resetPostStatus: (state) => {
            state.postChanges.status = 'loading'
        },
        resetMyPostStatus: (state) => {
            state.myPosts.status = 'loading'
        },
        popularPost: (state) => {
           state.postsArr.items = state.posts.items.sort((a, b) => b.viewCount - a.viewCount) 
        },
        newPosts: (state) => {
            state.postsArr.items = state.posts.items.sort((a, b) => {
                let c = new Date(a.createdAt);
                let d = new Date(b.createdAt);
                return d-c;
            });
        },
        oldPosts: (state) => {
            state.postsArr.items = state.posts.items.sort((a, b) => {
                let c = new Date(a.createdAt);
                let d = new Date(b.createdAt);
                return c-d;
            });
        },
        searchPost: (state, action) => {
            console.log(action.payload)
            state.postsArr.items = state.posts.items.filter(el => {
                    return el.title.toLowerCase() === action.payload.title.toLowerCase()
                }
            )
        }
    },
    extraReducers: (build) => {
        build.addCase(fetchPosts.pending, (state) => {
                state.posts.items = []
                state.posts.status = 'loading'
            })
        .addCase(fetchPosts.fulfilled, (state, action) => {
            state.posts.items = action.payload
            state.postsArr.items = action.payload
            state.posts.status = 'success'
        })
        .addCase(fetchPosts.rejected, (state) => {
            state.posts.items = []
            state.posts.status = 'errors'
        })
        .addCase(fetchTags.pending, (state) => {
            state.tags.items = []
            state.tags.status = 'loading'
        })
        .addCase(fetchTags.fulfilled, (state, action) => {
            state.tags.items = action.payload
            state.tags.status = 'success'
        })
        .addCase(fetchTags.rejected, (state) => {
            state.tags.items = []
            state.tags.status = 'errors'
        })
        .addCase(createPost.pending, (state) => {
            state.postChanges.status = 'loading'
        })
        .addCase(createPost.fulfilled, (state) => {
            state.postChanges.status = 'success'
        })
        .addCase(createPost.rejected, (state) => {
            state.postChanges.status = 'errors'
        })      
        .addCase(sendImg.pending, (state) => {
            state.postChanges.img.status = 'loading'
        })    
        .addCase(sendImg.fulfilled, (state, action) => {
            state.postChanges.img.status = 'success'
            state.postChanges.img.value = action.payload
        })      
        .addCase(sendImg.rejected, (state) => {
            state.postChanges.img.status = 'errors'
        })          
        .addCase(deletePost.fulfilled, (state, action) => {
            state.posts.items = state.posts.items.filter(el => el._id !== action.payload)
        })       
        .addCase(updatePost.fulfilled, (action) => {
            console.log(action.payload)
        })   
        .addCase(getPost.pending, (state) => {
            state.post.status = 'loading'
        })   
        .addCase(getPost.fulfilled, (state, action) => {
            state.post.status = 'success'
            state.post.items = action.payload
        })   
        .addCase(getPost.rejected, (state) => {
            state.post.status = 'errors'
        })   
        .addCase(createComment.fulfilled, (state, action) => {
            state.post.items.comments = action.payload
        })
        .addCase(deleteComment.fulfilled, (state, action) => {
            if(state.post.items.comments){
                state.post.items.comments = state.post.items.comments.filter(el => el.commentId !== action.payload.id)
            }
        })
    }
})

export const postsReducer = postsSlice.reducer
export const {createTag, deleteTag, deleteImg, getMyPosts, resetCreatePost, resetPost, resetPostStatus, resetMyPostStatus, popularPost, oldPosts, newPosts, searchPost} = postsSlice.actions

