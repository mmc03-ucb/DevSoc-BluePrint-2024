# DevSoc BluePrint Hackaathon 2024
### Active Tasks (Farhan):
For each component in src/components, create a landing page with the name of the component in text.Example for dynamic leetcode (already done):

import React from 'react';
import { Typography, Container } from '@mui/material';

function DynamicLeetCodeList() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h2" align="center">
        Dynamic LeetCode List
      </Typography>
    </Container>
  );
}

export default DynamicLeetCodeList;

### General Guidelines:

- Write clean, well-documented code with appropriate comments.
- Ensure the design is simple, user-friendly, and visually appealing.

### Task Distribution:

1. **Dynamic LeetCode List** - *Muqueet*
   - Implement a dynamic problem list similar to Grind75.
   - Tailor suggestions based on time left, company preferences, and current preparation level.

2. **Company Overviews** - *Farhan*
   - Collect and display information on companies:
     - Name, tech stack, recruiter list.
     - Pay and perks.
     - Employee reviews.
     - Tagged alumni from our list.
     - General LinkedIn link to see more UNSW alumni in the company.
     - Tagged questions link/list related to the company.

3. **General Resources** - *Farhan*
   - Compile crowdsourced guides and general advice for:
     - Resume building.
     - Interview preparation.
     - Other job search resources.

4. **Alumni Connect** - *Muqueet*
   - Create a signup form for alumni.
   - Implement status indicators for alumni availability to:
     - Connect for networking.
     - Provide mock interviews.
     - Offer career advice.

5. **Job Board** - *Muqueet*
   - Build a job posting system with:
     - Filters for work rights.
     - Auto-removal of expired listings.
     - Notifications when new jobs are posted.

6. **Upcoming Events and Competitions** - *Farhan*
   - Maintain a section that lists relevant events, hackathons, or competitions.

---

### Optional Task:

- **Discussion Board** - *Muqueet*
  - Implement a discussion board where users can engage with one another.


