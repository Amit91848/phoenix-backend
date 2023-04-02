const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
	name: {
		type: String,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	active: Boolean,
	email_token: String,
	tokenExpiry: Date,
	password: {
		type: String,
		// required: true
	},
	isUser: {
		type: Boolean,
	},
	about: {
		type: String,
	},
	linkedin: {
		type: String,
	},
	institute: {
		type: String,
	},
	number: {
		type: Number,
	},
	contactEmail: {
		type: String,
	},
	skills: [{ type: String }],
});

module.exports = mongoose.model('user', UserSchema);
