import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BookList from '../BookList';
import { bookApi } from '../../services/api';
import { mockBooks } from '../../test/utils';

// Mock the API
vi.mock('../../services/api', () => ({
  bookApi: {
    getAll: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock window.confirm
const mockConfirm = vi.fn();
window.confirm = mockConfirm;

describe('BookList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockConfirm.mockReturnValue(true);
  });

  it('renders loading state initially', () => {
    render(
      <BrowserRouter>
        <BookList />
      </BrowserRouter>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders books when data is loaded successfully', async () => {
    (bookApi.getAll as any).mockResolvedValue(mockBooks);

    render(
      <BrowserRouter>
        <BookList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('The Great Gatsby')).toBeInTheDocument();
      expect(screen.getByText('1984')).toBeInTheDocument();
    });
  });

  it('renders error message when loading fails', async () => {
    (bookApi.getAll as any).mockRejectedValue(new Error('Failed to load'));

    render(
      <BrowserRouter>
        <BookList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load books. Please try again later.')).toBeInTheDocument();
    });
  });

  it('deletes a book when delete button is clicked and confirmed', async () => {
    (bookApi.getAll as any).mockResolvedValue(mockBooks);
    (bookApi.delete as any).mockResolvedValue(undefined);

    render(
      <BrowserRouter>
        <BookList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('The Great Gatsby')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(bookApi.delete).toHaveBeenCalledWith('1');
    });
  });

  it('does not delete a book when delete is cancelled', async () => {
    mockConfirm.mockReturnValue(false);
    (bookApi.getAll as any).mockResolvedValue(mockBooks);

    render(
      <BrowserRouter>
        <BookList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('The Great Gatsby')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button');
    fireEvent.click(deleteButtons[0]);

    expect(bookApi.delete).not.toHaveBeenCalled();
  });

  it('shows error message when delete fails', async () => {
    (bookApi.getAll as any).mockResolvedValue(mockBooks);
    (bookApi.delete as any).mockRejectedValue(new Error('Failed to delete'));

    render(
      <BrowserRouter>
        <BookList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('The Great Gatsby')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Failed to delete book. Please try again later.')).toBeInTheDocument();
    });
  });
}); 