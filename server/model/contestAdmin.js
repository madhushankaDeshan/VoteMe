var mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var ContestAdminSchema = new mongoose.Schema({

    user_name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,

    },

    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },

    password: {
        type: String,
        require: true,
        minlength: 6
    },

    tokens: [{
        access: {
            type: String,
            required: true
        },

        token: {
            type: String,
            required: true
        }
    }]
});

ContestAdminSchema.methods.toJSON = function () {

    var admin = this;
    var adminObject = admin.toObject();

    return _.pick(adminObject, ['_id','user_name','email']);

};

ContestAdminSchema.methods.generateAuthToken = function () {

    var admin = this;
    var access = 'auth';
    var token = jwt.sign({_id: admin._id.toHexString(), access}, 'abc123').toString();

    admin.tokens.push({access, token});

    return admin.save().then(() => {

        return token;

    });
};

ContestAdminSchema.methods.removeToken = function (token) {

    var admin = this;

    return admin.update({

        $pull: {

            tokens: {token}

        }
    });
};


ContestAdminSchema.statics.findByToken = function (token) {

    var Admin = this;
    var decoded;

    try {

        decoded = jwt.verify(token, 'abc123');

    } catch (e) {

        return Promise.reject();

    }

    return Admin.findOne({

        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'

    });
};


ContestAdminSchema.statics.findByCredentials = function (email, password) {


    var Admin = this;

    return Admin.findOne({email}).then((admin) => {

        if (!admin) {

            return Promise.reject();

        }

        return new Promise((resolve, reject) => {

            // Use bcrypt.compare to compare password and user.password
            bcrypt.compare(password, admin.password, (err, res) => {

                if (res) {

                    resolve(admin);

                } else {

                    reject();

                }
            });
        });
    });
};

// hashing password before saving ----------- start


ContestAdminSchema.pre('save', function (next) {

    var admin = this;

    if (admin.isModified('password')) {

        bcrypt.genSalt(10, (err, salt) => {

            bcrypt.hash(admin.password, salt, (err, hash) => {

                admin.password = hash;
                next();

            });
        });
    } else {

        next();

    }
});

// hashing password before saving ----------- end 05

 var ContestAdmin = mongoose.model('ContestAdmin', ContestAdminSchema);

module.exports = {ContestAdmin}
