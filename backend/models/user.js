import { Sequelize } from 'sequelize'
import sequelize from '#config/database.js'

const { DataTypes } = Sequelize
const PROTECTED_ATTRIBUTES = ['password']

class User extends Sequelize.Model {
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
    // define association here
    if (!this.hasAlias('tokens')) {
      this.hasMany(personalaccesstokenModel, {
        foreignKey: 'user_id',
        as: 'tokens',
        onDelete: 'CASCADE',
      })        
    }
    if (!this.hasAlias('forgetpassword')) {
      this.hasMany(forgetpasswordtokenModel, {
        foreignKey: 'user_id',
        as: 'forgetpassword',
        onDelete: 'CASCADE',
      })        
    }
    if (!this.hasAlias('roles')) {
      this.belongsToMany(roleModel, { through: roleuserModel, as: 'roles', foreignKey: 'user_id', onDelete: 'cascade' })      
    }
    if (!this.hasAlias('avatar')) {
      this.hasOne(avatarModel, {
        foreignKey: 'user_id',
        as: 'avatar',
      })
    }
  }

  /**
   * Add role
   *
   * @param   roleModel  role  [role description]
   *
   * @return  {[type]}        [return description]
   */
  static async addRole(role) {
    await roleModel.create({
      user_id : this.id,
      role_id: role.id
    })
  }

  static async newToken(device_name = 'Web FE', userId) {
    const plainTextToken = stringHelper.random(40);
    

    const token = await personalaccesstokenModel.create({
      name: device_name,
      user_id: userId,
      token: hashingHelper.createSha256Hash(plainTextToken),
    });

    return {
      accessToken: token,
      plainTextToken: `${token.id}|${plainTextToken}`,
    };
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

User.init({
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  validation_token: DataTypes.STRING,
  validated_at: DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'users',
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})


export default User