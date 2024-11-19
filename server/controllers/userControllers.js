
import jwt from 'jsonwebtoken'
import userModel from '../models/user.js'
import bcrypt from 'bcrypt'


export const login = async (req, res) => {
    try{
        
        const user = await userModel.findOne({email: req.body.email})

        if(!user){
            return res.status(404).json({
                message: 'неверный email'
            })
        }

        const validPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if(!validPassword){
            return res.status(404).json({
                message: 'пароль неверный'
            })
        }

        const token = jwt.sign(
            {
                _id: user._id
            },
            'secretMax392',
            {
                expiresIn: '30d'
            }
        )

        const {passwordHash, ...result} = user._doc


        res.json({
            ...result,
            token
        })
    }
    catch(error){
        return res.status(500).json({
            message: 'авторизация не пройдена'
        })
    }
}

export const register = async (req, res) => {
    try{

        const checkUser = await userModel.findOne({fullName: req.body.fullName})

        if(checkUser){
            return res.status(404).json({
                message: 'имя занято'
            })
        }
    
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        
        const doc = new userModel({
            fullName: req.body.fullName,
            email: req.body.email,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash
        })
    
        const user = await doc.save()

        const token = jwt.sign(
            {
                _id: user._id
            },
            'secretMax392',
            {
                expiresIn: '30d'
            }
        )

        const {passwordHash, ...result} = user._doc


        res.json({
            ...result,
            token
        })
    }
    catch(error){
        res.status(500).json({
            message: 'не удалось зарегистрироваться'
        })
    }
}


export const getMe = async (req, res) => {

    try {
        const user = await userModel.findById(req.userId);

        if (!user) {
            throw new Error('User not found');
        }

        const { passwordHash, ...result } = user._doc;


        return res.json({
            ...result
        });
    } catch(err){
        res.status(404).json({
            msg: 'ошибка при получении'
        })
    }
}


export const avatarUser = async (req, res) => {
    try{
        const changeAvatar = await userModel.findByIdAndUpdate(
            req.body.id,
            { avatarUrl: req.body.avatar},
            { new: true }
          );
        
        res.json(changeAvatar)
    }
    catch(err){
        res.status(404).json({
            msg: 'ошибка при смене аватарки'
        })
    }
}

export const backgroundProfile = async (req, res) => {
    try{
        const changeBackground = await userModel.findByIdAndUpdate(
            req.body.id,
            {backgroundProfile: req.body.backgroundProfile},
            { new: true }
          );
        
        res.json(changeBackground)
    }
    catch(err){
        res.status(404).json({
            msg: 'ошибка при смене аватарки'
        })
    }
}

export const getUser = async(req, res) => {
    try{
        const userID = req.params.id

        const user = await userModel.findOne({_id: userID}).exec()

        if(!user){
            return res.status(404).json({
                message: 'пользователь не найден'
            })
        }

        return res.json(user)
    }
    catch(err){
        res.status(500).json({
            message: 'ошибка при получении пользователя'
        })
    }
}

export const subscribeUser = async(req, res) => {
    try {
        if (!req.body.chanelID || !req.body.userID) {
            return res.status(400).json({
                message: 'не коректный запрос'
            });
        }

        const chanel = await userModel.findByIdAndUpdate(
            req.body.chanelID,
            {$inc: {countSubs: 1}},
            {new: true}
        );

        if (!chanel) {
            return res.status(404).json({
                message: 'Канал не найден'
            });
        }

        const changeUser = await userModel.findByIdAndUpdate(
            req.body.userID,
            { $push: { 'subscribes': { 
                fullName: chanel.fullName, 
                userID: req.body.chanelID,
                avatarUrl: chanel.avatarUrl 
            }},

            }, 
            { new: true }
        );

        if (!changeUser) {
            return res.status(500).json({
                message: 'не удалось добавить подписку'
            });
        }

        res.json(changeUser);
    } catch (err) {
        res.status(500).json({
            message: 'Не удалось подписаться на канал'
        });
    }
}


export const unSubscribeUser = async(req, res) => {
    try {
        if (!req.body.chanelID || !req.body.userID) {
            return res.status(400).json({
                message: 'не коректный запрос'
            });
        }

        const chanel = await userModel.findByIdAndUpdate(
            req.body.chanelID,
            {$inc: {countSubs: -1}},
            {new: true}
        );

        if (!chanel) {
            return res.status(404).json({
                message: 'Канал не найден'
            });
        }

        const changeUser = await userModel.findByIdAndUpdate(
            req.body.userID,
            {$pull: {subscribes: { 
                userID: req.body.chanelID
            }}}, 
            { new: true }
        );

        if (!changeUser) {
            return res.status(500).json({
                message: 'не удалось добавить подписку'
            });
        }

        res.json(changeUser);
    } catch (err) {
        res.status(500).json({
            message: 'Не удалось подписаться на канал'
        });
    }
}


export const changeText = async (req, res) => {
    try{
        if(!req.body.text || !req.body.userID){
            res.status(400).json({
                message: 'поля для запроса не указаны'
            })
        }

        const user = await userModel.findByIdAndUpdate(
            req.body.userID,
            {text: req.body.text},
            {new: true}
        )

        if(!user){
            res.status(404).json({
                message: 'ползователь не найден'
            })
        }


        res.json(user)

    }
    catch(err){
        res.status(500).json({
            message: 'не получилось редактировать текст'
        })
    }
}



export const sendMsgSupport = async (req, res) => {
    try {
        // Проверка наличия текста сообщения
        if (!req.body.text) {
            return res.status(400).json({
                message: 'данные не коректны'
            });
        }

        // Поиск пользователя по userID
        const user = await userModel.findById(req.body.userID);
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            });
        }

        let msg;

        // Проверка статуса и создание сообщения
        if (req.body.status === 'admin') {
            msg = {
                text: req.body.text,
                status: 'admin'
            };
        } else {
            msg = {
                text: req.body.text,
                status: 'user',
                fullName: req.body.fullName
            };
        }

        // Обновление пользователя и добавление сообщения в чат
        const send = await userModel.findByIdAndUpdate(
            req.body.userID,
            {
                $push: { 'chat': msg }
            },
            { new: true }
        );

        return res.json(send);

    } catch (err) {
        // Подробная информация об ошибке
        return res.status(500).json({
            message: 'ошибка при послании сообщения в поддержку',
        });
    }
}