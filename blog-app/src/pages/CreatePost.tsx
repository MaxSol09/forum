import React, { useEffect, useRef, useState } from 'react'
import { Header } from './../pages/Header.tsx'
import { createPost, createTag, deleteImg, deleteTag, resetCreatePost, resetPostStatus, sendImg, TypeTags} from '../redux/posts.ts'
import uniqid from 'uniqid';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks.ts';

export const CreatePost: React.FC = () => {

  const dispatch = useAppDispatch()
  const id = uniqid()
  const refImg = useRef<HTMLInputElement | null>(null)
  const [len, setLen] = useState(0)
  const [tag, setTag] = useState('')
  const tags = useAppSelector(el => el.posts.createTag.items)   
  const {value} = useAppSelector(el => el.posts.postChanges.img)
  const imgStatus = useAppSelector(el => el.posts.postChanges.img.status)
  const {status} = useAppSelector(el => el.posts.postChanges)
  const {state} = useAppSelector(el => el.auth)

  const navigation = useNavigate()

  const postLoading = status === 'loading' 
  const successStatus = status === 'success'

  useEffect(() => {
    dispatch(resetCreatePost())
  }, [dispatch])


  useEffect(() => {
    if(successStatus){
      dispatch(resetPostStatus())
      navigation('/home')
    }
  }, [successStatus, navigation, dispatch])

  console.log(tags)


  const {
    register, 
    handleSubmit, 
    formState: {errors, isValid}
  } = useForm<{ title: string, text: string }>()

  const changeText = (e: string) => {
    setLen(e.length)
  }

  const changeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('check', e);
  
    const input = e.target as HTMLInputElement;
  
    if (!input.files || input.files.length === 0) {
      console.log('Загрузите, пожалуйста, картинку');
      return;
    }
  
    const file = input.files[0]; // Получаем первый файл из объекта
  
    console.log(file);
  
    // Замените `object` на `FormData`
    const formData = new FormData();
    formData.append('file', file); // Добавляем файл, а не input
  
    console.log(typeof formData);
  
    dispatch(sendImg(formData));
  };

  type SubmitType = {
    title: string, 
    text: string, 
    tags: TypeTags[],
    userId: string,
    imageUrl?: string
  }
  

  const submit = (data: {title: string, text: string}) => {
    console.log(value)
    if (isValid && '_id' in state) {
      if (value && imgStatus !== 'loading') {

        const postData: SubmitType = {...data, tags, imageUrl: value.path, userId: state._id}
        
          dispatch(createPost(postData));
      } else {
          dispatch(createPost({...data, tags, userId: state._id}));
      }
  }
}

  const createTagFun = () => {
    if(tags.find(it => it.tag === tag)) return 

    else if(tags.length < 4 && tag){
      dispatch(createTag({tag, id}))
    }

    setTag('')
  }


  return (
    <>
        <Header page='createPost'/>
        <div className='px-64 py-32'>
            <form onSubmit={handleSubmit(submit)} className='grid gap-8'>
              <label>
                <input {...register('title', {
                  required: 'Поле обзательно для ввода',
                  minLength: {
                    value: 3,
                    message: 'Мин. 3 символа'
                  }
                })} className='w-full p-2 py-1 text-2xl border-b-2 focus:outline-none focus:border-blue-400' placeholder='Название'/>
                  {errors?.title && <p className='text-lg pt-[8px] text-rose-600'>{errors?.title?.message}</p>}
                </label>
                <div className='flex items-end space-x-8'>
                  <input value={tag} onChange={(e) => setTag(e.target.value)} className='w-full p-2 py-1 text-2xl border-b-2 focus:outline-none focus:border-blue-400' placeholder='Добавить хэштег'/>
                  <button onClick={() => createTagFun()} type='button' className='bg-white p-2 px-7 text-gray-400 rounded border-2 transition-all delay-150 hover:border-blue-400 hover:shadow-xl hover:text-blue-400'>Добавить</button>
                </div>
                {tags.length > 0 ? (
                  <div className='flex space-x-4 max-w-full'>
                    {tags.map(el => (
                    <div key={el.id} className='bg-gray-200 pl-3 flex items-center'>{el.tag}<span onClick={() => dispatch(deleteTag(el.id))} className='pl-2 cursor-pointer text-2xl pb-1 pr-2'>&times;</span></div>
                    ))}
                  </div>
                ) : null}
                <label>
                <textarea {...register('text', {
                  required: 'Поле обзательно для ввода',
                  minLength: {
                    value: 10,
                    message: 'Мин. 10 символа'
                  },
                  maxLength: {
                    value: 5000,
                    message: 'Макс. 5000 символов'
                  }
                })} onChange={(e) => changeText(e.target.value)} className='text-xl p-2 w-full border-2 max-h-96 min-h-96 focus:outline-blue-400' placeholder='Текст статьи........'></textarea>
                {errors?.text && <p className='text-lg text-rose-600'>{errors?.text?.message}</p>}
                  <div className='flex justify-between py-3'>
                    <p style={{'color': len > 5000 ? 'red': 'black'}}>{len}/5000</p>
                    <div className='space-x-2 flex items-center'>
                      <p style={{display: postLoading ? 'flex' : 'none'}} className='pr-2'>Загрузка поста......</p>
                      <button type='submit' className='bg-blue-400 p-2 px-7  text-gray-100 rounded shadow-xl'>Создать</button>
                      <button onClick={() => navigation('/home')} className='  p-2 px-7 text-blue-400 border-blue-400 border-2 rounded shadow-xl'>Назад</button>
                    </div>
                  </div>
                </label>
            </form>
            {value && <div className='w-[260px] h-[140px] relative shadow-custom mb-6'>
                  <img className='w-[260px] h-[140px]' alt='jehej' src={value.path}/>
                  <button onClick={() => dispatch(deleteImg())} className='absolute top-[10px] right-[10px] bg-gray-300 rounded-full flex justify-center items-center w-8 h-8 shadow-custom'>
                    <span className='pb-[5px] text-gray-600 text-2xl'>&times;</span>
                  </button>
                </div>}
              <div>
                <button onClick={() => refImg.current?.click()} className='bg-blue-400 p-2 text-gray-100 rounded shadow-xl'>Добавить картинку</button>
                <input className='hidden' ref={refImg} type="file" onChange={(e) => changeImage(e)} 
                  accept='image/*,.png,.jpg,.gif,.web'
                />
              </div>
        </div>
    </>
  )
}
