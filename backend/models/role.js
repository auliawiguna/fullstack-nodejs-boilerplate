import { Sequelize } from 'sequelize'
import sequelize from '#config/database.js'

const { DataTypes } = Sequelize

class Role extends Sequelize.Model {

  static associate(models) {
    if (!this.hasAlias('permissionrole')) {
      this.hasMany(permissionroleModel, {
        foreignKey: 'role_id',
        as: 'permissionrole',
        onDelete: 'CASCADE',
      })  
    }
    if (!this.hasAlias('roleuser')) {
      this.hasMany(roleuserModel, {
        foreignKey: 'role_id',
        as: 'roleuser',
        onDelete: 'CASCADE',
      })  
    }
    if (!this.hasAlias('permissions')) {
      this.belongsToMany(permissionModel, { through: permissionroleModel, as: 'permissions', foreignKey: 'role_id', onDelete: 'cascade' });
    }    
    if (!this.hasAlias('users')) {
      this.belongsToMany(userModel, { through: roleuserModel, as: 'users', foreignKey: 'role_id', onDelete: 'cascade' })
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

Role.init({
  name: DataTypes.STRING
}, {
  sequelize,
  modelName: 'roles',
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})

Role.addHook('beforeCount', function (options) {
  if (this._scope.include && this._scope.include.length > 0) {
    options.distinct = true
    options.col = this._scope.col || options.col || `"${this.options.name.singular}".id`
  }

  if (options.include && options.include.length > 0) {
    options.include = null
  }
})


export default Role