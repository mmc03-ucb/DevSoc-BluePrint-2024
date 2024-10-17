import React, { useState, useEffect } from 'react';
import { Button, TextField, Modal, Box, Grid, Typography, Switch, Avatar, Container, MenuItem } from '@mui/material';
import { uploadAlumniData, getAlumniList, uploadFileToFirebase } from '../api';

function AlumniConnect() {
  const [alumniList, setAlumniList] = useState([]);  // Alumni list from the backend
  const [filteredAlumni, setFilteredAlumni] = useState([]);  // Filtered alumni list based on company
  const [companies, setCompanies] = useState([]);  // List of companies from alumni data
  const [selectedCompany, setSelectedCompany] = useState('');  // Selected company filter
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [alumniData, setAlumniData] = useState({
    name: '',
    email: '',
    showEmail: true,
    company: '',
    advice: '',
    calendlyLink: '',
    showCalendly: true,
    picture: null,
    linkedinLink: ''
  });

  useEffect(() => {
    const fetchAlumni = async () => {
      const data = await getAlumniList();
      setAlumniList(data);
      setFilteredAlumni(data);

      // Extract unique companies from the alumni list
      const uniqueCompanies = [...new Set(data.map(alumni => alumni.company))];
      setCompanies(uniqueCompanies);
    };

    fetchAlumni();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlumniData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await uploadFileToFirebase(formData);
      setAlumniData((prevData) => ({ ...prevData, picture: response.url }));
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const urlPattern = /^(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,})([\/\w\.-]*)*\/?$/;

    if (!emailPattern.test(alumniData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (alumniData.linkedinLink && !urlPattern.test(alumniData.linkedinLink)) {
      newErrors.linkedinLink = "Invalid LinkedIn URL";
    }

    if (alumniData.calendlyLink && !urlPattern.test(alumniData.calendlyLink)) {
      newErrors.calendlyLink = "Invalid Calendly URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await uploadAlumniData(alumniData);

      setAlumniData({
        name: '',
        email: '',
        showEmail: true,
        company: '',
        advice: '',
        calendlyLink: '',
        showCalendly: true,
        picture: null,
        linkedinLink: ''
      });
      setShowSignupForm(false);

      const updatedAlumniList = await getAlumniList();
      setAlumniList(updatedAlumniList);
      setFilteredAlumni(updatedAlumniList);
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  // Filter alumni list by selected company
  const handleCompanyFilter = (e) => {
    const company = e.target.value;
    setSelectedCompany(company);

    if (company === '') {
      setFilteredAlumni(alumniList);  // If no company is selected, show all alumni
    } else {
      const filtered = alumniList.filter(alumni => alumni.company === company);
      setFilteredAlumni(filtered);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ padding: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 3,
        }}
      >
        {/* Alumni Signup Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowSignupForm(true)}
          sx={{
            padding: '10px 20px',
            background: 'linear-gradient(90deg, #1976d2, #004ba0)',
            borderRadius: 2,
            boxShadow: 3,
            '&:hover': {
              background: 'linear-gradient(90deg, #004ba0, #1976d2)',
            },
          }}
        >
          Alumni Signup
        </Button>
      </Box>

      {/* Company Filter */}
      <TextField
        select
        label="Filter by Company"
        value={selectedCompany}
        onChange={handleCompanyFilter}
        fullWidth
        variant="outlined"
        sx={{ marginBottom: 3 }}
      >
        <MenuItem value="">All Companies</MenuItem>
        {companies.map((company, index) => (
          <MenuItem key={index} value={company}>
            {company}
          </MenuItem>
        ))}
      </TextField>

      {/* Signup Form Modal */}
      <Modal open={showSignupForm} onClose={() => setShowSignupForm(false)}>
        <Box sx={{ padding: 4, backgroundColor: 'white', margin: 'auto', width: 400, boxShadow: 3, borderRadius: 2 }}>
          <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ color: 'primary.main' }}>
            Alumni Signup
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="name"
              value={alumniData.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              variant="outlined"
            />

            <TextField
              label="Email"
              name="email"
              value={alumniData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              margin="normal"
              required
              variant="outlined"
            />

            <Box sx={{ display: 'flex', alignItems: 'center', marginY: 2 }}>
              <Switch
                checked={alumniData.showEmail}
                onChange={() => setAlumniData({ ...alumniData, showEmail: !alumniData.showEmail })}
                name="showEmail"
              />
              <Typography variant="body2">Show Email</Typography>
            </Box>

            <TextField
              label="Company"
              name="company"
              value={alumniData.company}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              variant="outlined"
            />

            <TextField
              label="Advice"
              name="advice"
              value={alumniData.advice}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              margin="normal"
              variant="outlined"
            />

            <Button variant="contained" component="label" fullWidth sx={{ marginTop: 2 }}>
              Upload Picture
              <input type="file" hidden onChange={handleFileUpload} />
            </Button>

            <TextField
              label="Calendly Link"
              name="calendlyLink"
              value={alumniData.calendlyLink}
              onChange={handleChange}
              error={!!errors.calendlyLink}
              helperText={errors.calendlyLink}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', marginY: 2 }}>
              <Switch
                checked={alumniData.showCalendly}
                onChange={() => setAlumniData({ ...alumniData, showCalendly: !alumniData.showCalendly })}
                name="showCalendly"
              />
              <Typography variant="body2">Show Calendly Link</Typography>
            </Box>

            <TextField
              label="LinkedIn Link"
              name="linkedinLink"
              value={alumniData.linkedinLink}
              onChange={handleChange}
              error={!!errors.linkedinLink}
              helperText={errors.linkedinLink}
              fullWidth
              margin="normal"
              variant="outlined"
            />

            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 3 }}>
              Submit
            </Button>
          </form>
        </Box>
      </Modal>

      {/* Alumni Grid */}
      <Grid container spacing={4} sx={{ marginTop: 4 }}>
        {filteredAlumni.map((alumni, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box
              sx={{
                padding: 3,
                borderRadius: 2,
                boxShadow: 3,
                textAlign: 'center',
                backgroundColor: '#f9f9f9',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <Avatar
                src={alumni.picture || ''}
                alt={alumni.name}
                sx={{ width: 80, height: 80, margin: '0 auto', marginBottom: 2 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {alumni.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', marginBottom: 1 }}>
                {alumni.company}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: 2 }}>
                {alumni.advice}
              </Typography>
              {alumni.showEmail && <Typography variant="body2">{alumni.email}</Typography>}
              {alumni.showCalendly && (
                <Button
                  variant="outlined"
                  href={alumni.calendlyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ marginTop: 1 }}
                >
                  Book a Chat
                </Button>
              )}
              {alumni.linkedinLink && (
                <Button
                  variant="outlined"
                  href={alumni.linkedinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ marginTop: 1 }}
                >
                  View LinkedIn
                </Button>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default AlumniConnect;
