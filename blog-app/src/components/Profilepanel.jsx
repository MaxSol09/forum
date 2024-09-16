
import React, { useEffect, useRef, useState } from 'react'
import User from '../images/user.png'
import { Link } from 'react-router-dom'
import { Skeleton } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { changeAvatar, sendAvatar } from '../redux/auth'


export const ProfilePanel = () => {
  const {state, status} = useSelector(val => val.auth)
  const ref = useRef()
  const dispatch = useDispatch()
  
  const {value} = useSelector(el => el.auth.userAvatar.img)

  const [previousValuePath, setPreviousValuePath] = useState(null);

  useEffect(() => {
      if (value !== null && value.path !== previousValuePath) {
          console.log(value)
          dispatch(changeAvatar({ id: state._id, avatar: value.path }));

          setPreviousValuePath(value.path);
          window.location.reload();
      }
  }, [value, state._id, dispatch, previousValuePath]); 
  


  const changeImage = (e) => {
      const image = e.target.files[0]
  
      if(!image){
        return 'загрузите пожалуйста картинку'
      }
  
      const formData = new FormData()
      formData.append('file', image)

      dispatch(sendAvatar(formData));
    }

  const loadingUser = status === 'success'


  return (
    <>
    <div>
        <Skeleton style={{'display': !loadingUser ? 'grid' : 'none'}} className='py-3' active/>
        {state && <div style={{'display': loadingUser ? 'grid' : 'none'}} className='space-y-3'>
          <div className='py-2 space-y-2 bg-gray-100 px-4 shadow-md'>
              <div className='relative group grid justify-center'>
                <img className='shadow-custom mt-2 w-[200px] h-[200px] rounded-full' src={state.avatarUrl ? state.avatarUrl : User} alt='userLogo'/> 
                <button onClick={() => ref.current.click()} className='btnImg hidden py-2 px-1 bg-gray-300 shadow-custom group-hover:flex'>
                  <span className='leading-none text-white'>Поменять аватарку</span>
                </button>
                <input onChange={e => changeImage(e)} ref={ref} className='hidden' type='file' accept='image/*,.png,.jpg,.gif,.web'/> 
              </div>
              <h1 className='text-center text-xl'>{state.fullName}</h1>
          </div>
            <Link to={`/profile/${state._id}`} className='text-2xl w-full text-center bg-gray-100 py-2 shadow-md'>Профиль</Link>
            <button className='text-2xl w-full bg-gray-100 py-2 shadow-md'>Смена пароля</button>
      </div>}
    </div>

    </>
  )
}
