const router = require('express').Router();
const path = require('path');
const Event = require('../Schemas/EventsSchema');
const multer = require('multer');
const User = require('../Schemas/UserSchema');
const mongoose = require('mongoose');
const Events = require('../Schemas/EventsSchema');
const multerS3 = require('multer-s3');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { putInS3 } = require('../utils/s3');

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const s3SecretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
const s3AccessKey = process.env.S3_ACCESS_KEY;

const s3 = new S3Client({
	credentials: {
		accessKeyId: s3AccessKey,
		secretAccessKey: s3SecretAccessKey,
	},
	region: bucketRegion,
});

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.post(
	'/addEvent',
	upload.fields([
		{ name: 'backgroundImage', maxCount: 1 },
		{ name: 'speaker1Photo', maxCount: 1 },
		{ name: 'speaker2Photo', maxCount: 1 },
		{ name: 'speaker3Photo', maxCount: 1 },
	]),
	async (req, res) => {
		const {
			name,
			domain,
			type,
			date,
			time,
			close,
			price,
			location,
			on_off,
			details,
			contact,
			email,
			speaker1,
			speaker1LinkedIn,
			speaker1Details,
			speaker2,
			speaker2LinkedIn,
			speaker2Details,
			speaker3,
			speaker3LinkedIn,
			orgId,
		} = req.body;
		const { speaker1Photo, speaker2Photo, speaker3Photo, backgroundImage } =
			req.files;
		const s3Params = {
			Bucket: bucketName,
		};

		let speaker1PhotoName = '';
		let speaker2PhotoName = '';
		let speaker3PhotoName = '';
		let backgroundImageName = '';
		try {
			if (speaker1Photo) {
				speaker1PhotoName =
					Date.now().toString() + '-' + speaker1Photo[0].originalname;
				await putInS3(
					speaker1PhotoName,
					speaker1Photo[0].buffer,
					speaker1Photo[0].mimetype
				);
			}
			if (speaker2Photo) {
				speaker2PhotoName =
					Date.now().toString() + '-' + speaker2Photo[0].originalname;
				await putInS3(
					speaker2PhotoName,
					speaker2Photo[0].buffer,
					speaker2Photo[0].mimetype
				);
			}
			if (speaker3Photo) {
				speaker3PhotoName =
					Date.now().toString() + '-' + speaker3Photo[0].originalname;
				await putInS3(
					speaker3PhotoName,
					speaker3Photo[0].buffer,
					speaker3Photo[0].mimetype
				);
			}
			if (backgroundImage) {
				backgroundImageName =
					Date.now().toString() +
					'-' +
					backgroundImage[0].originalname;
				await putInS3(
					backgroundImageName,
					backgroundImage[0].buffer,
					backgroundImage[0].mimetype
				);
			}

			const EventData = Event({
				orgId: orgId,
				name: name,
				domain: domain,
				type: type,
				date: date,
				time: time,
				close: close,
				price: price,
				location: location,
				on_off: on_off,
				details: details,
				contact: contact,
				email: email,
				speaker1: speaker1,
				speaker1LinkedIn: speaker1LinkedIn,
				speaker1Photo: speaker1PhotoName,
				speaker1Details: speaker1Details,
				speaker2: speaker2,
				speaker2LinkedIn: speaker1LinkedIn,
				speaker2Photo: speaker2PhotoName,
				speaker2Details: speaker2Details,
				speaker3: speaker3,
				speaker3LinkedIn: speaker2LinkedIn,
				speaker3Photo: speaker3PhotoName,
				speaker3Details: speaker3LinkedIn,
				backgroundImage: backgroundImageName,
			});
			await EventData.save();
			return res.status(201).json({
				message: 'done',
			});
		} catch (err) {
			console.log(err);
		}
	}
);

router.get('/allEvents/:id', async (req, res) => {
	let orgId = req.params.id;
	try {
		const events = await Events.find({ orgId: orgId });
		res.status(201).send(events);
	} catch (err) {
		console.log(err);
		res.status(401).send({ message: 'Internal Server Error' });
	}
});

router.get('/allEvents', (req, res) => {});

module.exports = router;
