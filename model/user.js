var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

var Schema = mongoose.Schema;

var userSchema = new Schema ({
    email : {
        type : String,
        required: true,
        unique : true,
        match : /@/,
        lowercase : true
    },
    username : {
        type : String,
        required : true,
        minlength : 4,
        maxlength : 14,
        unique : true 
    },
    password : {
        type : String,
        required : true,
        minlength : 4,
        maxlength : 14
    },
    token : {
        type: String
    }
},{timestamps : true});

userSchema.pre("save",function(next){
    if(this.password){
        this.password = bcrypt.hashSync(this.password,10);
    }
    next();
});

userSchema.methods.verifyPassword = function(password){
    return bcrypt.compareSync(password,this.password);
}

module.exports = mongoose.model("User", userSchema);