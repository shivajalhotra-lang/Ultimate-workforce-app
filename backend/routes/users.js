const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  getWorkerStatistics,
  getEmployerStatistics,
  uploadProfileImage,
  updateSkills,
  addDocument,
  verifyDocument
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Admin routes
router.route('/')
  .get(authorize('admin'), getUsers);

router.route('/:id/status')
  .put(authorize('admin'), updateUserStatus);

router.route('/:userId/documents/:docId/verify')
  .put(authorize('admin'), verifyDocument);

// User management routes
router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(authorize('admin'), deleteUser);

// Worker specific routes
router.route('/skills')
  .put(authorize('worker'), updateSkills);

router.route('/:id/statistics')
  .get(getWorkerStatistics);

// Employer specific routes
router.route('/:id/employer-stats')
  .get(authorize('employer', 'admin'), getEmployerStatistics);

// Common routes
router.route('/upload-profile')
  .post(uploadProfileImage);

router.route('/documents')
  .post(addDocument);

module.exports = router;