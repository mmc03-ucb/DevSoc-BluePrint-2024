import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  Container,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function CompanyDetails() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [open, setOpen] = useState(false);
  const [updatedCompany, setUpdatedCompany] = useState({
    name: '',
    techStack: '',
    recruiterList: '',
    payAndPerks: '',
    employeeReviews: '',
    taggedAlumni: '',
    linkedinAlumniLink: '',
    taggedQuestions: '',
  });

  useEffect(() => {
    const fetchCompany = async () => {
      const companyDoc = doc(db, 'companies', id);
      const companySnap = await getDoc(companyDoc);
      if (companySnap.exists()) {
        setCompany(companySnap.data());
      }
    };
    fetchCompany();
  }, [id]);

  const handleOpen = () => {
    setUpdatedCompany({
      name: company.name || '',
      techStack: company.techStack?.join(', ') || '',
      recruiterList: company.recruiterList?.join(', ') || '',
      payAndPerks: company.payAndPerks || '',
      employeeReviews: company.employeeReviews || '',
      taggedAlumni: company.taggedAlumni?.join(', ') || '',
      linkedinAlumniLink: company.linkedinAlumniLink || '',
      taggedQuestions: company.taggedQuestions?.join(', ') || '',
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCompany((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const companyDoc = doc(db, 'companies', id);
    const updatedData = {
      ...updatedCompany,
      techStack: updatedCompany.techStack.split(',').map((item) => item.trim()),
      recruiterList: updatedCompany.recruiterList.split(',').map((item) => item.trim()),
      taggedAlumni: updatedCompany.taggedAlumni.split(',').map((item) => item.trim()),
      taggedQuestions: updatedCompany.taggedQuestions.split(',').map((item) => item.trim()),
    };
    await updateDoc(companyDoc, updatedData);
    setCompany(updatedData);
    handleClose();
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {company ? (
        <Box>
          <Typography variant="h4" gutterBottom>{company.name}</Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Tech Stack: {company.techStack?.join(', ')}
          </Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Recruiter List: {company.recruiterList?.join(', ')}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Pay and Perks: {company.payAndPerks}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Employee Reviews: {company.employeeReviews}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Tagged Alumni: {company.taggedAlumni?.join(', ') || 'None'}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <a href={company.linkedinAlumniLink} target="_blank" rel="noopener noreferrer">
              LinkedIn Alumni Link
            </a>
          </Typography>
          <Typography variant="body1" gutterBottom>
            Tagged Questions:
            <ul>
              {company.taggedQuestions?.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>
          </Typography>

          <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mt: 2 }}>
            Edit Details
          </Button>
        </Box>
      ) : (
        <Typography>Loading...</Typography>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Company Details</DialogTitle>
        <DialogContent>
          <TextField margin="dense" name="name" label="Company Name" fullWidth variant="standard" value={updatedCompany.name} onChange={handleChange} />
          <TextField margin="dense" name="techStack" label="Tech Stack" fullWidth variant="standard" value={updatedCompany.techStack} onChange={handleChange} />
          <TextField margin="dense" name="recruiterList" label="Recruiter List" fullWidth variant="standard" value={updatedCompany.recruiterList} onChange={handleChange} />
          <TextField margin="dense" name="payAndPerks" label="Pay and Perks" fullWidth variant="standard" value={updatedCompany.payAndPerks} onChange={handleChange} />
          <TextField margin="dense" name="employeeReviews" label="Employee Reviews" fullWidth variant="standard" value={updatedCompany.employeeReviews} onChange={handleChange} />
          <TextField margin="dense" name="taggedAlumni" label="Tagged Alumni" fullWidth variant="standard" value={updatedCompany.taggedAlumni} onChange={handleChange} />
          <TextField margin="dense" name="linkedinAlumniLink" label="LinkedIn Alumni Link" fullWidth variant="standard" value={updatedCompany.linkedinAlumniLink} onChange={handleChange} />
          <TextField margin="dense" name="taggedQuestions" label="Tagged Questions" fullWidth variant="standard" value={updatedCompany.taggedQuestions} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default CompanyDetails;
