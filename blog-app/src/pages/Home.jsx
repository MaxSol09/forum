
import React, { useEffect, useState } from 'react'
import { Header } from './Header'

import { PostsHome } from './PostsHome'
import { LeftPanel } from './LeftPanel'

export const Home = () => {

    
  return (
    <>
        <Header/>
        <main className='px-64 pt-32' >
            <div className='flex justify-between'>
                <LeftPanel/>
                <PostsHome/>
            </div>
        </main>
    </>
  )
}
