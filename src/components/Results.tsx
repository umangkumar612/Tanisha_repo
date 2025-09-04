import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserAnswer } from '../types/quiz';
import { Trophy, RotateCcw, CheckCircle, XCircle, Home } from 'lucide-react';

interface ResultsState {
  userAnswers: UserAnswer[];
  totalQuestions: number;
  score: number;
}

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ResultsState | null;

  // Redirect to Home if no state
  useEffect(() => {
    if (!state) {
      navigate('/');
    }
  }, [state, navigate]);

  if (!state) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gradient-to-br from-purple-50 via-white to-orange-50">
        <p className="text-xl font-semibold text-gray-700 mb-4">
          No results found. Please take the quiz first!
        </p>
        <button
          onClick={() => navigate('/quiz')}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
        >
          Go to Quiz
        </button>
      </div>
    );
  }

  const { userAnswers, totalQuestions, score } = state;
  const percentage = Math.round((score / totalQuestions) * 100);

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-purple-700';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return 'Outstanding! 🌟';
    if (percentage >= 80) return 'Excellent work! 🎉';
    if (percentage >= 70) return 'Good job! 💪';
    if (percentage >= 60) return 'Not bad! 👍';
    return 'Keep practicing! 🚀';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Quiz Complete!</h1>
          <p className="text-xl text-gray-600">{getScoreMessage(percentage)}</p>
        </div>

        {/* Score Summary */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-6">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(percentage)}`}>
              {score}/{totalQuestions}
            </div>
            <div className={`text-2xl font-semibold ${getScoreColor(percentage)}`}>
              {percentage}% Correct
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-800">Correct</span>
              </div>
              <div className="text-2xl font-bold text-purple-700">{score}</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-orange-600" />
                <span className="font-semibold text-orange-800">Incorrect</span>
              </div>
              <div className="text-2xl font-bold text-orange-700">{totalQuestions - score}</div>
            </div>
          </div>
        </div>

        {/* Answer Review */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Answer Review</h2>
          <div className="space-y-4">
            {userAnswers.map((answer, index) => (
              <div
                key={answer.questionId}
                className={`p-4 rounded-xl border-2 ${
                  answer.isCorrect
                    ? 'border-purple-200 bg-purple-50'
                    : 'border-orange-200 bg-orange-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {answer.isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 mb-2">
                      Question {index + 1}
                    </p>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Your answer:</span>{' '}
                        <span
                          className={
                            answer.isCorrect ? 'text-purple-700' : 'text-orange-700'
                          }
                        >
                          {answer.selectedAnswer || 'No answer selected'}
                        </span>
                      </p>
                      {!answer.isCorrect && (
                        <p>
                          <span className="font-medium">Correct answer:</span>{' '}
                          <span className="text-purple-700">{answer.correctAnswer}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-4 px-8 rounded-xl transition-all hover:scale-105"
          >
            <Home className="w-5 h-5" />
            Home
          </button>

          <button
            onClick={() => navigate('/quiz')}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white font-semibold py-4 px-8 rounded-xl transition-all hover:scale-105 shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
            Take Quiz Again
          </button>
        </div>
      </div>
    </div>
  );
}
