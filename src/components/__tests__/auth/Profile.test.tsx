import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Profile from '../../../pages/Profile';
import { authService } from '../../../services/auth';

// Mock the auth service
vi.mock('../../../services/auth', () => ({
  authService: {
    getProfile: vi.fn(),
  },
}));

describe('Profile', () => {
  const mockUser = {
    name: 'Test User',
    email: 'test@example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders profile information correctly', async () => {
    (authService.getProfile as any).mockResolvedValue(mockUser);

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });

  it('shows loading state while fetching profile', () => {
    (authService.getProfile as any).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    expect(screen.getByText('Loading profile...')).toBeInTheDocument();
  });

  it('shows error message when profile fetch fails', async () => {
    (authService.getProfile as any).mockRejectedValue(new Error('Failed to fetch profile'));

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load profile')).toBeInTheDocument();
    });
  });
}); 