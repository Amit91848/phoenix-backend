const nodeCron = require('node-cron');
const { scrapeKnowAFest, scrape } = require('./WebScrapper');
const { updateExternalEvents } = require('../controllers/ext_events');
// const updateExternalEvents = require('../controllers/ext_events');

const job = nodeCron.schedule('* * 20 * * *', async function () {
	const knowAFest = await scrapeKnowAFest();
	const tenTimes = await scrape();
	const events = [];

	events.push(knowAFest);
	events.push(tenTimes);

	try {
		await updateExternalEvents(events);
	} catch (err) {
		throw new Error('Error in cron job: ', err);
	}
});

const addExternalEvents = async () => {
	const knowAFest = await scrapeKnowAFest();
	const tenTimes = await scrape();
	const events = [];

	events.push(knowAFest);
	events.push(tenTimes);
	console.log(events.length);

	try {
		await updateExternalEvents(events);
	} catch (err) {
		// throw new Error('Error in cron job: ', err);
		console.log(err);
	}
};

module.exports = addExternalEvents;
