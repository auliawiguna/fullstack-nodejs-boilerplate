import { Op } from "sequelize"

/**
 * Handle database operations on Role Model
 */
class Role {
    search = async(limit, offset, search) => {
        const param = {
            limit: parseInt(limit),
            offset: parseInt(offset),
            include : 'permissions'
        }

        if (search) {
            param.where = {
                name: {
                    [Op.like]: `%${search}%`
                }
            }
        }
        return await roleModel.findAndCountAll(param)
    }

}

export default Role