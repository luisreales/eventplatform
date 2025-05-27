# 🎟️ Event Management Platform

A fullstack web application to create, view, update, and manage events. Built with:

- **Frontend**: Angular (Standalone Components + Angular Material)
- **Backend**: ASP.NET Core Web API (EF Core + REST)

---

## 🔧 Features

### ✅ Core Functionality
- Create, edit, and delete events
- Fields: `title`, `dateTime`, `location`, `description`, `status`
- Status values: `Upcoming`, `Attending`, `Maybe`, `Declined`
- Search/filter (optional bonus)

### 🧪 Bonus Features (Optional)
- Deployed live demo (if provided)
- Authentication with user profiles
- AI integration (natural language search, etc.)

---

## 🚀 Getting Started

### ⚙️ Prerequisites

- [.NET 7 SDK](https://dotnet.microsoft.com/)
- [Node.js (v18+)](https://nodejs.org/)
- Angular CLI:
  ```bash
  npm install -g @angular/cli

🖥 Backend Setup (.NET API)
  cd Backend/EventPlatform.API
dotnet restore
dotnet ef database update      # Ensure EF migrations are applied
dotnet run                     # Runs on http://localhost:5237

🌐 Frontend Setup (Angular)

cd Frontend/event-platform
npm install
ng serve                        # Runs on http://localhost:4200


I have tested the CRUD in Postman, I had problem problem with the Edit in Angular, have issue problem in my laptop to finish, so only have the Create, Delete and Get methods in Angular.Use clean arquitecture for this project.

