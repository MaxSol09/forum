import React, { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Header } from './Header.tsx';
import User from '../images/user.png';
import Watch from '../images/watch.webp';
import Coment from '../images/coment.png';
import Gray from '../images/gray.png';
import { getPost, resetPost } from '../redux/posts.ts';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Comments } from '../components/Comments.tsx';
import { useAppDispatch, useAppSelector } from '../redux/hooks.ts';
import { isPost } from '../utils/checkValue.ts';


export const Post: React.FC = () => {
  const { id } = useParams();
  const post = useAppSelector((state) => state.posts.post.items);
  const status = useAppSelector((state) => state.posts.post.status);
  const dispatch = useAppDispatch();
  
  const {theme} = useAppSelector(el => el.theme)

  const location = useLocation();
  const user = location.state;

  useEffect(() => {
    dispatch(resetPost())
    if(id !== undefined){
      dispatch(getPost(id));
    }
  }, [dispatch, id])

  const loadingPost = status === 'loading'


  return (
    <>
      <Header page='createPost' />
      <div style={{background: theme ? '#292828' : 'white'}} className='px-72 py-32'>
        <Spin style={{'display': !loadingPost ? 'none' : 'flex', justifyContent: 'center', alignItems: 'center'}} indicator={<LoadingOutlined style={{ fontSize: 68 }} spin />} />
        {isPost(post) ? (
          <div key={post._id}>
            <div className='shadow-2xl bg-white pt-4'>
              <div className='px-5'>
                <img
                  src={post.imageUrl ? post.imageUrl : Gray}
                  alt='Post'
                  className='w-full h-[600px]'
                />
                <div className='pt-3 flex gap-2'>
                  <img
                    className='w-14 h-14 rounded-full'
                    alt='user'
                    src={user.avatarUrl ? user.avatarUrl : User}
                  />
                  <div> 
                    {user.fullName ? <Link to={`/profile/${user._id}`} className='text-xl text-gray-500'>{user.fullName}</Link>
                      : <h1 className='text-xl text-gray-500'>Пользователь удален</h1>}
                    <p>
                      {post.createdAt.slice(0, 10)} {+post.createdAt.slice(11, 13) + 3}{post.createdAt.slice(13, 19)} часов
                    </p>
                  </div>
                </div>
                <div className='p-3 space-y-3 pt-2 '>
                  <h1 className='text-2xl font-bold'>{post.title}</h1>
                  <p>{post.text}</p>
                  <div className='flex space-x-2 text-gray-500'>
                    {post.tags.length ? (
                      post.tags.map((el) => <p key={el.id}>#{el.tag}</p>)
                    ) : (
                      <p>Теги отсутствуют</p>
                    )}
                  </div>
                  <div className='flex space-x-6'>
                    <div className='flex space-x-1 items-center'>
                      <img className='w-6' src={Watch} alt='views' />
                      {post.viewCount}
                    </div>
                    <div className='flex space-x-1 items-center'>
                      <img className='w-6' src={Coment} alt='comments' />
                      {post.comments.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Comments />
          </div>
        ) : (
          <h1 className='text-center' style={{'display': !loadingPost ? 'grid' : 'none'}}>Посты не найденны</h1>
        )}
      </div>
    </>
  );
};