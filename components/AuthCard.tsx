import { useState } from 'react';

interface AuthCardProps {
  onSignIn: (email: string, password: string) => void;
  onSignUp: (email: string, password: string) => void;
}

export default function AuthCard({ onSignIn, onSignUp }: AuthCardProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await onSignUp(email, password);
      } else {
        await onSignIn(email, password);
      }
      setEmail('');
      setPassword('');
    } catch (err: any) {
      console.error('Auth error:', err);
      
      // Handle Firebase auth errors
      let errorMessage = 'An error occurred. Please try again.';
      
      if (err.code) {
        switch (err.code) {
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password.';
            break;
          case 'auth/email-already-in-use':
            errorMessage = 'An account with this email already exists.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password should be at least 6 characters.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again later.';
            break;
          default:
            errorMessage = err.message || errorMessage;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-[#182343] rounded-lg p-8 border border-gray-700">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h2>
          <p className="text-gray-400">
            {isSignUp 
              ? 'Create an account to sync your todos' 
              : 'Sign in to access your todos'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-600 text-white rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#0e1629] text-white px-4 py-3 rounded border border-gray-600 focus:border-[#4c73fe] focus:outline-none"
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#0e1629] text-white px-4 py-3 rounded border border-gray-600 focus:border-[#4c73fe] focus:outline-none"
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4c73fe] text-white py-3 rounded font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-[#4c73fe] hover:text-blue-400 transition-colors text-sm"
            disabled={loading}
          >
            {isSignUp 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}