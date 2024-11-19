import React from 'react'
import { Skeleton } from 'antd'
import { useAppSelector } from '../redux/hooks.ts'

export const TagsPosts: React.FC = () => {
    const {tags} = useAppSelector(val => val.posts)
    

    const loadingTags = tags.status === 'loading'

    return (
        <div className=' bg-gray-100 px-4 py-4'>
            <h1 className=' text-2xl'>Хэштеги</h1>
            <Skeleton style={{'display': loadingTags ? 'grid' : 'none'}} className='py-3' active/>
            <div className='py-3' style={{'display': loadingTags ? 'none' : 'grid'}}>
                {tags.items.length ? tags.items.map(item => (
                    <p key={item.tag}>#{item.tag}</p> 
                ))
                : <h1>Отсутствуют</h1>}
            </div>
        </div>
    )
}
