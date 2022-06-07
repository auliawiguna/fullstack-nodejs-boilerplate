/**
 * Class PostGroup
 */
export default class PostGroupController {
    index = async (req, res) => {
        // postgroupModel.associate()
        const posts = await postgroupModel.findAll({
            include : [
                {
                    model: postsModel,
                    foreignKey: 'post_id'        
                }                
            ]
        })

        return APIResponses.success(res, posts, 'Success')
    }

    show = async (req, res) => {
        const { id } = req.params
        let record = await postgroupModel.findByPk(id)
        if (record) {
            return APIResponses.success(res, record, 'Success')
        } else {
            return APIResponses.notFound(res, 'Not Found')            
        }
    }

    store = async (req, res) => {
        let save = await postgroupModel.updateOrCreate({
            where: {
                name: req.body.name
            }
        }, req.body)
        if (typeof save.id != 'undefined') {
            return APIResponses.success(res, save, 'Success')            
        } else {
            return APIResponses.unprocessableEntity(res, save)
        }
    }

    update = async (req, res) => {
        const { id } = req.params

        try {
            let save = await postgroupModel.update(req.body, {
                where: {
                    'id': id
                }
            })

            if (save) {
                return APIResponses.success(res, save, 'Success')            
            } else {
                return APIResponses.unprocessableEntity(res, save)
            }    
        } catch (error) {
            return APIResponses.serverError(res, error.message)
        }
    }

    destroy = async (req, res) => {
        try {
            let { id } = req.params 
            const deleteRecord = await postgroupModel.destroy({
                where: {
                    'id': id
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