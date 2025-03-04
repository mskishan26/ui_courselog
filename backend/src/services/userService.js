const { Volunteer, Class } = require('../models/model');
const {admin} = require('./firebaseService');
const config = require('../config/config');

class UserService {
  constructor(transporter) {
    this.transporter = transporter;
  }

  // Create new volunteer and send invitation
  async createVolunteer(volunteerData, requester) {
    let volunteer;
    try {
      // Check requester's role

      const targetClass = await Class.findOne({
        where: { class_id: volunteerData.class_id },
      });

      if(!targetClass || targetClass.center_id !== volunteerData.center_id){
        return {
          success: false,
          message: 'Data mismatch. Class does not belong to center.'
        }
      }

      if (requester.volunteer_role === 'L3') {
        // Validate that class_id belongs to requester's center_id
        if (!targetClass || targetClass.center_id !== requester.center_id) {
          return {
            success: false,
            message: 'Invalid access for your role.',
          };
        }
      } else if (requester.volunteer_role === 'L2') {
        // Check if the volunteerData's class_id matches the requester's class_id
        if (volunteerData.class_id !== requester.class_id) {
          return {
            success: false,
            message: 'Invalid access for your role.',
          };
        }
      } else if (requester.volunteer_role === 'L1') {
        return {
          success: false,
          message: 'Unauthorised.',
        };
      }

      // First create the volunteer in your database
      volunteer = await Volunteer.create(volunteerData);
      
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
      await this.sendInvitationEmail(volunteer.volunteer_id, volunteer.volunteer_name, actionLink);
      
      return {
        success: true,
        volunteer
      };
    } catch (error) {
      // If there was an error, clean up any partially created resources
      if (volunteer && volunteer.volunteer_id) {
        await volunteer.destroy({ force: true }).catch(err => console.error('Cleanup error:', err));
      }
      
      return {
        success: false,
        message: 'Volunteer creation failed: ' + error.message
      };
    }
  }

  // Delete volunteer from both Firebase and database
  async deleteVolunteer(volunteerId, requester) {
    try {
      // Find the volunteer to get their Firebase UID
      const volunteer = await Volunteer.findByPk(volunteerId);

      // Check requester's role
      if (requester.volunteer_role === 'L3') {
        // Validate that class_id belongs to requester's center_id
        const targetClass = await Class.findOne({
          where: { class_id: volunteer.class_id },
        });

        if (!targetClass || targetClass.center_id !== requester.center_id) {
          return {
            success: false,
            message: 'Invalid access for your role.',
          };
        }
      } else if (requester.volunteer_role === 'L2') {
        // Check if the volunteerData's class_id matches the requester's class_id
        if (volunteer.class_id !== requester.class_id) {
          return {
            success: false,
            message: 'Invalid access for your role.',
          };
        }
      } else if (requester.volunteer_role === 'L1') {
        return {
          success: false,
          message: 'Unauthorised.',
        };
      }
      
      if (!volunteer) {
        throw new Error('Volunteer not found');
      }
      
      // If volunteer has a Firebase account, delete it
      if (volunteer.firebase_uid) {
        await admin.auth().deleteUser(volunteer.firebase_uid);
      }
      
      // Delete the volunteer from the database
      await volunteer.destroy();
      
      return {
        success: true,
        message: 'Volunteer deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Volunteer deletion failed: ' + error.message
      };
    }
  }

  // Helper method to send invitation email
  async sendInvitationEmail(email, name, actionLink) {
    try {
      // Email content
      // from: `Your Organization <${config.gmail_email_from}>`,
      console.log(config.gmail_email_from);
      console.log(email);
      console.log(actionLink);
      console.log(this.transporter);
      const mailOptions = {
        from: config.gmail_email_from,
        to: email,
        subject: 'Welcome to Our Volunteer Platform',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome, ${name}!</h2>
            <p>You've been added as a volunteer to our platform.</p>
            <p>Please click the button below to set up your password and complete your registration:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${actionLink}" style="background-color: #4285F4; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                Set Up Password
              </a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p>${actionLink}</p>
            <p>This link will expire in 24 hours.</p>
            <p>Thank you for joining us!</p>
          </div>
        `
      };
      
      // Send email using the transporter from emailService
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Invitation email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Error sending invitation email:', error);
      return false;
    }
  }
}

module.exports = UserService;
