const cron = require('node-cron');
const options = require('../knexfile');
const knex = require('knex')(options);
const { format, eachDayOfInterval } = require('date-fns');

// Check & insert missing completion records
const createMissingHabitCompletions = async () => {
    console.log('Checking for missing habit completion entries...');

    const today = format(new Date(), 'yyyy-MM-dd');

    try {
        // Get all active habits
        const activeHabits = await knex('habits')
            .where('start_date', '<=', today)
            .andWhere(builder => {
                builder.where('end_date', '>=', today).orWhereNull('end_date');
            });
        
        console.log(`Found ${activeHabits.length} active habits.`);

        for (const habit of activeHabits) {
            const habitStartDate = habit.start_date;
            const allDates = eachDayOfInterval({ start: habitStartDate, end: new Date() })
                .map(date => format(date, 'yyyy-MM-dd'));
            
            for (const date of allDates) {
                const existingEntry = await knex('habit_completion')
                    .where({ habit_id: habit.habit_id, completion_date: date })
                    .first();
                
                if (!existingEntry) {
                    await knex('habit_completion').insert({
                        habit_id: habit.habit_id,
                        completion_date: date,
                        is_complete: false,
                    });
                    console.log(`Created completion entry for habit ${habit.habit_id} on ${date}`);
                }
            }
        }
    } catch (error) {
        console.error(`Error checking for missing habit completions: `, error);
    }
}

// Run on server start to backfill all missing dates
console.log('Running habit completion check on server start...');
createMissingHabitCompletions();

// Schedule the job to run at midnight every night (if server running)
cron.schedule('0 0 * * *', () => {
    console.log('Running scheduled habit completion job...');
    createMissingHabitCompletions();
});

module.exports = createMissingHabitCompletions;