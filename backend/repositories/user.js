/**
 * Handle database operations on User Model
 */
class User {
    /**
     * Find a user by email
     *
     * @param   string  email  Email
     *
     * @return  userModel
     */
    findByEmailForLogin = async(email) => {
        let userReturn = await userModel.findOne({
            where: {
                email: email
            },
            include : [
                {
                    model: personalaccesstokenModel,
                    as: 'tokens'
                },
                {
                    model: roleModel,
                    as: 'roles',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: permissionModel,
                            through: permissionroleModel, 
                            as: 'permissions', 
                            foreignKey: 'role_id',
                            attributes: ['id', 'name']
                        }
                    ]
                }
                // 'roles.permissions'
            ]  
        })

        return userReturn
    }

    /**
     * Find user with its permissions
     *
     * @param   int  id  userModel.id
     *
     * @return  userModel
     */
    findById = async(id) => {
        let userReturn = await userModel.findOne({
            where: {
                id: id
            },
            include : [
                {
                    model: roleModel,
                    as: 'roles',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: permissionModel,
                            through: permissionroleModel, 
                            as: 'permissions', 
                            foreignKey: 'role_id',
                            attributes: ['id', 'name']
                        }
                    ]
                },
                'avatar'
                // 'roles.permissions'
            ]  
        })

        let userObj = {...userReturn.dataValues}

        let permissionIdArray = []
        let permissionNameArray = []
        for (const role of userObj.roles) {
            permissionNameArray = Array.prototype.concat(permissionNameArray, role.permissions.map(({name}) => name))
            permissionIdArray = Array.prototype.concat(permissionIdArray, role.permissions.map(({id}) => id))
        }
        userObj.roles_name = userObj.roles.map(({name}) => name)
        userObj.roles_id = userObj.roles.map(({id}) => id)
        userObj.permissions_name = permissionNameArray
        userObj.permissions_id = permissionIdArray
        userObj.avatar_url = typeof userObj.avatar.id != 'undefined' ? `/api/v1/profiles/stream-avatar/${userObj.avatar.id}` : ''

        return userObj
    }    

    /**
     * Check if particular user has particular roles
     *
     * @param   int  userId  userModel.id
     * @param   mixed  role    can be integer or array of integer
     *
     * @return  boolean
     */
    hasRole= async (userId, role) => {
        
    }

    /**
     * Flush user role
     *
     * @param   int  userId  userModel.id
     * @param   mixed  roleId  single integer roleModel.id OR array of integer roleModel.id
     *
     * @return  {[type]}          [return description]
     */
    flushRole= async (userId, roleId) => {
        await roleuserModel.destroy({
            where : {
                user_id : userId
            }
        })        

        if (Array.isArray(roleId)) {
            for (const id of roleId) {
                await roleuserModel.create({
                    user_id : userId,
                    role_id : id,
                })    
            }
        } else {
            await roleuserModel.create({
                user_id : userId,
                role_id : roleId,
            })
        }
    }

    /**
     * Add new role(s) to particular user
     *
     * @param   int  userId  userModel.id
     * @param   mixed  roleId  single integer roleModel.id OR array of integer roleModel.id
     *
     * @return  {[type]}          [return description]
     */
     addNewRole= async (userId, roleId) => {
        if (Array.isArray(roleId)) {
            for (const id of roleId) {
                await roleuserModel.create({
                    user_id : userId,
                    role_id : id,
                })    
            }
        } else {
            await roleuserModel.create({
                user_id : userId,
                role_id : roleId,
            })
        }
    }

    /**
     * Send email notification if user change his/her email address
     *
     * @param   int  userId    userModel.id
     * @param   string  newEmail  New email address
     *
     * @return  mixed
     */
    initiateChangeEmail= async (userId, newEmail) => {
        let user = await userModel.findByPk(userId)
        if (user.email!=newEmail) {
            await changeemailModel.destroy({
                where: {
                    user_id: userId
                }
            })

            let token = hashingHelper.createSha256Hash(stringHelper.random(6))
            await changeemailModel.create({
                user_id: userId,
                new_email: newEmail,
                token: token
            })

            //Send to old email
            return await notificationsHelper.changedEmail(user.first_name, user.email, newEmail, token)
        }

        return
    }
}

export default User