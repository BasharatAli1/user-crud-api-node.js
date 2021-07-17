const bcrypt = require('bcrypt');
const User = require('../model/user.model');
const saltRounds = 10;

exports.getUser = async (id, callback) => {
	User.findOne({ _id: id}, function(err, user) {
		if (err) return callback(err);
		else if (user)
		{
			return callback(err, response(true, "Successful", user));
		}
		else {
			callback(err, response(false, "User not found"));
		}
	});
};

exports.getAllUsers = (callback) => {
	User.find({}, function(err, users) {
		if(err)
			return callback(err);
		else if (users)
		{
			return callback(err, response(true, "Successful", users));
		}
		else
			return callback(err, response(false, "Collection is empty"));
	});
};

exports.createUser = async (req, callback) => {
	User.findOne({ username: req.body.username}, function(err, user) {
		if (err) return callback(err);
		if (user)
		{
			callback(err, response(false, "Username already exist"));
		}
		else {
			User.findOne({ email: req.body.email}, async function(err, user) {
				if (err) return callback(err);
				if (user)
				{
					return callback(err, response(false, "Email already exist"));
				}
				else {
					var user = new User();
					if(req.body.role)
						user.role = req.body.role;
					user.username = req.body.username;
					user.email = req.body.email;
					user.user_nicename = req.body.user_nicename;
					user.contact_num = req.body.contact_num;
					user.address = req.body.address;
					user.delivery_days = req.body.delivery_days;
					user.dependents = req.body.dependents;
					user.password = req.body.password;

					bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
						if (err) return console.log(err);
						user.password = hash;
						user.save(function (err) {
							return callback(err, response(true, "Successful", user));
						});
					});
				}
			});
		}
	});
};

exports.comparePassword = async (password, username, callback) => {
	User.findOne({ username: username }, async function(err, user) {
		if(err)
			return callback(err);
		else if(user) {
			await bcrypt.compare(password, user.password, function(err, result) {
				if(err)
					return callback(err);
				if(result)
					return callback(err, response(true, "Successful", user));
				else
					return callback(err, response(false, "Password doesn't match" ));
			});
		}
		else {
			return callback(err, response(false, "User not found") );
		}
	});
};

exports.updateUser = async (req, id, callback) => {
	User.findOne({ _id: id}, async function(err, user) {
		if(err)
			return callback(err);
		else if (user)
		{
			if(req.body.username)
				user.username = req.body.username;
			if(req.body.email)
				user.email = req.body.email;
			if(req.body.user_nicename)
				user.user_nicename = req.body.user_nicename;
			if(req.body.role)
				user.role = req.body.role;
			if(req.body.contact_num)
				user.contact_num = req.body.contact_num;
			if(req.body.address)
				user.address = req.body.address;
			if(req.body.delivery_days)
				user.delivery_days = req.body.delivery_days;
			if(req.body.dependents)
				user.dependents = req.body.dependents;
			if(req.body.password) {
				await bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
					if (err) return console.log(err);
					else {
						user.password = hash;
						user.save(function (err) {
							return callback(err, response(true, "Successful", user));
						});
					}
				});
			}
			else {
				user.save(function (err) {
					return callback(err, response(true, "Successful", user));
				});
			}
		}
		else {
			return callback(err, response(false, "User not found") );
		}
	});
};

exports.deleteUser = async (id, callback) => {
	User.findOne({ _id: id}, function(err, user) {
		if(err)
			return callback(err);
		else if (user)
		{
			User.deleteOne( { _id: id }, function(err, result) {
				if(err) return callback(err);
				// else return callback(err, result.deletedCount);
				else return callback(err, response(true, "Successful", user));
			});
		}
		else {
			return callback(err, response(false, "User not found" ));
		}
	});
};

exports.addDependent = async (req, id, callback) => {
	User.findOne({ _id: id}, function(err, user) {
		if (err) return callback(err);
		if (user)
		{
			let dependent = {};
			if(req.body.person_name);
				dependent.person_name = req.body.person_name;
			if(req.body.portion_size);
				dependent.portion_size = req.body.portion_size;
			if(req.body.fish_sel);
				dependent.fish_sel = req.body.fish_sel;
			if(req.body.lunch_sel);
				dependent.lunch_sel = req.body.lunch_sel;
			if(req.body.avoid_ingredients);
				dependent.avoid_ingredients = req.body.avoid_ingredients;

			user.dependents.push(dependent);
			user.save(function (err) {
				return callback(err, response(true, "Successful", user));
			});
		}
		else {
			return callback(err, response(false, "User not found"));
		}
	});
};	

exports.updateDependent = async (req, userId, dependentId, callback) => {
	User.findOne({ _id: userId}, function(err, user) {
		if (err) return callback(err);
		if (user)
		{
			var flag = false;
			for(var i = 0; i < user.dependents.length; i++) {
				if(user.dependents[i]._id == dependentId) {
					if(req.body.person_name);
					console.log("\n\nreq.body: ", req.body);
						user.dependents[i].person_name = req.body.person_name;
					if(req.body.portion_size);
						user.dependents[i].portion_size = req.body.portion_size;
					if(req.body.fish_sel);
						user.dependents[i].fish_sel = req.body.fish_sel;
					if(req.body.lunch_sel !== null);
						user.dependents[i].lunch_sel = req.body.lunch_sel;
					if(req.body.avoid_ingredients);
						user.dependents[i].avoid_ingredients = req.body.avoid_ingredients;
					flag = true;
				}
			}
			if(flag) {
				user.save(function (err) {
					return callback(err, response(true, "Successful", user));
				});
			}
			else
				return callback(err, response(false, "Dependent not found"));
		}
		else {
			return callback(err, response(false, "User not found"));
		}
	});
};	

exports.deleteDependent = async (req, userId, dependentId, callback) => {

	User.findById(userId, function(err, user) {
		if (err) return callback(err);
		if (user)
		{
			var flag = false;
			for(var i = 0; i < user.dependents.length; i++) {
				if(user.dependents[i]._id == dependentId) {
					flag = true;
					console.log("user.dependents[i]", user.dependents[i])
				}
			}
			if(!flag)
				return callback(err, response(false, "Dependent not found"));
			else {
				User.update({
						'_id': userId
					}, 
					{
						$pull: {
							dependents: {_id: dependentId}
						}
					},
					function (err) {
						if(err) {
							return callback(err);
						} else {
							User.findById(userId, function(err, user) {
								if (err) return callback(err);
								if (user)
								{
									return callback(err, response(true, "Successful", user));
								}
							});
						}
					}
				);
			}
		}
		else {
			return callback(err, response(false, "User not found"));
		}
	});
};

function response(status, message, obj) {
	var res = {};
	res.status = status;
	res.message = message;
	if(obj)
		res.response = obj;
		console.log("Response: ", res);
	return res;
}
