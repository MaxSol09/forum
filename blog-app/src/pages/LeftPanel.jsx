import React from 'react'
import { TagsPosts } from '../components/TagsPosts'
import { ProfilePanel } from '../components/Profilepanel'


export const LeftPanel = () => {


  return (
    <div className='w-1/4 space-y-3'>
        <TagsPosts />
        <ProfilePanel/>
    </div>
  )
}
