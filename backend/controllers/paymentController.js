const Payment = require('../models/Payment');
const User = require('../models/User');
const Job = require('../models/Job');

// @desc    Create payment
// @route   POST /api/payments
// @access  Private (Employer only)
exports.createPayment = async (req, res, next) => {
  try {
    const { jobId, workerId, amount, description, paymentMethod, paymentDetails } = req.body;

    // Validate job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Validate worker
    const worker = await User.findById(workerId);
    if (!worker || worker.role !== 'worker') {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    // Check if employer owns the job
    if (job.employer.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to create payment for this job'
      });
    }

    // Create payment
    const payment = await Payment.create({
      job: jobId,
      worker: workerId,
      employer: req.user.id,
      amount,
      description,
      paymentMethod,
      paymentDetails,
      status: paymentMethod === 'wallet' ? 'completed' : 'pending'
    });

    // If payment is via wallet, update balances
    if (paymentMethod === 'wallet') {
      // Deduct from employer's wallet
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { walletBalance: -amount }
      });

      // Add to worker's wallet
      await User.findByIdAndUpdate(workerId, {
        $inc: { walletBalance: amount, earnings: amount }
      });

      // Update worker's completed jobs count
      await User.findByIdAndUpdate(workerId, {
        $inc: { totalJobsCompleted: 1 }
      });
    }

    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private/Admin
