'use client';

import { useRouter } from 'next/navigation';

interface ImpersonationBannerProps {
  isImpersonating: boolean;
}

export default function ImpersonationBanner({
  isImpersonating,
}: ImpersonationBannerProps) {
  const router = useRouter();

  const stopImpersonating = async () => {
    try {
      await fetch('/api/admin/impersonate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: null }),
      });
      router.push('/admin/users');
      router.refresh();
    } catch (error) {
      console.error('Failed to stop impersonating', error);
    }
  };

  if (!isImpersonating) return null;

  return (
    <div className="bg-indigo-600 text-white px-4 py-3 shadow-lg fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-2xl mr-2">👀</span>
          <span className="font-medium">
            You are currently viewing as a user
          </span>
        </div>
        <button
          onClick={stopImpersonating}
          className="px-4 py-2 bg-white text-indigo-600 rounded-md font-semibold hover:bg-gray-100 transition-colors text-sm"
        >
          Exit View Mode
        </button>
      </div>
    </div>
  );
}
