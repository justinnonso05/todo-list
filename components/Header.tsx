import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  user: any;
  onSignOut: () => void;
}

export default function Header({ user, onSignOut }: HeaderProps) {
  return (
    <header className="bg-[#182343] px-6 py-4 border-b border-gray-700">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <h1 className="text-xl font-bold text-white">Todo App</h1>
        
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-300">{user.email}</span>
            <button 
              onClick={onSignOut}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}