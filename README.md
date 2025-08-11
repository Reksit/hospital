# CareFleet - Healthcare Fleet Management System

A comprehensive healthcare fleet management system built with React, TypeScript, Spring Boot, and MongoDB. CareFleet provides real-time ambulance tracking, hospital resource management, and staff coordination tools.

## 🚀 Features

### Authentication & Security
- **2-Step Email Verification**: Email link + OTP verification process
- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Role-Based Access Control**: Support for Hospital Admin, Ambulance Driver, Doctor, and Nurse roles
- **Rate Limiting**: Protected OTP endpoints with rate limiting
- **Password Security**: bcrypt hashing for secure password storage

### Real-Time Tracking
- **Google Maps Integration**: Real-time ambulance location tracking
- **WebSocket Communication**: Live location updates from drivers to administrators
- **Emergency Dispatch**: Real-time emergency call assignment and tracking

### Hospital Management
- **Bed Management**: Track bed availability, occupancy, and maintenance status
- **Staff Management**: Manage hospital staff, shifts, and assignments
- **Patient Allocation**: Assign beds and staff to patients
- **Live Dashboard**: Real-time hospital operations overview

### Role-Specific Features

#### Hospital Admin
- Live dashboard with real-time metrics
- Bed and staff management interfaces
- Ambulance fleet tracking with Google Maps
- Emergency call dispatch and monitoring

#### Ambulance Driver
- GPS location sharing controls
- Emergency call notifications
- Status updates (Available, En Route, On Scene, etc.)
- Direct navigation integration

#### Doctor/Nurse
- Assignment and task management
- Shift tracking and reporting
- Patient care coordination
- Real-time notifications for new assignments

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Router** for navigation
- **Socket.IO Client** for real-time communication
- **Google Maps API** for mapping features
- **Recharts** for data visualization

### Backend (Production Ready)
- **Spring Boot 3.x** with Java 17+
- **MongoDB** with Spring Data
- **WebSocket** for real-time communication
- **JWT** with refresh token support
- **Spring Security** for authentication
- **Email Service** integration
- **Rate Limiting** with Redis

### DevOps & Testing
- **Docker Compose** for containerization
- **GitHub Actions** for CI/CD
- **Vitest** for unit testing
- **Spring Boot Test** for integration tests
- **OpenAPI 3.0** documentation

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Java 17+ and Maven
- MongoDB 4.4+
- Redis (for rate limiting)
- Docker & Docker Compose

### Frontend Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd carefleet
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Add your Google Maps API key
   VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Configure application properties**
   ```properties
   # application.yml
   spring:
     data:
       mongodb:
         uri: mongodb://localhost:27017/carefleet
     mail:
       host: smtp.gmail.com
       port: 587
       username: your-email@gmail.com
       password: your-app-password
   
   jwt:
     secret: your-jwt-secret-key
     expiration: 86400000 # 24 hours
     refresh-expiration: 604800000 # 7 days
   
   google:
     maps:
       api-key: your-google-maps-api-key
   ```

3. **Run the application**
   ```bash
   ./mvnw spring-boot:run
   ```

### Full Stack with Docker

1. **Start all services**
   ```bash
   docker-compose up -d
   ```

This will start:
- MongoDB database
- Redis cache
- Spring Boot backend
- React frontend (development build)

## 🧪 Testing

### Frontend Tests
```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Backend Tests
```bash
# Run all tests
./mvnw test

# Run integration tests only
./mvnw test -Dtest="**/*IT"

# Run with coverage
./mvnw test jacoco:report
```

## 📱 Demo Credentials

For testing the application, use these demo credentials:

- **Hospital Admin**: admin@hospital.com / admin123
- **Ambulance Driver**: driver@ambulance.com / driver123  
- **Doctor**: doctor@hospital.com / doctor123

## 🔧 Configuration

### Google Maps Setup
1. Create a Google Cloud Project
2. Enable Maps JavaScript API
3. Generate an API key
4. Add the key to your environment variables

### Email Service Setup
1. Configure SMTP settings in `application.yml`
2. For Gmail, use App Passwords
3. Update email templates in `src/main/resources/templates/`

### WebSocket Configuration
The application uses Socket.IO for real-time communication:
- Location updates from ambulance drivers
- Emergency call notifications
- Staff assignment updates

## 📊 API Documentation

The backend provides OpenAPI 3.0 documentation available at:
```
http://localhost:8080/swagger-ui.html
```

Key endpoints include:
- `/api/v1/auth/**` - Authentication endpoints
- `/api/v1/ambulances/**` - Ambulance management
- `/api/v1/hospitals/**` - Hospital resources
- `/api/v1/staff/**` - Staff management
- `/api/v1/assignments/**` - Task assignments

## 🏗️ Architecture

### Frontend Architecture
```
src/
├── components/          # Reusable UI components
├── pages/              # Route-based page components
├── services/           # API and WebSocket services
├── stores/             # Zustand state management
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### Backend Architecture
```
src/main/java/
├── config/             # Spring configuration
├── controller/         # REST controllers
├── service/            # Business logic
├── repository/         # Data access layer
├── model/              # Entity classes
├── dto/                # Data transfer objects
├── security/           # Security configuration
└── websocket/          # WebSocket handlers
```

## 🚀 Deployment

### Production Build
```bash
# Frontend
npm run build

# Backend
./mvnw clean package -Pprod
```

### Docker Deployment
```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up -d
```

### CI/CD Pipeline
The project includes GitHub Actions workflows for:
- Automated testing on pull requests
- Security scanning
- Docker image building
- Deployment to staging/production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation at `/docs`
- Review the API documentation at `/swagger-ui.html`

## 🔮 Future Enhancements

- [ ] Mobile app for drivers (React Native)
- [ ] Advanced analytics dashboard
- [ ] Integration with hospital information systems
- [ ] Multi-language support
- [ ] Offline mode capabilities
- [ ] Advanced notification system
- [ ] Telemedicine integration

---

Built with ❤️ for healthcare professionals worldwide.