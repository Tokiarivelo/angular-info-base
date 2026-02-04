'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useAdminPage } from './AdminPageClient.hooks';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Users,
  GraduationCap,
  AlertCircle,
  ArrowRight,
  Settings,
  Clock,
  CheckCircle2,
  Shield,
  Activity,
} from 'lucide-react';

export default function AdminPageClient() {
  const t = useTranslations('admin');
  const { stats, isLoading, error } = useAdminPage();

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {t('errorLoading')}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {t('errorDescription')}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium transition-transform hover:scale-105"
        >
          {t('reloadDashboard')}
        </button>
      </div>
    );
  }

  const hasPendingRequests =
    stats.pendingEnrollmentRequests > 0 || stats.pendingCourseRequests > 0;

  return (
    <div className="space-y-10">
      {/* Page Header with subtle gradient accent */}
      <div className="relative">
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-white dark:to-gray-200 rounded-2xl shadow-xl shadow-gray-900/10 dark:shadow-none">
            <LayoutDashboard className="w-6 h-6 text-white dark:text-gray-900" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {t('dashboard')}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {t('overview')}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t('totalCourses')}
          value={stats.coursesCount}
          icon={
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          }
          gradient="from-blue-50 to-white dark:from-blue-900/10 dark:to-gray-800"
          border="border-blue-100 dark:border-blue-800/30"
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          href="/admin/courses"
        />
        <StatCard
          label={t('contentChapters')}
          value={stats.chaptersCount}
          icon={
            <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          }
          gradient="from-purple-50 to-white dark:from-purple-900/10 dark:to-gray-800"
          border="border-purple-100 dark:border-purple-800/30"
          iconBg="bg-purple-100 dark:bg-purple-900/30"
        />
        <StatCard
          label={t('activeUsers')}
          value={stats.usersCount}
          icon={
            <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          }
          gradient="from-emerald-50 to-white dark:from-emerald-900/10 dark:to-gray-800"
          border="border-emerald-100 dark:border-emerald-800/30"
          iconBg="bg-emerald-100 dark:bg-emerald-900/30"
          href="/admin/users"
        />
        <StatCard
          label={t('totalEnrollments')}
          value={stats.enrollmentsCount}
          icon={
            <GraduationCap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          }
          gradient="from-orange-50 to-white dark:from-orange-900/10 dark:to-gray-800"
          border="border-orange-100 dark:border-orange-800/30"
          iconBg="bg-orange-100 dark:bg-orange-900/30"
        />
      </div>

      {/* Pending Requests Alert */}
      {hasPendingRequests && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-900/50 rounded-3xl p-6 flex flex-col md:flex-row md:items-center gap-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/40 dark:bg-transparent backdrop-blur-[2px] z-0 opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 z-10">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 z-10">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {t('actionRequired')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t('pendingRequestsDescription')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto z-10">
            {stats.pendingEnrollmentRequests > 0 && (
              <Link
                href="/admin/enrollment-requests"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-amber-700 dark:text-amber-400 rounded-xl font-semibold text-sm shadow-sm hover:shadow-md border border-amber-100 dark:border-amber-900/30 transition-all hover:bg-amber-50 dark:hover:bg-gray-700"
              >
                <span>
                  {stats.pendingEnrollmentRequests} {t('viewEnrollments')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            {stats.pendingCourseRequests > 0 && (
              <Link
                href="/admin/course-requests"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-amber-700 dark:text-amber-400 rounded-xl font-semibold text-sm shadow-sm hover:shadow-md border border-amber-100 dark:border-amber-900/30 transition-all hover:bg-amber-50 dark:hover:bg-gray-700"
              >
                <span>
                  {stats.pendingCourseRequests} {t('viewCourseRequests')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <span className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </span>
          {t('quickActions')}
        </h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <ActionCard
            title={t('manageCourses')}
            description={t('manageCoursesDesc')}
            icon={
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            }
            href="/admin/courses"
            iconBg="bg-blue-100 dark:bg-blue-900/30"
          />
          <ActionCard
            title={t('enrollmentRequests')}
            description={t('enrollmentRequestsDesc')}
            icon={
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            }
            href="/admin/enrollment-requests"
            badge={stats.pendingEnrollmentRequests}
            iconBg="bg-green-100 dark:bg-green-900/30"
          />
          <ActionCard
            title={t('courseRequests')}
            description={t('courseRequestsDesc')}
            icon={
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            }
            href="/admin/course-requests"
            badge={stats.pendingCourseRequests}
            iconBg="bg-purple-100 dark:bg-purple-900/30"
          />
          <ActionCard
            title={t('userManagement')}
            description={t('userManagementDesc')}
            icon={
              <Shield className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            }
            href="/admin/users"
            iconBg="bg-gray-200 dark:bg-gray-700"
          />
          <ActionCard
            title={t('systemSettings')}
            description={t('systemSettingsDesc')}
            icon={
              <Settings className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            }
            href="/admin/settings"
            iconBg="bg-cyan-100 dark:bg-cyan-900/30"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  gradient,
  border,
  iconBg,
  href,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
  border: string;
  iconBg: string;
  href?: string;
}) {
  const content = (
    <>
      <div className="flex items-center justify-between mb-5">
        <div
          className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}
        >
          {icon}
        </div>
        {href && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
          {label}
        </p>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          {value}
        </h3>
      </div>
    </>
  );

  const className = `bg-gradient-to-br ${gradient} p-6 rounded-3xl border ${border} shadow-sm transition-all hover:shadow-md hover:-translate-y-1 group relative overflow-hidden`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}

function ActionCard({
  title,
  description,
  icon,
  href,
  badge,
  iconBg,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
  iconBg: string;
}) {
  return (
    <Link
      href={href}
      className="group p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl hover:shadow-lg dark:hover:shadow-none hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`p-3 ${iconBg} rounded-xl group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
        {badge && badge > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-red-500/20 animate-pulse">
            {badge}
          </span>
        )}
      </div>
      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
        {description}
      </p>
    </Link>
  );
}
