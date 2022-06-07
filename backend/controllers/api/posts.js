
import slugify from 'slugify'

export default class PostController {
    index = async (req, res) => {
        const posts = await postsModel.findAll({
            include : 'postgroups'
        })

        return APIResponses.success(res, posts, 'Success')
    }

    show = async (req, res) => {
        let { id } = req.params
        const record = await postsModel.findOne({
            where: {
                id: id
            },
            include : 'postgroups'
        })

        if (record) {
            return APIResponses.success(res, record, 'Success')
        } else {
            return APIResponses.notFound(res, 'Not Found')            
        }
    }

    store = async (req, res) => {
        let body = req.body
        body.slug = slugify(body.title, {
            lower: true,
            trim: true
        })
        let save = await postsModel.create(body)

        if (save) {
            return APIResponses.success(res, save, 'Success')
        } else {
            return APIResponses.unprocessableEntity(res, 'Failed')
        }
    }

    update = async (req, res) => {
        const { id } = req.params

        try {
            let body = req.body
            body.slug = slugify(body.title, {
                lower: true,
                trim: true
            })
    
            let save = await postsModel.update(body, {
                where: {
                    'id': id
                }
            })

            if (save) {
                return APIResponses.success(res, save, 'Success')
            } else {
                return APIResponses.unprocessableEntity(res, 'Failed')
            }             
        } catch (error) {
            return APIResponses.serverError(res, error.message)
        }

    }

    destroy = async (req, res) => {
        try {
            let { id } = req.params 
            const deleteRecord = await postsModel.destroy({
                where : {
                    'id' : id
                }
            })        

            if (deleteRecord) {
                return APIResponses.success(res, deleteRecord, 'Deleted')
            } else {
                return APIResponses.unprocessableEntity(redeleteRecords, 'Failed')
            }             
        } catch (error) {
            return APIResponses.serverError(res, error.message)
        }
    }
}