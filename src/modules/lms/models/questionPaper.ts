export type PaperStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';

export interface OptionItem {
  id: string;
  label: string;
  text: string;
}

export interface QuestionItem {
  id: string;
  type: string;
  questionText: string;
  options: OptionItem[];
  correctOptionId: string;
  marks: number;
  negativeMarks: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isRequired: boolean;
}

export interface SectionItem {
  id: string;
  name: string;
  subtitle: string;
  questions: QuestionItem[];
}

export interface QuestionPaper {
  id: string | number;
  title: string;
  subTitle: string;
  description: string;
  code: string;
  department: string;
  subDepartment: string;
  lineSection: string;
  allowedTime: number; // in minutes
  passingScore: number; // in %
  status: PaperStatus;
  sections: SectionItem[];
  createdAt: string;
  updatedAt: string;
}
