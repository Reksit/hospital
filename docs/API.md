# CareFleet API Documentation

## Base URL
```
http://localhost:8080/api/v1
```

## Authentication

All API endpoints except authentication endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### JWT Token Structure
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "DOCTOR",
  "firstName": "John",
  "lastName": "Doe",
  "isEmailVerified": true,
  "exp": 1640995200,
  "iat": 1640908800
}
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "DOCTOR",
  "hospitalId": "hospital_id_optional"
}
```

**Response:** `201 Created`
```json
{
  "message": "Registration successful. Please check your email to verify your account.",
  "verificationToken": "email_verification_token"
}
```

#### POST /auth/login
Authenticate user and get JWT tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "DOCTOR",
    "isEmailVerified": true
  }
}
```

#### POST /auth/verify-email
Complete email verification with token and OTP.

**Request Body:**
```json
{
  "token": "email_verification_token",
  "otp": "123456"
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "DOCTOR",
    "isEmailVerified": true
  }
}
```

#### POST /auth/refresh
Refresh JWT access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "new_jwt_access_token",
  "refreshToken": "new_jwt_refresh_token"
}
```

### Hospitals

#### GET /hospitals
Get all hospitals (Admin only).

**Response:** `200 OK`
```json
[
  {
    "id": "hospital_id",
    "name": "General Hospital",
    "address": "123 Main St, City, State",
    "phoneNumber": "+1234567890",
    "totalBeds": 100,
    "availableBeds": 25,
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /hospitals
Create a new hospital (Admin only).

**Request Body:**
```json
{
  "name": "General Hospital",
  "address": "123 Main St, City, State",
  "phoneNumber": "+1234567890",
  "totalBeds": 100,
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  }
}
```

### Beds

#### GET /hospitals/{hospitalId}/beds
Get all beds for a hospital.

**Response:** `200 OK`
```json
[
  {
    "id": "bed_id",
    "hospitalId": "hospital_id",
    "bedNumber": "A101",
    "type": "ICU",
    "status": "AVAILABLE",
    "patientId": null,
    "assignedStaffId": null,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /hospitals/{hospitalId}/beds
Create a new bed.

**Request Body:**
```json
{
  "bedNumber": "A101",
  "type": "ICU"
}
```

#### PUT /beds/{bedId}
Update bed information.

**Request Body:**
```json
{
  "status": "OCCUPIED",
  "patientId": "patient_id",
  "assignedStaffId": "staff_id"
}
```

### Staff

#### GET /hospitals/{hospitalId}/staff
Get all staff for a hospital.

**Response:** `200 OK`
```json
[
  {
    "id": "staff_id",
    "hospitalId": "hospital_id",
    "employeeId": "EMP001",
    "firstName": "Dr. Jane",
    "lastName": "Smith",
    "role": "DOCTOR",
    "department": "Emergency",
    "shift": "MORNING",
    "isActive": true,
    "phoneNumber": "+1234567890",
    "email": "jane.smith@hospital.com",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /hospitals/{hospitalId}/staff
Create a new staff member.

**Request Body:**
```json
{
  "employeeId": "EMP001",
  "firstName": "Dr. Jane",
  "lastName": "Smith",
  "role": "DOCTOR",
  "department": "Emergency",
  "shift": "MORNING",
  "phoneNumber": "+1234567890",
  "email": "jane.smith@hospital.com"
}
```

### Ambulances

#### GET /ambulances
Get all ambulances.

**Response:** `200 OK`
```json
[
  {
    "id": "ambulance_id",
    "licensePlate": "AMB-001",
    "driverId": "driver_id",
    "status": "AVAILABLE",
    "currentLocation": {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "timestamp": "2024-01-01T12:00:00Z"
    },
    "destinationHospitalId": null,
    "patientOnBoard": false,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /ambulances
Create a new ambulance (Admin only).

**Request Body:**
```json
{
  "licensePlate": "AMB-001",
  "driverId": "driver_id"
}
```

#### PUT /ambulances/{ambulanceId}/location
Update ambulance location (Driver only).

**Request Body:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "speed": 45.5,
  "heading": 180.0
}
```

#### PUT /ambulances/{ambulanceId}/status
Update ambulance status.

**Request Body:**
```json
{
  "status": "IN_TRANSIT",
  "destinationHospitalId": "hospital_id",
  "patientOnBoard": true
}
```

### Emergency Calls

#### GET /emergency-calls
Get all emergency calls.

**Response:** `200 OK`
```json
[
  {
    "id": "call_id",
    "ambulanceId": "ambulance_id",
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "address": "123 Emergency St, City"
    },
    "priority": "HIGH",
    "status": "DISPATCHED",
    "description": "Car accident with injuries",
    "callerName": "John Doe",
    "callerPhone": "+1234567890",
    "estimatedPatients": 2,
    "dispatchTime": "2024-01-01T12:00:00Z",
    "arrivalTime": null,
    "completionTime": null,
    "createdAt": "2024-01-01T11:50:00Z",
    "updatedAt": "2024-01-01T12:00:00Z"
  }
]
```

#### POST /emergency-calls
Create a new emergency call.

**Request Body:**
```json
{
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "address": "123 Emergency St, City"
  },
  "priority": "HIGH",
  "description": "Car accident with injuries",
  "callerName": "John Doe",
  "callerPhone": "+1234567890",
  "estimatedPatients": 2
}
```

### Assignments

#### GET /staff/{staffId}/assignments
Get assignments for a staff member.

**Response:** `200 OK`
```json
[
  {
    "id": "assignment_id",
    "staffId": "staff_id",
    "patientId": "patient_id",
    "bedId": "bed_id",
    "taskType": "CHECKUP",
    "description": "Morning checkup and vitals",
    "priority": "MEDIUM",
    "status": "PENDING",
    "scheduledTime": "2024-01-15T09:00:00Z",
    "completedTime": null,
    "notes": null,
    "createdAt": "2024-01-15T08:00:00Z",
    "updatedAt": "2024-01-15T08:00:00Z"
  }
]
```

#### POST /assignments
Create a new assignment (Admin only).

**Request Body:**
```json
{
  "staffId": "staff_id",
  "patientId": "patient_id",
  "bedId": "bed_id",
  "taskType": "CHECKUP",
  "description": "Morning checkup and vitals",
  "priority": "MEDIUM",
  "scheduledTime": "2024-01-15T09:00:00Z"
}
```

#### PUT /assignments/{assignmentId}
Update assignment status.

**Request Body:**
```json
{
  "status": "COMPLETED",
  "notes": "Patient is stable, vitals normal"
}
```

## WebSocket Events

### Connection
Connect to WebSocket at `/ws` with JWT token in authorization header.

### Events

#### Location Updates (Ambulance Drivers)
**Emit:** `location_update`
```json
{
  "ambulanceId": "ambulance_id",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "timestamp": "2024-01-01T12:00:00Z",
  "speed": 45.5,
  "heading": 180.0
}
```

**Subscribe:** `subscribe_location_updates` (Admin only)

#### Emergency Calls
**Subscribe:** `subscribe_emergency_calls`
**Receive:** `new_emergency_call`

#### Staff Assignments
**Subscribe:** `subscribe_staff_assignments` with `staffId`
**Receive:** `new_assignment`

## Error Responses

### 400 Bad Request
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Invalid request data",
  "details": [
    {
      "field": "email",
      "message": "Email should be valid"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "UNAUTHORIZED",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "FORBIDDEN",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "NOT_FOUND",
  "message": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Too many OTP requests. Please try again later.",
  "retryAfter": 300
}
```

### 500 Internal Server Error
```json
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "An unexpected error occurred"
}
```

## Rate Limiting

- OTP requests: 3 requests per 15 minutes per email
- Login attempts: 5 attempts per 15 minutes per IP
- General API calls: 100 requests per minute per user

## Pagination

For endpoints returning lists, use query parameters:
- `page`: Page number (0-based, default: 0)
- `size`: Page size (default: 20, max: 100)
- `sort`: Sort field and direction (e.g., `createdAt,desc`)

**Example:**
```
GET /hospitals?page=0&size=10&sort=name,asc
```

**Response:**
```json
{
  "content": [...],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "sorted": true,
      "unsorted": false
    }
  },
  "totalElements": 50,
  "totalPages": 5,
  "first": true,
  "last": false
}
```