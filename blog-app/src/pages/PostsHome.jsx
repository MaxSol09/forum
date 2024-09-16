import React, {useEffect} from 'react'
import { LoadingOutlined } from '@ant-design/icons';
import {Spin} from 'antd'
import {useDispatch, useSelector} from 'react-redux'
import { fetchPosts, fetchTags } from '../redux/posts'
import { meFetch } from '../redux/auth'
import { Posts } from '../components/Posts';
import { Toppanel } from './Toppanel';



export const PostsHome = () => {

    const dispatch = useDispatch()
    const {posts, postsArr} = useSelector(val => val.posts)
    
    useEffect(() => {
        dispatch(meFetch())

        const disableBackButton = () => {
            window.history.pushState(null, null, window.location.href)
            window.onpopstate = () => {
            window.history.pushState(null, null, window.location.href)
            }
        }
        
        disableBackButton();
        
        return () => {
            window.onpopstate = null;
        }

    }, [dispatch])



    useEffect(() => {
        dispatch(fetchPosts())
        dispatch(fetchTags())
    }, [dispatch])

    const loadingPosts = posts.status === 'loading'


  return (
    <div className='w-4/6 grid gap-6 pb-24'>
        <Toppanel />
        <Spin style={{'display': !loadingPosts ? 'none' : ''}} indicator={<LoadingOutlined style={{ fontSize: 68 }} spin />} />
        <Posts posts={postsArr} loadingPosts={loadingPosts}/>     
    </div>
  )
}
