export interface Question {
  id: number;
  section: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

export type QuestionStatus = 'not-visited' | 'not-answered' | 'answered' | 'marked-for-review';
