
# 🚀 Socially - Next.js Social Media App     (FOR ONLY SELF LEARNING)

A modern social media web application built with Next.js 14, TypeScript, Prisma, Clerk, UploadThing, and Tailwind CSS. Inspired by Twitter/X, this project demonstrates full-stack features including authentication, posting, image upload, notifications, and more.

## 📋 Table of Contents

* [Technologies Used](#technologies-used)
* [Key Features](#key-features)
* [Project Structure](#project-structure)
* [System Requirements](#system-requirements)
* [Installation & Getting Started](#installation--getting-started)
* [Screenshots](#screenshots)
* [Contributing](#contributing)
* [License](#license)

## 🛠️ Technologies Used

* **Next.js 14** - React framework for production
* **TypeScript** - Type safety for JavaScript
* **Prisma ORM** - Database toolkit
* **PostgreSQL** - Database (can use SQLite for dev)
* **Clerk** - Authentication & user management
* **UploadThing** - File/image upload
* **React Hot Toast** - Notifications
* **Tailwind CSS** - Utility-first CSS framework
* **Lucide React** - Icon library
* **Date-fns** - Date formatting
* **ESLint & Prettier** - Code quality & formatting

## ✨ Key Features

* 🔐 User authentication (sign up, sign in, sign out)
* 📝 Create, edit, and delete posts
* 📷 Upload and preview images in posts
* ❤️ Like and comment on posts
* 🛎️ Real-time notifications
* 👤 User profile pages
* 🌙 Light/Dark mode toggle
* 🏷️ Responsive, modern UI

## 📁 Project Structure

```
src/
├── actions/           # Server actions (post, user, notification, etc.)
├── app/               # Next.js app directory
│   ├── api/           # API routes (UploadThing, etc.)
│   ├── fonts/         # Custom fonts
│   ├── notifications/ # Notifications page
│   ├── profile/       # User profile pages
│   └── ...            # Other app routes
├── components/        # React components (UI, PostCard, Navbar, etc.)
├── generated/         # Generated Prisma client
├── lib/               # Utility libraries (prisma, uploadthing, etc.)
└── middleware.ts      # Next.js middleware
```

## 💻 System Requirements

* **Node.js**: >= 18.x
* **npm** or **yarn**: Latest version
* **PostgreSQL** or **SQLite**: For database

## 🚀 Installation & Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/DangDuyy/Socially.git
cd Socially/my-app
```

### 2. Install dependencies

```bash
yarn install
# or
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root with the following:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/socially
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
UPLOADTHING_SECRET=your-uploadthing-secret
UPLOADTHING_APP_ID=your-uploadthing-app-id
```

### 4. Run Database Migrations

```bash
yarn prisma migrate dev
```

### 5. Start the Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🖼️ Screenshots

![alt text](image.png)     ![alt text](image-1.png)     ![alt text](image-2.png)

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.
