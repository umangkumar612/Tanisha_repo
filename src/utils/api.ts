import { Question, FormattedQuestion } from '../types/quiz';

const API_BASE_URL = 'https://opentdb.com/api.php';

export async function fetchQuestions(amount = 10, difficulty = 'medium'): Promise<FormattedQuestion[]> {
  try {
    const response = await fetch(`${API_BASE_URL}?amount=${amount}&difficulty=${difficulty}&type=multiple`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.response_code !== 0) {
      throw new Error('Failed to fetch questions from API');
    }
    
    return formatQuestions(data.results);
  } catch (error) {
    console.warn('API fetch failed, using fallback questions:', error);
    throw error;
  }
}

function formatQuestions(questions: Question[]): FormattedQuestion[] {
  return questions.map((q, index) => ({
    id: index,
    question: decodeHtml(q.question),
    options: shuffleArray([
      decodeHtml(q.correct_answer),
      ...q.incorrect_answers.map(decodeHtml)
    ]),
    correctAnswer: decodeHtml(q.correct_answer),
    category: decodeHtml(q.category),
    difficulty: q.difficulty
  }));
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function decodeHtml(html: string): string {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}