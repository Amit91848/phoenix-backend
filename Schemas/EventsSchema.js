const mongoose = require('mongoose');

const EventsSchema = mongoose.Schema({
	orgId: {
		type: String,
	},
	name: {
		type: String,
	},
	domain: {
		type: String,
	},
	type: {
		type: String,
	},
	date: {
		type: Date,
	},
	time: {
		type: String,
	},
	price: {
		type: Number,
	},
	location: {
		type: String,
	},
	close: {
		type: String,
	},
	on_off: {
		type: String,
	},
	details: {
		type: String,
	},
	contact: {
		type: Number,
	},
	email: {
		type: String,
	},
	speaker1: {
		type: String,
	},
	speaker1Photo: {
		type: String,
	},
	speaker1LinkedIn: {
		type: String,
	},
	speaker1Details: {
		type: String,
	},
	speaker2: {
		type: String,
	},
	speaker2Profile: {
		type: String,
	},
	speaker2Photo: {
		type: String,
	},
	speaker2Details: {
		type: String,
	},
	speaker2LinkedIn: {
		type: String,
	},
	speaker3: {
		type: String,
	},
	speaker3Profile: {
		type: String,
	},
	speaker3Photo: {
		type: String,
	},
	speaker3LinkedIn: {
		type: String,
	},
	speaker3Details: {
		type: String,
	},
	backgroundImage: {
		type: String,
	},
	registrants: [
		{
			type: String,
		},
	],
	sentCertificate: {
		type: Boolean,
	},
});

module.exports = mongoose.model('events', EventsSchema);
