import Telegram from '../images/telegram.png'
import Pisocial from '../images/Pisocial.png'
import Back from  '../images/back.svg'
import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { registerFetch } from '../redux/auth.ts'
import { isUser } from '../utils/checkValue.ts'
import { useAppDispatch, useAppSelector } from '../redux/hooks.ts'
import axios from 'axios'


export const Register: React.FC = () => {

    const {state} = useAppSelector(el => el.auth)
    const navigate = useNavigate()

    useEffect(() => {
        if(isUser(state)){
            if(state.token){
                localStorage.setItem('JWTtoken', state.token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
                navigate('/home');
            }
            else{
                return 
            }
        }
    }, [state, navigate])

    const {
        register, 
        handleSubmit,
        formState: {errors}
    } = useForm<{email: string, password: string, fullName: string}>()

    const dispatch = useAppDispatch()

    const onSubmit = (data: {email: string, password: string, fullName: string}) => {
        dispatch(registerFetch(data))
    }

  return (
    <div className='flex'>
        <div className='w-1/2 h-vh bg-register-back bg-full-size relative flex items-center justify-center shadow-blue'>
            <img className=' absolute left-8 top-6' alt='logo' src={Pisocial}></img>
            <Link to={'https://t.me/frontendin14'} className='bg-white py-6 px-14 flex items-center text-center gap-5 rounded-4xl border-gray-300 border-4'>
                <img className=' w-16' alt='telegram' src={Telegram}></img>
                <h1 className='bold text-2xl'>Присоединяйся к нашему тг каналу!</h1>
            </Link>
        </div>
        <div className=' w-1/2 relative flex flex-col justify-center items-center'>
        <img className='absolute bottom-3 left-4' alt='back' src={Back}></img>
        <img className='absolute top-3 right-3' alt='back' src={Back}></img>
        <form onSubmit={handleSubmit(onSubmit)} className=' space-y-7'>
            <h1 className='bold text-5xl text-center'>Регистрация</h1>
            <h3 className=' text-neutral-400 text-center text-2xl'>Пройди регистрацию бесплатно!</h3>
            <label className='grid text-xl justify-center gap-1' >
                Имя
                <input {...register('fullName', {
                    required: 'Поле обязательно!',
                    minLength: {
                        value: 3,
                        message: 'Минимум 3 символа!'
                    },
                    maxLength: {
                        value: 20,
                        message: 'Максимум 20 символов!'
                    }
                })} type="text" className='px-2 w-96 py-2 pb-2 text-xl text-blue-500 border-gray-400 outline-none border-2 focus:border-blue-600'/>
                {errors?.fullName && <p className='text-lg text-rose-600'>{errors?.fullName?.message}</p>}
            </label>
            <label className='grid text-xl justify-center gap-1'>
                Email
                <input {...register('email', {
                    required: true
                })} type="email" className='px-2 w-96 py-2 pb-2 text-xl text-blue-500 border-gray-400 border-2 outline-none focus:border-blue-600'/>
                {errors?.email && <p className='text-lg text-rose-600'>Поле обязательно!</p>}
            </label>
            <label className='grid text-xl justify-center gap-1' >
                Пароль
                <input {...register('password', {
                    required: 'Поле обязательно!',
                    minLength: {
                        value: 5,
                        message: 'Минимум 5 символов!'
                    }
                })} type="text" className='px-2 w-96 py-2 pb-2 text-xl text-blue-500 border-gray-400 outline-none border-2 focus:border-blue-600'/>
                {errors?.password && <p className='text-lg text-rose-600'>{errors?.password?.message}</p>}
            </label>
            <button className='px-10 py-3 text-2xl bg-blue-500 rounded-xl text-white hover:bg-lime-500 transition-all delay-75 flex justify-center m-auto' type='submit'>Зарегистрироваться</button> 
        </form>
        <h2 className=' pt-5 pb-10 text-center text-lg'>
            Ты ещё не регистрировался? <Link to={'/'} className='text-center text-blue-600 text-xl' >Вход</Link>
        </h2>
    </div>
    </div>
  )
}
