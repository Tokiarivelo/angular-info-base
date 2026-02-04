'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User } from 'next-auth';
import { ThemeToggle } from '@/components/ThemeToggle';
import LanguageSelector from '@/components/shared/LanguageSelector';
import {
  Menu,
  X,
  Shield,
  BookOpen,
  CheckSquare,
  User as UserIcon,
  LogOut,
  Settings,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  user?: User;
  variant?: 'admin' | 'user';
}

export default function Header({ user, variant = 'user' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAdmin = user?.role === 'ADMIN';
  const pathname = usePathname();

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Define navigation items based on variant and role
  const adminLinks = [
    { href: '/admin', label: 'Dashboard', icon: Shield },
    { href: '/admin/courses', label: 'Courses', icon: BookOpen },
    {
      href: '/admin/enrollment-requests',
      label: 'Enrollments',
      icon: UserIcon,
    },
    { href: '/admin/course-requests', label: 'Requests', icon: CheckSquare },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const userLinks = [
    { href: '/courses', label: 'Courses', icon: BookOpen },
    { href: '/checklist', label: 'Checklists', icon: CheckSquare },
    { href: '/profile', label: 'Profile', icon: UserIcon },
  ];

  const activeLinks = variant === 'admin' ? adminLinks : userLinks;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex items-center flex-shrink-0">
            <Link
              href={variant === 'admin' ? '/admin' : '/'}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center transform group-hover:rotate-3 transition-transform">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
                {variant === 'admin' ? 'Admin Panel' : 'Angular Info'}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {activeLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-gray-200 dark:border-gray-800 ml-4">
            {variant === 'admin' ? (
              <Link
                href="/courses"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors mr-2"
              >
                Exit Admin
              </Link>
            ) : (
              isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors mr-2"
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </Link>
              )
            )}
            <LanguageSelector variant="compact" />
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="p-2 -mr-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 animate-in slide-in-from-top-2">
          <div className="px-4 py-3 space-y-1">
            {activeLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium ${
                  pathname === link.href
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Language
              </span>
              <LanguageSelector variant="compact" />
            </div>

            {variant === 'user' && isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium"
              >
                <Shield className="w-4 h-4" />
                Go to Admin Panel
              </Link>
            )}

            {variant === 'admin' && (
              <Link
                href="/courses"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl font-medium text-gray-900 dark:text-white"
              >
                <LogOut className="w-4 h-4" />
                Exit Admin Mode
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
