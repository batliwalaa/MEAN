
# Node.js API Project

## Overview

This is a robust Node.js API built with the following key functionalities:
- **Redis**: Used as a cache and message broker.
- **MongoDB**: Used for data persistence.
- **PDF Generation**: Dynamically generates PDF documents for relevant use cases.
- **Payment Gateway Integration**: Supports secure payment processing.
- **Authentication with 2FA**: Implements two-factor authentication (2FA) for enhanced security.

The project is designed to be scalable, maintainable, and efficient, leveraging modern tools and best practices.

---

## Features

1. **Redis Cache and Message Broker**:
   - Speeds up data access using Redis as a caching mechanism.
   - Utilizes Redis as a message broker for inter-service communication.

2. **MongoDB for Persistence**:
   - Stores application data reliably using MongoDB.
   - Follows schema-based design for consistent data handling.

3. **PDF Generation**:
   - Dynamically generates PDF documents for use cases such as receipts, reports, or summaries.

4. **Payment Gateway**:
   - Integrates with a payment gateway to process secure transactions.

5. **Authentication with 2FA**:
   - Implements Two-Factor Authentication for secure user access.

---

## Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v16 or later)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)
- **Redis** (local or cloud instance)
- **Docker** (if you want to use containerization)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend_project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create an `.env` file in the root directory and add the required environment variables (see `.env.example` for reference).

4. Start MongoDB and Redis instances locally or ensure connections to cloud instances.

### Running the Application

- In development mode:
  ```bash
  npm run dev
  ```

- In production mode:
  ```bash
  npm start
  ```

### Docker Setup

1. Build the Docker image:
   ```bash
   docker build -t nodejs-api .
   ```

2. Run the Docker container:
   ```bash
   docker run -p 3000:3000 --env-file .env nodejs-api
   ```

---

## API Documentation

The API exposes the following endpoints:

1. **Authentication**:
   - `POST /auth/login`: Logs in a user with 2FA.
   - `POST /auth/register`: Registers a new user.

2. **PDF Generation**:
   - `POST /documents/pdf`: Generates a PDF based on user input.

3. **Payments**:
   - `POST /payments/process`: Processes a payment transaction.

4. **Cache and Messaging**:
   - `GET /cache/:key`: Retrieves data from Redis cache.

For a full list of endpoints, refer to the Swagger documentation at `/api-docs` when the server is running.

---

## Testing

Run the test suite using:
```bash
npm test
```

- Unit tests are located in the `tests` directory.
- Ensure MongoDB and Redis instances are running during tests.

---

## CI/CD Integration

This project uses **Azure Pipelines** for CI/CD:
- Refer to `azure-pipelines.yml` for configuration details.

