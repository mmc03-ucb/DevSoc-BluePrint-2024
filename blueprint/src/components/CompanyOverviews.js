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
} from '@mui/material';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase'; // Ensure storage is imported

function CompanyOverviews() {
  const [companyData, setCompanyData] = useState([]);
  const [open, setOpen] = useState(false); // State to control dialog visibility
  const [newCompany, setNewCompany] = useState({
    name: '',
    techStack: '',
    recruiterList: '',
    payAndPerks: '',
    employeeReviews: '',
    icon: null, // Updated to handle file
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      const companySnapshot = await getDocs(collection(db, 'companies'));
      const companies = companySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCompanyData(companies);
    };

    fetchCompanies();
  }, []);

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
        techStack: newCompany.techStack.split(',').map((item) => item.trim()),
        recruiterList: newCompany.recruiterList.split(',').map((item) => item.trim()),
      };
      await addDoc(collection(db, 'companies'), formattedCompany);

      // Refresh the company list after adding a new entry
      const updatedCompanies = await getDocs(collection(db, 'companies'));
      setCompanyData(updatedCompanies.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
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
          Learn more about companies, their culture, tech stack, and connect with alumni.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mt: 2 }}>
          Add Company
        </Button>
      </Box>

      <Grid container spacing={4}>
        {companyData.map((company) => (
          <Grid item key={company.id} xs={12} sm={6} md={4}>
            <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardActionArea component={Link} to={`/company-details/${company.id}`}>
                <CardContent>
                  <Box component="img" src={company.icon} alt={`${company.name} logo`} sx={{ height: 100, width: 'auto', marginBottom: 2 }} />
                  <Typography variant="h5" component="div" gutterBottom>
                    {company.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Tech Stack: {company.techStack.join(', ')}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Recruiters: {company.recruiterList?.join(', ')}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Pay and Perks: {company.payAndPerks}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Employee Reviews: {company.employeeReviews}
                  </Typography>
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
          <TextField margin="dense" name="name" label="Company Name" type="text" fullWidth variant="standard" value={newCompany.name} onChange={handleChange} />
          <TextField margin="dense" name="techStack" label="Tech Stack" type="text" fullWidth variant="standard" value={newCompany.techStack} onChange={handleChange} />
          <TextField margin="dense" name="recruiterList" label="Recruiters" type="text" fullWidth variant="standard" value={newCompany.recruiterList} onChange={handleChange} />
          <TextField margin="dense" name="payAndPerks" label="Pay and Perks" type="text" fullWidth variant="standard" value={newCompany.payAndPerks} onChange={handleChange} />
          <TextField margin="dense" name="employeeReviews" label="Employee Reviews" type="text" fullWidth variant="standard" value={newCompany.employeeReviews} onChange={handleChange} />

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
