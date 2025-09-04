import { useState, useEffect, useCallback } from 'react';
import { FormattedQuestion, UserAnswer, QuizState } from '../types/quiz';
import { fetchQuestions } from '../utils/api';
import fallbackQuestions from '../data/questions.json';

const QUESTION_TIME_LIMIT = 30; // seconds

export function useQuiz() {
  const [state, setState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    isLoading: true,
    error: null,
    timeRemaining: QUESTION_TIME_LIMIT,
    isQuizComplete: false,
  });

  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  // Initialize quiz
  const initializeQuiz = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const questions = await fetchQuestions(10);
      setState(prev => ({
        ...prev,
        questions,
        isLoading: false,
        timeRemaining: QUESTION_TIME_LIMIT,
      }));
    } catch (error) {
      console.log('Using fallback questions');
      setState(prev => ({
        ...prev,
        questions: fallbackQuestions as FormattedQuestion[],
        isLoading: false,
        timeRemaining: QUESTION_TIME_LIMIT,
      }));
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (state.isLoading || state.isQuizComplete || state.timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setState(prev => {
        if (prev.timeRemaining <= 1) {
          // Time's up - auto submit current question
          return prev;
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.isLoading, state.isQuizComplete, state.timeRemaining]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (state.timeRemaining === 0 && !state.isQuizComplete) {
      handleNextQuestion();
    }
  }, [state.timeRemaining]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    const currentQuestion = state.questions[state.currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    const userAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer: selectedAnswer || '',
      isCorrect,
      correctAnswer: currentQuestion.correctAnswer,
    };

    setState(prev => {
      const newUserAnswers = [...prev.userAnswers, userAnswer];
      const isLastQuestion = prev.currentQuestionIndex >= prev.questions.length - 1;
      
      return {
        ...prev,
        userAnswers: newUserAnswers,
        currentQuestionIndex: isLastQuestion ? prev.currentQuestionIndex : prev.currentQuestionIndex + 1,
        isQuizComplete: isLastQuestion,
        timeRemaining: isLastQuestion ? 0 : QUESTION_TIME_LIMIT,
      };
    });

    setSelectedAnswer('');
  };

  const handlePreviousQuestion = () => {
    if (state.currentQuestionIndex > 0) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
        timeRemaining: QUESTION_TIME_LIMIT,
      }));
      
      // Set the previously selected answer
      const prevAnswer = state.userAnswers[state.currentQuestionIndex - 1];
      if (prevAnswer) {
        setSelectedAnswer(prevAnswer.selectedAnswer);
      } else {
        setSelectedAnswer('');
      }
    }
  };

  const restartQuiz = () => {
    setState({
      questions: [],
      currentQuestionIndex: 0,
      userAnswers: [],
      isLoading: true,
      error: null,
      timeRemaining: QUESTION_TIME_LIMIT,
      isQuizComplete: false,
    });
    setSelectedAnswer('');
    initializeQuiz();
  };

  const getScore = () => {
    return state.userAnswers.filter(answer => answer.isCorrect).length;
  };

  return {
    ...state,
    selectedAnswer,
    initializeQuiz,
    handleAnswerSelect,
    handleNextQuestion,
    handlePreviousQuestion,
    restartQuiz,
    getScore,
  };
}