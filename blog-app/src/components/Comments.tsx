import React, { useState, useEffect } from 'react';
import { getUser } from '../redux/auth.ts';
import uniqid from 'uniqid';
import { createComment, deleteComment, TypeComment } from '../redux/posts.ts';
import User from '../images/user.png';
import { Modal } from 'antd';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks.ts';
import { isPost, isUser } from '../utils/checkValue.ts';

export const Comments = () => {

    const [text, setText] = useState('');
    const { state } = useAppSelector((state) => state.auth);
    const post = useAppSelector((state) => state.posts.post.items);
    const [arrayComment, setArrayComment] = useState<TypeComment[]>([]);
    const [modal, setModal] = useState<Boolean | string>(false)

    const {theme} = useAppSelector(el => el.theme)

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (isPost(post)) {
          const commentPromises = post.comments.map((comment) =>
            dispatch(getUser({id: comment.userID})).then((userData) => ({
              ...comment,
              avatarUrl: userData.payload.avatarUrl,
              fullName: userData.payload.fullName,
            }))
          );
    
          Promise.all(commentPromises).then((val) => setArrayComment(val));
        }
      }, [post, dispatch]);
    
      const submitComment = () => {
        if(isPost(post) && isUser(state)){
          const commentData = {
            postId: post._id,
            fullName: state.fullName,
            text,
            commentId: uniqid(),
            avatar: state.avatarUrl,
            userId: state._id,
          };
    
          dispatch(createComment(commentData))
        
          setText('')
        }
      }

      const removeComment = (postId: string, commentId: string) => {
        dispatch(deleteComment({postId, commentId}))
      }

  return (
    <div className='py-16 text-2xl space-y-8'>
      <div className='flex gap-5'>
        <input
          onChange={(e) => setText(e.target.value)}
          value={text}
          className='p-3 w-full text-xl border-2 border-gray-200 focus:outline-gray-400 comment-input'
          placeholder='Написать комментарий'
        />
        <button
          onClick={submitComment}
          className='text-xl bg-green-300 py-2 px-6 text-white rounded'
        >
          Отправить
        </button>
      </div>
      <h1 className={`${theme ? 'text-white' : 'text-black'}`}>Комментарии:</h1>
      {arrayComment.length > 0 && isUser(state) && isPost(post) &&
        arrayComment.map((comment) => {
          const id = comment.commentId
          return (
          <div className={`py-2 px-4 break-words realtive ${theme ? 'shadow-white-sm' : 'shadow-custom'}`} key={comment.commentId}>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-1'>
                <img className='w-[50px] h-[50px] rounded-full mr-1' src={comment.avatarUrl ? comment.avatarUrl : User} alt='User'/>
                <Link to={`/profile/${comment.userID}`} className={`${theme ? 'text-gray-400' : 'text-gray-500'}`}>{comment.fullName}</Link>
              </div>
              {state.fullName === comment.fullName && <button onClick={() => setModal(comment.commentId)} className=' bg-gray-300 rounded-full flex justify-center items-center w-6 h-6 shadow-custom'>
                  <span className='pb-[8px] text-black text-2xl'>&times;</span>
              </button>}
            </div>
            <p className={`leading-none py-3 ${theme ? 'text-white' : 'text-black'}`}>{comment.text}</p>
            <Modal okText={'Да'} cancelText={'Нет'} open={modal === id} onOk={() => removeComment(post._id, comment.commentId)} onCancel={() => setModal(false)} cancelButtonProps={{style: {fontSize: "20px"}}} okButtonProps={{style: {fontSize: '20px'}}}>
              <p className='text-xl pb-3'>Вы уверены, что хотите удалить комментарий?</p>
            </Modal>
          </div>
        )}).reverse()}
    </div>
  )
}
