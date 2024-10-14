# DevSoc BluePrint Hackaathon 2024
### Active Tasks (Farhan):
### 1. URL Trimming
When a LeetCode URL is inserted, e.g.  
`https://leetcode.com/problems/populating-next-right-pointers-in-each-node/description/`  
Automatically trim the `/description/` part.  
The resulting URL should be:  
`https://leetcode.com/problems/populating-next-right-pointers-in-each-node/`

### 2. Relevant Code for Trimming:

```jsx
{/* Conditional Contribution Form */}
{showContributeForm && (
  <form onSubmit={showDifficultyField ? handleAddNewProblem : handleContribute} style={{ marginTop: '16px' }}>
    {/* Leetcode Link Input */}
    <TextField
      label="Leetcode Problem Link"
      value={contributeLink}
      onChange={(e) => setContributeLink(e.target.value)}
      fullWidth
      margin="normal"
      required
    />
  </form>
)}
```

### 3. Title Extraction from URL
When extracting the title from the URL, ensure each word starts with a capital letter.

#### Relevant Code for Title Extraction:
```javascript
const extractTitleFromURL = (url) => {
    const slug = url.split("/problems/")[1].split("/")[0];  // Extract the problem slug
    const title = slug.replace(/-/g, " ");  // Replace hyphens with spaces
    return title.charAt(0).toUpperCase() + title.slice(1);  // Capitalize the first letter
};

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


