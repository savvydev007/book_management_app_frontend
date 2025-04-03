import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { authService } from '../services/auth';
import { ROUTES } from '../config';

export default function ProtectedRoute() {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
} 