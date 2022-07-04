import { Sequelize } from 'sequelize'
import sequelize from '#config/database.js'

const { DataTypes } = Sequelize

class RoleUser extends Sequelize.Model {

  static associate(models) {
    // define association here
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

RoleUser.init({
  role_id: DataTypes.INTEGER,
  user_id: DataTypes.INTEGER,
}, {
  sequelize,
  modelName: 'role_users',
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})


export default RoleUser