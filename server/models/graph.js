import { buildSchema } from "graphql";


export const schema = buildSchema(`
    type User{
        age: Int,
        name: String,
        id: ID
    }
    
    type Episode {
        fullName: String,
        email: String,
        _id: ID
    }


    type getMe{
        fullName: String,
        email: String,
        avatarUrl: String,
        subscribes: [Episode],
        backgroundProfile: String,
        text: String,
        _id: ID
    }

    type Query { 
        getAllUsers: [User],
        getUser: getMe
    }
        
`)