# Electro Pi - Project & Task Management API

A robust, enterprise-grade RESTful API built for managing projects and tasks. This application was built using a strict layered architecture and modern TypeScript practices, successfully satisfying all core requirements and all bonus points for the Technical Assessment.

## Tech Stack & Bonus Features Implemented
*   **Runtime / Language:** Node.js (v18+) / **TypeScript** *(Bonus Point)*
*   **Framework:** Express.js
*   **Database & ODM:** MongoDB & Mongoose
*   **Authentication:** JSON Web Tokens (JWT) & bcrypt
*   **Validation:** Zod (TypeScript-first schema validation)
*   **Testing:** Jest & `ts-jest` *(Bonus Point)*
*   **Containerization:** Docker & Docker Compose *(Bonus Point)*

---

## ⚙️ How to Set Up and Run Locally

### Prerequisites
*   [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running.

### 1. Environment Setup
Clone the repository and set up the environment variables:
```bash
git clone https://github.com/MustfaAshraf/Task_Management_System
cd Task_Management_System
```

Create a `.env` file in the root directory and copy the following configuration:

```env
NODE_ENV=development

PORT=5000

MONGO_URI=mongodb://mongo:27017/electro-pi-db

JWT_SECRET=super_secret_key_123
JWT_REFRESH_SECRET=super_refresh_secret_456
```

## 2. Start the Application (Docker)

The application is fully containerized. To compile the TypeScript and start the Node.js API + MongoDB database:

```bash
docker-compose up --build -d
```

The API will be available at `http://localhost:5000` (or `http://localhost` if mapped to port 80 in your `docker-compose`).

---

## 3. Database Migration / Seeding

To populate the database with mock Users (Admin & Member), Projects, and Tasks, run the seeder script **inside** the running Docker container:

```bash
docker exec -it electro_pi_api npm run seed
```

### Test Accounts Created

- **Admin**
  - Email: `admin@test.com`
  - Password: `password123`

- **Member**
  - Email: `member@test.com`
  - Password: `password123`

## 4. Running Unit Tests

Jest is configured to run unit tests on the application's utility functions (JWT generation/verification and API Response formatting). To run the test suites:

```bash
npm run test
```

---

## 📚 API Documentation

A complete **Postman Collection** is included in the root of this repository (`Electro_Pi_Postman_Collection.json`).

Import this file into Postman to test all endpoints. All routes (except login/register) require a valid `Bearer Token` in the Authorization header.

---

## 🧠 Important Notes About Implementation

To ensure enterprise-grade code quality, several design patterns were implemented:

### 1. Layered Architecture (Separation of Concerns)

The codebase strictly follows:

`Routes ➜ Controllers ➜ Services ➜ Models`

Controllers are kept clean (handling only req/res), while the `Services` layer handles all business logic, database queries, and relational security checks.

### 2. Role-Based Access Control (RBAC) *(Bonus Point)*

A custom `authorize` middleware was built.

While Members can manage their own projects and tasks, only users with the `Admin` role are permitted to permanently `DELETE` projects and tasks.

### 3. Pagination, Sorting & Filtering *(Bonus Point)*

A reusable `ApiFeatures` utility class was implemented to dynamically handle Advanced Querying.

**Example:**

```http
GET /api/tasks/project/<ID>?status=Pending&sort=dueDate&page=1&limit=5
```

### 4. Zod Validation Pipeline

All incoming requests (`body`, `query`, `params`) are intercepted by a generic Zod validation middleware.

Invalid requests are rejected before touching the controllers.

### 5. Centralized Error Handling

Controllers are wrapped in an `asyncHandler` to eliminate `try/catch` clutter.

Custom Error classes (`ApiError`) funnel all exceptions to a Global Error Handler middleware, ensuring consistent JSON error responses.

### 6. Relational Data Isolation

Mongoose references are utilized.

Business logic actively verifies that `req.user.id` matches the owner of the Project/Task before allowing any `GET`, `PUT`, or `DELETE` operations, preventing data leakage between users.

### 7. Multi-Device Session Management

The Authentication service implements Token Rotation and stores Refresh Tokens in an array within the User model, securely allowing simultaneous multi-device logins.
