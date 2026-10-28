# IMovies - Movie Ticket Booking (MERN)

Browse movies, pick a showtime, choose seats on a live seat map and book. Built with
React + Bootstrap (client) and Express + MongoDB + JWT (server).

## Prerequisites
Node.js v16+, npm v8+, MongoDB Community running locally (or a MongoDB Atlas URI), VS Code, Postman (optional).

## Run it

### 1. Backend
```bash
cd server
npm install
cp .env.example .env        # Windows: copy .env.example .env
# edit .env -> set MONGO_URI and a long random JWT_SECRET
npm run seed                # demo movies, showtimes, admin + demo user
npm run dev                 # http://localhost:5000
```

### 2. Frontend (new terminal)
```bash
cd client
npm install
npm run dev                 # http://localhost:5173
```


## Live Demo

- Frontend: https://your-frontend.onrender.com
- Backend: https://your-backend.onrender.com

### Demo logins (created by the seed script)
| Role  | Email              | Password |
|-------|--------------------|----------|
| Admin | admin@imovies.com  | admin123 |
| User  | user@imovies.com   | user123  |

## Features
- Register / login with bcrypt-hashed passwords and JWT (7 day expiry)
- Browse, search and filter movies by genre
- Movie page with upcoming showtimes grouped by day, price and seats left
- Seat map (8 x 10) that refreshes every 5 seconds, so availability stays live
- Atomic seat reservation on the server: two people can never book the same seat
- Booking history with cancel (releases seats back instantly)
- Admin panel: add / delete movies, add showtimes (admin routes protected by role)

## API
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/register, /api/auth/login | public |
| GET | /api/auth/me | logged in |
| GET | /api/movies?search=&genre= , /api/movies/:id | public |
| POST/PUT/DELETE | /api/movies(/:id) | admin |
| GET | /api/showtimes/movie/:movieId , /api/showtimes/:id | public |
| POST/DELETE | /api/showtimes(/:id) | admin |
| POST | /api/bookings  `{showtimeId, seats[]}` | logged in |
| GET | /api/bookings/mine | logged in |
| PUT | /api/bookings/:id/cancel | logged in |

## Structure
```
imovies/
  server/  config/ models/ middleware/ controllers/ routes/ seed.js server.js
  client/  src/ components/ pages/ context/ api.js styles.css
```
