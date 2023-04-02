const router = require('express').Router();
const User = require('../Schemas/UserSchema');

router.put('/update', async (req, res) => {
    const { _id } = req.body;
    const { about, linkedin, contactEmail, number, institute, name } = req.body;
    console.log(req.body);
    try {
        const data = await User.findByIdAndUpdate({ _id: _id }, { $set: { name: name, about: about, linkedin: linkedin, contactEmail: contactEmail, number: number, institute: institute } }, { new: true });
        console.log(data);
    } catch(err) {
        console.log(err);
    }
    // const data2 = await User.findById(_id);
    // console.log(data2);
})

module.exports = router;