
import { changeTextFun, checkSubscribe, getUser, meFetch, resetUser, subscribeChanel, sendAvatar, changeAvatar, unSubscribeChanel, changeBackground, sendBackground } from '../redux/auth.ts' 
import { Header } from './Header.tsx' 
import ProfileBack from '../images/cosmos.jpg' 
import { Button, Spin} from 'antd' 
import { fetchPosts, getMyPosts, resetMyPostStatus} from '../redux/posts.ts' 
import React, {useEffect, useRef, useState} from 'react' 
import { LoadingOutlined } from '@ant-design/icons'; 
import { Posts } from '../components/Posts.tsx' 
import User from '../images/user.png';
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../redux/hooks.ts'
import { isUser } from '../utils/checkValue.ts'

export const Profile: React.FC = () => {

 
const {id} = useParams()
const dispatch = useAppDispatch()
const user = useAppSelector(el => el.auth.user.value)
const {status} = useAppSelector(el => el.auth.user)
const {posts} = useAppSelector(el => el.posts)
const subStatus = useAppSelector(el => el.auth.subscribe.status)
const {state} = useAppSelector(el => el.auth)
const myPosts = useAppSelector(el => el.posts.myPosts)
const avaRef = useRef<HTMLInputElement | null>(null)
const bgRef = useRef<HTMLInputElement | null>(null)
const [changeText, setChangeText] = useState(false)
const [text, setText] = useState<string>('')

const {theme} = useAppSelector(el => el.theme)

const avaValue = useAppSelector(el => el.auth.userAvatar.img.value)
const bgValue = useAppSelector(el => el.auth.userBackground.img.value)

const [avatarPath, setAvatarPath] = useState<string | null>(null);
const [bgPath, setBgPath] = useState<string | null>(null)


useEffect(() => {
  window.scrollTo(0, 0)
  if(id !== undefined){
    dispatch(meFetch()) // получаем информацию о нас
    dispatch(resetMyPostStatus()) // получаем посты юзера на профиль которого мы нажали
    dispatch(resetUser())
    dispatch(getUser({id})) // получаю пользователя на профиль которого перешел
    dispatch(checkSubscribe({id})) // смотрим подписаны ли мы на пользователя
    dispatch(fetchPosts()) //получаю все посты для того чтобы функция getMyPosts могла отфильтровать их и найти посты написанные конкретным юзером
  }
}, [dispatch, id])



useEffect(() => {
  if(posts.status === 'success'){ //проверяем на то что все посты загрузились а после фильтруем их на посты данного юзера
    dispatch(getMyPosts({id}))
  }
}, [dispatch, posts.status, id])


console.log(bgValue)


useEffect(() => {
    if (isUser(user) && isUser(state) && avaValue !== avatarPath && state._id === user._id && avaValue !== null) { //в данной строчке проверяю что имя картинки не равно той на которую мы меняли в прошлый раз 
        console.log('nice')
        dispatch(changeAvatar({ id: user._id, avatar: avaValue })); //меняю аватарку у определенного пользователя

        setAvatarPath(avaValue)
    }

    else if (isUser(user) && isUser(state) && bgValue !== bgPath && state._id === user._id && bgValue !== null) { //в данной строчке проверяю что имя картинки не равно той на которую мы меняли в прошлый раз
  
      dispatch(changeBackground({ id: user._id, backgroundProfile: bgValue })); //меняю задний фон у определенного юзера

      setBgPath(bgValue)
    }
    else{
      return
    }
}, [avaValue, bgValue, bgPath, user, dispatch, avatarPath,  state]);


console.log(avaValue, 'ava')

const changeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  dispatch(sendAvatar(formData));
}


const changeBg = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  dispatch(sendBackground(formData)); //отправка картинки на сервер
}

const subscribe = () => {
  if(isUser(state) && isUser(user)){
    dispatch(subscribeChanel({chanelID: user._id, userID: state._id}))
  }
}

const unSubscribe = () => {
  if(isUser(state) && isUser(user)){
    dispatch(unSubscribeChanel({chanelID: user._id, userID: state._id}))
  }
}

const submit = () => {
  if(!text) return 
  
  setChangeText(false)
  if(isUser(state)){
    dispatch(changeTextFun({userID: state._id, text})) // меняем текст в профиле
  }
}
const loadingPosts = myPosts.status === 'loading' && status === 'loading' // статус загрузки постов пользователя

