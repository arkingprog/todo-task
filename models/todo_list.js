// TodoList.belongsTo(User,{foreignKey:'user_id'});
module.exports = function (sequelize, DataTypes) {
    var TodoList = sequelize.define('todo_list',
        {
            id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
            title: DataTypes.STRING(1024),
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE
        },
        {
            timestamps: true,
            updatedAt: 'updated_at',
            createdAt: 'created_at',
            classMethods: {
                associate: function (models) {
                    TodoList.belongsTo(models.user,{foreignKey:'user_id'});
                    TodoList.hasMany(models.todo_item,{foreignKey:'todo_list_id'});

                }
            }
        });
    return TodoList;
};
