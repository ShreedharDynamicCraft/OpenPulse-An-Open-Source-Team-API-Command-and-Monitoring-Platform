"use client";

import dynamic from "next/dynamic";

const Tldraw = dynamic(
  async () => (await import("tldraw")).Tldraw,
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading canvas...</p>
        </div>
      </div>
    ),
  }
);

export default function DesignPage() {
  return (
    <div className="h-full w-full">
      <Tldraw 
        autoFocus
      />
    </div>
  );
}
