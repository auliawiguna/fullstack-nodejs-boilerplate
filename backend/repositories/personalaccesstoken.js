import { Op } from 'sequelize'

/**
 * Handle database operations on Avatar Model
 */
class Personalaccesstoken {
    invalidatedOtherToken= async (userId, currentToken) => {
        const deleteOtherTokens = await personalaccesstokenModel.destroy({
            where: {
                token: {
                    [Op.ne] : currentToken
                },                
                user_id: userId
            }
        })

        return deleteOtherTokens
    }
}

export default Personalaccesstoken