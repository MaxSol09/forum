import { gql } from '@apollo/client'

export const GET_ALL_USERS = gql`
    query{
        getAllUsers{
            id, name
        }
    }
`


export const GET_USER = gql`
    query{
        getUser{
            fullName, email, avatarUrl, _id
        }
    }
`