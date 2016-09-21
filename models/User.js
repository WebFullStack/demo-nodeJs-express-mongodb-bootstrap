var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var _User = new Schema({
    name : {type: String, default:''},
    mobile : {type: String, default: ''},
    email : {type: String, default: ''},
    password : {type: String, default:''},
    created_at : {type : Date, default: Date.now},
    updated_at : {type : Date, default: Date.now}
});

_User.method("findByName", function(appId, callback) {
    return this.model('users').find({_id: appId}, callback);
});


exports.User = mongoose.model('users', _User);
