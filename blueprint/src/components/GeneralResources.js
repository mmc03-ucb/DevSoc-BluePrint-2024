import React from 'react';
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function GeneralResources() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h4" gutterBottom>
          General Resources
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Guides for resume building and interview preparation.
        </Typography>
      </Box>

      {/* Resume Building Section */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="resume-building-content"
          id="resume-building-header"
        >
          <Typography variant="h5">Resume Building</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" gutterBottom>
            <strong>General Guidelines:</strong>
            <ul>
              <li>Keep it concise: 1 page for students, 2 pages max for experienced professionals.</li>
              <li>Use bullet points for scannability.</li>
              <li>Tailor your resume to each job by incorporating relevant keywords.</li>
              <li>Start bullet points with strong action verbs (e.g., "Developed," "Managed").</li>
              <li>Quantify your achievements wherever possible (e.g., "Increased sales by 20%").</li>
            </ul>
          </Typography>

          <Typography variant="body1" gutterBottom>
            <strong>Key Sections:</strong>
            <ul>
              <li>Contact Information (Name, LinkedIn, email, portfolio)</li>
              <li>Professional Summary/Objective</li>
              <li>Experience (using action verbs, quantify results)</li>
              <li>Education (GPA, relevant courses, honors)</li>
              <li>Skills (languages, tools, certifications)</li>
              <li>Projects (personal, academic, hackathons)</li>
              <li>Awards and Achievements</li>
            </ul>
          </Typography>

          <Typography variant="body1" gutterBottom>
            <strong>Formatting Tips:</strong>
            <ul>
              <li>Use professional fonts (Arial, Calibri, etc.)</li>
              <li>Be consistent with bullet points and margins.</li>
              <li>Save your resume as a PDF to avoid formatting issues.</li>
            </ul>
          </Typography>

          <Typography variant="body1" gutterBottom>
            <strong>Resume Tools:</strong>
            <ul>
              <li><strong>Canva</strong> - User-friendly resume templates</li>
              <li><strong>Novoresume</strong> - Professional resume builder with industry-specific templates</li>
              <li><strong>Zety</strong> - Comprehensive resume templates and tips</li>
            </ul>
          </Typography>

          <Typography variant="body1">
            <strong>ATS-Friendly Resumes:</strong> Many companies use Applicant Tracking Systems (ATS). Ensure your resume is ATS-compliant by avoiding images and special formatting.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Interview Preparation Section */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="interview-prep-content"
          id="interview-prep-header"
        >
          <Typography variant="h5">Interview Preparation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" gutterBottom>
            <strong>Types of Interviews:</strong>
            <ul>
              <li><strong>Behavioral Interviews:</strong> Use the STAR method (Situation, Task, Action, Result).</li>
              <li><strong>Technical Interviews:</strong> Practice on platforms like LeetCode, HackerRank, and prepare to explain your thought process.</li>
              <li><strong>Case Interviews:</strong> Common in consulting. Practice using business frameworks like SWOT and profitability analysis.</li>
              <li><strong>Phone/Screening Interviews:</strong> Be ready to talk about your resume and why you’re a good fit for the role.</li>
            </ul>
          </Typography>

          <Typography variant="body1" gutterBottom>
            <strong>Common Interview Questions:</strong>
            <ul>
              <li>Tell me about yourself.</li>
              <li>Why do you want to work here?</li>
              <li>What are your strengths and weaknesses?</li>
              <li>Tell me about a challenge you faced and how you overcame it.</li>
              <li>Why should we hire you?</li>
            </ul>
          </Typography>

          <Typography variant="body1" gutterBottom>
            <strong>Technical Interview Prep:</strong>
            <ul>
              <li><strong>Data Structures and Algorithms:</strong> Practice on LeetCode, HackerRank, and GeeksforGeeks.</li>
              <li><strong>System Design:</strong> Familiarize yourself with system scalability, microservices, and databases.</li>
            </ul>
          </Typography>

          <Typography variant="body1" gutterBottom>
            <strong>Behavioral Interview Tips:</strong> Be honest and use the STAR method. Practice mock interviews with platforms like Pramp or with peers.
          </Typography>

          <Typography variant="body1" gutterBottom>
            <strong>Final Preparation:</strong> Research the company, prepare questions, dress appropriately, and follow up with a thank-you email after the interview.
          </Typography>

          <Typography variant="body1">
            <strong>Interview Prep Resources:</strong>
            <ul>
              <li><strong>LeetCode</strong> - Best for coding challenges</li>
              <li><strong>Pramp</strong> - Free mock interview platform</li>
              <li><strong>Glassdoor</strong> - Company-specific interview questions</li>
            </ul>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
}

export default GeneralResources;
