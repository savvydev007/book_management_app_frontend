import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/auth';
import { ROUTES } from './config';
import Layout from './components/Layout';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={
          authService.isAuthenticated() ? <Navigate to={ROUTES.HOME} /> : <Login />
        } />
        <Route path={ROUTES.REGISTER} element={
          authService.isAuthenticated() ? <Navigate to={ROUTES.HOME} /> : <Register />
        } />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path={ROUTES.HOME} element={<BookList />} />
            <Route path={ROUTES.BOOKS.NEW} element={<BookForm />} />
            <Route path={ROUTES.BOOKS.EDIT(':id')} element={<BookForm />} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
