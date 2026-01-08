# Todo Full-Stack Web Application (Frontend)

A modern and vibrant todo application built with Next.js, TypeScript, and Tailwind CSS. This application allows users to manage their tasks efficiently with features like dark/light mode, multilingual support, and a simulated chatbot assistant.

## Features

- **Task Management**: Create, read, update, and delete todo items
- **Filtering & Sorting**: Filter tasks by status (active/completed) and priority (low/medium/high)
- **Responsive Design**: Works seamlessly across all device sizes
- **Dark/Light Mode**: Toggle between light and dark themes
- **Multilingual Support**: Available in English and Urdu
- **Floating Navbar**: With glass effect that hides on scroll down and appears on scroll up
- **Simulated Chatbot**: Get help and support through the chatbot available on all pages
- **Modern UI**: Built with shadcn/ui components and Framer Motion animations
- **Persistent Storage**: Todos and preferences are saved in localStorage

## Tech Stack

- **Framework**: Next.js 16.0.1
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Sonner
- **Icons**: Lucide React
- **Internationalization**: next-i18next

## Getting Started

### Prerequisites

- Node.js (version 18.x or higher)
- npm (version 8.x or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/todo-full-stack-web-app.git
   cd todo-full-stack-web-app/todo-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Create a production build
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for code issues
- `npm run test` - Run tests (if configured)

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
│   │   ├── navigation/    # Navbar, footer, etc.
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
├── .env                   # Environment variables
├── .env.local             # Local environment variables
├── next.config.ts         # Next.js configuration
├── package.json           # Project dependencies and scripts
├── postcss.config.mjs     # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

## API Integration

This frontend is designed to connect with a Python FastAPI backend. The API service stub is located in `src/services/api.ts` and follows the contract defined in `specs/1-todo-frontend-app/contracts/todo-api-contract.yaml`.

## Internationalization

The application supports both English and Urdu. Translation files are located in `public/locales/`:
- English: `public/locales/en/common.json`
- Urdu: `public/locales/ur/common.json`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) for the excellent React framework
- [shadcn/ui](https://ui.shadcn.com/) for the accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Zustand](https://github.com/pmndrs/zustand) for the lightweight state management
- [Framer Motion](https://www.framer.com/motion/) for the smooth animations