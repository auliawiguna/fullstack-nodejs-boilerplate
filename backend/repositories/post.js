import { Op } from "sequelize"

/**
 * Handle database operations on Role Model
 */
class Post {
    search = async(limit, offset, search) => {
        const param = {
            limit: parseInt(limit),
            offset: parseInt(offset),
        }

        if (search) {
            param.where = {
                title: {
                    [Op.like]: `%${search}%`
                }
            }
        }
        return await postModel.findAndCountAll(param)
    }

}

export default Post