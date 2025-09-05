import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService, LoginRequest } from '../services/auth';
import { toast } from 'sonner';

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      toast.success('Login berhasil!');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Username atau password salah');
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();
      toast.success('Logout berhasil!');
      navigate('/auth');
    },
    onError: () => {
      // Even if API call fails, clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      queryClient.clear();
      navigate('/auth');
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => authService.getCurrentUser(),
    enabled: !!localStorage.getItem('token'),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAuthStatus = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  return {
    isAuthenticated: !!(token && user),
    user: user ? JSON.parse(user) : null,
    token,
  };
};