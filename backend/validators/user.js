import Joi from 'joi'
import { Op } from 'sequelize'

const validate = {
    create: async (req, res, next) => {
      try {
        const uniqueEmail = async (email) => {
          const user = await userModel.findOne({
            where: {
              email: email
            }
          })
          if (user) {
            throw new Error('Email Already Exists')
          }
        }
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
    
        const schema = Joi.object({
          first_name: Joi.string().required(),
          last_name: Joi.string().required(),
          role_id: Joi.array().required().external(checkRole),
          email: Joi.string().required().email({ tlds: { allow: false } }).external(uniqueEmail),
          password: Joi.string().required(),
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
    validateTokenAuth: async (req, res, next) => {
      const schema = Joi.object({
        token: Joi.required(),
      }).strict()
  
      const payload = schema.validate(req.body)
  
      if (payload.error) {
        return APIResponses.unprocessableEntity(res, payload.error.message)
      }
  
      next()
    },        
    signUp: async (req, res, next) => {
      try {
        const uniqueEmail = async (email) => {
          const user = await userModel.findOne({
            where: {
              email: email
            }
          })
          if (user) {
            throw new Error('Email Already Exists')
          }
        }
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
    
        const schema = Joi.object({
          first_name: Joi.string().required(),
          last_name: Joi.string().required(),
          email: Joi.string().required().email({ tlds: { allow: false } }).external(uniqueEmail),
          password: Joi.string().required(),
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
    validateToken: async (req, res, next) => {
      const schema = Joi.object({
        token: Joi.number().integer().required(),
      }).strict()
  
      const payload = schema.validate(req.body)
  
      if (payload.error) {
        return APIResponses.unprocessableEntity(res, payload.error.message)
      }
  
      next()
    },  
    validateForgetPassword: async (req, res, next) => {
      const schema = Joi.object({
        email: Joi.string().required().email({ tlds: { allow: false } }),
      }).strict()
  
      const payload = schema.validate(req.body)
  
      if (payload.error) {
        return APIResponses.unprocessableEntity(res, payload.error.message)
      }
  
      next()
    },
    resetPassword: async (req, res, next) => {
      const schema = Joi.object({
        email: Joi.string().required().email({ tlds: { allow: false } }),
        token: Joi.number().integer().required(),
        password: Joi.string().required(),
      }).strict()
  
      const payload = schema.validate(req.body)
  
      if (payload.error) {
        return APIResponses.unprocessableEntity(res, payload.error.message)
      }
  
      next()
    },
    update: async (req, res, next) => {
      try {
        const uniqueEmail = async (email) => {
          const user = await userModel.findOne({
            where: {
              email: email,
              id: {
                [Op.ne] : req.params.id
              }
            }
          })
          if (user) {
            throw new Error('Email Already Exists')
          }
        }
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
        const schema = Joi.object({
          first_name: Joi.string().required(),
          last_name: Joi.string().required(),
          role_id: Joi.array().required().external(checkRole),
          email: Joi.string().required().email({ tlds: { allow: false } }).external(uniqueEmail),
          password: Joi.string().allow(null, ''),
        }).strict()
    
        const payload = await schema.validateAsync(req.body)
    
        if (payload.error) {
          throw new Error(payload.error.message)
        }
    
        next()          
      } catch (error) {
        return APIResponses.unprocessableEntity(res, error.message)                
      }
    },
    profileUpdate: async (req, res, next) => {
      try {
        const uniqueEmail = async (email) => {
          if (!email) {
            return
          }
          const user = await userModel.findOne({
            where: {
              email: email,
              id: {
                [Op.ne] : req.userData.id
              }
            }
          })
          if (user) {
            throw new Error('Email Already Exists')
          }
        }
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
        const isOldPasswordValid = async (pass) => {
          if (!pass) {
            return
          }
          const user = await userModel.findOne({
            where: {
              id: req.userData.id
            }
          })
          if (!user) {
            throw new Error('User does not exists')
          }
          const checkPassword = await hashingHelper.compare(pass, user.password)
          if (!checkPassword) {
            throw new Error(`Old password is incorrect`)
          }
        }

        const schema = Joi.object({
          first_name: Joi.string(),
          last_name: Joi.string(),
          email: Joi.string().email({ tlds: { allow: false } }).external(uniqueEmail),
          password: Joi.string().allow(null),
          password_confirmation: Joi.string().allow(null).when('password', {is: Joi.exist(), then: Joi.valid(Joi.ref('password')).required(), otherwise: Joi.optional()}),
          old_password: Joi.string().allow(null).when('password', {is: Joi.exist(), then: Joi.required().external(isOldPasswordValid), otherwise: Joi.optional()}),
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