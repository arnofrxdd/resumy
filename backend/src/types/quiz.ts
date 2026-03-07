export interface QuizQuestion {
    id: string;
    type: 'mcq' | 'coding' | 'mixed';
    question: string;
    options?: string[];
    correctAnswer: string | number;
    solutions?: Solution[]; // Multiple solutions for coding questions
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
    topic: string;
    codeTemplate?: string;
    testCases?: TestCase[];
}

export interface Solution {
    title: string;
    code: string;
    complexity: string;
    explanation: string;
}

export interface TestCase {
    input: string;
    expectedOutput: string;
    description: string;
}

export interface QuizConfig {
    topic: string;
    format: 'mcq' | 'coding' | 'mixed';
    difficulty: 'easy' | 'medium' | 'hard';
    questionCount: number;
    mcqCount: number;
    codingCount: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface UserInfo {
  name?: string;
  email?: string;
  experienceLevel?: string;
}

export interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  quizConfig?: QuizConfig;
}

