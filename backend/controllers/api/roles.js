/**
 * Role Controller
 */
 export default class RoleController {
    /**
     * Display resources
     *
     * @param   Request  req
     * @param   Result  res
     * 
     * HTTP Method : GET
     * Changelog :
     *
     * @return  JSON
     */
    index = async (req, res) => {
        let limit = req.query.per_page ?? 10
        let offset = 0
        let page = req.query.page ?? 1
        offset = limit * (page - 1);

        const posts = await roleModel.findAndCountAll({
            limit: parseInt(limit),
            offset: parseInt(offset),
            include : 'permissions'
        })

        posts.pages = Math.ceil(posts.count / limit)

        return APIResponses.success(res, posts, 'Success')
    }

    /**
     * Show individual resource based on param ID
     *
     * @param   Request  req
     * @param   Result  res
     * 
     * HTTP Method : GET
     * Changelog :
     *
     * @return  JSON
     */
     show = async (req, res) => {
        let { id } = req.params
        const record = await roleModel.findByPk(id)

        if (record) {
            return APIResponses.success(res, record, 'Success')
        } else {
            return APIResponses.notFound(res, 'Not Found')            
        }
    }

    /**
     * Create new individual resource based on param ID
     *
     * @param   Request  req
     * @param   Result  res
     * 
     * HTTP Method : POST
     * Changelog :
     *
     * @return  JSON
     */
     store = async (req, res) => {
        let body = req.body
        let save = await roleModel.create(body)

        if (save) {
            return APIResponses.success(res, save, 'Success')
        } else {
            return APIResponses.unprocessableEntity(res, 'Failed')
        }
    }

    /**
     * Update existing individual resource based on param ID
     *
     * @param   Request  req
     * @param   Result  res
     * 
     * HTTP Method : PUT
     * Changelog :
     *
     * @return  JSON
     */
     update = async (req, res) => {
        const { id } = req.params

        try {
            let body = req.body
    
            let save = await roleModel.update(body, {
                where: {
                    'id': id
                }
            })

            if (save==1) {
                return APIResponses.success(res, save, 'Success')
            } else {
                return APIResponses.unprocessableEntity(res, 'Failed')
            }             
        } catch (error) {
            return APIResponses.serverError(res, error.message)
        }

    }

    /**
     * Delete existing individual resource based on param ID
     *
     * @param   Request  req
     * @param   Result  res
     * 
     * HTTP Method : DELETE
     * Changelog :
     *
     * @return  JSON
     */
     destroy = async (req, res) => {
        try {
            let { id } = req.params 

            const deleteRecord = await roleModel.destroy({
                where : {
                    'id' : id
                }
            })        

            if (deleteRecord) {
                return APIResponses.success(res, deleteRecord, 'Deleted')
            } else {
                return APIResponses.unprocessableEntity(res, 'Failed')
            }             
        } catch (error) {
            return APIResponses.serverError(res, error.message)
        }
    }
}