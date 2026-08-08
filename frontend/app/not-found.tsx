import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4 px-6 text-center">
      <div className="w-14 h-14 rounded-full bg-brand-purple-light flex items-center justify-center text-2xl">
        &#128269;
      </div>
      <h1 className="text-xl font-bold text-gray-900">Page not found</h1>
      <p className="text-sm text-gray-600">The page you're looking for doesn't exist or may have moved.</p>
      <Link href="/" className="bg-brand-purple text-white text-sm font-semibold rounded-lg px-5 py-2.5 hover:bg-brand-purple-dark transition-colors">
        Back to home
      </Link>
    </div>
  );
}
