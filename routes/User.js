const User = require('../Schemas/UserSchema');
const Events = require('../Schemas/EventsSchema');
const { getFromS3 } = require('../utils/s3');
const router = require('express').Router();

const handleError = () => {
	console.log(err);
	res.status.send({ message: 'Internal Server Error' });
};

router.get('/id/:id', async (req, res) => {
	let { id } = req.params;
	let userDetails = await User.findById(id);
	return res.status(201).send(userDetails);
});

router.get('/dashboard', (req, res) => {
	res.json({ message: 'At user dashboard' });
});

router.get('/getEvents', async (req, res) => {
	const { userId } = req.body;

	const events = await Events.find();

	for (const event of events) {
		let { speaker1Photo, speaker2Photo, speaker3Photo, backgroundImage } =
			event;

		try {
			if (speaker1Photo != '') {
				event.speaker1Photo = await getFromS3(speaker1Photo);
			}
			if (speaker2Photo != '') {
				event.speaker2Photo = await getFromS3(speaker1Photo);
			}
			if (speaker3Photo != '') {
				event.speaker3Photo = await getFromS3(speaker3Photo);
			}
			if (backgroundImage != '') {
				event.backgroundImage = await getFromS3(backgroundImage);
			}
		} catch (err) {
			console.log(err);
		}
	}

	return res.status(201).send(events);
});

router.get('/getSimilarEvents', async (req, res) => {
	let { domain } = req.body;
	try {
		const events = await Events.find({ domain: domain });
		return res.status(201).send(events);
	} catch (err) {
		handleError();
	}
});

router.post('/register', async (req, res) => {
	let { userId, eventId } = req.body;
	try {
		let event = await Events.findByIdAndUpdate(
			{ _id: eventId },
			{ $addToSet: { registrants: userId } }
		);
		res.status(201).send({ message: true });
	} catch (err) {
		handleError();
	}
});

router.post('/isRegistered', async (req, res) => {
	let { userId, eventId } = req.body;
	try {
		let { registrants } = await Events.findById(eventId);
		const isRegistered = registrants?.find((id) => id === userId);
		if (isRegistered) {
			res.status(201).send({ message: true });
		} else {
			res.status(201).send({ message: false });
		}
	} catch (err) {
		handleError();
	}
});

router.post('/cancelEvent', async (req, res) => {
	let { userId, eventId } = req.body;

	try {
		let event = await Events.findByIdAndUpdate(eventId, {
			$pull: { registrants: userId },
		});
		res.status(201).send({ message: true });
	} catch (err) {
		handleError();
	}
});

router.put('/updateSkill', async (req, res) => {
	let { id, skill } = req.body;
	try {
		let message = await User.findByIdAndUpdate(
			id,
			{ $addToSet: { skills: skill } },
			{ new: true }
		);
		res.status(201).send({ message: 'Skills Updated' });
	} catch (err) {
		handleError();
	}
});

module.exports = router;
