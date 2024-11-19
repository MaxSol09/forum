import React, { useEffect, useRef, useState } from 'react'
import User from '../images/user.png'
import { Link } from 'react-router-dom'
import { Skeleton } from 'antd'
import { changeAvatar, sendAvatar } from '../redux/auth.ts'
import { useAppDispatch, useAppSelector } from '../redux/hooks.ts'
import { isUser } from '../utils/checkValue.ts'
import Sun from '../images/sun.svg'
import Luna from '../images/sun2.svg'
import { changeTheme } from '../redux/theme.ts'


export const ProfilePanel: React.FC = () => {
  const {state, status} = useAppSelector(val => val.auth)
  const ref = useRef<HTMLInputElement | null>(null)
  const dispatch = useAppDispatch()

  const {theme} = useAppSelector(el => el.theme)

  console.log(theme)
  
  const {value} = useAppSelector(el => el.auth.userAvatar.img)

  const [previousValuePath, setPreviousValuePath] = useState<null | string>(null);

  console.log(value);

  useEffect(() => {
      if (value !== null && value !== previousValuePath && isUser(state)) {
          console.log(value)
          dispatch(changeAvatar({ id: state._id, avatar: value }));

          setPreviousValuePath(value);
      }
  }, [value, state, dispatch, previousValuePath]); 
  

  const changeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('check', e);
  
    const input = e.target as HTMLInputElement;
  
    if (!input.files || input.files.length === 0) {
      console.log('Загрузите, пожалуйста, картинку');
      return;
    }
  
    const file = input.files[0]; // Получаем первый файл из объекта
  
    // Замените `object` на `FormData`
    const formData = new FormData();
    formData.append('file', file); // Добавляем файл, а не input
  
    console.log(typeof formData);

      dispatch(sendAvatar(formData));
    }

  const loadingUser = status === 'success'


  return (
    <>
    <div>
        <Skeleton style={{'display': !loadingUser ? 'grid' : 'none'}} className='py-3' active/>
        {isUser(state) && <div style={{'display': loadingUser ? 'grid' : 'none'}} className='space-y-3'>
          <div className='py-2 space-y-2 bg-gray-100 px-4 shadow-md'>
              <div className='relative group grid justify-center'>
                <img className='shadow-custom mt-2 w-[200px] h-[200px] rounded-full' src={state.avatarUrl ? state.avatarUrl : User} alt='userLogo'/> 
                <button onClick={() => ref.current?.click()} className='btnImg hidden py-2 px-1 bg-gray-300 shadow-custom group-hover:flex'>
                  <span className='leading-none text-white'>Поменять аватарку</span>
                </button>
                <input onChange={e => changeImage(e)} ref={ref} className='hidden' type='file' accept='image/*,.png,.jpg,.gif,.web'/> 
              </div>
              <h1 className='text-center text-xl'>{state.fullName}</h1>
          </div>
            <Link to={`/profile/${state._id}`} className='text-2xl w-full text-center bg-gray-100 py-2 shadow-md'>Профиль</Link>
            <button className='text-2xl w-full text-center bg-gray-100 py-2 shadow-md'>Месседжер</button>
            <button onClick={() => dispatch(changeTheme())} className='text-2xl w-full bg-gray-100 py-2 shadow-md flex justify-center gap-[12px] items-center'>Смена темы<img className='h-[40px]' src={theme ? Luna : Sun}/></button>
      </div>}
    </div>

    </>
  )
}
