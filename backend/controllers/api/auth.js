import dotenv from 'dotenv'
import _ from 'lodash'
export default class AuthController {
    /**
     * Handle user sign up
     *
     * @param   Request  req
     * @param   Response  res
     *
     * @return  {mixed}
     */
     signUp = async (req, res) => {
        const  { first_name, last_name, email, password } = req.body
        try {
            let user = await userModel.findOne({
                where: {
                    email: email
                }
            })
            if (user !== null) {
                return APIResponses.unprocessableEntity(res, "Account already exists")
            } else {
                let token = stringHelper.randomNumber().toString()
                user = await userModel.create({
                    first_name       : first_name, 
                    last_name        : last_name, 
                    email            : email, 
                    password         : hashingHelper.createHash(password),
                    validation_token : hashingHelper.createSha256Hash(token)
                })

                if (typeof user.id != 'undefined') {
                    //Send mail
                    await notificationsHelper.registrationEmail(email, token, first_name)

                    return APIResponses.success(res, user, 'Success')            
                } else {
                    return APIResponses.unprocessableEntity(res, user)
                }
            }
        } catch (error) {
            return APIResponses.serverError(res, error.message)
        }
    }

    /**
     * Handle user sign in
     *
     * @param   Request  req
     * @param   Response  res
     *
     * @return  {mixed}
     */
     signIn = async (req, res) => {
        const  { email, password, device_name } = req.body
        try {
            // userModel.associate()
            let user = await userRepository.findByEmailForLogin(email)

            if (user === null) {
                return APIResponses.unprocessableEntity(res, "Account does not exists")
            } else {
                const checkPassword = hashingHelper.compare(password, user.password)
                if (!checkPassword) {
                    return APIResponses.unprocessableEntity(res, "Incorrect credential")                    
                }

                const token = await userModel.newToken(device_name, user.id)
                return APIResponses.success(res, {
                    token: token.plainTextToken,
                    user: {
                        name: `${user.first_name} ${user.last_name}`,
                        id: user.id,
                        email: user.email,
                        roles: user.roles ?? []
                    },
                }, 'Success')            
            }
        } catch (error) {
            return APIResponses.serverError(res, error.message)
        }
    }

    /**
     * Handle user sign out
     *
     * @param   Request  req
     * @param   Response  res
     *
     * @return  {mixed}
     */
    signOut = async (req, res) => {
        try {
            const token = await personalaccesstokenModel.findOne({
                where: {
                    token: req.currentToken,
                    user_id: req.userData.id
                }
            })
            if (token==null) {
                return APIResponses.notFound(res, 'Token not found')                
            } else {
                const deleteToken = await personalaccesstokenModel.destroy({
                    where: {
                        token: req.currentToken,
                        user_id: req.userData.id
                    }
                })
                
                if (deleteToken==1) {
                    return APIResponses.success(res, deleteToken, 'Sign Out')                    
                } else {
                    return APIResponses.serverError(res, 'An error occured')                    
                }
            }

        } catch (error) {
            return APIResponses.serverError(res, error.message)
        }        
    }

    /**
     * Finalise email changes and then redirect to frontend
     *
     * @param   Request  req
     * @param   Response  res
     *
     * @return  {mixed}
     */    
    finaliseEmailChange = async (req, res) => {
        try {
            dotenv.config()

            let { token } = req.params

            const validateToken = await changeemailModel.findOne({
                where: {
                    token: token
                }
            })

            if (validateToken==null) {
                return APIResponses.notFound(res, 'Invalid Request')
            } else {
                const changeEmail = await SEQUELIZE.transaction(async (t) => {
                    const user = await userModel.update({
                        email: validateToken.new_email
                    }, {
                        where: {
                            id: validateToken.user_id
                        }
                    })
                    const deleteToken = await changeemailModel.destroy({
                        where: {
                            token: token,
                        }
                    })
                    return user
                })
        
                
                if (changeEmail==1) {
                    return res.redirect(process.env.FRONTEND_URL)
                } else {
                    return APIResponses.serverError(res, 'An error occured')                    
                }
            }

        } catch (error) {
            return APIResponses.serverError(res, error.message)
        }             
    }

