const express = require('express');
const verifyToken = require('../middleware/verify-token');
const router = express.Router();

router.use(verifyToken);

// Update completion
router.put('/:id', async (req, res) => {
    const { id } = req.params;


    if (!id) {
        return res.status(400).json({
            error: true,
            message: 'Invalid completion id provided.'
        });
    }

    try {
        const habitCompletion = await req.db('habit_completion')
            .where('completion_id', '=', id)
            .select('is_complete')
            .first();

        if (!habitCompletion) {
            return res.status(404).json({
                error: true,
                message: 'Habit completion not found.'
            });
        }

        const newStatus = !habitCompletion.is_complete;

        const result = await req.db('habit_completion')
            .where({ completion_id: id })
            .update({ is_complete: newStatus });
        
        if (result === 0) {
            return res.status(404).json({
                error: true,
                message: 'Completion entry not found or no changes made.'
            });
        }

        res.status(200).json({
            error: false,
            message: 'Success updating habit completion.',
            is_complete: newStatus
        });

    } catch (error) {
        console.error('Error updating habit completion status: ', error);
        res.status(500).json({
            error: true,
            message: 'Internal server error.'
        });
    }
})

module.exports = router;