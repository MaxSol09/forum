import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from 'axios'


export const fetchPosts = createAsyncThunk('fetch/posts', async() => {
    const {data} = await axios.get('http://localhost:4444/posts')

    return data
})

export const fetchTags = createAsyncThunk('tags/posts', async() => {
    const {data} = await axios.get('http://localhost:4444/tags')

    console.log(data)

    return data
})

type SubmitType = {
    title: string, 
    text: string, 
    tags: TypeTags[],
    userId: string,
    imageUrl?: string
  }

export const createPost = createAsyncThunk('fetch/postCreate', async(postData: SubmitType) => {

    const {data} = await axios.post('http://localhost:4444/posts', postData)

    return data
})

export const sendImg = createAsyncThunk( 'img/fetch', async (formData: object) => {

    const {data} = await axios.post('http://localhost:4444/upload', formData)

    return data
})


export const deletePost = createAsyncThunk('delete/Post', async (id: string) => {
    
    const {data} = await axios.delete(`http://localhost:4444/posts/${id}`)

    return data
}
)

type PostData = {
    id: string,
    text: string
}

export const updatePost = createAsyncThunk('update/Post', async (PostData: PostData) => {

    const {data} = await axios.patch(`http://localhost:4444/posts/${PostData.id}`, {text: PostData.text})

    console.log('egeg', data)

    return data
})

export const getPost = createAsyncThunk(
    'getPost/fetch',
    async (id: string) => {
        const {data} = await axios.get(`http://localhost:4444/posts/${id}`)

        return data
    }
)

interface TypeCommentData {
    postId: string,
    fullName: string,
    text: string,
    commentId: string,
    avatar?: string,
    userId: string,
}

export const createComment = createAsyncThunk('createComment/fetch', async (commentData: TypeCommentData) => {

    const {data} = await axios.post('http://localhost:4444/create/comment', commentData)

    return data.comments
})

interface TypeRemoveComment {
    postId: string, 
    commentId: string
}

export const deleteComment = createAsyncThunk('delete/comment', async (commentData: TypeRemoveComment) => {

    const {data} = await axios.post('http://localhost:4444/delete/comment', commentData)

    return data
})

  export type TypeTags = {
    tag: string,
    id: string
  }

  export type TypeComment = {
    userID: string,
    text: string,
    fullName: string,
    avatarUrl?: string,
    commentId: string
  }

  type TypeChanell = {
    fullName: string,
    _id: string,
    imageUrl?: string
  }

  export type TypePost = {
    createdAt: string,
    updateAt: string,
    user: TypeChanell | string,
    text: string,
    title: string,
    viewCount: number,
    __v: number,
    _id: string,
    tags: TypeTags[],
    comments: TypeComment[],
    imageUrl?: string
  } 

  type TypeImageValue = {
    path: string,
    url: string
  }

  type TypeStatus = 'none' | 'success' | 'loading' | 'errors'

  type TypeState = { 
    posts: {
        items: [] | TypePost[]
        status: TypeStatus
    }
    postsArr: {
        items: [] | TypePost[]
    },
    myPosts: {
        items: [] | TypePost[],
        status: TypeStatus
    },
    post: {
        items: {} | TypePost,
        status: TypeStatus
    },
    tags: {
        items: [] | TypeTags[],
        status: TypeStatus
    },   
    deletePostStatus: {
        status: TypeStatus
    },
    createTag: {
        items: TypeTags[]
    },
    postChanges: {
        status: 'none' | TypeStatus,
        img: {
            status: TypeStatus,
            value: null | TypeImageValue
        }
    },
    commentCreate: {
        items: []
    }
  }



const initialState: TypeState = {
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
        items: {},
        status: 'loading'
    },
    tags: {
        items: [],
        status: 'loading'
    },
    deletePostStatus: {
        status: 'loading'
    },
    createTag: {
        items: []
    },
    postChanges: {
        status: 'none',
        img: {
            status: 'loading',
            value: null
        }
    },
    commentCreate: {
        items: []
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
                state.myPosts.items = state.posts.items.filter(el => {
                    const user = typeof(el.user) === 'string' ? {_id: el.user} : el.user as TypeChanell
                    return user._id === action.payload.id
                })
            

            state.myPosts.status = 'success'
        },
        resetCreatePost: (state) => {
            state.createTag.items = []
            state.postChanges.img.value = null
        },
        resetPost: (state) => {
            state.post.items = {} as TypePost
        },
        resetPostStatus: (state) => {
            state.postChanges.status = 'none'
        },
        resetMyPostStatus: (state) => {
            state.myPosts.status = 'loading'
        },
        popularPost: (state) => {
           state.postsArr.items = state.posts.items.sort((a, b) => b.viewCount - a.viewCount) 
        },
        newPosts: (state) => {
            state.postsArr.items = state.posts.items.sort((a, b) => {
                let c = new Date(a.createdAt).getTime();
                let d = new Date(b.createdAt).getTime();
                return d-c;
            });
        },
        oldPosts: (state) => {
            state.postsArr.items = state.posts.items.sort((a, b) => {
                let c = new Date(a.createdAt).getTime();
                let d = new Date(b.createdAt).getTime();
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
        .addCase(deletePost.pending, (state) => {
            state.deletePostStatus.status = 'loading'
        })      
        .addCase(deletePost.fulfilled, (state, action) => {
            state.posts.items = state.posts.items.filter(el => el._id !== action.payload)
            state.deletePostStatus.status = 'success'
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

            if('comments' in state.post.items){
                state.post.items.comments = action.payload
            }
            
        })
        .addCase(deleteComment.fulfilled, (state, action) => {
            if ('comments' in state.post.items && Array.isArray(state.post.items.comments)) {
                state.post.items.comments = state.post.items.comments.filter(el => el.commentId !== action.payload.id)
            }
        })
    }
})

export const postsReducer = postsSlice.reducer
export const {createTag, deleteTag, deleteImg, getMyPosts, resetCreatePost, resetPost, resetPostStatus, resetMyPostStatus, popularPost, oldPosts, newPosts, searchPost} = postsSlice.actions

