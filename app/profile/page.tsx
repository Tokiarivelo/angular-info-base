import { auth, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Header from '@/components/shared/Header/Header';
import Image from 'next/image';
import { Settings, LogOut, User, Mail, Shield } from 'lucide-react';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/signin');
  }

  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors pb-20">
      <Header user={session.user} variant="user" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Profile Settings
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your account information and preferences.
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Banner/Header of Card */}
            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
              <div className="absolute -bottom-12 left-8">
                <div className="h-24 w-24 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-700 flex items-center justify-center text-3xl font-bold text-blue-600 dark:text-blue-400 shadow-md">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={96}
                      height={96}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    getInitials(session.user.name || 'U')
                  )}
                </div>
              </div>
            </div>

            <div className="pt-16 pb-8 px-8">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {session.user.name || 'Anonymous User'}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4" />
                    {session.user.email}
                  </p>
                </div>
                {/* <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                  {session.user.role === 'ADMIN' ? 'Administrator' : 'Student'}
                </span> */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Shield className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {session.user.role?.toLowerCase() || 'Student'}
                  </span>
                </div>
              </div>

              <div className="mt-8 border-t border-gray-100 dark:border-gray-700 pt-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-500" />
                  Account Details
                </h3>

                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Full Name
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white font-medium">
                      {session.user.name || 'Not provided'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Email Address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white font-medium">
                      {session.user.email}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      User ID
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500 dark:text-gray-500 font-mono truncate">
                      {session.user.id}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                <form
                  action={async () => {
                    'use server';
                    await signOut({ redirectTo: '/signin' });
                  }}
                >
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
