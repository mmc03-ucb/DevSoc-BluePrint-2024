import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Container,
  Box,
  Button,
  Avatar,
} from '@mui/material';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';

function CompanyDetails() {
  const { id } = useParams(); // Get company ID from URL
  const [company, setCompany] = useState(null);
  const [alumniData, setAlumniData] = useState([]);

  useEffect(() => {
    const fetchCompany = async () => {
      const companyDoc = doc(db, 'companies', id);
      const companySnap = await getDoc(companyDoc);
      if (companySnap.exists()) {
        setCompany({ id: companySnap.id, ...companySnap.data() });
      }
    };

    const fetchAlumni = async () => {
      const alumniSnapshot = await getDocs(collection(db, 'alumni'));
      const alumniList = alumniSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAlumniData(alumniList);
    };

    fetchCompany();
    fetchAlumni();
  }, [id]);

  const getCompanyAlumni = () => {
    return alumniData.filter((alumni) => alumni.company === company?.name);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {company ? (
        <Box>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              {company.name}
            </Typography>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Tech Stack: {company.techStack.join(', ')}
            </Typography>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Recruiters: {company.recruiterList?.join(', ')}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Pay and Perks: {company.payAndPerks}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Employee Reviews: {company.employeeReviews}
            </Typography>
          </Box>

          {/* Alumni Section */}
          <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
            Alumni
          </Typography>
          <Grid container spacing={4}>
            {getCompanyAlumni().map((alumni) => (
              <Grid item xs={12} sm={6} md={4} key={alumni.id}>
                <Card
                  variant="outlined"
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}
                >
                  <Avatar
                    src={alumni.picture || ''}
                    alt={alumni.name}
                    sx={{ width: 80, height: 80, marginBottom: 2 }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {alumni.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {alumni.company}
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
                    {alumni.advice}
                  </Typography>
                  {alumni.linkedinLink && (
                    <Button
                      variant="outlined"
                      href={alumni.linkedinLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ mt: 1 }}
                    >
                      View LinkedIn
                    </Button>
                  )}
                  {alumni.showCalendly && alumni.calendlyLink && (
                    <Button
                      variant="outlined"
                      href={alumni.calendlyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ mt: 1 }}
                    >
                      Book a Chat
                    </Button>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Container>
  );
}

export default CompanyDetails;
