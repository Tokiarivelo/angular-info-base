'use client';

import { QuizQuestionProps } from '../QuizTaker.types';

export default function QuizQuestion({
  question,
  questionIndex,
  selectedAnswer,
  onAnswerSelect,
}: QuizQuestionProps) {
  return (
    <div className="mb-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">
        {question.question}
      </h4>
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <label
            key={index}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedAnswer === index
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name={`question-${questionIndex}`}
              value={index}
              checked={selectedAnswer === index}
              onChange={() => onAnswerSelect(index)}
              className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-3 text-gray-900">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
