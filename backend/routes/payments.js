const express = require('express');
const {
  createPayment,
  getPayments,
  getPayment,
  updatePayment,
  deletePayment,
  getMyPayments,
  initiatePayment,
  verifyPayment,
  getPaymentStatistics,
  addWalletBalance,
  withdrawWalletBalance,
  getWalletTransactions
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Payment routes
router.route('/')
  .get(authorize('admin'), getPayments)
  .post(authorize('employer'), createPayment);

router.route('/my-payments')
  .get(getMyPayments);

router.route('/initiate')
  .post(initiatePayment);

router.route('/verify')
  .post(verifyPayment);

router.route('/wallet/add')
  .post(addWalletBalance);

router.route('/wallet/withdraw')
  .post(authorize('worker'), withdrawWalletBalance);

router.route('/wallet/transactions')
  .get(getWalletTransactions);

router.route('/statistics')
  .get(getPaymentStatistics);

router.route('/:id')
  .get(getPayment)
  .put(authorize('admin', 'employer'), updatePayment)
  .delete(authorize('admin'), deletePayment);

module.exports = router;