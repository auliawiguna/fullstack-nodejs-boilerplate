import { Sequelize } from 'sequelize'
import sequelize from '#config/database.js'

const { DataTypes } = Sequelize
const PROTECTED_ATTRIBUTES = ['token']

class PersonalAccessToken extends Sequelize.Model {
  toJSON() {
    // hide protected fields
    const attributes = { ...this.get() }
    // eslint-disable-next-line no-restricted-syntax
    for (const a of PROTECTED_ATTRIBUTES) {
      delete attributes[a]
    }
    return attributes
  }

  static associate(models) {
    if (!this.hasAlias('owner')) {
      this.belongsTo(userModel, {
        foreignKey: 'user_id',
        as: 'owner',
        onDelete: 'CASCADE',
      })        
    }
  }

  static async findToken(authToken, req) {
    if (authToken) {
      let accessToken
      if (authToken.includes('|')) {
        let [id, token] = authToken.split('|')
        accessToken = await this.findOne({
          where: {
            token: hashingHelper.createSha256Hash(token),
            id: id
          },
          include: 'owner'
        })
      } else {
        let [id, token] = authToken.split('|', 2)
        let instance = await this.findByPk(id, {
          include: 'owner'
        })

        if (instance) {
          accessToken = hashingHelper.compareSha256Hash(instance.token, hashingHelper.createSha256Hash(authToken)) ? instance : null
        }
      }  
      
      if (!accessToken) {
        return {
          user  : null,
          token : null
        }                
      } else {
        accessToken.last_used_at = stringHelper.dateTimeNow()
        accessToken.last_ip_address = req.ip
        await accessToken.save()

        const completeUserData = await userRepository.findById(accessToken.owner.id)

        return {
          user  : completeUserData,
          token : accessToken.token
        }                
      }    
    }

    return {
      user  : null,
      token : null
    }
  }

  static async updateOrCreate (where, arrayItem) {
    const itemSearch = await this.findOne(where)

    if (!itemSearch) {
      const item = await this.create(arrayItem)
      return item
    }
  
    const update = await this.update(arrayItem, where)
    return itemSearch
  }
  
}

PersonalAccessToken.init({
  name: DataTypes.STRING,
  token: DataTypes.STRING,
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },  
  last_used_at: DataTypes.STRING,
  last_ip_address: DataTypes.STRING
}, {
  sequelize,
  modelName: 'personal_access_tokens',
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});


export default PersonalAccessToken