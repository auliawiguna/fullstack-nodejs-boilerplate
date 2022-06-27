import { Op } from "sequelize"

class Permission {
    search = async(limit, offset, search) => {
        const param = {
            limit: parseInt(limit),
            offset: parseInt(offset),
            include : 'roles'
        }

        if (search) {
            param.where = {
                name: {
                    [Op.like]: `%${search}%`
                }
            }
        }
        return await permissionModel.findAndCountAll(param)
    }
}

export default Permission