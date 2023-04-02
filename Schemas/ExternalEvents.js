const { default: mongoose } = require('mongoose');

const ExternalEvents = new mongoose.Schema({
	ext_link: String,
	logo: {
		required: false,
		type: String,
	},
	title: String,
	details: String,
	date: String,
	location: String,
	backgroundImage: String,
	type: String,
});

module.exports = mongoose.model('ext_events', ExternalEvents);
