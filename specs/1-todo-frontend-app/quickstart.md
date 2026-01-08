# Quickstart Guide: Todo Full-Stack Web Application (Frontend)

**Feature**: 1-todo-frontend-app | **Date**: 2026-01-08

## Overview

This guide provides step-by-step instructions to set up, develop, and run the Todo Full-Stack Web Application frontend locally.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **npm**: Version 8.x or higher (comes with Node.js)
- **Git**: For version control
- **Code Editor**: VS Code recommended with TypeScript extensions

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/todo-full-stack-web-app.git
cd todo-full-stack-web-app
```

### 2. Navigate to the Frontend Directory

```bash
cd todo-app
```

### 3. Install Dependencies

```bash
npm install
```

This will install all necessary dependencies including:
- Next.js and React
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Framer Motion
- Sonner for notifications
- Zustand for state management
- Jest and React Testing Library for testing

### 4. Configure Environment Variables

Create a `.env.local` file in the `todo-app` directory:

```env
# API Configuration (for future backend connection)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Internationalization
NEXT_PUBLIC_DEFAULT_LOCALE=en

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 5. Initialize shadcn/ui Components

Follow the official shadcn/ui installation guide to set up components:

```bash
npx shadcn-ui@latest init
```

Then add the required components:

```bash
npx shadcn-ui@latest add button card input label textarea select checkbox dialog
```

## Development

### 1. Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application running.

### 2. Available Scripts

- `npm run dev`: Starts the development server with hot reloading
- `npm run build`: Creates an optimized production build
- `npm run start`: Starts the production server
- `npm run lint`: Runs ESLint to check for code issues
- `npm run test`: Runs all tests
- `npm run test:watch`: Runs tests in watch mode
- `npm run storybook`: Starts Storybook for component development (if configured)

## Project Structure

```
todo-app/
├── public/                 # Static assets (images, favicon, etc.)
│   ├── favicon.ico
│   ├── logo.svg
│   └── images/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn UI components
│   │   ├── layout/        # Layout components (header, footer)
│   │   ├── todo/          # Todo-specific components
│   │   ├── theme/         # Theme provider and toggle
│   │   ├── i18n/          # Internationalization components
│   │   └── chatbot/       # Chatbot components
│   ├── pages/             # Next.js pages
│   │   ├── index.tsx      # Home page
│   │   ├── todo-app.tsx   # Todo application page
│   │   ├── about.tsx      # About page
│   │   ├── contact.tsx    # Contact page
│   │   └── 404.tsx        # 404 error page
│   ├── lib/               # Utilities and shared code
│   │   ├── store.ts       # Zustand store
│   │   ├── types.ts       # TypeScript type definitions
│   │   ├── utils.ts       # Utility functions
│   │   └── constants.ts   # Application constants
│   ├── hooks/             # Custom React hooks
│   │   ├── useLocalStorage.ts
│   │   └── useScrollDirection.ts
│   ├── styles/            # Global styles
│   │   └── globals.css
│   └── services/          # Service layer
│       ├── api.ts         # API service
│       └── storage.ts     # Local storage service
├── __tests__/             # Test files
│   ├── components/
│   ├── pages/
│   └── services/
├── .env                   # Environment variables
├── .env.local             # Local environment variables
├── next.config.ts         # Next.js configuration
├── package.json           # Project dependencies and scripts
├── postcss.config.mjs     # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

## Key Features Setup

### 1. Dark/Light Mode Toggle

The theme toggle is implemented using:
- `components/theme/ThemeProvider.tsx` - Context provider for theme state
- `components/theme/ThemeToggle.tsx` - Toggle button component
- `styles/globals.css` - CSS variables for both themes

### 2. Internationalization (i18n)

Language switching is handled by:
- `components/i18n/LanguageSwitcher.tsx` - Language selector component
- `public/locales/` - Translation files for English and Urdu
- `lib/i18n.ts` - i18n configuration

### 3. Floating Navbar with Glass Effect

Implemented in:
- `components/navigation/FloatingNavbar.tsx` - The navbar component
- Uses Framer Motion for scroll detection
- Tailwind classes for glass effect styling

### 4. Simulated Chatbot

Located in:
- `components/chatbot/ChatbotWidget.tsx` - Floating chatbot widget
- `components/chatbot/ChatWindow.tsx` - Chat interface
- `services/chatbot.ts` - Predefined responses logic

### 5. Todo Management

Core functionality in:
- `components/todo/TodoList.tsx` - Displays and manages todo items
- `components/todo/TodoForm.tsx` - Form for adding/editing todos
- `lib/store.ts` - Zustand store for todo state management

## Testing

### Running Tests

```bash
# Run all tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

Tests are organized by:
- `__tests__/components/` - Component tests using React Testing Library
- `__tests__/pages/` - Page-level integration tests
- `__tests__/services/` - Unit tests for service functions

## Building for Production

### 1. Create Production Build

```bash
npm run build
```

### 2. Start Production Server

```bash
npm start
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to a Git repository
2. Connect your repository to [Vercel](https://vercel.com)
3. Vercel will automatically detect the Next.js app and deploy it

### Environment Variables for Production

Set these environment variables in your deployment platform:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_DEFAULT_LOCALE=en
NODE_ENV=production
```

## Troubleshooting

### Common Issues

1. **Module not found errors**: Run `npm install` to reinstall dependencies
2. **TypeScript errors**: Check `tsconfig.json` and ensure all types are properly defined
3. **Tailwind classes not working**: Verify `tailwind.config.js` and that styles are imported in `_app.tsx`
4. **Hot reload not working**: Restart the development server with `npm run dev`

### Performance Tips

1. **Bundle size**: Use `npm run build` and check the output for large bundles
2. **Image optimization**: Use Next.js Image component for all images
3. **Code splitting**: Use dynamic imports for non-critical components
4. **Animations**: Optimize Framer Motion animations for performance