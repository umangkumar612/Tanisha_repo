export interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface FormattedQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  category: string;
  difficulty: string;
}

export interface UserAnswer {
  questionId: number;
  selectedAnswer: string;
  isCorrect: boolean;
  correctAnswer: string;
}

export interface QuizState {
  questions: FormattedQuestion[];
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  isLoading: boolean;
  error: string | null;
  timeRemaining: number;
  isQuizComplete: boolean;
}