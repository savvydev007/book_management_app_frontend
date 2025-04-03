export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  publishedYear: number;
  isbn: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookInput {
  title: string;
  author: string;
  description: string;
  publishedYear: number;
  isbn: string;
}

export interface UpdateBookInput extends Partial<CreateBookInput> {} 