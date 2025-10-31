# Rails + React Authentication Project
This is a **study project** built with **Ruby on Rails (backend)** and **React (frontend)**, communicating via a RESTful API. The project is containerized using **Docker**.  
It allows users to **register, log in, and log out**, and records these events asynchronously using background jobs, storing them in the database. Authentication is handled using **Devise**, providing secure user management.

## Features
- User registration with **email** and **password** via Devise  
- User login and logout  
- Fetch the currently logged-in user  
- Event logging via background jobs (e.g., registration, login, logout)  
- React frontend consuming Rails API  
- Dockerized development environment
- **Backend tests** written with **RSpec** for models, controllers, and jobs  

## Tech Stack
- **Backend:** Ruby on Rails, PostgreSQL, Devise, RSpec
- **Frontend:** React, Axios (or Fetch API)  
- **Containerization:** Docker, Docker Compose  
- **Background Jobs:** Sidekiq

## Setup
### Prerequisites
- Docker & Docker Compose installed  

### Steps
1. Clone the repository:  
```bash
git clone https://github.com/ayrtonaoki/aiou
cd aiou
```
2. Build and start the containers:
```
docker compose up --build
```
3. Run containers up
```
docker compose up
```

4. Access the frontend:
Open http://localhost:3001 in your browser

## Running tests
```
docker compose run backend bundle exec rspec
```

## API Endpoints (Rails with Devise)
- POST /signup – Register a new user
- POST /login – Log in
- DELETE /logout – Log out the current user
- GET /current_user – Fetch the currently logged-in user
- GET /api/v1/events/event_stats – Retrieve event statistics

## Notes

This project is intended for learning purposes.
Passwords are securely stored using Devise.
Event logging is handled asynchronously using Rails background jobs.
Authentication and session management are handled via Devise JSON API.
