# FitTrackPro - Your Personal Fitness Companion

![image alt](https://github.com/AbuJrVandi/fitTrackPro/blob/4096ef088c622a876ceffa90a45cf4866d792518/tom.png)


FitTrackPro is a comprehensive fitness tracking application built with React Native (frontend) and Node.js (backend). It helps users track their fitness journey, monitor workouts, log meals, and maintain health records.

![FitTrackPro Logo](frontend/assets/images/Tomfitness.png)

## Features

- **User Authentication**
  - Secure login and registration
  - Biometric authentication support
  - Password management

- **Comprehensive Health Tracking**
  - Workout logging with duration and calories
  - Meal tracking with calorie and macro counting
  - Water intake monitoring
  - Sleep tracking
  - Weight tracking

- **Profile Management**
  - Customizable user profiles
  - Personal goal setting
  - Progress tracking
  - Fitness metrics monitoring

- **Customization Options**
  - Dark/Light theme support
  - Metric/Imperial unit switching
  - Customizable daily targets

## Tech Stack

### Frontend
- React Native with Expo
- Redux Toolkit for state management
- React Navigation for routing
- Expo Local Authentication
- AsyncStorage for local data persistence
- React Native Vector Icons
- Responsive design with react-native-responsive-fontsize

### Backend
- Node.js
- Express.js
- SQLite3 for database
- JWT for authentication
- bcryptjs for password hashing
- CORS support

## Getting Started

### Prerequisites
- Node.js (v12 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fitTrackPro.git
   cd fitTrackPro
   ```

2. Install Backend Dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install Frontend Dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

4. Start the Backend Server:
   ```bash
   cd ../backend
   npm run dev
   ```

5. Start the Frontend Application:
   ```bash
   cd ../frontend
   npm start
   ```

## Environment Setup

### Backend (.env)
Create a `.env` file in the backend directory:
```
PORT=3000
JWT_SECRET=your_jwt_secret
```

### Frontend
The frontend configuration is managed through `app.json` and environment variables are handled through the app's settings system.

## Project Structure

```
fitTrackPro/
├── backend/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   └── utils/          # Utility functions
└── frontend/
    ├── assets/         # Images and static files
    ├── components/     # Reusable components
    ├── navigation/     # Navigation configuration
    ├── screens/        # Application screens
    ├── services/       # API services
    ├── store/          # Redux store and slices
    └── utils/          # Utility functions
```

## Available Scripts

### Backend
- `npm start`: Start the production server
- `npm run dev`: Start the development server with nodemon

### Frontend
- `npm start`: Start the Expo development server
- `npm run android`: Start the Android app
- `npm run ios`: Start the iOS app
- `npm run web`: Start the web version

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgments

- React Native community
- Expo team
- All contributors who help improve FitTrackPro 
