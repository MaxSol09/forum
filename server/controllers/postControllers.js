import PostSchema from '../models/post.js'
import { flattenArray } from '../utils/flatten.js'
import { removeDuplicates } from '../utils/sort.js'

export const create = async (req, res) => {
    try{

        const doc = new PostSchema({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId
        })

        const post = await doc.save()

        res.json(post)
    }
    catch(err){
        return res.status(500).json({
            message: 'Пост не опубликовался'
        })
    }
}

export const getTags = async(req, res) => {
    try{
        const posts = await PostSchema.find()

        const result = posts.map(item => item.tags) 
        const flattenArr = flattenArray(result) //flattenArray служит для того чтобы массивы в массиве обьединить в один
        const filterTags = removeDuplicates(flattenArr) //removeDuplicates служит для удаления дубликатов из массивов и вывода самыъ 3 популярных значения

        res.json(filterTags)
    }
    catch(err){
        res.status(500).json({
            message: 'не удалось получить посты'
        })
    }
}

export const getAll = async(req, res) => {
    try{
        const posts = await PostSchema.find().populate({path: 'user', select: ['fullName', 'avatarUrl']}).exec()

        res.json(posts.reverse())
    }
    catch(err){
        res.status(500).json({
            message: 'не удалось получить посты'
        })
    }
}


export const getOne = async (req, res) => {
    try{
        const postId = req.params.id

        const doc = await PostSchema.findByIdAndUpdate(
            {
                _id: postId
            }, 
            {
                $inc: {viewCount: 1}
            }, 
            {
                returnDocument: 'after'
            }
    )


    if(!doc) {
        return res.status(404).json({
            message: 'пост не найден'
        })
    }

        return res.json(doc)
    }
    catch(err){
        return res.status(500).json({
            message: 'Ошибка при поиске статьи'
        })
    }
}


export const getRemove = async (req, res) => {
    try{
        const postId = req.params.id

        const doc = await PostSchema.findByIdAndDelete(
            {
                _id: postId
            }, 
            {
                returnDocument: 'after'
            }
    )


    if(!doc) {
        return res.status(404).json({
            message: 'статья не удаленна'
        })
    }

        return res.json({
            sucsess: true
        })
    }
    catch(err){
        return res.status(500).json({
            message: 'Ошибка при удалении этой статьи'
        })
    }
}



export const update = async (req, res) => {
    try{
        const postId = req.params.id

        const docUpdate = await PostSchema.findByIdAndUpdate(
            {
                _id: postId,
            },
            {
                text: req.body.text
            },
            {
                returnDocument: 'after'
            }
        )

        if(!docUpdate){
            return res.status(404).json({
                message: 'Не найденно'
            })
        }

        return res.json(docUpdate)
    }
    catch(err){
        res.status(500).json({
            message: 'Пост не измененн'
        })
    }
}


export const createComment = async (req, res) => {
    try{

        if(!req.body.fullName || !req.body.text){
            return res.status(404).json({
                message: 'не коректный запрос'
            })
        }

        const comment = await PostSchema.findByIdAndUpdate(
            req.body.postId,
            {$push: {'comments': {
                text: req.body.text, 
                fullName: req.body.fullName, 
                userID: req.body.userId,
                avatarUrl: req.body.avatar, 
                commentId: req.body.commentId}
            }}, 
            {new: true}
        )

        if (!comment) {
            return res.status(404).json({ message: 'Пост не найден' });
        }

        return res.json(comment)
    }
    catch(err){
        return res.status(500).json({
            message: 'ошибка в создание комментария '
        })
    }
}

export const removeComment = async (req, res) => {
    try {
        if (!req.body.postId || !req.body.commentId) {
            return res.status(400).json({ message: 'postId и commentId обязательны' });
        }

        const comment = await PostSchema.findByIdAndUpdate(
            req.body.postId,
            { $pull: { comments: { commentId: req.body.commentId }}},
            { new: true }
        );

        if (!comment) {
            return res.status(404).json({ message: 'Комментарий не найден или не удален' });
        }

        return res.json(
            {id: req.body.commentId}
        );
        
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'ошибка в удалении комментария' })
    }
}

