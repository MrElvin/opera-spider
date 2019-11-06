module.exports = (sequelize, DataTypes) => {
  return sequelize.define('opera', {
    operaId: {
      type: DataTypes.CHAR(8),
      allowNull: false,
      primaryKey: true
    },
    operaName: {
      type: DataTypes.CHAR(50),
      allowNull: false
    },
    operaPeriod: {
      type: DataTypes.CHAR(50),
      allowNull: false,
      primaryKey: true
    },
    operaSource: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    operaBrief: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    operaComment: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'operas',
    timestamps: false
  })
}
