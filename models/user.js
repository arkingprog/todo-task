var bcrypt = require('bcrypt-nodejs');
// User.hasMany(TodoList,{foreignKey:'userId'});
module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('user',
        {
            id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
            username: DataTypes.STRING(35),
            password: DataTypes.STRING,
            email: DataTypes.STRING(35)
        },
        {
            timestamps: false,
            classMethods: {
                associate: function (models) {
                    User.hasMany(models.todo_list, {foreignKey: 'user_id'})
                },
                validPassword: function (password, passwd, done, user) {
                    bcrypt.compare(password, passwd, function (err, isMatch) {
                        if (err) console.log(err);
                        if (isMatch)
                            return done(null, user)
                        else
                            return done(null, false);
                    })
                }
            }
            ,
            hooks: {
                beforeCreate: function (user, options, next) {
                    bcrypt.genSalt(12, function (err, salt) {
                        bcrypt.hash(user.password, salt, null, function (err, hash) {
                            user.password = hash;
                            next(null, user);
                        });
                    });
                }
            },
            instanceMethods: {
                validPassword: function (password) {
                    return bcrypt.compareSync(password, this.password);
                }
            }
        }
    );

    return User;
};