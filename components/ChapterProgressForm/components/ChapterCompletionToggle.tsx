'use client';

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
  return (
    <div className="pt-4 border-t">
      <label className="flex items-center space-x-3 cursor-pointer">
        <input
          type="checkbox"
          checked={completed}
          onChange={onToggle}
          disabled={isPending}
          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <span className="text-sm font-medium text-gray-700">
          Mark chapter as completed
        </span>
      </label>
    </div>
  );
}
