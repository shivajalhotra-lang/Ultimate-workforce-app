import api from './api';

export const jobService = {
  // Get all jobs with filters
  getAllJobs(params = {}) {
    return api.get('/jobs', { params });
  },

  // Get job by ID
  getJobById(id) {
    return api.get(`/jobs/${id}`);
  },

  // Create new job
  createJob(jobData) {
    return api.post('/jobs', jobData);
  },

  // Update existing job
  updateJob(id, jobData) {
    return api.put(`/jobs/${id}`, jobData);
  },

  // Delete job
  deleteJob(id) {
    return api.delete(`/jobs/${id}`);
  },

  // Apply for a job
  applyForJob(id) {
    return api.post(`/jobs/${id}/apply`);
  },

  // Withdraw application
  withdrawApplication(jobId) {
    return api.delete(`/jobs/${jobId}/application`);
  },

  // Get jobs by employer
  getEmployerJobs(params = {}) {
    return api.get('/jobs/employer/my-jobs', { params });
  },

  // Get worker's applications
  getMyApplications() {
    return api.get('/jobs/my-applications');
  },

  // Get recommended jobs for worker
  getRecommendedJobs() {
    return api.get('/jobs/recommended');
  },

  // Get nearby jobs based on location
  getNearbyJobs(latitude, longitude, radius = 10) {
    return api.get('/jobs/nearby', {
      params: { latitude, longitude, radius }
    });
  },

  // Update job status (employer only)
  updateJobStatus(id, status) {
    return api.patch(`/jobs/${id}/status`, { status });
  },

  // Assign worker to job (employer only)
  assignWorker(jobId, workerId) {
    return api.post(`/jobs/${jobId}/assign`, { workerId });
  },

  // Complete job
  completeJob(jobId, data) {
    return api.post(`/jobs/${jobId}/complete`, data);
  },

  // Get job categories
  getCategories() {
    return api.get('/jobs/categories');
  },

  // Get job statistics
  getStatistics() {
    return api.get('/jobs/statistics');
  },

  // Bulk create jobs (for bulk hiring)
  bulkCreateJobs(jobsData) {
    return api.post('/jobs/bulk', jobsData);
  },

  // Search jobs with advanced filters
  searchJobs(filters) {
    return api.get('/jobs/search', { params: filters });
  },

  // Save job for later
  saveJob(jobId) {
    return api.post(`/jobs/${jobId}/save`);
  },

  // Get saved jobs
  getSavedJobs() {
    return api.get('/jobs/saved');
  },

  // Remove saved job
  removeSavedJob(jobId) {
    return api.delete(`/jobs/${jobId}/save`);
  }
};