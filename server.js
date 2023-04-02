const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDb } = require('./database/db');
const User = require('./Schemas/UserSchema');
const bcrypt = require('bcryptjs');
const { createAccessToken } = require('./controllers/auth');

const app = express();
const route = express.Router();
const port = process.env.PORT || 8080;

app.use(
	cors({
		origin: 'http://localhost:3000',
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

// (async function () {
// 	await addExternalEvents();
// })();

app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/User'));
app.use('/organisation', require('./routes/Organisation'));
app.use('/verify', require('./routes/verify'));
app.use('/event', require('./routes/Event'));
app.use('/profile', require('./routes/Profile'));
app.use('/uploads', express.static('./tempEvents'));

app.post('/findUser', async (req, res) => {
	const { _id } = req.body;
	const user = await User.findById({ _id });
	res.json(user);
});

app.listen(port, async () => {
	console.log(`App Listening on http://localhost:${port}`);
	await connectDb();
});
