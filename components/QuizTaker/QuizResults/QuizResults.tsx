'use client';

import { QuizResultsProps } from '../QuizTaker.types';

export default function QuizResults({
  results,
  passingScore,
  questions,
  answers,
  onRetake,
}: QuizResultsProps) {
  const passed = results.passed;
  const score = results.score;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Quiz Results</h3>
      <div className="mb-6">
        <div className="flex items-center justify-center mb-4">
          <div
            className={`text-6xl font-bold ${
              passed ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {score}%
          </div>
        </div>
        <div className="text-center">
          {passed ? (
            <div className="text-green-600 font-semibold text-lg">
              🎉 Congratulations! You passed!
            </div>
          ) : (
            <div className="text-red-600 font-semibold text-lg">
              You didn&apos;t pass this time. (Required: {passingScore}%)
            </div>
          )}
        </div>
      </div>
      <div className="space-y-4">
        {questions.map((q, index) => {
          const userAnswer = answers[index];
          const isCorrect = userAnswer === q.correctAnswer;
          return (
            <div
              key={q.id}
              className={`p-4 border rounded-lg ${
                isCorrect
                  ? 'border-green-300 bg-green-50'
                  : 'border-red-300 bg-red-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="font-medium text-gray-900">
                  Question {index + 1}
                </div>
                {isCorrect ? (
                  <span className="text-green-600 font-semibold">✓</span>
                ) : (
                  <span className="text-red-600 font-semibold">✗</span>
                )}
              </div>
              <div className="text-gray-700 mb-2">{q.question}</div>
              <div className="space-y-1 text-sm">
                <div>
                  Your answer:{' '}
                  <span
                    className={isCorrect ? 'text-green-700' : 'text-red-700'}
                  >
                    {q.options[userAnswer]}
                  </span>
                </div>
                {!isCorrect && (
                  <div>
                    Correct answer:{' '}
                    <span className="text-green-700">
                      {q.options[q.correctAnswer]}
                    </span>
                  </div>
                )}
                {q.explanation && (
                  <div className="mt-2 text-gray-600 italic">
                    {q.explanation}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex justify-center">
        <button
          onClick={onRetake}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retake Quiz
        </button>
      </div>
    </div>
  );
}
