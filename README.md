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

The project includes comprehensive testing setup:

- **Unit Tests:** Using Vitest and React Testing Library
- **End-to-End Tests:** Using Cypress
- **Code Quality:** ESLint for code linting

To run tests:
```bash
# Run unit tests
bun run test

# Run E2E tests
bun run test:e2e
```

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