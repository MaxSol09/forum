import React, {useEffect} from 'react'
import { LoadingOutlined } from '@ant-design/icons';
import {Spin} from 'antd'
import { fetchPosts, fetchTags } from '../redux/posts.ts'
import { meFetch } from '../redux/auth.ts'
import { Posts } from '../components/Posts.tsx';
import { Toppanel } from './Toppanel.tsx';
import { useAppDispatch, useAppSelector } from '../redux/hooks.ts';



export const PostsHome: React.FC = () => {

    const dispatch = useAppDispatch()
    const postsArr = useAppSelector(val => val.posts.postsArr.items)
    const posts = useAppSelector(el => el.posts.posts.items)
    const status = useAppSelector(el => el.posts.posts.status)

    console.log(posts)
    
    useEffect(() => {
        dispatch(meFetch())

        const disableBackButton = () => {
            window.history.pushState(null, '', window.location.href)
            window.onpopstate = () => {
            window.history.pushState(null, '', window.location.href)
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

    const loadingPosts = status === 'loading'


  return (
    <div className='w-4/6 grid gap-6 pb-24'>
        <Toppanel />
        <Spin style={{'display': !loadingPosts ? 'none' : ''}} indicator={<LoadingOutlined style={{ fontSize: 68 }} spin />} />
        <Posts posts={postsArr} loadingPosts={loadingPosts}/>     
    </div>
  )
}