return ( 
  <div style={{background: theme ? '#292828' : 'white'}}> 
    <Header page='createPost'/> 
    {isUser(state) && isUser(user) && <div className='px-64 pt-24 relative'> 
      <div className={`w-full relative ${theme ? 'shadow-white-xl' : 'shadow-lg'}`}> 
        <img className='w-full h-[300px]' alt='bgProfile' src={state._id === user._id ? state.backgroundProfile : user.backgroundProfile ? user.backgroundProfile : ProfileBack}></img> 
        <Button onClick={() => bgRef.current?.click()} style={{display: state._id === user._id ? '' : 'none', padding: '20px 30px', fontSize: '18px', position: 'absolute', right: '25px', top: '25px'}}> Изменить фон </Button> 
        <input onChange={e => changeBg(e)} ref={bgRef} className='hidden' type='file' accept='image/,.png,.jpg,.gif,.web'/> <div className="group bg-white rounded-full absolute right-[90%] top-8 z-10 translate-x-1/2 translate-y-1/2 flex justify-center items-center w-[200px] h-[200px]"> 
        <img className='absolute w-full h-full rounded-full border-2 border-black shadow-custom' src={state._id === user._id ? state.avatarUrl : user.avatarUrl ? user.avatarUrl : User} alt="avatar" /> 
        <button style={{display: state._id === user._id ? '' : 'none',}} onClick={() => avaRef.current?.click()} className='btnImg bg-gray-300 hidden shadow-custom py-2 px-4 group-hover:flex'> 
          <span className='leading-none text-white'>Поменять аватарку</span> 
          </button> 
          <input onChange={e => changeImage(e)} ref={avaRef} className='hidden' type='file' accept='image/,.png,.jpg,.gif,.web'/> 
        </div> 
        <div className='pt-9 px-14 bg-gray-200'> 
        <p className='text-2xl break-words'>{user.fullName}
                <span className='text-blue-500 text-xl pl-6'>{user.countSubs} подписчиков</span>
                </p> 
          <div className='flex justify-between w-full items-baseline'> 
            <div className='w-3/4 '>
            <textarea onChange={(e) => setText(e.target.value)} className='min-h-[400px] text-xl mt-6 p-2 max-h-[400px] w-[1000px] focus:outline-blue-400' style={{display: changeText ? 'flex' : 'none'}} placeholder='Расскажите что-нибудь о себе'></textarea>
              <p style={{display: changeText ? 'none' : 'block'}} className='text-xl pt-2 text-gray-500 break-words whitespace-normal'>
                <span className='text-gray-600 pr-2'>Описание: </span>{user.text ? user.text : 'Отсутствует'}
              </p>
            </div>
                <div className='grid gap-3'>
                {state.fullName === user.fullName && 
                <Button onClick={() => setChangeText(true)} style={{padding: '17px 12px', fontSize: '18px'}}>Редактировать</Button>} 
                {changeText && <Button onClick={() => setChangeText(false)} style={{padding: '17px 12px', fontSize: '18px'}}>Назад</Button>}
                {changeText && <Button onClick={() => submit()} style={{padding: '17px 12px', fontSize: '18px'}}>Сохранить</Button>} 
                </div>
            </div> 
            <div className='pb-9 pt-5 justify-end flex'> {state.fullName === user.fullName ? '' : subStatus === 'none' ? 
                    <Button onClick={() => subscribe()} style={{padding: '20px 30px', fontSize: '18px'}} type="primary" size="large"> Подписаться </Button>
                   : <Button onClick={() => unSubscribe()} style={{padding: '20px 40px', fontSize: '18px', background: 'red'}} type="primary" size="large"> Отписаться </Button>} 
                  </div> 
          </div> 
          </div> 
            <div style={{background: theme ? '#292828' : 'white'}} className={`relative grid justify-center py-10 pb-36 ${theme ? 'shadow-white-xl' : 'shadow-lg'}`}> 
              <Spin style={{'display': !loadingPosts ? 'none' : ''}} indicator={<LoadingOutlined style={{ fontSize: 68 }} spin />} /> 
              <Posts posts={myPosts.items} loadingPosts={loadingPosts}/> 
              </div> 
            <div style={{display: loadingPosts ? 'flex' : 'none'}} className='absolute flex justify-center items-center z-10 mt-24 mx-64 top-0 bottom-0 right-0 left-0 bg-back-color' > 
          <Spin size="large" /> </div> 
          </div>} 
          </div> 
          )
        }