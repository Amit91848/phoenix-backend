const ExternalEvents = require('../Schemas/ExternalEvents');

const updateExternalEvents = async (events) => {
	await ExternalEvents.deleteMany({});
	// events.map(async (event) => {
	// 	console.log(event);
	// 	await ext_events.insertMany(event);
	// });
	for (const event of events) {
		// 	try {
		const insertResponse = await ExternalEvents.insertMany(event);
		console.log(insertResponse.length);
		// } catch (err) {
		// 		// console.log('error inserting event ' + event[0].type + ': ', err);
	}
	console.log('length of events: ', events.length);
	// }
};

const fetchExternal = async (type) => {
	return await ExternalEvents.find({ type: type });
};

module.exports = {
	updateExternalEvents,
	fetchExternal,
};
