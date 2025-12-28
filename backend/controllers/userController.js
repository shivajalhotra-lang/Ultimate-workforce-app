const User = require('../models/User');
const Job = require('../models/Job');
const Payment = require('../models/Payment');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    let query = {};
    const { role, status, search } = req.query;

    // Apply filters
    if (role) {
      query.role = role;
    }
    if (status) {
      query.accountStatus = status;
    }
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    const users = await User.find(query)
      .select('-password')
      .skip(startIndex)
      .limit(limit)
      .sort('-createdAt');

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check authorization
    if (req.user.id !== user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view this user'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check authorization
    if (req.user.id !== user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this user'
      });
    }

    // Remove password from update data
    delete req.body.password;

    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).select('-password');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if trying to delete own account
    if (req.user.id === user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update user status
// @route   PUT /api/users/:id/status
// @access  Private/Admin
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.accountStatus = status;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User status updated to ${status}`,
      data: user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get worker statistics
// @route   GET /api/users/:id/statistics
// @access  Private
exports.getWorkerStatistics = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Check authorization
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get job statistics
    const totalApplied = await Job.countDocuments({
      'applications.worker': userId
    });

    const totalHired = await Job.countDocuments({
      'hiredWorkers.worker': userId,
      'hiredWorkers.status': { $in: ['hired', 'working', 'completed'] }
    });

    const totalCompleted = await Job.countDocuments({
      'hiredWorkers.worker': userId,
      'hiredWorkers.status': 'completed'
    });

    // Get payment statistics
    const payments = await Payment.find({ worker: userId });
    const totalEarnings = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, payment) => sum + payment.amount, 0);

    // Get category preferences
    const jobCategories = await Job.aggregate([
      { $match: { 'hiredWorkers.worker': mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          rating: user.rating,
          experience: user.experience,
          skills: user.skills
        },
        statistics: {
          totalApplied,
          totalHired,
          totalCompleted,
          totalEarnings,
          averageRating: user.rating || 0
        },
        categories: jobCategories,
        recentPayments: payments
          .filter(p => p.status === 'completed')
          .sort((a, b) => b.paymentDate - a.paymentDate)
          .slice(0, 5)
      }
    });
  } catch (error) {
    console.error('Get worker statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get employer statistics
// @route   GET /api/users/:id/employer-stats
// @access  Private
exports.getEmployerStatistics = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Check authorization
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Get job statistics
    const totalJobs = await Job.countDocuments({ employer: userId });
    const activeJobs = await Job.countDocuments({ 
      employer: userId, 
      status: { $in: ['active', 'in-progress'] } 
    });
    const completedJobs = await Job.countDocuments({ 
      employer: userId, 
      status: 'completed' 
    });

    // Get worker statistics
    const hiredWorkers = await Job.aggregate([
      { $match: { employer: mongoose.Types.ObjectId(userId) } },
      { $unwind: '$hiredWorkers' },
      { $group: { _id: '$hiredWorkers.worker' } },
      { $count: 'total' }
    ]);

    // Get payment statistics
    const payments = await Payment.find({ employer: userId });
    const totalSpent = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, payment) => sum + payment.amount, 0);

    // Get category distribution
    const categoryStats = await Job.aggregate([
      { $match: { employer: mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        statistics: {
          totalJobs,
          activeJobs,
          completedJobs,
          totalWorkers: hiredWorkers[0]?.total || 0,
          totalSpent
        },
        categoryStats,
        recentJobs: await Job.find({ employer: userId })
          .sort('-createdAt')
          .limit(5)
          .select('title category status postedAt')
      }
    });
  } catch (error) {
    console.error('Get employer statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Upload profile image
// @route   POST /api/users/upload-profile
// @access  Private
exports.uploadProfileImage = async (req, res, next) => {
  try {
    // In production, you would use multer or cloudinary
    // This is a simplified version
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: imageUrl },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Upload profile image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update worker skills
// @route   PUT /api/users/skills
// @access  Private (Worker only)
exports.updateSkills = async (req, res, next) => {
  try {
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        message: 'Skills must be an array'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { skills },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Add document
// @route   POST /api/users/documents
// @access  Private
exports.addDocument = async (req, res, next) => {
  try {
    const { type, number, fileUrl } = req.body;

    const user = await User.findById(req.user.id);
    
    user.documents.push({
      type,
      number,
      fileUrl,
      verified: false
    });

    await user.save();

    res.status(200).json({
      success: true,
      data: user.documents[user.documents.length - 1]
    });
  } catch (error) {
    console.error('Add document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Verify document (Admin only)
// @route   PUT /api/users/documents/:docId/verify
// @access  Private/Admin
exports.verifyDocument = async (req, res, next) => {
  try {
    const { userId, docId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const document = user.documents.id(docId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    document.verified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Document verified successfully',
      data: document
    });
  } catch (error) {
    console.error('Verify document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};