import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Question from './Question';
import ProgressBar from './ProgressBar';
import { useQuiz } from '../hooks/useQuiz';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

export default function Quiz() {
  const navigate = useNavigate();
  const {
    questions,
    currentQuestionIndex,
    selectedAnswer,
    isLoading,
    error,
    timeRemaining,
    isQuizComplete,
    initializeQuiz,
    handleAnswerSelect,
    handleNextQuestion,
    handlePreviousQuestion,
  } = useQuiz();

  useEffect(() => {
    initializeQuiz();
  }, [initializeQuiz]);

  useEffect(() => {
    if (isQuizComplete) {
      navigate('/results');
    }
  }, [isQuizComplete, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading Quiz...</h2>
          <p className="text-gray-500 mt-2">Preparing your questions</p>
        </div>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Quiz</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={initializeQuiz}
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const canGoBack = currentQuestionIndex > 0;
  const canGoNext = selectedAnswer.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">QuizMaster</h1>
          <p className="text-gray-600">Test your knowledge with our interactive quiz</p>
        </div>

        {/* Progress Bar */}
        <ProgressBar 
          current={currentQuestionIndex} 
          total={questions.length}
          timeRemaining={timeRemaining}
        />

        {/* Question */}
        <div className="mb-8">
          <Question
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            timeRemaining={timeRemaining}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <button
            onClick={handlePreviousQuestion}
            disabled={!canGoBack}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              canGoBack
                ? 'bg-gray-200 hover:bg-gray-300 text-gray-800 hover:scale-105'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              {selectedAnswer ? 'Click Next to continue' : 'Select an answer to proceed'}
            </p>
          </div>

          <button
            onClick={handleNextQuestion}
            disabled={!canGoNext}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              canGoNext
                ? 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105 shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}