# Study Hub Website

Welcome to the **Study Hub Website**, a platform that provides structured knowledge, curated roadmaps, smart tracking, and vibrant resources for every student.

![Theme](https://img.shields.io/badge/Theme-Red%20%26%20Black-red.svg)
![Stack](https://img.shields.io/badge/Stack-Node.js%20%7C%20Express%20%7C%20EJS%20%7C%20SQLite-blue.svg)

## Features
- **Curated Paths**: Optimized roadmap steps for different subjects.
- **Progress Loop**: Visual indicators and dashboard metrics.
- **Community Driven**: Access top-rated resources shared globally.
- **Responsive UI**: Modern interface with an interior design theme.
- **Authentication**: Secure login and registration.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- npm

### Local Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/nimishasshine2027/studyhub-website.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm run dev
   ```
4. Open the application in your browser: `http://localhost:3000`

## Deployment

This project includes a GitHub Actions workflow for automated deployment to an Ubuntu server via SSH.

### Prerequisites
1. An Ubuntu server with Docker and Docker Compose installed.
2. Code already cloned on the server in a known path.

### GitHub Secrets Setup
To enable automated deployments, add the following secrets to your GitHub Repository (**Settings > Secrets and variables > Actions**):

| Secret Name | Description |
|-------------|-------------|
| `SSH_HOST` | Server IP or Domain |
| `SSH_USERNAME` | SSH username (e.g., `ubuntu`) |
| `SSH_PRIVATE_KEY` | Contents of your private SSH key |
| `DEPLOY_PATH` | Full path to the project on the server (e.g., `/var/www/studyhub`) |
