import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BookForm from '../BookForm';
import { bookApi } from '../../services/api';
import { mockBook, mockCreateBookInput, mockUpdateBookInput } from '../../test/utils';

// Mock the API
vi.mock('../../services/api', () => ({
  bookApi: {
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();

// Mock useParams with different values for create and edit modes
const mockUseParams = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
  };
});

describe('BookForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default to create mode (no id)
    mockUseParams.mockReturnValue({});
  });

  describe('Create Mode', () => {
    it('renders create form correctly', () => {
      render(
        <BrowserRouter>
          <BookForm />
        </BrowserRouter>
      );

      expect(screen.getByText('Add New Book')).toBeInTheDocument();
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/author/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/published year/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/isbn/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add book/i })).toBeInTheDocument();
    });

    it('creates a new book successfully', async () => {
      (bookApi.create as any).mockResolvedValue(mockBook);

      render(
        <BrowserRouter>
          <BookForm />
        </BrowserRouter>
      );

      // Fill in the form
      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: mockCreateBookInput.title } });
      fireEvent.change(screen.getByLabelText(/author/i), { target: { value: mockCreateBookInput.author } });
      fireEvent.change(screen.getByLabelText(/description/i), { target: { value: mockCreateBookInput.description } });
      fireEvent.change(screen.getByLabelText(/published year/i), { target: { value: mockCreateBookInput.publishedYear } });
      fireEvent.change(screen.getByLabelText(/isbn/i), { target: { value: mockCreateBookInput.isbn } });

      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /add book/i }));

      await waitFor(() => {
        expect(bookApi.create).toHaveBeenCalledWith(expect.objectContaining(mockCreateBookInput));
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('shows error message when creation fails', async () => {
      (bookApi.create as any).mockRejectedValue(new Error('Failed to create'));

      render(
        <BrowserRouter>
          <BookForm />
        </BrowserRouter>
      );

      // Fill in the form
      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: mockCreateBookInput.title } });
      fireEvent.change(screen.getByLabelText(/author/i), { target: { value: mockCreateBookInput.author } });
      fireEvent.change(screen.getByLabelText(/description/i), { target: { value: mockCreateBookInput.description } });
      fireEvent.change(screen.getByLabelText(/published year/i), { target: { value: mockCreateBookInput.publishedYear } });
      fireEvent.change(screen.getByLabelText(/isbn/i), { target: { value: mockCreateBookInput.isbn } });

      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /add book/i }));

      await waitFor(() => {
        expect(screen.getByText('Failed to save book. Please try again later.')).toBeInTheDocument();
      });
    });
  });

  describe('Edit Mode', () => {
    beforeEach(() => {
      // Set up edit mode with an id
      mockUseParams.mockReturnValue({ id: '1' });
    });

    it('loads and displays existing book data', async () => {
      (bookApi.getById as any).mockResolvedValue(mockBook);

      render(
        <BrowserRouter>
          <BookForm />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(bookApi.getById).toHaveBeenCalledWith('1');
        expect(screen.getByDisplayValue(mockBook.title)).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockBook.author)).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockBook.description)).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockBook.publishedYear)).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockBook.isbn)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /update book/i })).toBeInTheDocument();
      });
    });

    it('updates book successfully', async () => {
      (bookApi.getById as any).mockResolvedValue(mockBook);
      (bookApi.update as any).mockResolvedValue({ ...mockBook, ...mockUpdateBookInput });

      render(
        <BrowserRouter>
          <BookForm />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue(mockBook.title)).toBeInTheDocument();
      });

      // Update form fields
      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: mockUpdateBookInput.title } });
      fireEvent.change(screen.getByLabelText(/author/i), { target: { value: mockUpdateBookInput.author } });

      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /update book/i }));

      await waitFor(() => {
        expect(bookApi.update).toHaveBeenCalledWith('1', expect.objectContaining(mockUpdateBookInput));
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('shows error message when update fails', async () => {
      (bookApi.getById as any).mockResolvedValue(mockBook);
      (bookApi.update as any).mockRejectedValue(new Error('Failed to update'));

      render(
        <BrowserRouter>
          <BookForm />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue(mockBook.title)).toBeInTheDocument();
      });

      // Update form fields
      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: mockUpdateBookInput.title } });
      fireEvent.change(screen.getByLabelText(/author/i), { target: { value: mockUpdateBookInput.author } });

      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /update book/i }));

      await waitFor(() => {
        expect(screen.getByText('Failed to save book. Please try again later.')).toBeInTheDocument();
      });
    });
  });

  it('validates required fields', async () => {
    render(
      <BrowserRouter>
        <BookForm />
      </BrowserRouter>
    );

    // Try to submit empty form
    fireEvent.click(screen.getByRole('button', { name: /add book/i }));

    // Check for HTML5 validation messages
    expect(screen.getByLabelText(/title/i)).toBeInvalid();
    expect(screen.getByLabelText(/author/i)).toBeInvalid();
    expect(screen.getByLabelText(/description/i)).toBeInvalid();
    expect(screen.getByLabelText(/isbn/i)).toBeInvalid();
  });
}); 