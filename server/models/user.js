const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role: {
        type: String,
        default: 'user'
    },
    cart: {
        type: Array,
        default: []
    },
    address: [
        { type: mongoose.Types.ObjectId, ref: 'Address' },
    ],
    wishList: [
        { type: mongoose.Types.ObjectId, ref: 'Product' },
    ],
    isBlocked: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
    },
    passwordChangeAt: {
        type: String,
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetExpires: {
        type: String
    },
}, { timeseries: true });

// Hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = bcrypt.genSaltSync(10);
    this.password = hashPassword = await bcrypt.hashSync(this.password, salt);
});

// Compare password

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compareSync(password, this.password);
};

//Export the model
module.exports = mongoose.model('User', userSchema);