# API Integration Documentation

## Overview
Aplikasi ini telah diintegrasikan dengan API backend menggunakan axios dan TanStack React Query untuk manajemen state dan caching.

## Configuration

### Environment Variables
```env
VITE_API_BASE_URL=http://localhost:3000
```

### Axios Configuration
- Base URL: `http://localhost:3000/api`
- Automatic token injection untuk authenticated requests
- Response interceptor untuk handle token expiry (401 errors)
- Auto redirect ke `/auth` ketika token expired

## API Endpoints

### Authentication
- **POST** `/auth/login` - Login user
- **POST** `/auth/logout` - Logout user
- **GET** `/auth/me` - Get current user info

## Features Implemented

### 1. Login Integration
- Form login menggunakan email dan password
- Integrasi dengan API `http://localhost:3000/api/auth/login`
- Token disimpan di localStorage
- Auto redirect ke dashboard setelah login sukses

### 2. Token Management
- Automatic token injection di setiap request
- Token expiry handling dengan auto redirect ke login
- Logout functionality dengan token cleanup

### 3. React Query Integration
- Optimistic updates
- Automatic retry pada failed requests
- Query invalidation setelah login/logout
- Caching untuk better performance

## File Structure

```
src/
├── lib/
│   └── axios.ts          # Axios configuration dengan interceptors
├── services/
│   └── auth.ts           # API service functions
├── hooks/
│   └── useAuth.ts        # React Query hooks untuk auth
├── contexts/
│   └── AuthContext.tsx   # Auth context dengan React Query integration
└── pages/
    └── Auth.tsx          # Login page dengan API integration
```

## Usage

### Login
```typescript
const { login, isLoading } = useAuth();

const handleLogin = (email: string, password: string) => {
  login(email, password);
};
```

### Logout
```typescript
const { logout } = useAuth();

const handleLogout = () => {
  logout();
};
```

### Check Authentication Status
```typescript
const { isAuthenticated, user } = useAuth();
```

## Error Handling

- Network errors ditampilkan via toast notifications
- 401 errors (token expired) auto redirect ke login
- Form validation untuk input kosong
- Loading states untuk better UX

## Demo Credentials

Untuk testing, gunakan:
- **Email**: admin@example.com
- **Password**: admin123

## Notes

- Pastikan backend API berjalan di `http://localhost:3000`
- Token disimpan di localStorage dengan key `token`
- User data disimpan di localStorage dengan key `user`
- Aplikasi akan auto redirect ke login jika token expired