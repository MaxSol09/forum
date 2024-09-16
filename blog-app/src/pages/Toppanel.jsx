import React, { useEffect, useState } from 'react'
import {SearchOutlined } from '@ant-design/icons';
import {Button, Input, Skeleton} from 'antd'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPosts, newPosts, oldPosts, popularPost, searchPost } from '../redux/posts';
import { getUser } from '../redux/auth';

export const Toppanel = () => {
    const {status} = useSelector(val => val.auth)
    const {state} = useSelector(el => el.auth)
    const [subscribes, setSubscribes] = useState([])
    


    const dispatch = useDispatch()

    useEffect(() => {
        if (state.subscribes) {
          const subsPromise = state.subscribes.map((sub) =>
            dispatch(getUser({id: sub.userID})).then((userData) => ({
              ...sub,
              avatarUrl: userData.payload.avatarUrl,
              fullName: userData.payload.fullName,
            }))
          );
    
          Promise.all(subsPromise).then(setSubscribes);
        }
      }, [state.subscribes, dispatch]);


    const findPost = (e) => {
        if(!e.target.value) return 

        setTimeout(() => {
            dispatch(searchPost({title: e.target.value}))
        }, 300)
    }

    const loadingUser = status === 'success'


  return (
    <div className='justify-between flex items-center'>
        <div className='p-4 py-2 bg-gray-100 w-2/5'>
        <h1 className='text-center pb-1 text-xl'>Мои подписки</h1>
        { loadingUser ?
    <div className='flex space-x-5 overflow-auto whitespace-nowrap'>
        {subscribes.length ? 
            subscribes.map(el => (
                <div className='py-2' key={el.userID}>
                    <img className='w-16 h-16 rounded-full object-cover' src={el.avatarUrl} alt={el.alt || el.avatarUrl}></img>
                    <Link to={`/profile/${el.userID}`} >{el.fullName.length <= 8 ? el.fullName : el.fullName.slice(0, 6)}{el.fullName.length > 8 && '....'}</Link>
                </div>
            )) 
            : <div className='flex justify-center items-center w-full'>
                <h1 className='py-2 m-0'>Отсутствуют</h1>
            </div>
        }
    </div>
: 
    <Skeleton />
}
        </div>
        <div className='w-1/2 pt-2'>
            <Input onChange={e => findPost(e)} style={{ fontSize: '20px' }} suffix={<SearchOutlined style={{padding: '6px'}} />} placeholder="Поиск поста по названию" enterButton />
            <div className='flex py-4 gap-2'>
                <Button onClick={() => dispatch(popularPost())}>Популярные</Button>
                <Button onClick={() => dispatch(newPosts())}>Новые</Button>
                <Button onClick={() => dispatch(oldPosts())}>Старые</Button>
                <Button onClick={() => dispatch(fetchPosts())}>Все</Button>
            </div>
        </div>
    </div>
  )
}
