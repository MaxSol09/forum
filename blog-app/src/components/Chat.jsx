import Support from '../images/support.png'
import Send from '../images/send.png'
import React, { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks.ts'
import { sendMessage } from '../redux/auth.ts'

export const Chat = () => {

    const [open, setOpen] = useState(false)
    const messageRef = useRef(null)

    const {state} = useAppSelector(el => el.auth)
    const dispatch = useAppDispatch()
    const [text, setText] = useState('')


    console.log('wfwfwf', state)

    useEffect(() => {
        if(open) {
            messageRef.current.scrollTop = messageRef.current.scrollHeight //делаем так чтобы при открытии пересписки мы изначально были в последнх сообщениях
        }
    }) 
    
    const send = () => {
        if(!text) return 

        dispatch(sendMessage({
            text,
            userID: state._id,
            status: 'user',
            fullName: state.fullName
        }))

        setText('')
    }
            
        return (
    <>
     <div title="Поддержка" onClick={() => setOpen(true)} className='bg-white flex items-center justify-center w-[130px] h-[130px] shadow-custom-rounded rounded-[50%] fixed right-8 bottom-8'>
        <img className='w-[80px] h-[80px]' src={Support} alt="support" />
     </div>
     <div style={{display: open ? 'flex' : 'none'}} className='w-[320px] flex-col h-[410px] border-gray-600 shadow-custom-rounded bg-white fixed right-6 bottom-6'>
        <div className='py-2 bg-gray-100 flex px-3 justify-between text-[19px]'>
            <h1 className='text-center'>Поддержка</h1>
            <p onClick={() => setOpen(false)} className='cursor-pointer'>&#10006;</p>
        </div>
        <div ref={messageRef} className='py-3 relative overflow-auto scrollbar-thin'>
        {state.chat ? state.chat.map(el => (
                <div className={`${el.status === 'user' ? 'ml-auto' : 'ml-[15px]'} bg-slate-200 my-4 w-2/3 py-1 px-2 block break-words`}>
                    <p>{el.text}</p>
                </div>
            )) : <p>Нет сообщений</p>}
        </div>
        <div className='flex px-4 py-1 gap-3 pb-1'>
            <textarea value={text} onChange={e => setText(e.target.value)} className='items-center overflow-auto scrollbar-thin w-full pb-1 outline-none resize-none' placeholder='Cообщение:' type="text" />
            <div onClick={() => send()} className='flex w-[58px] justify-center items-center px-2 mb-1 rounded-[50%] bg-slate-200 shadow-custom-rounded hover:bg-blue-400 duration-200'>
                <img src={Send} alt='Send'></img>
            </div>
        </div>
     </div>
    </>
  )
}
