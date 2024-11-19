
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Register } from './pages/Register.tsx'
import { CreatePost } from './pages/CreatePost.tsx'
import { Home } from './pages/Home.tsx'
import { Login } from './pages/Login.tsx'
import { Profile } from './pages/Profile.tsx'
import { Post } from './pages/Post.tsx'



export const Router = () => {
  return (
    <div>
    <Routes> 
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/create' element={<CreatePost/>}></Route>
        <Route path='/post/:id' element={<Post/>}></Route>
        <Route path='/home' element={<Home/>}></Route>
        <Route path='/profile/:id' element={<Profile/>}></Route>
        <Route path='/' element={<Login/>}></Route>
        <Route path='*' element={<h1>Не найденно</h1>}></Route>
    </Routes>
    </div>
  )
}
