const express = require('express');
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  applyForJob,
  getEmployerJobs,
  getMyApplications,
  updateApplicationStatus,
  completeJob,
  getJobStatistics,
  bulkCreateJobs
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.route('/')
  .get(getJobs);

router.route('/:id')
  .get(getJob);

// Protected routes
router.use(protect);

// Worker routes
router.route('/my-applications')
  .get(authorize('worker'), getMyApplications);

router.route('/:id/apply')
  .post(authorize('worker'), applyForJob);

// Employer routes
router.route('/')
  .post(authorize('employer', 'admin'), createJob);

router.route('/employer/my-jobs')
  .get(authorize('employer', 'admin'), getEmployerJobs);

router.route('/:id')
  .put(authorize('employer', 'admin'), updateJob)
  .delete(authorize('employer', 'admin'), deleteJob);

router.route('/:jobId/applications/:applicationId')
  .put(authorize('employer', 'admin'), updateApplicationStatus);

router.route('/:id/complete')
  .post(authorize('employer', 'admin'), completeJob);

router.route('/bulk')
  .post(authorize('employer', 'admin'), bulkCreateJobs);

// Statistics (all authenticated users)
router.route('/statistics')
  .get(getJobStatistics);

module.exports = router;