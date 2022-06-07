import Joi from 'joi'

const validate = {
    create: (req, res, next) => {
        const schema = Joi.object({
          device_name: Joi.string().required(),
          email: Joi.string().email({ tlds: { allow: false } }),
          password: Joi.string().required(),
        }).strict()
    
        const payload = schema.validate(req.body)
    
        if (payload.error) {
          return APIResponses.unprocessableEntity(res, payload.error.message)
        }
    
        next()
      },    
}

export default validate