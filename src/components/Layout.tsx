import { Link, useNavigate, Outlet } from 'react-router-dom';
import { BookOpenIcon, PlusIcon, UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { authService } from '../services/auth';
import { ROUTES } from '../config';
import { useState, useEffect } from 'react';

interface UserProfile {
  name: string;
  email: string;
}

export default function Layout() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await authService.getProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };
    loadProfile();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to={ROUTES.HOME} className="flex items-center">
                  <BookOpenIcon className="h-8 w-8 text-primary-600" />
                  <span className="hidden sm:block ml-2 text-xl font-semibold text-gray-900">
                    Book Management App
                  </span>
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                  <UserCircleIcon className="h-5 w-5" />
                  <span>{userProfile?.name || 'Profile'}</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <Link
                        to={ROUTES.BOOKS.NEW}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        role="menuitem"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Add Book
                      </Link>
                      <Link
                        to={ROUTES.PROFILE}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        role="menuitem"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        View Profile
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        role="menuitem"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
} 