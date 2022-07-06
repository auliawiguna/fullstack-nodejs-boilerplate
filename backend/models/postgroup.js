import { Sequelize } from 'sequelize'
import sequelize from '#config/database.js'

const { DataTypes } = Sequelize

class PostGroup extends Sequelize.Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    if (!this.hasAlias('posts')) {
      this.belongsTo(postModel, {
        foreignKey: 'post_id',
        as: 'posts',
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

PostGroup.init({
  name: DataTypes.STRING,
  post_id: {
    type: DataTypes.INTEGER,
    field : 'post_id'
  }
}, {
  sequelize,
  modelName: 'post_groups',
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',

});

// PostGroup.associate = () => {
//   PostGroup.belongsTo(Post)
// }


export default PostGroup