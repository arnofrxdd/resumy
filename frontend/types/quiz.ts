// /types/quiz.ts

// ---------------- QUIZ TYPES ----------------

export interface QuizQuestion {
    id: string;
    type: 'mcq' | 'coding';
    question: string;
    options?: string[];
    correctAnswer: string | number;
    explanation: string;
    difficulty: string;
    topic: string;
    codeTemplate?: string;
    testCases?: any[];
    max_score?: number;
}

export interface UserAnswer {
    questionId: string;
    answer: string;
    isCorrect: boolean;
    timeSpent: number;
    score: number;
}

export interface QuizSession {
    id: string;
    topic: string;
    format: 'mcq' | 'coding' | 'mixed';
    difficulty: string;
    questions: QuizQuestion[];
    userAnswers: UserAnswer[];
    currentQuestionIndex: number;
    score: number;
    totalQuestions: number;
    startTime?: Date;
    endTime?: Date;
    sessionId?: string;
}

// ---------------- CHAT TYPES ----------------

export interface QuizConfig {
    topic: string;
    format: 'mcq' | 'coding' | 'mixed';
    difficulty: 'easy' | 'medium' | 'hard';
    questionCount: number;
    mcqCount: number;
    codingCount: number;
}

export interface UserInfo {
    name?: string;
    email?: string;
    experienceLevel?: string;
    topic?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    format?: 'mcq' | 'coding' | 'mixed';   // ✅ IMPORTANT
}

export interface ChatMessage {
    id: string;   // ✅ required (you use it everywhere)
    role: 'user' | 'assistant';
    content: string;
    timestamp?: Date;   // matches new Date()
    type?: string;
}

export interface ChatState {
    step?: string;
    messages?: ChatMessage[];
    isTyping?: boolean;
    quizConfig?: QuizConfig;
    userInfo: UserInfo;   // required because you always use it
}
