# Contributing to CampusFlow

Thank you for considering contributing to CampusFlow! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/student-portal.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Push to your fork: `git push origin feature/your-feature-name`
6. Open a Pull Request

## How to Contribute

### Reporting Bugs

- Use the [GitHub Issues](https://github.com/NAQEEB26/student-portal/issues) page
- Check if the issue already exists before creating a new one
- Include steps to reproduce, expected behavior, and actual behavior
- Include screenshots if applicable

### Suggesting Features

- Open an issue with the `enhancement` label
- Describe the feature and its use case
- Explain why it would be beneficial

### Code Contributions

- Fix bugs listed in Issues
- Implement features from the roadmap
- Improve documentation
- Write or improve tests
- Refactor code for better maintainability

## Development Setup

### Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- A Supabase account (free tier works)

### Installation

```bash
# Clone the repository
git clone https://github.com/NAQEEB26/student-portal.git
cd student-portal

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Fill in your Supabase credentials in .env
# Then deploy the database schema
npm run deploy

# Run tests
npm test
```

### Running Locally

```bash
# Start development server (requires a local server like live-server)
npx live-server frontend/

# Or use any static file server of your choice
```

## Pull Request Process

1. **Branch naming**: Use descriptive names like `feature/add-export-csv`, `fix/login-validation`, `docs/update-readme`
2. **Commit messages**: Write clear, concise commit messages following conventional commits:
   - `feat: add student export functionality`
   - `fix: resolve login redirect issue`
   - `docs: update API documentation`
   - `refactor: simplify auth flow`
3. **Description**: Include a clear description of changes in the PR
4. **Tests**: Ensure all existing tests pass (`npm test`)
5. **Review**: Wait for at least one approval before merging
6. **Conflicts**: Resolve any merge conflicts before requesting review

## Coding Standards

### JavaScript

- Use ES6+ syntax (arrow functions, template literals, destructuring)
- Use `const` by default, `let` when reassignment is needed, avoid `var`
- Use meaningful variable and function names
- Add JSDoc comments for public functions
- Handle errors gracefully with try/catch

### HTML/CSS

- Use semantic HTML5 elements
- Follow BEM naming convention for CSS classes
- Ensure responsive design (mobile-first)
- Maintain accessibility (ARIA labels, keyboard navigation)

### File Organization

```
frontend/
├── index.html          # Landing page
├── pages/              # Application pages
├── assets/
│   ├── css/            # Stylesheets
│   └── js/             # JavaScript modules
scripts/                # Backend/deployment scripts
supabase/
├── schema.sql          # Database schema
├── rls-policies.sql    # Security policies
├── seed.sql            # Sample data
└── functions/          # Edge functions
```

### Security Guidelines

- **NEVER** commit secrets, API keys, or credentials
- Use environment variables for all configuration
- Validate all user inputs (client and server-side)
- Follow the principle of least privilege for database access
- Keep dependencies up to date

## Reporting Issues

When reporting issues, please include:

1. **Environment**: OS, browser, Node.js version
2. **Steps to reproduce**: Clear, numbered steps
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Screenshots/Logs**: If applicable
6. **Possible solution**: If you have ideas

## Questions?

Feel free to open a [Discussion](https://github.com/NAQEEB26/student-portal/discussions) for questions that aren't bugs or feature requests.

---

Thank you for contributing! 🎉
