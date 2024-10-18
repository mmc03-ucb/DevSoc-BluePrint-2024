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
  CircularProgress,
} from '@mui/material';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { getLeetCodeProblemsByCompany } from '../api';  // Import the function for LeetCode problems

function CompanyDetails() {
  const { id } = useParams(); // Get company ID from URL
  const [company, setCompany] = useState(null);
  const [alumniData, setAlumniData] = useState([]);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      const companyDoc = doc(db, 'companies', id);
      const companySnap = await getDoc(companyDoc);
      if (companySnap.exists()) {
        setCompany({ id: companySnap.id, ...companySnap.data() });

        // Fetch LeetCode problems for this company
        const companyProblems = await getLeetCodeProblemsByCompany(companySnap.data().name);
        setProblems(companyProblems);
      }
    };

    const fetchAlumni = async () => {
      const alumniSnapshot = await getDocs(collection(db, 'alumni'));
      const alumniList = alumniSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAlumniData(alumniList);
    };

    // Fetch company and alumni data
    Promise.all([fetchCompany(), fetchAlumni()])
      .then(() => setLoading(false))
      .catch((error) => console.error("Error fetching data:", error));
  }, [id]);

  const getCompanyAlumni = () => {
    return alumniData.filter((alumni) => alumni.company === company?.name);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {company ? (
        <Box>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              {company.name}
            </Typography>
            <Typography variant="h6" color="textSecondary" gutterBottom>
  {/* Hyperlink the recruiter names to their LinkedIn profile */}
  Recruiters: {company.recruiterList?.map((recruiter, index) => (
    <span key={index}>
      {recruiter.linkedin ? (
        <a href={recruiter.linkedin} target="_blank" rel="noopener noreferrer">
          {recruiter.name}
        </a>
      ) : (
        recruiter.name
      )}
      {index < company.recruiterList.length - 1 && ', '}
    </span>
  ))}
</Typography>

<Typography variant="body1" color="textSecondary" gutterBottom>{company.email && (
  <Typography variant="body1" color="textSecondary" gutterBottom>
    Email: <a href={`mailto:${company.email}`} target="_blank" rel="noopener noreferrer">
      {company.email}
    </a>
  </Typography>
)}
</Typography>

            <Typography variant="body1" gutterBottom>
              Perks: {company.payAndPerks}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Alumni Rating: {company.employeeReviews}
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

          {/* LeetCode Problems Section */}
          <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
            LeetCode Problems Tagged with {company.name}
          </Typography>
          <Grid container spacing={4}>
            {problems.length > 0 ? (
              problems.map((problem) => (
                <Grid item xs={12} sm={6} md={4} key={problem.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6">{problem.title}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Difficulty: {problem.difficulty}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Frequency: {problem.frequency}
                      </Typography>
                      <a href={problem.url} target="_blank" rel="noopener noreferrer">
                        View Problem
                      </a>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography>No LeetCode problems found for {company.name}.</Typography>
            )}
          </Grid>
        </Box>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Container>
  );
}

export default CompanyDetails;
