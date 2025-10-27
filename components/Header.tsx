interface HeaderProps {
  user: any;
  onSignOut: () => void;
}

export default function Header({ user, onSignOut }: HeaderProps) {
  const getDisplayEmail = (email: string) => {
    if (!email) return '';
    const username = email.split('@')[0];
    return username;
  };

  return (
    <header className="bg-[#182343] px-2 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-gray-700">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <h1 className="text-lg sm:text-xl font-bold text-white">Todo App</h1>
        
        {user && (
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Full email on medium screens and up, truncated on small screens */}
            <span className="text-xs sm:text-sm text-gray-300 hidden md:block">{user.email}</span>
            <span className="text-xs sm:text-sm text-gray-300 block md:hidden">{getDisplayEmail(user.email)}</span>
            <button 
              onClick={onSignOut}
              className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}