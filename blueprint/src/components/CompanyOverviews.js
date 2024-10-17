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
} from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function CompanyOverviews() {
  const [companyData, setCompanyData] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const querySnapshot = await getDocs(collection(db, 'companies'));
      const companies = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCompanyData(companies);
    };

    fetchCompanies();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h4" gutterBottom>
          Company Overviews
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Learn more about companies, their culture, tech stack, and connect with alumni.
        </Typography>
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
    </Container>
  );
}

export default CompanyOverviews;
