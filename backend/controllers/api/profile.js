
export default class ProfileController {
    /**
     * Handle update profile
     *
     * @param   Request  req
     * @param   Response  res
     *
     * Security concern based on Open Bug Bounty :
     * - If password is changed, all other tokens of current user must be invalidated
     * - If email is changed, do not immediate change the email, use another validation feature
     * - Send notification email to current user that his/her profile has been changed
     * 
     * @return  {mixed}
     */
     update = async (req, res) => {
        const userData = req.userData

        try {
            let body = req.body
            let passwordIsChanged = false
            if (body.password) {
                body.password = hashingHelper.createHash(body.password)
                passwordIsChanged = true
            } else {
                delete(body.password)
            }

            //If email is changed, send notification
            let emailIsChanged = false
            let newEmail
            if (body.email) {
                newEmail = body.email
                delete body.email
                emailIsChanged = true
            }
    
            const update = await SEQUELIZE.transaction(async (t) => {
                let save = await userModel.update(body, {
                    where: {
                        'id': userData.id
                    }
                })
                
                return save
            })

            let changedAttributes = `<ul>`
            for (const attribute of Object.keys(body)) {
                changedAttributes = changedAttributes + `<li>${attribute}</li>`
            }  
            changedAttributes = changedAttributes + '</ul>'
            
            if (update==1) {
                //Send notification
                await notificationsHelper.changedProfile(userData.email, userData.first_name, changedAttributes)

                if (emailIsChanged) {
                    await userRepository.initiateChangeEmail(userData.id, newEmail ?? '')
                }

                //invalidated other tokens
                if (passwordIsChanged) {
                    const deleteOtherTokens = await personalaccesstokenRepository.invalidatedOtherToken(req.userData.id, req.currentToken)
                }

                return APIResponses.success(res, {update: update, is_password_changed: passwordIsChanged}, 'Success')
            } else {
                return APIResponses.unprocessableEntity(res, 'Failed')
            }             
        } catch (error) {
            return APIResponses.serverError(res, error.message)
        }
    }

    /**
     * Handle upload new user's avatar and remove the user's exif metadata
     *
     * @param   Request  req
     * @param   Response  res
     *
     * @return  {mixed}
     */
    changeAvatar = async (req, res) => {
        try {
            await imageHelper.uploadFile(req, res)
            if (req.file == undefined) {
                return APIResponses.unprocessableEntity(res, 'Please upload a file')
            }
            await imageHelper.removeExifMetadata(req.file)
            const newAvatar = await avatarRepository.updateUserAvatar(req.userData.id, req.file)
            
            return APIResponses.success(res, newAvatar, 'Success')
        } catch (error) {
            return APIResponses.serverError(res, error.message)
        }
    }

    /**
     * Handle URL to stream user's avatar since we do not publish "/uploads" folder
     *
     * @param   Request  req
     * @param   Response  res
     *
     * @return  {mixed}
     */
    streamAvatar = async (req, res) => {
        try {
            const { id } = req.params
            const avatar = await avatarModel.findByPk(id)
            if (avatar==null) {
                return APIResponses.notFound(res, "Avatar not found")                
            } else {
                let imagePath = BASE_PATH + avatar.path
                return res.sendFile(imagePath)
            }
        } catch (error) {
            return APIResponses.serverError(res, error.message)
        }
    }

    /**
     * Get current user's active sessions
     *
     * @param   Request  req
     * @param   Response  res
     *
     * @return  personalaccesstokenModel
     */
    activeSessions = async (req, res) => {
        try {
            const userData = req.userData

            const tokens = await personalaccesstokenModel.findAll({
                where: {
                    user_id: userData.id
                }
            })

            return APIResponses.success(res, tokens, 'Success')
        } catch (error) {
            return APIResponses.serverError(res, error.message)
        }
    }

    /**
     * Get active profiles
     *
     * @param   Request  req
     * @param   Response  res
     *
     * @return  userModel
     */
     activeProfile = async (req, res) => {
        try {
            return APIResponses.success(res, req.userData, 'Success')
        } catch (error) {
            return APIResponses.serverError(res, error.message)
        }
    }    
}