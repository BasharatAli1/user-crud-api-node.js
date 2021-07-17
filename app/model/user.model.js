var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
      },
    email: {
        type: String,
        required: true
      },
    password: {
      type: String,
      required: true
    },
    role: { type: String, default: 'user'},
    user_nicename: String,
    contact_num: String,
    address: {
      apartment_num: String,
      building_num: String,
      street_name: String,
      block_address: String,
    },
    delivery_days: [String],
    dependents:
    [
      {
        person_name: String, 
        portion_size: Number, 
        fish_sel: Number, 
        lunch_sel: Boolean, 
        avoid_ingredients: String
      }
    ],
}, { timestamps: true });

var User = mongoose.model('User', userSchema);
module.exports = User;
