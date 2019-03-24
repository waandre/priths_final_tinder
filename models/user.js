// var mongoose = require('mongoose')

// const userSchema = new mongoose.Schema({
//     username: { type: String },
//     password: { type: String }
// })

// module.exports = mongoose.model('User', userSchema);

var mongoose = require('mongoose')

const user = new mongoose.Schema({
    name: String,
    picture: String,
    likes: Array,
    finishedRatings: Boolean

})

module.exports = mongoose.model('User', user);
