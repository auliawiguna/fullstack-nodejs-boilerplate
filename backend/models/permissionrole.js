import { Sequelize } from 'sequelize'
import sequelize from '#config/database.js'

const { DataTypes } = Sequelize

class PermissionRole extends Sequelize.Model {

  static associate(models) {
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

PermissionRole.init({
  role_id: DataTypes.INTEGER,
  permission_id: DataTypes.INTEGER,
}, {
  sequelize,
  modelName: 'permission_roles',
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})


export default PermissionRole