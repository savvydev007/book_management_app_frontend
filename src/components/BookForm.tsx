import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Book } from '../types/book';
import { bookApi } from '../services/api';

export default function BookForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<Omit<Book, 'id'>>({
    title: '',
    author: '',
    description: '',
    publishedYear: new Date().getFullYear(),
    isbn: '',
    _id: '',
    userId: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing) {
      loadBook();
    }
  }, [id]);

  const loadBook = async () => {
    try {
      const book = await bookApi.getById(id!);
      setFormData({
        title: book.title,
        author: book.author,
        description: book.description,
        publishedYear: book.publishedYear,
        isbn: book.isbn,
        _id: book._id,
        userId: book.userId,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
      });
    } catch (err) {
      setError('Failed to load book. Please try again later.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing) {
        await bookApi.update(id!, formData);
      } else {
        await bookApi.create(formData);
      }
      navigate('/');
    } catch (err) {
      setError('Failed to save book. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'publishedYear' ? parseInt(value) : value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        {isEditing ? 'Edit Book' : 'Add New Book'}
      </h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="input mt-1"
          />
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">
            Author
          </label>
          <input
            type="text"
            name="author"
            id="author"
            required
            value={formData.author}
            onChange={handleChange}
            className="input mt-1"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            required
            value={formData.description}
            onChange={handleChange}
            className="input mt-1"
          />
        </div>

        <div>
          <label htmlFor="publishedYear" className="block text-sm font-medium text-gray-700">
            Published Year
          </label>
          <input
            type="number"
            name="publishedYear"
            id="publishedYear"
            required
            min="1800"
            max={new Date().getFullYear()}
            value={formData.publishedYear}
            onChange={handleChange}
            className="input mt-1"
          />
        </div>

        <div>
          <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">
            ISBN
          </label>
          <input
            type="text"
            name="isbn"
            id="isbn"
            required
            value={formData.isbn}
            onChange={handleChange}
            className="input mt-1"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Book' : 'Add Book'}
          </button>
        </div>
      </form>
    </div>
  );
} 