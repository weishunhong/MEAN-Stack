# Wilsons - Next.js Migration

This project has been migrated from a MEAN stack (MongoDB, Express, Angular, Node.js) to a modern Next.js application with React and TypeScript.

## Features

- **User Authentication**: Sign up, sign in, and password reset functionality
- **Real-time Updates**: Socket.io integration for live meow updates
- **Social Feed**: Post and view "meows" (similar to tweets)
- **Audit Trail**: Track all user actions
- **Modern UI**: Built with Tailwind CSS and responsive design

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **Real-time**: Socket.io
- **Password Hashing**: bcryptjs

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/wilsons
JWT_SECRET=your-secret-key-here
```

3. Start the development server:
```bash
npm run dev
```

4. Start the Socket.io server (in a separate terminal):
```bash
node server/socket-server.js
```

The application will be available at `http://localhost:3000`

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── audittrail/        # Audit trail page
│   ├── signup/           # Signup page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── lib/                   # Utility libraries
│   ├── auth.ts           # Authentication utilities
│   ├── db.ts             # Database connection
│   └── models.ts         # Mongoose models
├── server/               # Socket.io server
│   └── socket-server.js  # Real-time server
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## API Endpoints

- `GET /api/meows` - Get all meows
- `POST /api/meows` - Create a new meow
- `PUT /api/meows/remove` - Remove a meow
- `POST /api/users` - Create a new user
- `PUT /api/users/signin` - Sign in user
- `PUT /api/users/resetPassword` - Reset password
- `GET /api/auditTrailEvents` - Get audit trail events

## Migration Notes

### From Angular to React
- Replaced Angular controllers with React hooks
- Converted Angular templates to JSX
- Replaced Angular services with fetch API calls
- Migrated from Angular routing to Next.js routing

### From Express to Next.js API Routes
- Converted Express routes to Next.js API routes
- Maintained the same database models and business logic
- Kept the same authentication flow with JWT

### UI Improvements
- Added responsive design with Tailwind CSS
- Improved form styling and user experience
- Better error handling and user feedback
- Modern component structure

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Setup

The application uses MongoDB with the following collections:
- `users` - User accounts
- `meows` - User posts
- `auditevents` - Audit trail events

## Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

3. Ensure MongoDB is accessible and environment variables are set

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
