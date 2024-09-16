import React, { useEffect, useState } from 'react'
import Logo from '../images/Pisocial.png'
import { Link, useNavigate } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { logout, meFetch } from '../redux/auth'
import { Modal} from 'antd';
import { checkValue } from '../utils/checkValue'


export const Header = ({page}) => {

  const [modal,setModal] = useState(false)
  const {state, status} = useSelector(el => el.auth)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
      dispatch(meFetch())

  }, [dispatch, navigate])

  useEffect(() => {
    if(!localStorage.getItem('JWTtoken')){
      navigate('/')
    }
  }, [status, navigate])

  const logoutFun = () => {
    dispatch(logout())
    setModal(false)
    localStorage.removeItem('JWTtoken')
    navigate('/')
    window.location.reload()
  }

  const modalFun = () => {
    setModal(true)
  }


  return (
    <header className='w-full flex bg-blue-300 py-7 px-64 items-center justify-between fixed z-50'>
      <img src={Logo} alt="logo" />
      {checkValue(state) ? <div className='space-x-6'>
        <button className='text-2xl border-2 border-gray-600 py-1 px-4 bg-slate-100 hover:bg-slate-200 delay-30' onClick={() => page === 'createPost' ?  window.history.back() : navigate('/create')}>{page === 'createPost' ? 'Назад' : 'Сделать пост'}</button>
        <button onClick={() => modalFun()} className='text-2xl border-2 border-gray-600 py-1 px-4 bg-slate-100 hover:bg-slate-200 delay-30'>Выйти</button>
        </div>  : <div className='space-x-6'>
        <Link className='text-2xl border-2 border-gray-600 py-1 px-4 bg-slate-100 hover:bg-slate-200 delay-30' to='/'>Войти</Link>
        <Link className='text-2xl border-2 border-gray-600 py-1 px-4 bg-slate-100 hover:bg-slate-200 delay-30' to='/register'>Регистрация</Link>
        </div>}
        <Modal okText={'Выйти'} cancelText={'Нет'} open={modal} onOk={() => logoutFun()} onCancel={() => setModal(false)} cancelButtonProps={{style: {fontSize: "20px"}}} okButtonProps={{style: {fontSize: '20px'}}}>
        <p className='text-xl pb-3'>Вы уверены, что хотите выйти из аккаунта?</p>
      </Modal>
    </header>
  )
}
