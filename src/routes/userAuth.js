const express = require('express');
const jwt = require('jsonwebtoken');
const middleware = require('../middleware/authMiddleware');
const volServices = require('../services/volunteerServices');
console.log("Initializing auth routes");

module.exports = (Volunteer) => {
    const router = express.Router();

    router.post('/login', async (req, res) => {
    try {
        console.log("Login attempt with body:", req.body);
        const { phone_num, password } = req.body;

        if (!phone_num || !password) {
            return res.status(400).send({ error: 'Phone number and password are required' });
        }

        const volunteer = await Volunteer.findOne({ where: { phone_num } });

        console.log("Volunteer found:", volunteer ? "Yes" : "No");

        if (!volunteer || !(await volunteer.validPassword(password))) {
        return res.status(401).send({ error: 'Invalid phone number or password' });
        }

        const token = jwt.sign({ phone_num: volunteer.phone_num, role: volunteer.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.send({ token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(400).send(error);
    }
    });

    // router.get('/profile', middleware.authMiddleware(Volunteer), async (req, res) => {
    // res.send(req.volunteer);
    // });

    router.get('/profile', middleware.verifyToken, middleware.checkPermission, async (req, res) => {
        console.log('inside the get call')
        try {
            const volunteer = await volServices.fetchDetails(Volunteer, req.user.phone_num);
            res.send(volunteer);
        } catch (error) {
            console.error('Error fetching volunteer details:', error);
            res.status(500).send('Internal Server Error');
        }
    });

    router.post('/logout', verifyToken, async (req, res) => {
        res.json({ message: 'Logged out successfully' });
    });

    return router;
};

