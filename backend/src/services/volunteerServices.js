const admin = require('firebase-admin');

async function fetchDetails(Volunteer, userId){
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

async function createVolunteer(volunteerData) {
    // First create the volunteer in your database
    const volunteer = await Volunteer.create(volunteerData);
    
    // Create a corresponding Firebase auth user
    const firebaseUser = await admin.auth().createUser({
      email: volunteer.volunteer_id, // Using email as volunteer_id based on your model
      emailVerified: false,
      // No password set initially
    });
    
    // Store Firebase UID in your volunteer record
    await volunteer.update({ firebase_uid: firebaseUser.uid });
    
    // Generate password setup link
    const actionLink = await admin.auth().generatePasswordResetLink(volunteer.volunteer_id);
    
    // Send invitation email with the link
    await sendInvitationEmail(volunteer.volunteer_id, volunteer.vol_name, actionLink);
    
    return volunteer;
  }

  module.exports = {
    fetchDetails,
    createVolunteer
  }