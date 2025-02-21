const express = require('express');
const verifyToken = require('../middleware/verify-token');
const router = express.Router();

router.use(verifyToken);

// Add Habit
router.post('/', async (req, res) => {
    const { habit_name, start_date, category } = req.body;

    // Validate required fields
    if (!habit_name || !start_date || !category) {
        return res.status(400).json({
            error: true,
            message: "All fields (habit_name, start_date, category_id) are required.",
        });
    }

    try {
        // Get user_id from the decoded token
        console.log("User Id: ", req.user.userId);
        const userId = req.user.userId;

        // Insert new habit into the database
        const result = await req.db.from('habits').insert({
            habit_name,
            start_date,
            end_date: null,
            category,
            user_id: userId,
        });

        const habitId = result[0];

        return res.status(201).json({
            error: false,
            message: 'Habit added successfully.',
            habitId,
        });
    } catch (error) {
        console.error("Error adding habit: ", error);
        return res.status(500).json({
            error: true,
            message: "An error occurred while adding the habit.",
        });
    }
});

// Get Habits
router.get('/', async (req, res) => {
    console.log("Received request for habits. Date param:", req.params.date);
    console.log("Full request URL:", req.originalUrl);
    console.log("Full request headers:", req.headers);
    
    const date = req.query.date;
    if (!date) {
        return res.status(400).json({
            error: true,
            message: "The 'date' query paramater is required.",
        });
    }

    try {
        console.log("User Id: ", req.user.userId);
        const userId = req.user.userId;

        const habits = await req.db.from('habits')
            .where('user_id', userId)
            .andWhere('start_date', '<=', date) // Habit started on or before the given date
            .andWhere(function () {
                this.where('end_date', '>', date).orWhereNull('end_date'); // Habit end_date is after the given date
            })
            .select('*')

        return res.status(200).json({
            error: false,
            habits,
        });
    } catch (error) {
        console.error("Error retrieving habits:", error);
        return res.status(500).json({
            error: true,
            message: "An error occurred while retrieving habits.",
        });
    }
});

module.exports = router;