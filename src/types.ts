export type Category =
  | "CFO 관점"
  | "AI 투자"
  | "두나무 거래"
  | "회계"
  | "세무"
  | "Pillar 2"
  | "경력 연결"
  | "지원동기";

export type Difficulty = "기본" | "임원" | "CFO 압박";

export type SourceType = "공식 공시" | "회사 발표" | "국제기구" | "면접 추론";

export interface Source {
  id: string;
  title: string;
  publisher: string;
  publishedAt: string;
  url: string;
  verifiedAt: string;
  type: SourceType;
}

export interface InterviewQuestion {
  id: string;
  category: Category;
  difficulty: Difficulty;
  question: string;
  interviewerIntent: string;
  keyAnswer: [string, string, string];
  answerFramework: string[];
  modelAnswer: string;
  metrics: string[];
  counterArgument: string;
  followUps: string[];
  redFlags: string[];
  candidateEvidence: string;
  tags: string[];
  sourceIds: string[];
  lastVerifiedAt: string;
}

export interface QuestionProgress {
  completed: boolean;
  confidence?: number;
  weak: boolean;
  bookmarked: boolean;
  note: string;
  attempts: number;
  lastAttemptAt?: string;
}

export interface StudyState {
  questions: Record<string, QuestionProgress>;
  lastStudyDate?: string;
  studyDates: string[];
  theme: "light" | "dark" | "system";
}

export interface CandidateStory {
  id: string;
  title: string;
  fields: {
    situation: string;
    role: string;
    criteria: string;
    stakeholders: string;
    action: string;
    result: string;
    control: string;
    naverApplication: string;
    cfoMeaning: string;
  };
}

export type LensName = "손익" | "현금흐름" | "재무상태표" | "세금" | "리스크" | "주주가치";
