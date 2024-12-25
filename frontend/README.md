# subziwale UI
subziwale UI is the frontend of the Quick Commerce platform, developed using React. This document provides instructions to build and run the project, ensuring it's ready for deployment on AWS.

## Prerequisites

Before proceeding, ensure the following tools are installed on your local machine:

- **Node.js**: v16 or above [Download here](https://nodejs.org/)
- **npm**: Comes bundled with Node.js
- **Git**: [Download here](https://git-scm.com/)

## Repository

Clone the project from the following repository:

[[https://github.com/revvtch/pyada-ui](https://github.com/revvtch/VeggShopee-Ui.git)]

---

## Setup Instructions

### 1. Clone the Repository

```bash
https://github.com/revvtch/VeggShopee-Ui.git
cd VeggShopee-Ui
npm i
```
### 2. Install Dependencies
Use npm to install the project dependencies:

```npm install```

## Available npm Scripts

The following npm scripts are available for development and production:

- **`npm start`**: Runs the app in development mode.  
  Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

- **`npm run build`**: Builds the app for production to the `build` folder.  
  It optimizes the build for the best performance.

---

## Environment Variables

If the project requires environment variables:

1. Create a `.env` file in the root directory.
2. Add your environment variables in the following format:

   ```env
   REACT_APP_API_URL=https://your-api-url.com
   REACT_APP_API_KEY=your-api-key```

# Production Build Instructions for Pyada UI

## Production Build Instructions

To prepare the project for deployment on AWS:

1. Run the following command to generate a production build:

   ```bash
   npm run build

This creates an optimized build/ directory containing the static files to deploy.

2. The build/ directory is ready to be uploaded to your AWS hosting service, such as:
   - S3 for hosting static websites.
   - EC2 for server-side hosting.

