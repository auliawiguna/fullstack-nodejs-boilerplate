import fs from 'fs'
import { join } from 'path'
import _ from 'lodash'

/**
 * Handle database operations on Avatar Model
 */
class Avatar {
    updateUserAvatar = async (userId, file) => {
        if (_.isNil(file.originalname)) {
            return
        }
        const currentAvatar = await avatarModel.findOne({
            where: {
                user_id: userId
            }
        })

        if (currentAvatar != null) {
            let path = join(BASE_PATH, currentAvatar.path)
            try {
                fs.unlinkSync(path)
            } catch (error) {
                console.log('====================================')
                console.log(error.message)
                console.log('====================================')                    
            }
        }

        await avatarModel.destroy({
            where : {
                user_id : userId
            }
        })

        let newAvatar = await avatarModel.create({
            user_id : userId,
            size : file.size ?? 0,
            mimetype : file.mimetype ?? 0,
            path : file.path.replace(BASE_PATH, ''),
        })

        return newAvatar
    }
}

export default Avatar