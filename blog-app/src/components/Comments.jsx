import { useState, useEffect } from 'react';
import { getUser } from '../redux/auth';
import uniqid from 'uniqid';
import { createComment, deleteComment } from '../redux/posts';
import { useDispatch, useSelector } from 'react-redux';
import User from '../images/user.png';
import { Modal } from 'antd';
import { Link } from 'react-router-dom';

export const Comments = () => {

    const [text, setText] = useState('');
    const { state } = useSelector((state) => state.auth);
    const post = useSelector((state) => state.posts.post.items);
    const [arrayComment, setArrayComment] = useState([]);
    const [modal, setModal] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        if (post.comments) {
          const commentPromises = post.comments.map((comment) =>
            dispatch(getUser({id: comment.userID})).then((userData) => ({
              ...comment,
              avatarUrl: userData.payload.avatarUrl,
              fullName: userData.payload.fullName,
            }))
          );
    
          Promise.all(commentPromises).then(setArrayComment);
        }
      }, [post.comments, dispatch]);
    
      const submitComment = () => {
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

      const removeComment = (postId, commentId) => {
        dispatch(deleteComment({postId, commentId}))
      }

  return (
    <div className='py-16 text-2xl space-y-8'>
              <div className='flex gap-5'>
                <input
                  onChange={(e) => setText(e.target.value)}
                  value={text}
                  className='p-3 w-full text-xl border-2 border-gray-200 focus:outline-gray-400'
                  placeholder='Написать комментарий'
                />
                <button
                  onClick={submitComment}
                  className='text-xl bg-green-300 py-2 px-6 text-white rounded'
                >
                  Отправить
                </button>
              </div>
              <h1>Комментарии:</h1>
              {arrayComment.length > 0 &&
                arrayComment.map((comment) => {
                  const id = comment.commentId
                  return (
                  <div className='shadow-custom py-2 px-4 break-words realtive' key={comment.commentId}>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-1'>
                        <img className='w-[50px] h-[50px] rounded-full' src={comment.avatarUrl ? comment.avatarUrl : User} alt='User'/>
                        <Link to={`/profile/${comment.userID}`} className='text-gray-500'>{comment.fullName}</Link>
                      </div>
                      {state.fullName === comment.fullName && <button onClick={() => setModal(comment.commentId)} className=' bg-gray-300 rounded-full flex justify-center items-center w-6 h-6 shadow-custom'>
                          <span className='pb-[8px] text-black text-2xl'>&times;</span>
                      </button>}
                    </div>
                    <p className='leading-none py-3'>{comment.text}</p>
                    <Modal okText={'Да'} cancelText={'Нет'} open={modal === id} onOk={() => removeComment(post._id, comment.commentId)} onCancel={() => setModal(false)} cancelButtonProps={{style: {fontSize: "20px"}}} okButtonProps={{style: {fontSize: '20px'}}}>
                      <p className='text-xl pb-3'>Вы уверены, что хотите удалить комментарий?</p>
                    </Modal>
                  </div>
                )}).reverse()}
        </div>
  )
}
