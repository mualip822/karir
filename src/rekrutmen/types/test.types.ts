export interface CandidateTest {
  id: string;
  test_id: string;
  test_title: string;
  test_description: string;
  assigned_at: string;
  status: string;
}

export interface QuestionOption {
  id: string;
  option_text: string;
  option_image?: string;
  is_correct?: boolean;
}

export interface Question {
  id: string;
  question_text: string;
  question_type: string;
  question_image?: string;
  answer_audio?: string;
  options?: QuestionOption[];
}

export interface TestAttempt {
  id: string;
  candidate_id: string;
  test_id: string;
  status: string;
}
export interface TestAssignment {
  id: string;
  candidate_id: number;
  test_id: string;
  message_id: number | null;
  status: 'assigned' | 'in_progress' | 'completed';
  assigned_at: string;
}

export interface TestWithAssignment {
  assignment: TestAssignment;
  test: Test;
}

export interface AttemptWithTest {
  id: string;
  candidate_id: string;
  test_id: string;
  status: string;
  started_at: string;
  finished_at: string | null;
  test_title: string;
  test_description: string;
  duration_minutes: number;
}

export interface TestResult {
  id: string;
  attempt_id: string;
  multiple_choice_score: number;
  essay_score: number;
  audio_score: number;
  total_score: number;
  passed: boolean | null;
  created_at: string;
}

export interface QuestionWithOptions extends Question {
  options?: QuestionOption[];
}
export interface Test {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  is_active?: boolean;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}