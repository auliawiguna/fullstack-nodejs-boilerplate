/**
 * Handle assign permission to a role
 */
export default class RoleMatrixController {
    /**
     * Index all permission matrix
     *
     * @param   Request  req
     * @param   Result  res
     *
     * @return  JSON
     */
     index = async (req, res) => {
        let save = await permissionroleModel.findAll()
        if (save) {
            return APIResponses.success(res, save, 'Success')
        } else {
            return APIResponses.unprocessableEntity(res, 'Failed')
        }
    }

    /**
     * Assign permission to a role
     *
     * @param   Request  req
     * @param   Result  res
     *
     * @return  JSON
     */
     assign = async (req, res) => {
        const  { role_id, permission_id } = req.body
        let save = await permissionroleModel.updateOrCreate({
            where: req.body
        }, req.body)
        if (save) {
            return APIResponses.success(res, save, 'Success')
        } else {
            return APIResponses.unprocessableEntity(res, 'Failed')
        }
    }

    /**
     * Delete permission to a role
     *
     * @param   Request  req
     * @param   Result  res
     *
     * @return  JSON
     */
    delete = async (req, res) => {
        const  { role_id, permission_id } = req.body
        try {
            const deleteRecord = await permissionroleModel.destroy({
                where : {
                    role_id : role_id,
                    permission_id : permission_id,
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