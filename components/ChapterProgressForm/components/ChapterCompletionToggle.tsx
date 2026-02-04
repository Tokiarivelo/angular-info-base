'use client';

import { useTranslations } from 'next-intl';

interface ChapterCompletionToggleProps {
  completed: boolean;
  onToggle: () => Promise<void>;
  isPending: boolean;
}

export default function ChapterCompletionToggle({
  completed,
  onToggle,
  isPending,
}: ChapterCompletionToggleProps) {
  const t = useTranslations('chapterProgress.completion');
  return (
    <div
      className={`p-6 rounded-lg border-2 transition-all shadow-sm ${
        completed
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-500'
          : 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 border-gray-300 dark:border-gray-700'
      }`}
    >
      <label className="flex items-start gap-4 cursor-pointer group">
        <div className="pt-1">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
              completed
                ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                : 'bg-gradient-to-br from-gray-400 to-slate-500'
            }`}
          >
            <span className="text-2xl">{completed ? '✅' : '⏳'}</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={completed}
              onChange={onToggle}
              disabled={isPending}
              className="w-6 h-6 text-green-600 border-2 border-gray-400 rounded focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
            />
            <span
              className={`text-lg font-bold transition-colors ${
                completed
                  ? 'text-green-700 dark:text-green-300'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {t('label')}
            </span>
          </div>
          <p
            className={`text-sm ml-9 ${
              completed
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {completed ? t('completedMessage') : t('pendingMessage')}
          </p>
        </div>
      </label>
    </div>
  );
}
