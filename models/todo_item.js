module.exports = function (sequelize, DataTypes) {
    var TodoItem = sequelize.define('todo_item',
        {
            id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
            content: DataTypes.STRING(1024),
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
            deadline: DataTypes.DATE,
            compiled_at:DataTypes.BOOLEAN,
            priority:DataTypes.INTEGER
        },
        {
            timestamps: true,
            updatedAt: 'updated_at',
            createdAt: 'created_at',
            classMethods: {
                associate: function (models) {
                    TodoItem.belongsTo(models.todo_list,{foreignKey:'todo_list_id'})
                }
            }
        });
    return TodoItem;
};
