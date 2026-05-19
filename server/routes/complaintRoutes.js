const express = require('express');
const router = express.Router();
const { 
  createComplaint, 
  getComplaints, 
  searchComplaints, 
  updateComplaint, 
  deleteComplaint,
  analyzeComplaint
} = require('../controllers/complaintController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/ai/analyze', protect, analyzeComplaint);
router.get('/search', protect, searchComplaints);
router.route('/')
  .post(protect, createComplaint)
  .get(protect, getComplaints);
router.route('/:id')
  .put(protect, admin, updateComplaint)
  .delete(protect, admin, deleteComplaint);

module.exports = router;
