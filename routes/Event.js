const Events = require('../Schemas/EventsSchema');
const { fetchExternal } = require('../controllers/ext_events');

const router = require('express').Router();

router.get('/external', async (req, res) => {
	const type = req.query.type;
	const external = await fetchExternal(type);
	return res.status(200).json(external);
});

router.get('/:eventId', async (req, res) => {
	const eventId = req.params.eventId;
	const eventData = await Events.findById(eventId);
	return res.status(201).json(eventData);
});

module.exports = router;
