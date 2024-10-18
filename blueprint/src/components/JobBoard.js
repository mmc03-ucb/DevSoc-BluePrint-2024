import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { TextField, Button, Grid, Card, CardContent, Typography, Container, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Box, Select, Checkbox, ListItemText } from '@mui/material';
import { Timestamp } from 'firebase/firestore';

function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [workRightsFilter, setWorkRightsFilter] = useState([]);  // Filter by work rights (now multiple)
  const [companyFilter, setCompanyFilter] = useState('');        // Filter by company
  const [companies, setCompanies] = useState([]);                // List of companies for filter dropdown
  const [companyLogos, setCompanyLogos] = useState({});          // Store company logos mapped by company name

  // State for job creation and editing dialog
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);  // State to check if we're editing an existing job
  const [jobToEdit, setJobToEdit] = useState(null);  // Store the job being edited
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    description: '',
    workRights: [],  // Allow multiple work rights
    expiryDate: '',
    applyUrl: '',
  });

  const workRightsOptions = ['Citizen', 'Work Visa', 'Permanent Resident', 'Student Visa'];

  useEffect(() => {
    const fetchJobsAndCompanies = async () => {
      const now = Timestamp.now();

      // Fetch jobs and filter out expired listings
      const jobsSnapshot = await getDocs(query(collection(db, 'jobs'), where('expiryDate', '>', now)));
      const jobsData = jobsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setJobs(jobsData);

      // Fetch companies and map company logos by company name
      const companySnapshot = await getDocs(collection(db, 'companies'));
      const companyData = companySnapshot.docs.reduce((acc, doc) => {
        acc[doc.data().name] = doc.data().icon; // Map company names to logos (icon URLs)
        return acc;
      }, {});

      setCompanies(Object.keys(companyData)); // Set companies for the filter dropdown
      setCompanyLogos(companyData); // Store logos
    };

    fetchJobsAndCompanies();
  }, []);

  const handleWorkRightsFilterChange = (e) => {
    setWorkRightsFilter(e.target.value);  // Update work rights filter with multiple values
  };

  const handleCompanyFilterChange = (e) => {
    setCompanyFilter(e.target.value);
  };

  const handleOpen = () => {
    setOpen(true);
    setEditMode(false);  // Ensure we're in "add" mode, not "edit"
    setNewJob({
      title: '',
      company: '',
      description: '',
      workRights: [],
      expiryDate: '',
      applyUrl: '',
    });
  };

  const handleClose = () => {
    setOpen(false);
    setJobToEdit(null);  // Clear the job being edited
  };

  const handleJobChange = (e) => {
    const { name, value } = e.target;
    setNewJob((prevJob) => ({ ...prevJob, [name]: value }));
  };

  const handleWorkRightsChange = (e) => {
    setNewJob((prevJob) => ({ ...prevJob, workRights: e.target.value }));
  };

  const handleSubmitJob = async () => {
    if (editMode && jobToEdit) {
      // Edit existing job
      try {
        const jobRef = doc(db, 'jobs', jobToEdit.id);
        await updateDoc(jobRef, {
          ...newJob,
          expiryDate: Timestamp.fromDate(new Date(newJob.expiryDate)),  // Convert expiry date to Firebase Timestamp
        });

        // Refresh job list
        const now = Timestamp.now();
        const jobsSnapshot = await getDocs(query(collection(db, 'jobs'), where('expiryDate', '>', now)));
        const jobsData = jobsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setJobs(jobsData);

        handleClose();
      } catch (error) {
        console.error('Error updating job:', error);
      }
    } else {
      // Add new job
      try {
        const formattedJob = {
          ...newJob,
          expiryDate: Timestamp.fromDate(new Date(newJob.expiryDate)),  // Convert expiry date to Firebase Timestamp
          createdAt: Timestamp.now(),
        };

        // Add new job to Firestore
        await addDoc(collection(db, 'jobs'), formattedJob);

        // Refresh job list
        const now = Timestamp.now();
        const jobsSnapshot = await getDocs(query(collection(db, 'jobs'), where('expiryDate', '>', now)));
        const jobsData = jobsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setJobs(jobsData);

        handleClose();
      } catch (error) {
        console.error('Error adding job:', error);
      }
    }
  };

  const handleEditJob = (job) => {
    setJobToEdit(job); // Store the job being edited
    setNewJob({
      title: job.title,
      company: job.company,
      description: job.description,
      workRights: job.workRights,
      expiryDate: job.expiryDate.toDate().toISOString().substr(0, 10), // Convert Firestore Timestamp to date string
      applyUrl: job.applyUrl,
    });
    setEditMode(true);
    setOpen(true);  // Open the dialog in edit mode
  };

  const handleDeleteJob = async (jobId) => {
    try {
      // Delete the job from Firestore
      await deleteDoc(doc(db, 'jobs', jobId));

      // Refresh job list after deletion
      const now = Timestamp.now();
      const jobsSnapshot = await getDocs(query(collection(db, 'jobs'), where('expiryDate', '>', now)));
      const jobsData = jobsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setJobs(jobsData);
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  // Apply filters based on work rights and company
  const filteredJobs = jobs.filter((job) => {
    return (
      (workRightsFilter.length === 0 || workRightsFilter.some((right) => job.workRights.includes(right))) &&
      (!companyFilter || job.company === companyFilter)
    );
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h4" gutterBottom>
          Job Board
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Explore amazing job opportunities from top companies!
        </Typography>
      </Box>

      {/* Add Job Button */}
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 4 }}>
        Add Job
      </Button>

      {/* Filters Section */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Select
            multiple
            fullWidth
            label="Filter by Work Rights"
            value={workRightsFilter}
            onChange={handleWorkRightsFilterChange}
            renderValue={(selected) => selected.join(', ')}  // Display selected work rights as a string
            variant="outlined"
          >
            {workRightsOptions.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox checked={workRightsFilter.indexOf(option) > -1} />
                <ListItemText primary={option} />
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Filter by Company"
            value={companyFilter}
            onChange={handleCompanyFilterChange}
            variant="outlined"
          >
            <MenuItem value="">All</MenuItem>
            {companies.map((company, index) => (
              <MenuItem key={index} value={company}>
                {company}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {/* Job Listings */}
      <Grid container spacing={4}>
        {filteredJobs.map((job) => (
          <Grid item xs={12} sm={6} md={4} key={job.id}>
            <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Box component="img" src={companyLogos[job.company]} alt={`${job.company} logo`} sx={{ height: 80, mb: 2 }} /> {/* Use the logo from company data */}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {job.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {job.company}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Work Rights: {job.workRights.join(', ')}  {/* Display multiple work rights */}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  {job.description}
                </Typography>
              </CardContent>
              <Box sx={{ padding: 2 }}>
                {job.applyUrl && (
                  <Button
                    variant="contained"
                    color="primary"
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    fullWidth
                  >
                    Learn More
                  </Button>
                )}
                {/* Edit Button */}
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleEditJob(job)}
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  Edit Job
                </Button>
                {/* Delete Button */}
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeleteJob(job.id)}
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  Delete Job
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Job Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Edit Job' : 'Add New Job'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="title"
            label="Job Title"
            type="text"
            fullWidth
            variant="standard"
            value={newJob.title}
            onChange={handleJobChange}
          />
          <TextField
            margin="dense"
            name="company"
            label="Company Name"
            type="text"
            fullWidth
            variant="standard"
            value={newJob.company}
            onChange={handleJobChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Job Description"
            type="text"
            fullWidth
            variant="standard"
            value={newJob.description}
            onChange={handleJobChange}
          />
          <Select
            multiple
            margin="dense"
            name="workRights"
            fullWidth
            variant="standard"
            value={newJob.workRights}
            onChange={handleWorkRightsChange}
            renderValue={(selected) => selected.join(', ')}
          >
            {workRightsOptions.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox checked={newJob.workRights.indexOf(option) > -1} />
                <ListItemText primary={option} />
              </MenuItem>
            ))}
          </Select>
          <TextField
            margin="dense"
            name="expiryDate"
            label="Expiry Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newJob.expiryDate}
            onChange={handleJobChange}
          />
          <TextField
            margin="dense"
            name="applyUrl"
            label="Job Application URL"
            type="url"
            fullWidth
            variant="standard"
            value={newJob.applyUrl}
            onChange={handleJobChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitJob} color="primary">
            {editMode ? 'Save Changes' : 'Add Job'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default JobBoard;
