import * as XLSX from 'xlsx';

export interface ColumnGuide {
  header: string;
  field: string;
  type: string;
  required: boolean;
  allowedValues?: string;
  example: string;
}

export const EMPLOYEE_EXCEL_COLUMNS: ColumnGuide[] = [
  { header: 'Employee ID', field: 'employeeId', type: 'String (Unique)', required: true, example: 'EMP1001' },
  { header: 'Full Name', field: 'fullName', type: 'String', required: true, example: 'Rahul Sharma' },
  { header: 'Father Name', field: 'fatherName', type: 'String', required: false, example: 'Vijay Sharma' },
  { header: 'Date of Birth', field: 'dob', type: 'Date (YYYY-MM-DD)', required: true, example: '1996-08-20' },
  { header: 'Gender', field: 'gender', type: 'Enum', required: true, allowedValues: 'Male, Female', example: 'Male' },
  { header: 'Designation', field: 'designation', type: 'String', required: true, example: 'Machine Operator' },
  { header: 'Category', field: 'category', type: 'Enum', required: false, allowedValues: 'Staff, Worker', example: 'Worker' },
  { header: 'Department', field: 'departmentId', type: 'Name OR ID', required: true, example: 'Production' },
  { header: 'Sub Department', field: 'subDepartmentId', type: 'Name OR ID', required: false, example: 'Assembly' },
  { header: 'Section', field: 'sectionId', type: 'Name OR ID', required: false, example: 'Section A' },
  { header: 'Line', field: 'lineId', type: 'Name OR ID', required: false, example: 'Line 1' },
  { header: 'Machine', field: 'machineId', type: 'Name OR ID', required: false, example: 'Press-01' },
  { header: 'Grade', field: 'grade', type: 'Enum', required: true, allowedValues: 'Manufacturing Indirect, Direct, Indirect', example: 'Direct' },
  { header: 'Division', field: 'division', type: 'String', required: true, example: 'Automotive' },
  { header: 'Address', field: 'address', type: 'String', required: false, example: 'Plot 45, Phase 2' },
  { header: 'State', field: 'state', type: 'String', required: false, example: 'Karnataka' },
  { header: 'Pincode', field: 'pincode', type: 'Number', required: false, example: '560100' },
  { header: 'Email', field: 'email', type: 'Email String', required: true, example: 'rahul.sharma@example.com' },
  { header: 'Mobile', field: 'mobile', type: 'String (min 7 digits)', required: true, example: '9876543210' },
  { header: 'Date of Joining', field: 'doj', type: 'Date (YYYY-MM-DD)', required: true, example: '2023-03-01' },
  { header: 'Date of Leaving', field: 'dol', type: 'Date (YYYY-MM-DD)', required: false, example: '' },
  { header: 'Is Active', field: 'isActive', type: 'Boolean', required: true, allowedValues: 'true/false, yes/no, 1/0', example: 'true' },
  { header: 'First of Day', field: 'firstOfDay', type: 'Date (YYYY-MM-DD)', required: false, example: '' },
  { header: 'Unit', field: 'unit', type: 'String', required: false, example: 'Unit 1' },
  { header: 'Shift', field: 'shift', type: 'Enum', required: true, allowedValues: 'A, B, C, General', example: 'A' },
  { header: 'Is Dojo', field: 'isDojo', type: 'Boolean', required: true, allowedValues: 'true/false, yes/no, 1/0', example: 'false' },
  { header: 'Skill', field: 'skill', type: 'Enum', required: true, allowedValues: 'L0, L1, L2, L3, L4, L5', example: 'L2' },
];

export function downloadEmployeeExcelTemplate(defaultDepartmentName: string = 'Production') {
  const headers = EMPLOYEE_EXCEL_COLUMNS.map(c => c.header);

  const sampleRows = [
    {
      'Employee ID': 'EMP1001',
      'Full Name': 'Rahul Sharma',
      'Father Name': 'Vijay Sharma',
      'Date of Birth': '1996-08-20',
      'Gender': 'Male',
      'Designation': 'Machine Operator',
      'Category': 'Worker',
      'Department': defaultDepartmentName,
      'Sub Department': '',
      'Section': '',
      'Line': '',
      'Machine': '',
      'Grade': 'Direct',
      'Division': 'Manufacturing',
      'Address': 'Plot 45, Phase 2, Industrial Area',
      'State': 'Karnataka',
      'Pincode': 560100,
      'Email': 'rahul.sharma@example.com',
      'Mobile': '9876543210',
      'Date of Joining': '2023-03-01',
      'Date of Leaving': '',
      'Is Active': 'true',
      'First of Day': '',
      'Unit': 'Unit 1',
      'Shift': 'A',
      'Is Dojo': 'false',
      'Skill': 'L2',
    },
    {
      'Employee ID': 'EMP1002',
      'Full Name': 'Pooja Verma',
      'Father Name': 'Suresh Verma',
      'Date of Birth': '1998-11-14',
      'Gender': 'Female',
      'Designation': 'Quality Inspector',
      'Category': 'Staff',
      'Department': defaultDepartmentName,
      'Sub Department': '',
      'Section': '',
      'Line': '',
      'Machine': '',
      'Grade': 'Manufacturing Indirect',
      'Division': 'Quality Assurance',
      'Address': 'Sector 14, Main Road',
      'State': 'Karnataka',
      'Pincode': 560068,
      'Email': 'pooja.verma@example.com',
      'Mobile': '9812345678',
      'Date of Joining': '2022-09-15',
      'Date of Leaving': '',
      'Is Active': 'true',
      'First of Day': '',
      'Unit': 'Unit 2',
      'Shift': 'General',
      'Is Dojo': 'true',
      'Skill': 'L3',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleRows, { header: headers });

  // Column auto widths
  worksheet['!cols'] = headers.map(header => ({
    wch: Math.max(header.length + 3, 14),
  }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');

  XLSX.writeFile(workbook, 'employee_upload_template.xlsx');
}
