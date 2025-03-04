const express = require('express');

// Export a function that takes authService as a parameter
module.exports = function(UserService) {
  const router = express.Router();

  // Create a new volunteer
  router.post('/create_volunteer', async (req, res) => {
    try {
      const result = await UserService.createVolunteer(req.body, req.volunteer);
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Delete a volunteer
  router.delete('/delete_volunteer/:id', async (req, res) => {
    try {
      const result = await UserService.deleteVolunteer(req.params.id, req.volunteer);
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  return router;
};