    /**
     * Handle user validate account
     *
     * @param   Request  req
     * @param   Response  res
     *
     * @return  {mixed}
     */
    validate = async (req, res) => {
        let { token } = req.body
        try {
            token = token.toString()
            // userModel.associate()
            let user = await userModel.findOne({
                where: {
                    validation_token: hashingHelper.createSha256Hash(token)
                }
            })

            if (user === null) {
                return APIResponses.unprocessableEntity(res, "Token does not exists")
            } else {
                user.validation_token = ''
                user.validated_at = Math.floor(new Date().getTime() / 1000)
                await user.save()
        
                return APIResponses.success(res, user, 'Success')
            }
        } catch (error) {
            return APIResponses.serverError(res, error.message)
        }        
    }

    /**
     * Validate token in every request
     *
     * @param   Request  req
     * @param   Response  res
     *
     * @return  {mixed}
     */
    validateAuth = async (req, res) => {
        let { token } = req.body
        try {
            token = token.toString()
            let tokenAuth = await personalaccesstokenModel.findToken(token, req)
            if (tokenAuth === null || !tokenAuth.user || !tokenAuth.token) {
                return APIResponses.unAuthorized(res, "Unauthorised")
            } else {
                let user = await userRepository.findByEmailForLogin(tokenAuth.user.email)
                return APIResponses.success(res, {
                    token: token,
                    user: {
                        name: user.name,
                        id: user.id,
                        validated_at: user.validated_at,
                        email: user.email,
                        roles: user.roles ?? []
                    },
                }, 'Success')            
            }
        } catch (error) {
            return APIResponses.serverError(res, error.message)
        }
    }

    /**
     * Send token to reset password
     *
     * @param   Request  req
     * @param   Response  res
     *
     * @return  {mixed}
     */
    forgotPassword = async (req, res) => {
        let { email } = req.body
        try {
            let user = await userModel.findOne({
                where: {
                    email: email
                }
            })

            if (user === null) {
                return APIResponses.unprocessableEntity(res, "Email does not exists")
            } else {
                let tokenPassword = stringHelper.randomNumber().toString()

                let hashedPassword = hashingHelper.createSha256Hash(tokenPassword)

                let updatedData = {
                    token: hashedPassword,
                    email: email,
                    user_id: user.id,
                    expired_at: Math.floor(Date.now() / 1000) + 3600
                }
        
                let token = await forgetpasswordtokenModel.updateOrCreate({
                    where: {
                        user_id: user.id
                    }
                }, updatedData) 

                // //Send mail
                await notificationsHelper.forgotPassword(email, tokenPassword, user.first_name)
                
                return APIResponses.success(res, updatedData, 'Success')
            }
        } catch (error) {
            return APIResponses.serverError(res, error.message)
        }        
    }    

    /**
     * Handle reset password
     *
     * @param   Request  req
     * @param   Response  res
     *
     * @return  {mixed}
     */
     resetPassword = async (req, res) => {
        let { token, email, password } = req.body
        try {
            token = token.toString()
            // userModel.associate()
            let user = await forgetpasswordtokenModel.findOne({
                where: {
                    token: hashingHelper.createSha256Hash(token),
                    email: email
                }
            })

            if (user === null) {
                return APIResponses.unprocessableEntity(res, "Token does not exists")
            } else {
                if (user.expired_at < Math.floor(new Date().getTime() / 1000) ) {
                    return APIResponses.unprocessableEntity(res, "Token is expired")                    
                }

                await forgetpasswordtokenModel.destroy({
                    where: {
                        email: email
                    }
                })   
                
                const updatedUser = await userModel.update({
                    password: hashingHelper.createHash(password)
                }, {
                    where: {
                        email: email
                    }
                })
                    
                return APIResponses.success(res, updatedUser, 'Success')
            }
        } catch (error) {
            return APIResponses.serverError(res, error.message)
        }        
    }

    /**
     * Get reset password token
     *
     * @param   Request  req
     * @param   Response  res
     *
     * @return  {mixed}
     */    
    getResetPassword = async (req, res) => {
        try {
            dotenv.config()

            let { token } = req.params

            const validateToken = await forgetpasswordtokenModel.findOne({
                where: {
                    token: token
                }
            })

            if (validateToken==null) {
                return APIResponses.notFound(res, 'Not Found Exception')
            } else {
                return APIResponses.success(res, validateToken, 'Success')
            }

        } catch (error) {
            return APIResponses.serverError(res, error.message)
        }             
    }    
}