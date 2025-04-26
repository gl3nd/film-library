## Backend API Endpoints

The backend (built in `index.js`) exposes the following REST API endpoints:

### Film Endpoints (Require authentication)

- **GET /api/films**  
  Retrieves all films for the authenticated user. Optionally, a `filter` query parameter can be passed.

- **GET /api/films/:id**  
  Retrieves a specific film (by ID) for the authenticated user.

- **POST /api/films**  
  Adds a new film. Expects a JSON body with `title`, `favorite`, `watchDate`, `rating`. The current user’s id is automatically included.

- **PUT /api/films/:id**  
  Updates an existing film. Only provided fields are updated.

- **DELETE /api/films/:id**  
  Deletes a film by ID for the authenticated user.

- **POST /api/films/:id/favorite**  
  Updates (marks) the favorite flag for the film.

- **POST /api/films/:id/rating**  
  Updates the film’s rating by a delta value.

- **GET /api/searchFilm**  
  Searches films by title (using a query parameter `title`).

### Session (User) Endpoints

- **POST /api/sessions**  
  Authenticates a user (login) using Passport’s local strategy.

- **GET /api/sessions/current**  
  Returns the current authenticated user.

- **DELETE /api/sessions/current**  
  Logs out the current user.

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v14 or later)
- npm (comes with Node.js)
