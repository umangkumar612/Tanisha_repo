import React from 'react';
import { FormattedQuestion } from '../types/quiz';
import { Clock } from 'lucide-react';

interface QuestionProps {
  question: FormattedQuestion;
  selectedAnswer: string;
  onAnswerSelect: (answer: string) => void;
  timeRemaining: number;
}

export default function Question({ 
  question, 
  selectedAnswer, 
  onAnswerSelect,
  timeRemaining 
}: QuestionProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-white/95">
        {/* Question Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {question.category}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {question.difficulty}
            </span>
            <div className={`flex items-center gap-1 ${timeRemaining <= 10 ? 'text-red-500' : 'text-gray-500'}`}>
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{timeRemaining}s</span>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 leading-relaxed">
            {question.question}
          </h2>
        </div>

        {/* Answer Options */}
        <div className="space-y-4">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
            
            return (
              <button
                key={index}
                onClick={() => onAnswerSelect(option)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 group hover:scale-[1.02] ${
                  isSelected
                    ? 'border-green-500 bg-green-50 shadow-md'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                }`}
                aria-label={`Option ${optionLetter}: ${option}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm transition-colors ${
                    isSelected 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                  }`}>
                    {optionLetter}
                  </div>
                  <span className="text-gray-800 font-medium text-lg leading-relaxed">
                    {option}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
