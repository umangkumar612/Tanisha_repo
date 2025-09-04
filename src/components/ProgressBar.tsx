import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  timeRemaining?: number;
}

export default function ProgressBar({ current, total, timeRemaining }: ProgressBarProps) {
  const progress = ((current + 1) / total) * 100;
  const timeProgress = timeRemaining ? (timeRemaining / 30) * 100 : 0;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-gray-700">
          Question {current + 1} of {total}
        </span>
        {timeRemaining !== undefined && (
          <span className={`text-sm font-medium ${timeRemaining <= 10 ? 'text-red-500' : 'text-gray-700'}`}>
            {timeRemaining}s remaining
          </span>
        )}
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div
          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Timer Bar */}
      {timeRemaining !== undefined && (
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div
            className={`h-1 rounded-full transition-all duration-1000 ease-linear ${
              timeRemaining <= 10 ? 'bg-red-500' : 'bg-yellow-500'
            }`}
            style={{ width: `${timeProgress}%` }}
          />
        </div>
      )}
    </div>
  );
}