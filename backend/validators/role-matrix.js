import Joi from 'joi'

const validate = {
  create: async (req, res, next) => {
    try {
      const checkRole = async (id) => {
        const role = await roleModel.findAll({
          where: {
            id: id
          }
        })
        if (!role.length) {
          throw new Error('Role Does Not Exists')
        }            
      }
  
      const checkPermission = async (id) => {
        const role = await permissionModel.findAll({
          where: {
            id: id
          }
        })
        if (!role.length) {
          throw new Error('Permission Does Not Exists')
        }            
      }

      const schema = Joi.object({
        role_id: Joi.number().integer().required().external(checkRole),
        permission_id: Joi.number().integer().required().external(checkPermission),
      }).strict()
  
      const payload = await schema.validateAsync(req.body)
  
      if (payload.error) {
        throw new Error(payload.error.message)
      }
  
      next()        
    } catch (error) {
      return APIResponses.serverError(res, error.message)        
    }
  },
}

export default validate