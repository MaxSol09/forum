import React from 'react'
import { TagsPosts } from '../components/TagsPosts.tsx'
import { ProfilePanel } from '../components/Profilepanel.tsx'


export const LeftPanel: React.FC = () => {


  return (
    <div className='w-1/4 space-y-3'>
        <TagsPosts />
        <ProfilePanel/>
    </div>
  )
}
