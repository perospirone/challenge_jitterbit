'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.hasMany(models.Item, {
        foreignKey: 'orderId',
        as: 'items'
      });
    }
  }
  Order.init({
    orderId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    value: DataTypes.FLOAT,
    creationDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Order',
    timestamps: false
  });
  return Order;
};
