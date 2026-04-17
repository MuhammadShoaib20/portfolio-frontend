import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div className="space-y-6">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Page Not Found</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary inline-flex">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;