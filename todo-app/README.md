# Todo Full-Stack Web Application with Authentication

A modern and vibrant todo application built with Next.js, TypeScript, and Tailwind CSS. This application allows users to manage their tasks efficiently with features like user authentication, dark/light mode, multilingual support, and a simulated chatbot assistant.

## Features

- **User Authentication**: Secure registration and login with JWT-based authentication
- **Task Management**: Create, read, update, and delete todo items
- **Enhanced Toggle UX**: Intuitive and responsive completion toggles with visual feedback
  - Smooth animations and transitions
  - Hover effects with subtle scaling
  - Clear visual distinction between completed/incomplete states
  - Immediate feedback on state changes with optimistic updates
  - Dedicated backend endpoint for faster response
- **Bulk Operations**: Select and delete multiple todo items at once with confirmation dialog
- **Improved Bulk UX**: Visual indicators for selection state, clear action buttons, and confirmation flow
  - Dedicated "Bulk Delete" button to activate selection mode
  - Button changes to "Cancel Bulk Delete" when active
  - Toggle between normal mode (completion toggles) and bulk mode (selection checkboxes)
  - First visible item is automatically selected to enable immediate bulk operations
  - Visual highlighting of selected items with enhanced animations
  - Floating action bar that appears when items are selected
  - Inline confirmation with enhanced text to prevent accidental deletions
  - Loading states with spinner during bulk operations
  - Progress indicators showing deletion status
  - Other buttons hidden during confirmation for focused decision making
  - Enhanced hover and selection animations for better feedback
  - Easy dismissal with main button serving as cancel when in bulk mode
  - Cancel button available directly in the floating action bar
  - Automatic deactivation after successful deletion or when all items are deselected
- **Filtering & Sorting**: Filter tasks by status (active/completed) and priority (low/medium/high)
- **Activity Logs**: Track and view history of todo actions (create, update, delete)
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
- **Authentication**: Better Auth with JWT tokens

## Getting Started

### Prerequisites

- Node.js (version 18.x or higher)
- npm (version 8.x or higher)
- Backend API server running (see backend documentation)

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

3. Copy the example environment file and update the values as needed:
   ```bash
   cp .env.example .env.local
   ```

   Then update the values in `.env.local` according to your environment:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_APP_NAME=Todo App
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Environment Variables

- `NEXT_PUBLIC_API_URL`: The URL of the backend API server
- `NEXT_PUBLIC_APP_NAME`: The name of the application (displayed in the UI)

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Create a production build
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for code issues
- `npm run test` - Run tests (if configured)

## API Integration

This frontend is designed to connect with a Python FastAPI backend with JWT-based authentication. The API service is located in `src/services/api.ts` and the todo-specific API functions are in `src/services/todoApi.ts`.

### Connecting to the Backend

1. Ensure the backend server is running (typically on `http://localhost:8000`)
2. Update the `NEXT_PUBLIC_API_URL` in your `.env.local` file to point to your backend:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
3. The frontend will automatically connect to the backend API for all todo operations

### Backend Endpoints Used

The frontend connects to these backend endpoints:
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user and return JWT token
- `POST /api/auth/logout` - Logout user (invalidate session)
- `GET /api/todos` - Retrieve all todos for authenticated user
- `POST /api/todos` - Create a new todo for authenticated user
- `GET /api/todos/{id}` - Get a specific todo for authenticated user
- `PUT /api/todos/{id}` - Update a specific todo for authenticated user
- `DELETE /api/todos/{id}` - Delete a specific todo for authenticated user
- `GET /api/todos/logs` - Get activity logs for authenticated user
- `GET /health` - Check backend health status

### Authentication Flow

1. User registers or logs in via the authentication endpoints
2. JWT token is received and stored in secure HTTP-only cookies
3. JWT token is sent in Authorization header for all protected API requests
4. Backend validates JWT and ensures users can only access their own data

### Data Mapping

The frontend includes adapter functions in `src/services/backendAdapters.ts` to convert between frontend and backend data structures, handling differences in naming conventions (camelCase vs snake_case) and data types.

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
- [Better Auth](https://better-auth.com/) for the authentication solution

## Repository Links

- **Frontend Repository**: [Todo-Full-Stack-Web-App](https://github.com/Umair4444/Todo-Full-Stack-Web-App) - The Next.js frontend application
- **Backend Repository**: [Hugging Face Space](https://huggingface.co/spaces/Umair44) - The FastAPI backend deployed as a Hugging Face Space