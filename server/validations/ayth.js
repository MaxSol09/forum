import { body } from "express-validator";

export const registerValidation = [
    body('email', 'email указан не коректно').isEmail(),
    body('fullName', 'имя должно состоять минимум из 3 символов').isLength({min: 3}),
    body('password', 'пароль должнен состоять минимум из 5 символов').isLength({min: 5}),
    body('avatarUrl', 'неверная ссылка на аватарку').optional().isURL()
]


export const loginValidation = [
    body('email', 'email указан не коректно').isEmail(),
    body('password', 'пароль должнен состоять минимум из 5 символов').isLength({min: 5}),
]

export const postValidation = [
    body('title', 'Введите название стать. Минимум 3 символа').isLength({min: 3}).isString(),
    body('text', 'Введите текст статьи. Минимум 10 символов').isLength({min: 10}).isString(),
    body('tags', 'Неверный формат тэгов').optional().isArray(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString()
]

export const updateValidation = [
    body('text', 'Введите текст статьи. Минимум 10 символов').isLength({min: 10}).isString()
]