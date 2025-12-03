

"use client";

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-background px-4">
      <div className="text-center space-y-6">
        <div className="text-6xl font-bold text-gray-900 dark:text-white">404</div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Page Not Found</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-lg">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/shop"
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
