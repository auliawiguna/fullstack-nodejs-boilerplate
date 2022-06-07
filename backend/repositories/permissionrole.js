import permissionrole from './../models/permissionrole.js'

class Permissionrole {
    addPermissionRole = async(permissionId, roleId) => {
        await permissionrole.create({
            permission_id: permissionId,
            role_id: roleId,
        })
        let save = await permissionrole.updateOrCreate({
            where: {
                permission_id: permissionId,
                role_id: roleId,
            }
        }, {
            permission_id: permissionId,
            role_id: roleId,
    })
    }
}

export default Permissionrole