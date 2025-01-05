import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-grow flex items-center justify-center min-h-[calc(100vh-var(--top-nav-bar-height))]">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
        <p className="text-gray-500 max-w-md">
          Sorry, we couldn't find the page you're looking for. Perhaps you'd like to create a resume instead?
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-block rounded-full bg-primary px-8 py-3 text-white hover:opacity-90 transition-opacity"
          >
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
} 