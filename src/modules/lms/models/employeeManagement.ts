export type EmployeeGender = 'Male' | 'Female';
export type EmployeeCategory = 'Staff' | 'Worker';
export type EmployeeGrade = 'Manufacturing Indirect' | 'Direct' | 'Indirect';
export type EmployeeShift = 'A' | 'B' | 'C' | 'General';
export type EmployeeSkill = 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5';

export interface Employee {
  id: number;
  employeeId: string;
  fullName: string;
  fatherName?: string | null;
  dob: string;
  gender: EmployeeGender;
  designation: string;
  category?: EmployeeCategory | null;
  departmentId: number;
  subDepartmentId?: number | null;
  sectionId?: number | null;
  lineId?: number | null;
  machineId?: number | null;
  grade: EmployeeGrade;
  division: string;
  address?: string | null;
  state?: string | null;
  pincode?: number | null;
  email: string;
  mobile: string;
  doj: string;
  dol?: string | null;
  isActive: boolean;
  firstOfDay?: string | null;
  unit?: string | null;
  shift: EmployeeShift;
  isDojo: boolean;
  skill: EmployeeSkill;
  createdAt?: string;
  updatedAt?: string;

  // Relations included from API
  department?: { id: number; name: string };
  subDepartment?: { id: number; name: string } | null;
  section?: { id: number; name: string } | null;
  line?: { id: number; name: string } | null;
  machine?: { id: number; name: string } | null;
}

export interface EmployeeFormData {
  id: number | null;
  employeeId: string;
  fullName: string;
  fatherName: string;
  dob: string;
  gender: EmployeeGender;
  designation: string;
  category: EmployeeCategory | '';
  departmentId: number | '';
  subDepartmentId: number | '';
  sectionId: number | '';
  lineId: number | '';
  machineId: number | '';
  grade: EmployeeGrade;
  division: string;
  address: string;
  state: string;
  pincode: string;
  email: string;
  mobile: string;
  doj: string;
  dol: string;
  isActive: boolean;
  firstOfDay: string;
  unit: string;
  shift: EmployeeShift;
  isDojo: boolean;
  skill: EmployeeSkill;
}