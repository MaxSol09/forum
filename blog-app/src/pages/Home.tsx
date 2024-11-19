
import React from 'react'
import { Header } from './Header.tsx'

import { PostsHome } from './PostsHome.tsx'
import { LeftPanel } from './LeftPanel.tsx'
import { useAppSelector } from '../redux/hooks.ts'
import { Chat } from '../components/Chat.jsx'

export const Home: React.FC = () => {

  const {theme} = useAppSelector(el => el.theme)
    
  return (
    <>
        <Header/>
        <main style={{background: theme ? '#292828' : 'white'}} className='px-64 pt-32 min-h-[105vh]'>
            <div className='flex justify-between'>
                <LeftPanel/>
                <PostsHome/>
                <Chat />
            </div>
        </main>
    </>
  )
  
}
