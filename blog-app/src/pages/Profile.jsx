
import { changeTextFun, checkSubscribe, getUser, meFetch, resetUser, subscribeChanel, sendAvatar, changeAvatar, unSubscribeChanel, changeBackground, sendBackground } from '../redux/auth' 
import { Header } from './Header' 
import ProfileBack from '../images/cosmos.jpg' 
import { Button, Spin} from 'antd' 
import { fetchPosts, getMyPosts, resetMyPostStatus} from '../redux/posts' 
import React, {useEffect, useRef, useState} from 'react' 
import { LoadingOutlined } from '@ant-design/icons'; import { Posts } from '../components/Posts' 
import User from '../images/user.png';
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

export const Profile = () => {

 
const {id} = useParams()
const dispatch = useDispatch()
const user = useSelector(el => el.auth.user.value)
const {status} = useSelector(el => el.auth.user)
const {posts} = useSelector(el => el.posts)
const subStatus = useSelector(el => el.auth.subscribe.status)
const {state} = useSelector(el => el.auth)
const myPosts = useSelector(el => el.posts.myPosts)
const ref = useRef()
const bgRef = useRef()
const [changeText, setChangeText] = useState(false)
const [text, setText] = useState('')

const {value} = useSelector(el => el.auth.userAvatar.img)
const bgValue = useSelector(el => el.auth.userBackground.img.value)

const [avatarPath, setAvatarPath] = useState(null);
const [bgPath, setBgPath] = useState(null)

useEffect(() => {
  if(state){
    dispatch(checkSubscribe({id}))
  }
}, [id, dispatch, state])

useEffect(() => {
  window.scrollTo(0, 0)
  dispatch(meFetch())
  dispatch(resetMyPostStatus())
  dispatch(resetUser())
  dispatch(getUser({id})) // получаю пользователя на профиль которого перешел
  dispatch(fetchPosts()) //получаю все посты для того чтобы функция getMyPosts могла отфильтровать их и найти посты написанные конкретным юзером
}, [dispatch, id])


useEffect(() => {
  if(posts.status === 'success'){
    dispatch(getMyPosts({id}))
  }
}, [dispatch, posts.status, id])

useEffect(() => {
    if (value !== null && value.path !== avatarPath) {
        console.log(value)
        dispatch(changeAvatar({ id: user._id, avatar: value.path }));

        setAvatarPath(value.path);
        window.location.reload();
    }
    else if (bgValue !== null && bgValue.path !== bgPath) {
      dispatch(changeBackground({ id: user._id, backgroundProfile: bgValue }));

      setBgPath(bgValue.path);
      window.location.reload();
    }
}, [value, bgValue, bgPath, user._id, dispatch, avatarPath]);




const changeImage = (e) => {
  const image = e.target.files[0]

  if(!image){
    return 'загрузите пожалуйста картинку'
  }

  const formData = new FormData()
  formData.append('file', image)

  dispatch(sendAvatar(formData));
}


const changeBg = (e) => {
  const image = e.target.files[0]


  if(!image){
    return 'загрузите пожалуйста картинку'
  }

  const formData = new FormData()
  formData.append('file', image)

  dispatch(sendBackground(formData));
}

const subscribe = () => {
  dispatch(subscribeChanel({chanelID: user._id, userID: state._id}))
}

const unSubscribe = () => {
  dispatch(unSubscribeChanel({chanelID: user._id, userID: state._id}))
}

const submit = () => {
  if(!text) return 
  
  setChangeText(false)
  dispatch(changeTextFun({userID: state._id, text}))
}
const loadingPosts = myPosts.status === 'loading' && status === 'loading'

return ( 
  <div> 
    <Header page='createPost'/> 
    {user && <div className='px-64 pt-24 relative'> 
      <div className='w-full relative '> 
        <img className='w-full h-[300px]' alt='bgProfile' src={user.backgroundProfile ? user.backgroundProfile : ProfileBack}></img> 
        <Button onClick={() => bgRef.current.click()} style={{display: state.fullName === user.fullName ? '' : 'none', padding: '20px 30px', fontSize: '18px', position: 'absolute', right: '25px', top: '25px'}}> Изменить фон </Button> 
        <input onChange={e => changeBg(e)} ref={bgRef} className='hidden' type='file' accept='image/,.png,.jpg,.gif,.web'/> <div className="group bg-white rounded-full absolute right-[90%] top-8 z-10 translate-x-1/2 translate-y-1/2 flex justify-center items-center w-[200px] h-[200px]"> 
        <img className='absolute w-full h-full rounded-full border-2 border-black shadow-custom' src={user.avatarUrl ? user.avatarUrl : User} alt="avatar" /> 
        <button style={{display: state.fullName === user.fullName ? '' : 'none',}} onClick={() => ref.current.click()} className='btnImg bg-gray-300 hidden shadow-custom py-2 px-4 group-hover:flex'> 
          <span className='leading-none text-white'>Поменять аватарку</span> 
          </button> 
          <input onChange={e => changeImage(e)} ref={ref} className='hidden' type='file' accept='image/,.png,.jpg,.gif,.web'/> 
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
            <div style={{background: myPosts.items.length ? 'rgb(255, 245, 235)' : ''}} className='relative grid justify-center shadow-lg py-10 pb-36'> 
              <Spin style={{'display': !loadingPosts ? 'none' : ''}} indicator={<LoadingOutlined style={{ fontSize: 68 }} spin />} /> <Posts posts={myPosts} loadingPosts={loadingPosts}/> 
                </div> 
            <div style={{display: loadingPosts ? 'flex' : 'none'}} className='absolute flex justify-center items-center z-10 mt-24 mx-64 top-0 bottom-0 right-0 left-0 bg-back-color' > 
          <Spin size="large" /> </div> 
          </div>} 
          </div> 
          )
        }