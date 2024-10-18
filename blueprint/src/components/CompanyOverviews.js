import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Rating, // Import Rating for star reviews
} from '@mui/material';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase'; // Ensure storage is imported

function CompanyOverviews() {
  const [companyData, setCompanyData] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]); // Filtered companies based on search
  const [open, setOpen] = useState(false); // State to control dialog visibility
  const [newCompany, setNewCompany] = useState({
    name: '',
    recruiterList: '', // Comma-separated string of recruiters and LinkedIn URLs
    payAndPerks: '',
    employeeReviews: 3, // Default employee review stars
    icon: null, // Updated to handle file
  });
  const [searchTerm, setSearchTerm] = useState(''); // Search state
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      const companySnapshot = await getDocs(collection(db, 'companies'));
      const companies = companySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCompanyData(companies);
      setFilteredCompanies(companies); // Initially show all companies
    };

    fetchCompanies();
  }, []);

  // Handle search input change and filter companies
  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = companyData.filter((company) =>
      company.name.toLowerCase().includes(searchValue)
    );
    setFilteredCompanies(filtered);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCompany((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewCompany((prev) => ({ ...prev, icon: file }));
  };

  const handleRatingChange = (event, newValue) => {
    setNewCompany((prev) => ({ ...prev, employeeReviews: newValue }));
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);

      // If an icon file is selected, upload it to Firebase Storage
      let iconURL = '';
      if (newCompany.icon) {
        const storageRef = ref(storage, `companyIcons/${new Date().getTime()}_${newCompany.icon.name}`);
        const uploadTask = uploadBytesResumable(storageRef, newCompany.icon);

        // Wait for the upload to complete
        const snapshot = await uploadTask;
        iconURL = await getDownloadURL(snapshot.ref); // Get the download URL for the icon
      }

      // Add the new company to Firestore with the icon URL
      const formattedCompany = {
        ...newCompany,
        icon: iconURL, // Store the uploaded icon URL
        recruiterList: newCompany.recruiterList
          .split(',')
          .map((item) => {
            const [name, linkedin] = item.trim().split('|'); // Split recruiter name and LinkedIn URL using "|"
            return { name: name.trim(), linkedin: linkedin?.trim() || '' }; // Return formatted recruiter object
          }),
      };
      await addDoc(collection(db, 'companies'), formattedCompany);

      // Refresh the company list after adding a new entry
      const updatedCompanies = await getDocs(collection(db, 'companies'));
      const companies = updatedCompanies.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCompanyData(companies);
      setFilteredCompanies(companies); // Update filtered companies after adding a new one
      handleClose(); // Close dialog
    } catch (error) {
      console.error('Error adding company:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h4" gutterBottom>
          Company Overviews
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Learn more about companies, their culture, and recruiters.
        </Typography>

        {/* Search Bar */}
        <TextField
          label="Search Companies"
          variant="outlined"
          fullWidth
          sx={{ mt: 2, mb: 4 }}
          value={searchTerm}
          onChange={handleSearchChange}
        />

        <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mt: 2 }}>
          Add Company
        </Button>
      </Box>

      <Grid container spacing={4}>
        {filteredCompanies.map((company) => (
          <Grid item key={company.id} xs={12} sm={6} md={4}>
            <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardActionArea component={Link} to={`/company-details/${company.id}`}>
                <CardContent>
                  <Box component="img" src={company.icon} alt={`${company.name} logo`} sx={{ height: 100, width: 'auto', marginBottom: 2 }} />
                  <Typography variant="h5" component="div" gutterBottom>
                    {company.name}
                  </Typography>

                  {/* Recruiters */}
                  <Typography variant="body2" color="textSecondary">
  Recruiters:
  {(Array.isArray(company.recruiterList) ? company.recruiterList : []).map((recruiter, index) => (
    <span key={index} style={{ marginLeft: 5 }}>
      {recruiter.name.includes('https') ? '' : recruiter.name}
    </span>
  ))}
</Typography>


                  <Typography variant="body2" color="textSecondary">
                    Perks: {company.payAndPerks}
                  </Typography>

                  {/* Star-based Employee Reviews */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>
                      Alumni Rating:
                    </Typography>
                    <Rating value={company.employeeReviews || 3} readOnly size="small" />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Company Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Company</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Company Name"
            type="text"
            fullWidth
            variant="standard"
            value={newCompany.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="recruiterList"
            label="Recruiters (Format: Name|LinkedIn, Name|LinkedIn)"
            type="text"
            fullWidth
            variant="standard"
            value={newCompany.recruiterList}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="payAndPerks"
            label="Perks"
            type="text"
            fullWidth
            variant="standard"
            value={newCompany.payAndPerks}
            onChange={handleChange}
          />

          {/* Star rating input for employee reviews */}
          <Typography component="legend" sx={{ mt: 2 }}>
            Employee Reviews
          </Typography>
          <Rating name="employeeReviews" value={newCompany.employeeReviews} onChange={handleRatingChange} size="large" />

          {/* File Input for Icon */}
          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Upload Company Icon
            <input type="file" hidden onChange={handleFileChange} />
          </Button>

          {uploading && <Typography variant="body2" color="textSecondary">Uploading...</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={uploading}>
            {uploading ? 'Adding...' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default CompanyOverviews;