exports.getPayments = async (req, res, next) => {
  try {
    let query = {};

    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      query.paymentDate = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by payment method
    if (req.query.paymentMethod) {
      query.paymentMethod = req.query.paymentMethod;
    }

    const payments = await Payment.find(query)
      .populate('worker', 'firstName lastName email phone')
      .populate('employer', 'firstName lastName companyName email')
      .populate('job', 'title category')
      .sort('-paymentDate');

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
exports.getPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('worker', 'firstName lastName email phone profileImage')
      .populate('employer', 'firstName lastName companyName email phone')
      .populate('job', 'title description category wage');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check authorization
    if (
      req.user.role !== 'admin' &&
      payment.worker._id.toString() !== req.user.id &&
      payment.employer._id.toString() !== req.user.id
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view this payment'
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update payment
// @route   PUT /api/payments/:id
// @access  Private (Admin/Employer)
exports.updatePayment = async (req, res, next) => {
  try {
    let payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && payment.employer.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this payment'
      });
    }

    payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete payment
// @route   DELETE /api/payments/:id
// @access  Private/Admin
exports.deletePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    await payment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    console.error('Delete payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get my payments
// @route   GET /api/payments/my-payments
// @access  Private
exports.getMyPayments = async (req, res, next) => {
  try {
    let query;

    if (req.user.role === 'worker') {
      query = { worker: req.user.id };
    } else if (req.user.role === 'employer') {
      query = { employer: req.user.id };
    } else {
      query = {};
    }

    const payments = await Payment.find(query)
      .populate(req.user.role === 'worker' ? 'employer' : 'worker', 'firstName lastName companyName profileImage')
      .populate('job', 'title category')
      .sort('-paymentDate');

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.error('Get my payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Initiate payment (for online payment gateways)
// @route   POST /api/payments/initiate
// @access  Private
exports.initiatePayment = async (req, res, next) => {
  try {
    const { amount, purpose, paymentMethod } = req.body;

    // Generate unique transaction ID
    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // In production, integrate with payment gateway here
    // This is a simplified version
    const paymentData = {
      transactionId,
      amount,
      purpose,
      paymentMethod,
      status: 'pending',
      createdAt: new Date()
    };

    res.status(200).json({
      success: true,
      message: 'Payment initiated',
      data: {
        ...paymentData,
        // In production, return payment gateway response
        paymentGatewayUrl: 'https://payment-gateway.com/pay',
        paymentGatewayParams: {
          transactionId,
          amount,
          callbackUrl: `${process.env.BACKEND_URL}/api/payments/verify`
        }
      }
    });
  } catch (error) {
    console.error('Initiate payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Verify payment (callback from payment gateway)
// @route   POST /api/payments/verify
// @access  Public (called by payment gateway)
exports.verifyPayment = async (req, res, next) => {
  try {
    const { transactionId, status, paymentId } = req.body;

    // In production, verify with payment gateway
    // This is a simplified version
    if (status === 'success') {
      // Update payment status
      const payment = await Payment.findByIdAndUpdate(
        paymentId,
        {
          status: 'completed',
          transactionId,
          completedAt: new Date()
        },
        { new: true }
      );

      // Update wallet balance if applicable
      if (payment && payment.paymentMethod === 'wallet') {
        await User.findByIdAndUpdate(payment.worker, {
          $inc: { walletBalance: payment.amount, earnings: payment.amount }
        });
      }

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      // Payment failed
      await Payment.findByIdAndUpdate(paymentId, {
        status: 'failed'
      });

      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get payment statistics
// @route   GET /api/payments/statistics
// @access  Private
exports.getPaymentStatistics = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'worker') {
      query.worker = req.user.id;
    } else if (req.user.role === 'employer') {
      query.employer = req.user.id;
    }

    const totalPayments = await Payment.countDocuments(query);
    const completedPayments = await Payment.countDocuments({
      ...query,
      status: 'completed'
    });
    const pendingPayments = await Payment.countDocuments({
      ...query,
      status: 'pending'
    });

    // Total amount
    const payments = await Payment.find({ ...query, status: 'completed' });
    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

    // Monthly statistics
    const monthlyStats = await Payment.aggregate([
      { $match: { ...query, status: 'completed' } },
      {
        $group: {
          _id: {
            year: { $year: '$paymentDate' },
            month: { $month: '$paymentDate' }
          },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalPayments,
        completedPayments,
        pendingPayments,
        totalAmount,
        averagePayment: totalPayments > 0 ? totalAmount / totalPayments : 0,
        monthlyStats
      }
    });
  } catch (error) {
    console.error('Get payment statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Add money to wallet
// @route   POST /api/payments/wallet/add
// @access  Private
exports.addWalletBalance = async (req, res, next) => {
  try {
    const { amount, paymentMethod } = req.body;

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    // Create wallet transaction record
    const transaction = await Payment.create({
      worker: req.user.id,
      employer: req.user.id, // Self for wallet top-up
      amount,
      paymentMethod,
      description: 'Wallet Top-up',
      status: 'pending'
    });

    // In production, integrate with payment gateway
    // For now, directly update wallet balance
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { walletBalance: amount } },
      { new: true }
    );

    // Update transaction status
    transaction.status = 'completed';
    transaction.completedAt = new Date();
    await transaction.save();

    res.status(200).json({
      success: true,
      message: 'Wallet balance updated successfully',
      data: {
        newBalance: user.walletBalance,
        transaction
      }
    });
  } catch (error) {
    console.error('Add wallet balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Withdraw money from wallet
// @route   POST /api/payments/wallet/withdraw
// @access  Private (Worker only)
exports.withdrawWalletBalance = async (req, res, next) => {
  try {
    const { amount, paymentMethod, paymentDetails } = req.body;

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    const user = await User.findById(req.user.id);

    // Check sufficient balance
    if (user.walletBalance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient wallet balance'
      });
    }

    // Create withdrawal transaction
    const transaction = await Payment.create({
      worker: req.user.id,
      employer: req.user.id, // Self for withdrawal
      amount: -amount, // Negative amount for withdrawal
      paymentMethod,
      paymentDetails,
      description: 'Wallet Withdrawal',
      status: 'pending'
    });

    // Update wallet balance
    user.walletBalance -= amount;
    await user.save();

    // Update transaction status
    transaction.status = 'completed';
    transaction.completedAt = new Date();
    await transaction.save();

    res.status(200).json({
      success: true,
      message: 'Withdrawal successful',
      data: {
        newBalance: user.walletBalance,
        transaction
      }
    });
  } catch (error) {
    console.error('Withdraw wallet balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get wallet transactions
// @route   GET /api/payments/wallet/transactions
// @access  Private
exports.getWalletTransactions = async (req, res, next) => {
  try {
    const transactions = await Payment.find({
      $or: [
        { worker: req.user.id, employer: req.user.id },
        { worker: req.user.id, paymentMethod: 'wallet' }
      ]
    })
    .sort('-createdAt')
    .populate('job', 'title')
    .limit(50);

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    console.error('Get wallet transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};