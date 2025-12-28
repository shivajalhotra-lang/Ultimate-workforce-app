import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { jobService } from '@/services/jobs';

export const useJobsStore = defineStore('jobs', () => {
  // State
  const jobs = ref([]);
  const savedJobs = ref([]);
  const applications = ref([]);
  const currentJob = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const filters = ref({
    category: '',
    subcategory: '',
    location: '',
    minWage: '',
    maxWage: '',
    workType: '',
    experience: '',
    radius: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Getters
  const filteredJobs = computed(() => {
    return jobs.value.filter(job => {
      // Filter by category
      if (filters.value.category && job.category !== filters.value.category) {
        return false;
      }
      
      // Filter by subcategory
      if (filters.value.subcategory && job.subcategory !== filters.value.subcategory) {
        return false;
      }
      
      // Filter by location
      if (filters.value.location && !job.location?.city?.toLowerCase().includes(filters.value.location.toLowerCase())) {
        return false;
      }
      
      // Filter by wage range
      if (filters.value.minWage && job.wage < parseFloat(filters.value.minWage)) {
        return false;
      }
      if (filters.value.maxWage && job.wage > parseFloat(filters.value.maxWage)) {
        return false;
      }
      
      // Filter by work type
      if (filters.value.workType && job.workType !== filters.value.workType) {
        return false;
      }
      
      // Filter by experience
      if (filters.value.experience && job.experienceRequired !== filters.value.experience) {
        return false;
      }
      
      return true;
    });
  });

  const nearbyJobs = computed(() => {
    // This would require geolocation data
    return jobs.value.filter(job => job.isNearby);
  });

  const activeJobs = computed(() => {
    return jobs.value.filter(job => job.status === 'active');
  });

  const completedJobs = computed(() => {
    return jobs.value.filter(job => job.status === 'completed');
  });

  // Actions
  const fetchJobs = async (params = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await jobService.getAllJobs({ ...filters.value, ...params });
      jobs.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch jobs';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchJobById = async (id) => {
    loading.value = true;
    try {
      const response = await jobService.getJobById(id);
      currentJob.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch job';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createJob = async (jobData) => {
    loading.value = true;
    try {
      const response = await jobService.createJob(jobData);
      jobs.value.unshift(response.data);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create job';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateJob = async (id, jobData) => {
    loading.value = true;
    try {
      const response = await jobService.updateJob(id, jobData);
      const index = jobs.value.findIndex(job => job._id === id);
      if (index !== -1) {
        jobs.value[index] = response.data;
      }
      if (currentJob.value?._id === id) {
        currentJob.value = response.data;
      }
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update job';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteJob = async (id) => {
    loading.value = true;
    try {
      await jobService.deleteJob(id);
      jobs.value = jobs.value.filter(job => job._id !== id);
      if (currentJob.value?._id === id) {
        currentJob.value = null;
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete job';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const applyForJob = async (jobId) => {
    loading.value = true;
    try {
      const response = await jobService.applyForJob(jobId);
      // Update job application status
      const jobIndex = jobs.value.findIndex(job => job._id === jobId);
      if (jobIndex !== -1) {
        jobs.value[jobIndex].hasApplied = true;
        jobs.value[jobIndex].applicationStatus = 'applied';
      }
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to apply for job';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchApplications = async () => {
    loading.value = true;
    try {
      const response = await jobService.getMyApplications();
      applications.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch applications';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchSavedJobs = async () => {
    loading.value = true;
    try {
      const response = await jobService.getSavedJobs();
      savedJobs.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch saved jobs';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const saveJob = async (jobId) => {
    try {
      await jobService.saveJob(jobId);
      const job = jobs.value.find(j => j._id === jobId);
      if (job) {
        job.isSaved = true;
        savedJobs.value.push(job);
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to save job';
      throw err;
    }
  };

  const removeSavedJob = async (jobId) => {
    try {
      await jobService.removeSavedJob(jobId);
      savedJobs.value = savedJobs.value.filter(job => job._id !== jobId);
      const job = jobs.value.find(j => j._id === jobId);
      if (job) {
        job.isSaved = false;
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to remove saved job';
      throw err;
    }
  };

  const updateFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters };
  };

  const clearFilters = () => {
    filters.value = {
      category: '',
      subcategory: '',
      location: '',
      minWage: '',
      maxWage: '',
      workType: '',
      experience: '',
      radius: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
  };

  const resetStore = () => {
    jobs.value = [];
    savedJobs.value = [];
    applications.value = [];
    currentJob.value = null;
    loading.value = false;
    error.value = null;
    clearFilters();
  };

  return {
    // State
    jobs,
    savedJobs,
    applications,
    currentJob,
    loading,
    error,
    filters,
    
    // Getters
    filteredJobs,
    nearbyJobs,
    activeJobs,
    completedJobs,
    
    // Actions
    fetchJobs,
    fetchJobById,
    createJob,
    updateJob,
    deleteJob,
    applyForJob,
    fetchApplications,
    fetchSavedJobs,
    saveJob,
    removeSavedJob,
    updateFilters,
    clearFilters,
    resetStore
  };
});