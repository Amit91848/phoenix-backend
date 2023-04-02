const User = require('../Schemas/UserSchema');
const bcrypt = require('bcryptjs');
const { sendSesEmail } = require('../utils/ses');
const router = require('express').Router();
const shortid = require('shortid');

router.post('/signup', async (req, res) => {
	console.log(req.body);
	try {
		const data = req.body;
		const email = data.email;

		const existing = await User.findOne({ email });
		if (existing) {
			return res.status(409).json({ message: 'User Already Exists!!!' });
		}

		const hashedPassword = await bcrypt.hash(data.password, 10);

		const email_token = shortid.generate();

		const UserData = new User({
			name: data.name,
			email: data.email,
			password: hashedPassword,
			isUser: data.isUser,
			active: false,
			email_token,
			tokenExpiry: new Date(Date.now() + 60 * 60 * 1000),
		});

		await UserData.save();

		const sesResponse = await sendSesEmail(email, email_token);
		console.log('ses response: ', sesResponse);

		return res
			.status(201)
			.json({ message: 'Registration successful, please login' });
	} catch (err) {
		console.log(err);
		return res.status(405).json({ message: 'Internal Server Error' });
	}
});

router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		const existingUser = await User.findOne({ email });

		if (!existingUser)
			return res.status(404).json({ message: 'User not found!!!' });

		if (!existingUser.active) {
			return res
				.status(401)
				.json({ message: 'Please verify your email first!!!' });
		}

		const validPassword = await bcrypt.compare(
			password,
			existingUser.password
		);

		if (!validPassword) {
			return res.status(401).json({ message: 'Invalid Credentials' });
		}

		const jwt = await createAccessToken(existingUser);

		return res.status(201).json({
			token: jwt,
			isUser: existingUser.isUser,
			message: 'User logged in',
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
});
module.exports = router;
