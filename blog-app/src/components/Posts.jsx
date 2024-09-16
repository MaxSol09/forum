import React, {useState} from 'react'
import User from '../images/user.png'
import Watch from '../images/watch.webp'
import Coment from '../images/coment.png'
import Gray from '../images/gray.png'
import NotResult from '../images/notResult.png'
import {Modal} from 'antd'
import { deletePost, fetchPosts, updatePost } from '../redux/posts'
import { Link } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

export const Posts = ({posts, loadingPosts}) => {

    const [modal, setModal] = useState(false)
    const {state} = useSelector(el => el.auth)
    const [change, setChange] = useState(false)
    const [text, setText] = useState('')
    const dispatch = useDispatch()

    const updateText = (id) => {
        dispatch(updatePost({id, text}))
        setChange(false)

        setText('')
    }

    const removePost = (id) => {
        dispatch(deletePost(id))
        dispatch(fetchPosts())
        setModal(null)
        window.location.reload()
    }


  return (
    <div className='grid gap-24'>
        { posts.items.length ? posts.items.map((post) => {
                const id = post._id
                return (
                <div key={post._id} style={{'display': !loadingPosts ? 'grid' : 'none'}} className='shadow-2xl relative w-full'>
                    {state.fullName === post.user.fullName && <div className='flex gap-4 absolute top-[15px] right-[15px]'>
                    <button onClick={() => setChange(post._id)} className=' bg-gray-300 rounded-full flex justify-center items-center w-12 h-12 shadow-custom'>
                        <span className='pb-[5px] text-white text-2xl'>	&#9998;</span>
                    </button>
                    <button onClick={() => setModal(post._id)} className=' bg-gray-300 rounded-full flex justify-center items-center w-12 h-12 shadow-custom'>
                        <span className='pb-[8px] text-white text-4xl'>&times;</span>
                    </button>
                    </div>}
                <img src={post.imageUrl ? post.imageUrl : Gray} alt="efef" className='w-full h-[600px]'/>
                <div className='py-3 px-5 border-t-2 border-gray-200'>
                        <div className=' flex gap-2'>
                            <img className='w-14 h-14 rounded-full' alt='user' src={post.user.avatarUrl ? post.user.avatarUrl : User}></img>
                            <div>
                                <Link to={`/profile/${post.user._id}`} className='text-xl text-gray-500'>{post.user.fullName}</Link>
                                <p>{post.createdAt.slice(0, 10)} {+post.createdAt.slice(11, 13) + 3}{post.createdAt.slice(13, 19)} часов</p>
                            </div>
                        </div>
                        <div className=' p-3 space-y-3'>
                            <h1 className='text-2xl font-bold'>{post.title}</h1>
                            <div className='flex space-x-2 pb-2 text-gray-500'>
                                {post.tags.length ? post.tags.map((el) => <p key={el.id}>#{el.tag}</p>) : <p>Теги отсутствуют</p>}
                            </div>
                            <Link state={post.user} to={`/post/${post._id}`}>Перейти</Link>
                            <div className='flex space-x-6'>
                                <div className='flex space-x-1 items-center'><img className=' w-6' src={Watch} alt="glaz" /><img src="" alt="" />{post.viewCount}</div>
                                <div className='flex space-x-1 items-center'><img className=' w-6' src={Coment} alt="coment" /><img src="" alt="" />{post.comments.length}</div>
                            </div>
                        </div>
                </div>
                <Modal okText={'Да'} cancelText={'Нет'} open={change === id} onOk={() => updateText(post._id)} onCancel={() => setChange(false)} cancelButtonProps={{style: {fontSize: "20px"}}} okButtonProps={{style: {fontSize: '20px'}}}>
                    <p className='text-xl pb-3'>Вы уверены, что хотите изменить текст поста?</p>
                    <textarea onChange={(e) => setText(e.target.value)} placeholder='текст....' className='p-2 text-2xl w-full border-red-200 border-2 h-[600px]' />
                </Modal>
                <Modal okText={'Да'} cancelText={'Нет'} open={modal === id} onOk={() => removePost(post._id)} onCancel={() => setModal(false)} cancelButtonProps={{style: {fontSize: "20px"}}} okButtonProps={{style: {fontSize: '20px'}}}>
                    <p className='text-xl pb-3'>Вы уверены, что хотите удалить пост?</p>
                </Modal>
                </div>)}) : <div  style={{'display': !loadingPosts ? 'grid' : 'none'}} className='pt-5 gap-12'>
                    <h1 className='text-center text-2xl text-gray-400'>Посты не опубликованы</h1>
                    <div className='flex justify-center'>
                        <img className='w-[400px]' src={NotResult} alt='notResult'></img>
                    </div>
                </div>
        }
    </div>
  )
}
