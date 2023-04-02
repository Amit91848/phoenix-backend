const User = require('../Schemas/UserSchema');

const verifyUserWithToken = async (token) => {
	// return await User.findOneAndUpdate(
	// 	{ email_token: token, tokenExpiry: { $gt: new Date().getTime() } },
	// 	{ $set: { active: true, email_token: null, tokenExpiry: null } }
	// );

	const user = await User.findOne({ email_token: token });

	if (!user) throw new Error('Email already verified');

	if (user.tokenExpiry > new Date().getTime())
		throw new Error('Please verify again');

	user.active = true;
	user.email_token = null;
	user.tokenExpiry = null;

	await user.save();
};

module.exports = {
	verifyUserWithToken,
};
