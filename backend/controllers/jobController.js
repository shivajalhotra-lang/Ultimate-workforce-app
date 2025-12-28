const Job = require('../models/Job');
const User = require('../models/User');
const mongoose = require('mongoose');

// Helper function to calculate distance
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res, next) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'nearby'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = Job.find(JSON.parse(queryStr)).populate('employer', 'firstName lastName companyName profileImage rating');

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-postedAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Job.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const jobs = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    // Filter by nearby location if requested
    if (req.query.nearby && req.user) {
      const user = await User.findById(req.user.id);
      if (user && user.address?.coordinates) {
        const { lat, lng } = user.address.coordinates;
        const radius = req.query.radius || 10; // km
        
        const nearbyJobs = jobs.filter(job => {
          if (!job.location?.coordinates) return false;
          const distance = calculateDistance(
            lat, lng,
            job.location.coordinates.lat,
            job.location.coordinates.lng
          );
          return distance <= radius;
        });

        return res.status(200).json({
          success: true,
          count: nearbyJobs.length,
          pagination,
          data: nearbyJobs
        });
      }
    }

    res.status(200).json({
      success: true,
      count: jobs.length,
      pagination,
      data: jobs
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employer', 'firstName lastName companyName profileImage rating phone email')
      .populate('applications.worker', 'firstName lastName profileImage skills rating')
      .populate('hiredWorkers.worker', 'firstName lastName profileImage phone rating');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Increment view count
    job.views += 1;
    await job.save();

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Employer only)
exports.createJob = async (req, res, next) => {
  try {
    // Add employer to req.body
    req.body.employer = req.user.id;
    req.body.employerName = req.user.fullName;

    const job = await Job.create(req.body);

    // Update employer's job count
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { totalJobsPosted: 1 }
    });

    res.status(201).json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Employer only)
exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Make sure user is job owner
    if (job.employer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer/Admin only)
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Make sure user is job owner or admin
    if (job.employer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
// @access  Private (Worker only)
exports.applyForJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if job is active
    if (job.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: `Cannot apply for job with status: ${job.status}`
      });
    }

    // Check if already applied
    const alreadyApplied = job.applications.find(
      app => app.worker.toString() === req.user.id
    );

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: 'Already applied for this job'
      });
    }

    // Check if already hired
    const alreadyHired = job.hiredWorkers.find(
      h => h.worker.toString() === req.user.id
    );

    if (alreadyHired) {
      return res.status(400).json({
        success: false,
        message: 'Already hired for this job'
      });
    }

    // Add application
    job.applications.push({
      worker: req.user.id,
      status: 'applied',
      appliedAt: Date.now()
    });

    await job.save();

    res.status(200).json({
      success: true,
      message: 'Applied successfully',
      data: job.applications[job.applications.length - 1]
    });
  } catch (error) {
    console.error('Apply job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get jobs by employer
// @route   GET /api/jobs/employer/my-jobs
// @access  Private (Employer only)
exports.getEmployerJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ employer: req.user.id })
      .sort('-createdAt')
      .populate('applications.worker', 'firstName lastName profileImage skills rating');

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    console.error('Get employer jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get worker applications
// @route   GET /api/jobs/my-applications
// @access  Private (Worker only)
exports.getMyApplications = async (req, res, next) => {
  try {
    const jobs = await Job.find({
      'applications.worker': req.user.id
    })
    .populate('employer', 'firstName lastName companyName profileImage rating');

    // Extract applications with job details
    const applications = jobs.flatMap(job => 
      job.applications
        .filter(app => app.worker.toString() === req.user.id)
        .map(app => ({
          ...app.toObject(),
          job: {
            id: job._id,
            title: job.title,
            employer: job.employer,
            category: job.category,
            location: job.location,
            wage: job.wage,
            wageType: job.wageType,
            status: job.status
          }
        }))
    );

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update application status (Employer action)
// @route   PUT /api/jobs/:jobId/applications/:applicationId
// @access  Private (Employer only)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { jobId, applicationId } = req.params;
    const { status } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if employer owns the job
    if (job.employer.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const application = job.applications.id(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Update status
    application.status = status;
    
    // If accepted, add to hired workers
    if (status === 'accepted') {
      job.hiredWorkers.push({
        worker: application.worker,
        hiredAt: Date.now(),
        status: 'hired'
      });
    }

    await job.save();

    res.status(200).json({
      success: true,
      message: 'Application status updated',
      data: application
    });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Mark job as completed
// @route   POST /api/jobs/:id/complete
// @access  Private (Employer only)
exports.completeJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if employer owns the job
    if (job.employer.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Update job status
    job.status = 'completed';
    job.hiredWorkers.forEach(worker => {
      if (worker.status === 'working') {
        worker.status = 'completed';
        worker.completedAt = Date.now();
      }
    });

    await job.save();

    res.status(200).json({
      success: true,
      message: 'Job marked as completed',
      data: job
    });
  } catch (error) {
    console.error('Complete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get job statistics
// @route   GET /api/jobs/statistics
// @access  Private
exports.getJobStatistics = async (req, res, next) => {
  try {
    let query = {};

    // Filter by employer if not admin
    if (req.user.role === 'employer') {
      query.employer = req.user.id;
    } else if (req.user.role === 'worker') {
      query['applications.worker'] = req.user.id;
    }

    const totalJobs = await Job.countDocuments(query);
    const activeJobs = await Job.countDocuments({ ...query, status: 'active' });
    const completedJobs = await Job.countDocuments({ ...query, status: 'completed' });
    
    // Get category distribution
    const categoryStats = await Job.aggregate([
      { $match: query },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get monthly job postings
    const monthlyStats = await Job.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalJobs,
        activeJobs,
        completedJobs,
        categoryStats,
        monthlyStats
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Bulk create jobs
// @route   POST /api/jobs/bulk
// @access  Private (Employer only)
exports.bulkCreateJobs = async (req, res, next) => {
  try {
    const { jobs } = req.body;

    if (!Array.isArray(jobs) || jobs.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Jobs array is required'
      });
    }

    // Add employer to each job
    const jobsWithEmployer = jobs.map(job => ({
      ...job,
      employer: req.user.id,
      employerName: req.user.fullName
    }));

    const createdJobs = await Job.insertMany(jobsWithEmployer);

    res.status(201).json({
      success: true,
      count: createdJobs.length,
      data: createdJobs
    });
  } catch (error) {
    console.error('Bulk create jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};