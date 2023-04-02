const router = require('express').Router();
const { verifyUserWithToken } = require('../controllers/User');

router.get('/email', async (req, res) => {
	const { token } = req.query;

	try {
		await verifyUserWithToken(token);
	} catch (err) {
		console.log(err);
	}

	return res.json({ message: 'Email verified' });
});

module.exports = router;
