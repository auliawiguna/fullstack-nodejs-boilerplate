import { Sequelize } from 'sequelize'
import sequelize from './../config/database.js'

const { DataTypes } = Sequelize

class Permission extends Sequelize.Model {

  static associate(models) {
    if (!this.hasAlias('permissionrole')) {
      this.hasMany(permissionroleModel, {
        foreignKey: 'permission_id',
        as: 'permissionrole',
        onDelete: 'CASCADE',
      })        
    }
    if (!this.hasAlias('roles')) {
      this.belongsToMany(roleModel, { through: permissionroleModel, as: 'roles', foreignKey: 'permission_id', onDelete: 'cascade' });    
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

Permission.init({
  name: DataTypes.STRING
}, {
  sequelize,
  modelName: 'permissions',
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})


export default Permission