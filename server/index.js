import express from 'express'
import mongoose from 'mongoose'
import checkAuth from './utils/checkAuth.js'
import multer from 'multer'
import cors from 'cors'
import { userController, postController } from './controllers/index.js'
import { Validations, validationErrors } from './validations/index.js'
import { graphqlHTTP } from 'express-graphql'
import { schema } from './models/graph.js'
import jwt from 'jsonwebtoken'
import userModel from './models/user.js'
import { getMe } from './controllers/userControllers.js'

const app = express()

const storage = multer.diskStorage(
    {
        destination: (_, __, cb) => {
            cb(null, 'images')
        },
        filename: (_, file, cb) => {
            cb(null, file.originalname)
        }
    }
)

const users = [{id: 10, name: 'пупкин', age: 15},{id: 11, name: 'пупкин2', age: 13},{id: 12, name: 'пупкин3', age: 11}]



const root = {
    getAllUsers: () => {
        return users;
    },
    getUser: async (args, context) => {

        console.log('ege', context)
        return await getMe({ userId: context.userId }); // Pass the userId from the context
    }
};

const upload = multer({storage})

app.use(express.json())
app.use(cors())
app.use('/upload', express.static('images'))

/*/
реализовал получание поьзователя с проверкой на токен в graphql
const context = (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Вы не авторизованны' });
        return;
    }

    const token = authHeader.slice(7);

    const decoded = jwt.verify(token, 'secretMax392')

    req.userId = decoded._id

    console.log('dd', req.userId)

    return { userId: req.userId };
};



app.use('/graphql', graphqlHTTP((req, res) => {
    const contextValue = context(req, res)

    return {
        graphiql: true,
        schema: schema,
        rootValue: root,
        context: contextValue
    };
}));
/*/

mongoose.connect(
    'mongodb+srv://maksimso:iqCHTLCNCkaO0QSN@cluster0.pff0xlz.mongodb.net/blog?retryWrites=true&w=majority'
).then(() => console.log('DB Ok'))
.catch((err) => console.log('DB error ', err))

//чтобы всё работало добавь свою бд

app.post('/posts', checkAuth, Validations.postValidation, validationErrors.validationErrors, postController.create)
app.get('/posts', checkAuth, postController.getAll)
app.get('/tags', checkAuth, postController.getTags)
app.get('/posts/:id', checkAuth, postController.getOne)
app.delete('/posts/:id', checkAuth, postController.getRemove)
app.patch('/posts/:id', checkAuth, Validations.updateValidation, validationErrors.validationErrors, postController.update)

app.post('/create/comment', checkAuth, postController.createComment)
app.post('/delete/comment', checkAuth, postController.removeComment)

app.post('/upload', upload.single('file'), (req, res) => {
    res.json({
        url: req.file.originalname,
        path: `http://localhost:4444/upload/${req.file.originalname}`
    })
})
app.get('/user/:id', checkAuth, userController.getUser)
app.post('/user/img', checkAuth, userController.avatarUser)
app.post('/user/backgroundProfile', checkAuth, userController.backgroundProfile)

app.post('/user/text', userController.changeText)

app.post('/chanel/subcribe', checkAuth, userController.subscribeUser)
app.post('/chanel/unsubcribe', checkAuth, userController.unSubscribeUser)

app.post('/auth/login', Validations.loginValidation, userController.login)
app.get('/auth/me', checkAuth, userController.getMe)
app.post('/auth/register', Validations.registerValidation, validationErrors.validationErrors, userController.register)


app.post('/send/message', userController.sendMsgSupport)

app.listen(4444, (err) => {
    if(err){
        return console.log(err)
    }
    console.log('Сервер запущен...')
})

