# Grade - Assessment Management System (Frontend)

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🎯 Overview

Grade is a modern, responsive web application for comprehensive assessment management, designed to streamline the process of creating, managing, and evaluating student assessments. This repository contains the **frontend application** built with Next.js that provides an intuitive user interface for the Grade platform.

> **Note**: This is the frontend repository. The backend API is available in a separate repository: [Grade Backend Repository](https://github.com/tiago-ferrer/grade)

## 🚀 Live Application

**Access the application online**: [https://grade.use3w.com](https://grade.use3w.com)

## ✨ Features

### 🏫 Class Management
- Create and organize educational classes
- Manage class enrollment and student lists
- Track class progress and performance metrics

### 📊 Assessment Tools
- Interactive assessment creation interface
- Multiple question types and formats
- Real-time assessment configuration
- Bulk student upload via CSV

### 👨‍🎓 Student Administration
- Student enrollment management
- Individual performance tracking
- Progress monitoring and analytics

### 🤖 AI-Powered Evaluation
- Automated assessment grading
- Intelligent feedback generation
- Performance analysis and insights

### 🔐 Authentication & Security
- Google OAuth integration
- Secure session management
- Role-based access control

### 🎨 Modern User Experience
- Responsive design for all devices
- Dark/light theme support
- Intuitive navigation and workflows
- Real-time updates and feedback

## 🛠️ Technology Stack

### Core Framework
- **Next.js 15.0** - Full-stack React framework with App Router
- **React 18.2** - Component-based UI library
- **TypeScript 5.7** - Type-safe JavaScript

### Styling & UI
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful & consistent icons
- **next-themes** - Dark/light theme switching

### Authentication & Forms
- **NextAuth.js 4.24** - Authentication for Next.js
- **React Hook Form 7.54** - Performant forms with easy validation
- **Zod 3.23** - TypeScript-first schema validation

### Containerization
- **Docker** - Containerized deployment
- **Docker Compose** - Multi-container orchestration

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js 18.19** or higher
- **pnpm** (recommended) or npm/yarn
- **Docker & Docker Compose** (optional, for containerized deployment)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/tiago-ferrer/grade-frontend.git
cd grade-frontend
```

### 2. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

### 3. Environment Configuration

Copy the example environment file and configure your variables:

```bash
cp .env.example .env
```

Update `.env` with your configuration:

```bash
# FRONTEND ENVS
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
BACKEND_URL=http://localhost:3010

# BACKEND ENVS (for Docker Compose)
GRADE_DB_URL=jdbc:mysql://localhost:3306/grade
GRADE_DB_USER=your_db_username
GRADE_DB_PASSWORD=your_db_password
GRADE_OPENAI_KEY=your_openai_key_or_none
```

### 4. Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins
6. Add your callback URL: `http://localhost:3000/api/auth/callback/google`

### 5. Run the Application

#### Development Mode

```bash
# Using pnpm
pnpm dev

# Using npm
npm run dev

# Using yarn
yarn dev
```

#### Production Build

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

#### Using Docker (Development)

```bash
# Run frontend only
docker build -t grade/web .
docker run -p 3000:3000 --env-file .env.local grade/web
```

#### Using Docker Compose (Full Stack)

```bash
# Run complete application stack (frontend + backend + database)
docker-compose up -d
```

The application will be available at:
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:3010`
- **Database**: `localhost:3306`

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (home)/            # Protected routes group
│   │   ├── assessments/   # Assessment management
│   │   ├── classes/       # Class management
│   │   ├── dashboard/     # Main dashboard
│   │   └── evaluate/      # Assessment evaluation
│   ├── @modal/            # Parallel routes for modals
│   ├── api/               # API routes
│   └── auth/              # Authentication pages
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── auth/             # Authentication components
│   └── header/           # Navigation components
├── context/              # React context providers
├── hooks/                # Custom React hooks
├── http/                 # HTTP client utilities
├── helper/               # Utility functions
├── lib/                  # Third-party library configurations
└── utils/                # General utility functions
```

## 🔒 Authentication Flow

The application uses NextAuth.js with Google OAuth:

1. **Unauthenticated users** are redirected to `/auth/signin`
2. **Google OAuth** handles authentication
3. **Session tokens** are stored securely in cookies
4. **Middleware** protects routes and handles redirects
5. **Authenticated users** access the dashboard and features

## 🎨 Theming & Styling

### Design System
- Built with **Tailwind CSS** for utility-first styling
- **Radix UI** components for accessibility
- **CVA (Class Variance Authority)** for component variants
- Support for **dark/light themes**

### Customization
- Modify `tailwind.config.ts` for theme customization
- Update CSS variables in `globals.css`
- Component variants in `src/components/ui/`

## 🧪 Code Quality

### Linting & Formatting
```bash
# Run Biome linter and formatter
pnpm check:write
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | ✅ |
| `NEXTAUTH_SECRET` | NextAuth.js encryption secret | ✅ |
| `NEXTAUTH_URL` | Application URL | ✅ |
| `BACKEND_URL` | Backend API URL | ✅ |

### Next.js Configuration

Key configurations in `next.config.ts`:
- **Image optimization** for Google profile pictures
- **TypeScript error handling** for development
- **Standalone output** for Docker deployment

## 🗺️ Roadmap

- [x] **Phase 1 - Core Features**
  - [x] Authentication with Google OAuth
  - [x] Class management interface
  - [x] Student administration
  - [x] Assessment creation and management
  - [x] Real-time evaluation system
  - [x] Responsive design implementation
  - [x] Dark/light theme support

- [ ] **Phase 2 - Enhanced Features**
  - [ ] Advanced analytics dashboard
  - [ ] Bulk operations interface
  - [ ] Enhanced accessibility features
  - [ ] Advanced reporting tools

- [ ] **Phase 3 - Advanced Integrations**
  - [ ] Multi-language support (i18n)
  - [ ] Advanced user roles and permissions
  - [ ] Integration with learning management systems
  - [ ] Enhanced AI-powered features

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add some amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow **TypeScript** best practices
- Use **Biome** for code formatting
- Write **meaningful commit messages**
- Add **proper error handling**
- Ensure **responsive design**
- Test on **multiple devices**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/tiago-ferrer/grade-frontend/issues) page
2. Create a new issue with detailed information about your problem
3. Include relevant error messages and system information