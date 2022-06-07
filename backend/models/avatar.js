import { Sequelize } from 'sequelize'
import sequelize from './../config/database.js'

const { DataTypes } = Sequelize

class Avatar extends Sequelize.Model {

  static associate(models) {
    if (!this.hasAlias('user')) {
      this.belongsTo(userModel, {
        foreignKey: 'user_id',
        as: 'user',
      })
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

Avatar.init({
  user_id: DataTypes.INTEGER,
  mimetype: DataTypes.STRING,
  size: DataTypes.INTEGER,
  path: DataTypes.STRING
}, {
  sequelize,
  // modelName: 'avatars',
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})


export default Avatar