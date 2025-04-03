# Book Management App - Frontend

A modern, responsive web application for managing your book collection. Built with React, TypeScript, and TailwindCSS.

## Features

- 📚 View your complete book collection
- ➕ Add new books to your collection
- ✏️ Edit existing book details
- 🗑️ Delete books from your collection
- 🔐 Secure authentication integration
- 🎨 Modern and responsive UI design

## Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **Routing:** React Router v7
- **Icons:** Heroicons
- **Package Manager:** Bun
- **Testing:**
  - Unit Tests: Vitest
  - E2E Tests: Cypress
  - Testing Library: React Testing Library

## Prerequisites

- Node.js (v18 or higher)
- Bun package manager

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   ```
   VITE_API_URL=your_backend_api_url
   ```

5. Start the development server:
   ```bash
   bun run dev
   ```

The application will be available at `http://localhost:5173`

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run test` - Run unit tests
- `bun run test:ui` - Run unit tests with UI
- `bun run test:coverage` - Run unit tests with coverage report
- `bun run cypress:open` - Open Cypress test runner
- `bun run cypress:run` - Run Cypress tests in headless mode
- `bun run test:e2e` - Run end-to-end tests
- `bun run lint` - Run ESLint

## Project Structure

```
frontend/
├── src/
│   ├── assets/         # Static assets
│   ├── components/     # Reusable UI components
│   ├── config/         # Configuration files
│   ├── pages/          # Page components
│   ├── services/       # API and service layer
│   ├── types/          # TypeScript type definitions
│   ├── test/           # Test files
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles
├── public/             # Public static files
├── cypress/            # End-to-end tests
└── node_modules/       # Dependencies
```

## Testing

The project includes a comprehensive testing setup with the following features:

### Unit Tests
- **Framework:** Vitest with React Testing Library
- **Coverage:** Jest DOM matchers for DOM testing
- **Mocking:** Built-in mocking capabilities for API calls and browser APIs
- **Test Structure:** Organized by component with separate test files

### Test Files Organization
```
src/
├── components/
│   └── __tests__/           # Component-specific tests
│       ├── BookList.test.tsx
│       └── BookForm.test.tsx
├── test/
│   ├── setup.ts            # Global test setup
│   └── utils.ts            # Test utilities and mocks
└── vitest.config.ts        # Vitest configuration
```

### Running Tests
```bash
# Run all tests
bun run test

# Run tests with UI
bun run test:ui

# Run tests with coverage report
bun run test:coverage

# Run tests in watch mode
bun run test --watch
```

### Test Coverage
The test suite covers:
- Component rendering
- User interactions
- Form validation
- API integration
- Error handling
- Loading states
- Navigation
- Data management

### Testing Best Practices
- Mock external dependencies (API calls, browser APIs)
- Test both success and error scenarios
- Validate form inputs and user interactions
- Test component lifecycle and side effects
- Use semantic queries for better maintainability
- Follow the Arrange-Act-Assert pattern

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/) 