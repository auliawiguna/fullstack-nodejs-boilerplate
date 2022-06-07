import fs from 'fs'
import { join } from 'path'

/**
 * Handle database operations on Avatar Model
 */
class Avatar {
    updateUserAvatar = async (userId, file) => {
        if (typeof file.originalname == 'undefined') {
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