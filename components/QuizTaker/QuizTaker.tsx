'use client';

import { QuizTakerProps } from './QuizTaker.types';
import { useQuizState, useQuizSubmission } from './QuizTaker.hooks';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';
import QuizProgress from './QuizProgress';

export default function QuizTaker({ quiz, onComplete }: QuizTakerProps) {
  const {
    currentQuestion,
    answers,
    showResults,
    results,
    sortedQuestions,
    isLastQuestion,
    isFirstQuestion,
    hasAnswered,
    handleAnswerSelect,
    handleNext,
    handlePrevious,
    handleRetake,
    setShowResults,
    setResults,
  } = useQuizState(quiz);

  const { submitQuizAnswers, isPending } = useQuizSubmission(
    quiz.id,
    onComplete
  );

  const handleSubmit = () => {
    submitQuizAnswers(answers, (quizResults) => {
      setResults(quizResults);
      setShowResults(true);
    });
  };

  if (showResults && results) {
    return (
      <QuizResults
        results={results}
        passingScore={quiz.passingScore}
        questions={sortedQuestions}
        answers={answers}
        onRetake={handleRetake}
      />
    );
  }

  const question = sortedQuestions[currentQuestion];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">{quiz.title}</h3>
          <div className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {sortedQuestions.length}
          </div>
        </div>
        {quiz.description && (
          <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>
        )}
        <QuizProgress
          current={currentQuestion}
          total={sortedQuestions.length}
        />
      </div>

      <QuizQuestion
        question={question}
        questionIndex={currentQuestion}
        selectedAnswer={answers[currentQuestion]}
        onAnswerSelect={handleAnswerSelect}
      />

      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={isFirstQuestion}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <div className="text-sm text-gray-600">
          {answers.filter((a) => a !== -1).length} of {sortedQuestions.length}{' '}
          answered
        </div>
        <button
          onClick={isLastQuestion ? handleSubmit : handleNext}
          disabled={!hasAnswered || isPending}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending
            ? 'Submitting...'
            : isLastQuestion
              ? 'Submit Quiz'
              : 'Next'}
        </button>
      </div>
    </div>
  );
}
