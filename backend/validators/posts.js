import Joi from 'joi'

const validate = {
  create: (req, res, next) => {
      const schema = Joi.object({
        title: Joi.string().required(),
      }).strict()
  
      const payload = schema.validate(req.body)
  
      if (payload.error) {
        return APIResponses.unprocessableEntity(res, payload.error.message)
      }
  
      next()
  },    
}

export default validate