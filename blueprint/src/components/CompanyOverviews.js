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
import { db } from '../firebase';

function CompanyOverviews() {
  const [companyData, setCompanyData] = useState([]);
  const [alumniData, setAlumniData] = useState([]); // Alumni data state
  const [open, setOpen] = useState(false); // State to control dialog visibility
  const [newCompany, setNewCompany] = useState({
    name: '',
    techStack: '',
    recruiterList: '',
    payAndPerks: '',
    employeeReviews: '',
    icon: '',
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      const companySnapshot = await getDocs(collection(db, 'companies'));
      const companies = companySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCompanyData(companies);
    };

    const fetchAlumni = async () => {
      const alumniSnapshot = await getDocs(collection(db, 'alumni'));
      const alumniList = alumniSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAlumniData(alumniList);
    };

    fetchCompanies();
    fetchAlumni();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCompany((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const formattedCompany = {
        ...newCompany,
        techStack: newCompany.techStack.split(',').map((item) => item.trim()),
        recruiterList: newCompany.recruiterList.split(',').map((item) => item.trim()),
      };
      await addDoc(collection(db, 'companies'), formattedCompany);
      
      const updatedCompanies = await getDocs(collection(db, 'companies'));
      setCompanyData(updatedCompanies.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      handleClose();
    } catch (error) {
      console.error('Error adding company:', error);
    }
  };

  // Helper function to filter alumni based on the company
  const getCompanyAlumni = (companyName) => {
    return alumniData.filter((alumni) => alumni.company === companyName);
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

                  {/* Alumni Section */}
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Alumni
                  </Typography>
                  {getCompanyAlumni(company.name).map((alumni) => (
                    <Box key={alumni.id} sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        {alumni.name}
                      </Typography>
                      <Button
                        variant="text"
                        href={alumni.linkedinLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LinkedIn
                      </Button>
                    </Box>
                  ))}
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
          <TextField margin="dense" name="icon" label="Icon URL" type="text" fullWidth variant="standard" value={newCompany.icon} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default CompanyOverviews;
