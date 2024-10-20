# HireVerse - Special Mention in DevSoc's Blueprint Hackathon 2024!

**Team:**  
- **Muqueet Mohsen Chowdhury**  
- **Farhan Bin Masud**

Welcome to **HireVerse**, the platform designed to help UNSW students prepare for technical interviews by providing personalized LeetCode problems, connecting with UNSW alumni, and accessing in-depth company insights. This repository contains the source code for our project, developed as part of the DevSoc Blueprint Hackathon 2024.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

### Problem
Preparing for technical interviews can be overwhelming. While platforms like LeetCode, Grind75, LinkedIn, and others provide helpful resources, they often fall short in delivering:
- Free, accessible, and relevant company-tagged problems.
- Reliable and timely alumni connections for personalized advice and mock interviews.
- Comprehensive company insights specific to the Australian market.

### Solution
**HireVerse** addresses these challenges by offering:
- A personalized LeetCode problem list based on target companies, preparation time, and interview dates.
- An *Alumni Connect* feature that allows students to connect with UNSW alumni for advice, insights, and mock interviews.
- Detailed company overviews with tech stacks, recruiter contacts, perks, and alumni connections — all for free!

## Features
- **Dynamic LeetCode Problem List**  
  Personalized problem sets based on target company and interview date, with problems tagged by UNSW alumni.
  
- **Alumni Connect**  
  Alumni can voluntarily sign up to provide advice and mock interviews, with options to show/hide Calendly links and email addresses.

- **Company Overviews**  
  In-depth insights on tech stacks, perks, recruiter lists, and alumni connections specific to the Australian market.

## Tech Stack
- **Frontend:**  
  - React with Material UI (dark mode, responsive design, accessibility support)

- **Backend:**  
  - Firebase Firestore (database)  
  - Firebase Authentication (user management)  

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/HireVerse.git
   cd HireVerse
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Firebase:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Set up Firestore and Firebase Authentication.
   - Add your Firebase config file to the project.

4. **Run the application:**
   ```bash
   npm start
   ```

## Usage
1. Navigate to the landing page where you can explore:
   - **Personalized LeetCode List:** Enter target company and interview date to receive a personalized problem list.
   - **Alumni Connect:** View available alumni, request advice, or schedule mock interviews.
   - **Company Overviews:** Explore company insights, including tech stacks, perks, and recruiter details.

2. Customize your experience by signing in with your Firebase account to save your progress, bookmark alumni, and access additional features.

## Contributing
We welcome contributions to make *HireVerse* even better! To contribute:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-branch-name`
5. Open a pull request and describe your changes.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
