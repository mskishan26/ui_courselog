

exports.fetchDetails = async (Volunteer, userId) => {
    console.log('Fetching volunteer details');
    try {
        const volunteer = await Volunteer.findOne({ where: { phone_num: userId } });
        if (!volunteer) {
            throw new Error('Volunteer not found');
        }
        return volunteer;
    } catch (error) {
        console.error('Error fetching volunteer details:', error);
        throw error;
    }
};