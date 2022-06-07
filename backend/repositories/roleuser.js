import roleuser from './../models/roleuser.js'

class Roleuser {
    addRole = async(userId, roleId) => {
        let save = await roleuser.updateOrCreate({
            where: {
                user_id: userId,
                role_id: roleId,
            }
        }, {
            user_id: userId,
            role_id: roleId,
        })
    }
}

export default Roleuser