/**
 * User Controller
 */
export default class UserController {
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

        const posts = await userModel.findAndCountAll({
            limit: parseInt(limit),
            offset: parseInt(offset),
            include : 'roles'
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
        const record = await userRepository.findById(id)

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
        body.password = hashingHelper.createHash(body.password)

        const create = await SEQUELIZE.transaction(async (t) => {
            let save = await userModel.create(body)

            await userRepository.addNewRole(save.id, req.body.role_id)
            
            return save
        })


        if (create) {
            return APIResponses.success(res, create, 'Success')
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
            console.log(body)
            if (body.password) {
                body.password = hashingHelper.createHash(body.password)                
            }
    
            const update = await SEQUELIZE.transaction(async (t) => {
                let save = await userModel.update(body, {
                    where: {
                        'id': id
                    }
                })

                await userRepository.flushRole(id, req.body.role_id)
                
                return save
            })

            if (update==1) {
                return APIResponses.success(res, update, 'Success')
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
            if (id==req.userData.id) {
                return APIResponses.unprocessableEntity(res, 'You are not allowed to delete yourself!')                
            }
            const deleteRecord = await userModel.destroy({
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