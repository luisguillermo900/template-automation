# Template Automation System

A comprehensive system for managing requirements engineering artifacts and templates, supporting the entire process from interviews and evidence gathering to specification creation.

## Overview

The Template Automation System is a full-stack application designed to streamline and automate the requirements engineering process. It provides organizations with tools to manage projects, conduct and document interviews, track evidence, create and maintain specifications, and manage various artifacts related to software requirements.

## Features

- **Organization Management**: Create and manage multiple organizations
- **Project Management**: Set up and organize projects within organizations
- **Interview Management**: Schedule, conduct, and document interviews with stakeholders
- **Evidence Tracking**: Upload and manage evidence files from various sources
- **Requirements Engineering**:
  - Document elicitation (educciones) from stakeholders
  - Create and maintain specifications (ilaciones)
  - Link requirements through a structured process
- **Actor Management**: Track all stakeholders and their roles in projects
- **Risk Management**: Document and track risks associated with requirements
- **Non-Functional Requirements**: Document and manage NFRs
- **Acceptance Records**: Generate and manage acceptance records for project deliverables
- **Role-Based Access Control**: Manage user permissions through customizable roles

## Tech Stack

### Backend

- **Node.js** with **Express.js** framework
- **TypeScript** for type-safe code
- **Prisma ORM** for database operations
- **PostgreSQL** database
- **JWT** for authentication
- **Multer** for file uploads
- **PDFKit** for PDF generation
- **ExcelJS** for Excel file generation

### Frontend

- **React** with functional components
- **React Router** for navigation
- **Axios** for API communication
- **CSS** for styling

## Getting Started

### Prerequisites

- Node.js (v16.0.0 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd template-automation-system
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Set up environment variables in the backend:
   Create a `.env` file in the backend directory with the following variables:

   ```
   PORT=5000
   DATABASE_URL=postgresql://username:password@localhost:5432/your_database
   DIRECT_URL=postgresql://username:password@localhost:5432/your_database
   JWT_SECRET=your_jwt_secret
   ```

4. Run Prisma migrations:

   ```bash
   npx prisma migrate deploy
   ```

5. Install frontend dependencies:

   ```bash
   cd ../frontend
   npm install
   ```

6. Start the development servers:

   In the backend directory:

   ```bash
   npm run dev
   ```

   In the frontend directory:

   ```bash
   npm start
   ```

## Project Structure

### Backend

- `src/app.ts`: Main application entry point
- `src/modules/`: Feature-specific modules
  - `auth/`: Authentication logic
  - `organizations/`: Organization management
  - `projects/`: Project management
  - `interviews/`: Interview functionality
  - `templates/`: Templates for requirements
  - `experts/`: Expert management
  - And many more specialized modules
- `prisma/`: Database schema and migrations

### Frontend

- `src/App.js`: Main React component
- `src/view/`: React views/pages
- `src/styles/`: CSS styles
- `src/iconos/`: Icons and images

## Database Schema

The system uses a relational database with a rich schema including entities for:

- Organizations
- Projects
- Users and Authors
- Interviews
- Evidence
- Requirements (Educciones)
- Specifications (Ilaciones)
- Actors
- Roles
- Risks
- And more

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Contact

For any inquiries or support, please contact the project maintainers.
