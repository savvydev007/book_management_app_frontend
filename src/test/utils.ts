import { Book } from '../types/book';

export const mockBooks: Book[] = [
  {
    _id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A story of decadence and excess.',
    publishedYear: 1925,
    isbn: '978-0743273565',
    userId: 'user1',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    _id: '2',
    title: '1984',
    author: 'George Orwell',
    description: 'A dystopian social science fiction novel.',
    publishedYear: 1949,
    isbn: '978-0451524935',
    userId: 'user1',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
];

export const mockBook: Book = mockBooks[0];

export const mockCreateBookInput = {
  title: 'New Book',
  author: 'New Author',
  description: 'New Description',
  publishedYear: 2024,
  isbn: '978-1234567890',
};

export const mockUpdateBookInput = {
  title: 'Updated Title',
  author: 'Updated Author',
}; 