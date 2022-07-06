import { Sequelize } from 'sequelize';
import sequelize from '#config/database.js'

const { DataTypes } = Sequelize

class Post extends Sequelize.Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    if (!this.hasAlias('postgroups')) {
      this.hasMany(postgroupModel, {
        foreignKey: 'post_id',
        as: 'postgroups',
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

Post.init({
  title: DataTypes.STRING,
  slug: DataTypes.STRING,
  content: DataTypes.TEXT
}, {
  sequelize,
  modelName: 'posts',
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Post