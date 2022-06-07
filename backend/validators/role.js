import Joi from 'joi'
import { Op } from 'sequelize'

const validate = {
    create: async (req, res, next) => {
        try {
          const uniqueRole = async (name) => {
            const user = await roleModel.findOne({
              where: {
                name: name
              }
            })
            if (user) {
              throw new Error('Role Already Exists')
            }
          }
          const schema = Joi.object({
            name: Joi.string().required().external(uniqueRole),
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
  
    update: async (req, res, next) => {
      try {
        const uniqueRole = async (name) => {
          const user = await roleModel.findOne({
            where: {
              name: name,
              id: {
                [Op.ne] : req.params.id
              }
            }
          })
          if (user) {
            throw new Error('Role Already Exists')
          }
        }
        const schema = Joi.object({
          name: Joi.string().required().external(uniqueRole),
        }).strict()
    
        const payload = await schema.validateAsync(req.body)
    
        if (payload.error) {
          throw new Error(payload.error.message)
        }
    
        next()          
      } catch (error) {
        return APIResponses.unprocessableEntity(res, error.message)                
      }
    }
}

export default validate