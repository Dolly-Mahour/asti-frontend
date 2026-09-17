import React, { useEffect, useState, useRef } from 'react';
import type {
  Employee,
  EmployeeFormData,
  EmployeeCategory,
} from '../models/employeeManagement';
import {
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  uploadEmployeesExcel,
  type EmployeePayload,
} from '../services/employeeService';
import { getDepartment } from '../services/departmentService';
import { getSubDepartments } from '../services/subDepartmentService';
import { getSections } from '../services/sectionService';
import { getLines } from '../services/lineService';
import { getMachines } from '../services/machineService';
import {
  downloadEmployeeExcelTemplate,
  EMPLOYEE_EXCEL_COLUMNS,
} from '../utils/employeeExcelUtils';
import '../../../styles/departments.css';

interface MasterEntity {
  id: number;
  name: string;
  departmentId?: number | null;
  subDepartmentId?: number | null;
  sectionId?: number | null;
  lineId?: number | null;
}

const INITIAL_FORM_DATA: EmployeeFormData = {
  id: null,
  employeeId: '',
  fullName: '',
  fatherName: '',
  dob: '',
  gender: 'Male',
  designation: '',
  category: 'Worker',
  departmentId: '',
  subDepartmentId: '',
  sectionId: '',
  lineId: '',
  machineId: '',
  grade: 'Direct',
  division: 'Manufacturing',
  address: '',
  state: '',
  pincode: '',
  email: '',
  mobile: '',
  doj: new Date().toISOString().split('T')[0],
  dol: '',
  isActive: true,
  firstOfDay: '',
  unit: 'Unit 1',
  shift: 'A',
  isDojo: false,
  skill: 'L1',
};

function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successToast, setSuccessToast] = useState<string>('');

  // Master Data Lists for Dropdowns & Placement
  const [departmentsList, setDepartmentsList] = useState<MasterEntity[]>([]);
  const [subDepartmentsList, setSubDepartmentsList] = useState<MasterEntity[]>([]);
  const [sectionsList, setSectionsList] = useState<MasterEntity[]>([]);
  const [linesList, setLinesList] = useState<MasterEntity[]>([]);
  const [machinesList, setMachinesList] = useState<MasterEntity[]>([]);

  // Filters
  const [search, setSearch] = useState<string>('');
  const [deptFilter, setDeptFilter] = useState<string>('All Departments');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  const [shiftFilter, setShiftFilter] = useState<string>('All Shifts');
  const [skillFilter, setSkillFilter] = useState<string>('All Skills');

  // Add / Edit Modal
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');
  const [formData, setFormData] = useState<EmployeeFormData>(INITIAL_FORM_DATA);

  // View Details Modal
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);

  // Excel Upload Modal
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState<string>('');
  const [showColumnGuide, setShowColumnGuide] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --------------------------------------------------
  // Fetch Employees from API
  // --------------------------------------------------
  const fetchEmployees = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await getEmployee({
        sortBy: 'id',
        sortOrder: 'desc',
      });
      const data = res?.data?.data || [];
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to fetch employees:', err);
      setErrorMessage(
        err?.response?.data?.message || 'Failed to fetch employees from server.'
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Fetch Master Data (Departments, SubDepts, Sections, Lines, Machines)
  // --------------------------------------------------
  const fetchMasterData = async () => {
    try {
      const [deptRes, subDeptRes, secRes, lineRes, macRes] = await Promise.allSettled([
        getDepartment(),
        getSubDepartments(),
        getSections(),
        getLines(),
        getMachines(),
      ]);

      if (deptRes.status === 'fulfilled') {
        const depts = deptRes.value?.data?.data || [];
        setDepartmentsList(depts);
      }
      if (subDeptRes.status === 'fulfilled') {
        const subDepts = subDeptRes.value?.data?.data || [];
        setSubDepartmentsList(subDepts);
      }
      if (secRes.status === 'fulfilled') {
        const secs = secRes.value?.data?.data || [];
        setSectionsList(secs);
      }
      if (lineRes.status === 'fulfilled') {
        const lines = lineRes.value?.data?.data || [];
        setLinesList(lines);
      }
      if (macRes.status === 'fulfilled') {
        const macs = macRes.value?.data?.data || [];
        setMachinesList(macs);
      }
    } catch (err) {
      console.error('Failed loading master data:', err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchMasterData();
  }, []);

  // Auto-dismiss success notification
  useEffect(() => {
    if (successToast) {
      const timer = setTimeout(() => setSuccessToast(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [successToast]);

  // --------------------------------------------------
  // Filtered Employees
  // --------------------------------------------------
  const filteredEmployees: Employee[] = employees.filter((emp) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      emp.fullName.toLowerCase().includes(q) ||
      emp.employeeId.toLowerCase().includes(q) ||
      emp.designation.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q) ||
      emp.mobile.includes(q);

    const matchesDept =
      deptFilter === 'All Departments' ||
      String(emp.departmentId) === deptFilter ||
      emp.department?.name === deptFilter;

    const matchesStatus =
      statusFilter === 'All Status' ||
      (statusFilter === 'ACTIVE' && emp.isActive) ||
      (statusFilter === 'INACTIVE' && !emp.isActive);

    const matchesShift =
      shiftFilter === 'All Shifts' || emp.shift === shiftFilter;

    const matchesSkill =
      skillFilter === 'All Skills' || emp.skill === skillFilter;

    return (
      matchesSearch &&
      matchesDept &&
      matchesStatus &&
      matchesShift &&
      matchesSkill
    );
  });

  // Statistics
  const totalEmployees = employees.length;
  const activeCount = employees.filter((e) => e.isActive).length;
  const inactiveCount = totalEmployees - activeCount;
  const dojoCount = employees.filter((e) => e.isDojo).length;

  // --------------------------------------------------
  // Cascading Master Data Helpers for Form
  // --------------------------------------------------
  const filteredSubDepts = subDepartmentsList.filter((s) => {
    if (!formData.departmentId) return false;
    return String(s.departmentId) === String(formData.departmentId);
  });

  const filteredSections = sectionsList.filter((s) => {
    if (!formData.subDepartmentId) return false;
    return String(s.subDepartmentId) === String(formData.subDepartmentId);
  });

  const filteredLines = linesList.filter((l) => {
    if (!formData.sectionId) return false;
    return String(l.sectionId) === String(formData.sectionId);
  });

  const filteredMachines = machinesList.filter((m) => {
    if (!formData.lineId) return false;
    return String(m.lineId) === String(formData.lineId);
  });

  // --------------------------------------------------
  // Form Handlers
  // --------------------------------------------------
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'departmentId') {
      setFormData((prev) => ({
        ...prev,
        departmentId: value ? Number(value) : '',
        subDepartmentId: '',
        sectionId: '',
        lineId: '',
        machineId: '',
      }));
    } else if (name === 'subDepartmentId') {
      setFormData((prev) => ({
        ...prev,
        subDepartmentId: value ? Number(value) : '',
        sectionId: '',
        lineId: '',
        machineId: '',
      }));
    } else if (name === 'sectionId') {
      setFormData((prev) => ({
        ...prev,
        sectionId: value ? Number(value) : '',
        lineId: '',
        machineId: '',
      }));
    } else if (name === 'lineId') {
      setFormData((prev) => ({
        ...prev,
        lineId: value ? Number(value) : '',
        machineId: '',
      }));
    } else if (name === 'machineId') {
      setFormData((prev) => ({
        ...prev,
        machineId: value ? Number(value) : '',
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const generateNewEmpId = (): string => {
    if (employees.length === 0) return 'EMP-1001';
    const nums = employees
      .map((e) => {
        const parts = e.employeeId.match(/\d+/);
        return parts ? parseInt(parts[0], 10) : 0;
      })
      .filter((n) => !isNaN(n) && n > 0);
    const maxNum = nums.length > 0 ? Math.max(...nums) : 1000;
    return `EMP-${maxNum + 1}`;
  };

  const handleOpenAddModal = () => {
    setFormData({
      ...INITIAL_FORM_DATA,
      employeeId: generateNewEmpId(),
      departmentId: departmentsList.length > 0 ? departmentsList[0].id : '',
    });
    setFormError('');
    setIsEditing(false);
    setShowModal(true);
  };

  const formatDateForInput = (dateStr?: string | null): string => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      return d.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const handleOpenEditModal = (emp: Employee) => {
    setFormData({
      id: emp.id,
      employeeId: emp.employeeId,
      fullName: emp.fullName,
      fatherName: emp.fatherName || '',
      dob: formatDateForInput(emp.dob),
      gender: emp.gender,
      designation: emp.designation,
      category: emp.category || '',
      departmentId: emp.departmentId || '',
      subDepartmentId: emp.subDepartmentId || '',
      sectionId: emp.sectionId || '',
      lineId: emp.lineId || '',
      machineId: emp.machineId || '',
      grade: emp.grade,
      division: emp.division || 'Manufacturing',
      address: emp.address || '',
      state: emp.state || '',
      pincode: emp.pincode ? String(emp.pincode) : '',
      email: emp.email || '',
      mobile: emp.mobile || '',
      doj: formatDateForInput(emp.doj),
      dol: formatDateForInput(emp.dol),
      isActive: emp.isActive,
      firstOfDay: formatDateForInput(emp.firstOfDay),
      unit: emp.unit || 'Unit 1',
      shift: emp.shift,
      isDojo: emp.isDojo,
      skill: emp.skill,
    });
    setFormError('');
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validations
    if (!formData.fullName.trim()) {
      setFormError('Full Name is required.');
      return;
    }
    if (!formData.employeeId.trim()) {
      setFormError('Employee ID is required.');
      return;
    }
    if (!formData.dob) {
      setFormError('Date of Birth is required.');
      return;
    }
    if (!formData.designation.trim()) {
      setFormError('Designation is required.');
      return;
    }
    if (!formData.departmentId) {
      setFormError('Department is required.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setFormError('A valid email address is required.');
      return;
    }
    if (!formData.mobile.trim() || formData.mobile.length < 7) {
      setFormError('Mobile number is required and must have at least 7 digits.');
      return;
    }
    if (!formData.doj) {
      setFormError('Date of Joining is required.');
      return;
    }
    if (!formData.division.trim()) {
      setFormError('Division is required.');
      return;
    }

    const payload: EmployeePayload = {
      employeeId: formData.employeeId.trim(),
      fullName: formData.fullName.trim(),
      fatherName: formData.fatherName.trim() || null,
      dob: formData.dob,
      gender: formData.gender,
      designation: formData.designation.trim(),
      category: (formData.category as EmployeeCategory) || null,
      departmentId: Number(formData.departmentId),
      subDepartmentId: formData.subDepartmentId ? Number(formData.subDepartmentId) : null,
      sectionId: formData.sectionId ? Number(formData.sectionId) : null,
      lineId: formData.lineId ? Number(formData.lineId) : null,
      machineId: formData.machineId ? Number(formData.machineId) : null,
      grade: formData.grade,
      division: formData.division.trim(),
      address: formData.address.trim() || null,
      state: formData.state.trim() || null,
      pincode: formData.pincode ? Number(formData.pincode) : null,
      email: formData.email.trim(),
      mobile: formData.mobile.trim(),
      doj: formData.doj,
      dol: formData.dol || null,
      isActive: formData.isActive,
      firstOfDay: formData.firstOfDay || null,
      unit: formData.unit.trim() || null,
      shift: formData.shift,
      isDojo: formData.isDojo,
      skill: formData.skill,
    };

    setSubmitting(true);
    try {
      if (isEditing && formData.id) {
        await updateEmployee(formData.id, payload);
        setSuccessToast(`Employee "${payload.fullName}" updated successfully!`);
      } else {
        await createEmployee(payload);
        setSuccessToast(`Employee "${payload.fullName}" created successfully!`);
      }
      setShowModal(false);
      await fetchEmployees();
    } catch (err: any) {
      console.error('Failed to save employee:', err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Failed to save employee. Please verify inputs and try again.';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------------------------
  // Delete Employee
  // --------------------------------------------------
  const handleDeleteEmployee = async (emp: Employee) => {
    if (
      !window.confirm(
        `Are you sure you want to delete employee "${emp.fullName}" (${emp.employeeId})? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteEmployee(emp.id);
      setSuccessToast(`Employee "${emp.fullName}" deleted successfully.`);
      await fetchEmployees();
    } catch (err: any) {
      console.error('Failed to delete employee:', err);
      alert(
        err?.response?.data?.message || 'Failed to delete employee. Try again.'
      );
    }
  };

  // --------------------------------------------------
  // Excel Upload Handlers
  // --------------------------------------------------
  const handleOpenUploadModal = () => {
    setUploadFile(null);
    setUploadError('');
    setUploadSuccess('');
    setShowColumnGuide(false);
    setShowUploadModal(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const lower = file.name.toLowerCase();
      if (!lower.endsWith('.xlsx') && !lower.endsWith('.xls')) {
        setUploadError('Invalid file type. Only Excel files (.xlsx, .xls) are allowed.');
        setUploadFile(null);
        return;
      }
      setUploadError('');
      setUploadFile(file);
    }
  };

  const handleDropFile = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const lower = file.name.toLowerCase();
      if (!lower.endsWith('.xlsx') && !lower.endsWith('.xls')) {
        setUploadError('Invalid file type. Only Excel files (.xlsx, .xls) are allowed.');
        setUploadFile(null);
        return;
      }
      setUploadError('');
      setUploadFile(file);
    }
  };

  const handleUploadSubmit = async () => {
    if (!uploadFile) {
      setUploadError('Please select or drop an Excel (.xlsx or .xls) file first.');
      return;
    }

    setUploading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      const res = await uploadEmployeesExcel(uploadFile);
      const msg = res?.data?.message || 'Employees uploaded successfully!';
      const count = res?.data?.data?.uploadedCount ?? '';
      setUploadSuccess(`${msg}${count ? ` (${count} records processed)` : ''}`);
      setSuccessToast(`Excel uploaded: ${msg}`);
      await fetchEmployees();
      setTimeout(() => {
        setShowUploadModal(false);
      }, 1500);
    } catch (err: any) {
      console.error('Failed to upload Excel:', err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Upload failed. Please verify your Excel format and try again.';
      setUploadError(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const defaultDept = departmentsList.length > 0 ? departmentsList[0].name : 'Production';
    downloadEmployeeExcelTemplate(defaultDept);
  };

  return (
    <div className="h-auto bg-white shadow-sm rounded border p-4">
      {/* Success Notification Alert */}
      {successToast && (
        <div
          className="alert alert-success d-flex align-items-center justify-content-between py-2 px-3 mb-3 shadow-sm rounded-3"
          style={{ borderLeft: '5px solid #059669', fontSize: '0.9rem' }}
          role="alert"
        >
          <div className="d-flex align-items-center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#059669"
              strokeWidth="2.5"
              className="me-2"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <strong>{successToast}</strong>
          </div>
          <button
            type="button"
            className="btn-close"
            style={{ fontSize: '0.75rem' }}
            onClick={() => setSuccessToast('')}
          ></button>
        </div>
      )}

      {/* Global Error Alert */}
      {errorMessage && (
        <div
          className="alert alert-danger d-flex align-items-center justify-content-between py-2 px-3 mb-3 shadow-sm rounded-3"
          role="alert"
        >
          <div className="d-flex align-items-center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#dc2626"
              strokeWidth="2.5"
              className="me-2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            className="btn-close"
            style={{ fontSize: '0.75rem' }}
            onClick={() => setErrorMessage('')}
          ></button>
        </div>
      )}

      {/* Stats Row */}
      <div className="row g-3 mb-4">
        {[
          {
            label: 'Total Employees',
            value: totalEmployees,
            color: '#1d4ed8',
            bgClass: 'my-fade-blue',
            stroke: '#1d4ed8',
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            ),
          },
          {
            label: 'Active Workforce',
            value: `${activeCount} Active`,
            subText: inactiveCount > 0 ? `${inactiveCount} Inactive` : undefined,
            color: '#059669',
            bgClass: 'bg-emerald-50',
            stroke: '#059669',
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            ),
          },
          {
            label: 'Dojo Certified',
            value: `${dojoCount} Trained`,
            color: '#4338ca',
            bgClass: 'my-fade-purple',
            stroke: '#4338ca',
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ),
          },
        ].map((stat, index) => (
          <div key={index} className="col-md-4">
            <div className="stat-card-box d-flex align-items-center p-3">
              <div
                className={`me-3 rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0 ${stat.bgClass}`}
                style={{ width: '46px', height: '46px', color: stat.stroke }}
              >
                {stat.icon}
              </div>
              <div>
                <div className="stat-card-label">{stat.label}</div>
                <div className="stat-card-value" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                {stat.subText && (
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {stat.subText}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="ctq-filter-bar border rounded-4 shadow-sm p-3 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div className="d-flex align-items-center flex-wrap gap-2">
          {/* Filter icon label */}
          <div className="d-flex align-items-center me-1">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1d4ed8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span className="ms-1 fw-semibold" style={{ fontSize: '0.82rem', color: '#3d3d3d' }}>
              Filters
            </span>
          </div>

          {/* Search */}
          <div className="ctq-filter-search-group">
            <svg
              className="ctq-filter-search-icon"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="ctq-filter-search-input"
              placeholder="Search by name, ID, mobile, designation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Department Filter */}
          <div className="d-flex align-items-center">
            <select
              className="ctq-filter-select"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="All Departments">All Departments</option>
              {departmentsList.map((dept) => (
                <option key={dept.id} value={String(dept.id)}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="d-flex align-items-center">
            <select
              className="ctq-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All Status">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {/* Shift Filter */}
          <div className="d-flex align-items-center">
            <select
              className="ctq-filter-select"
              value={shiftFilter}
              onChange={(e) => setShiftFilter(e.target.value)}
            >
              <option value="All Shifts">All Shifts</option>
              <option value="A">Shift A</option>
              <option value="B">Shift B</option>
              <option value="C">Shift C</option>
              <option value="General">Shift General</option>
            </select>
          </div>

          {/* Skill Filter */}
          <div className="d-flex align-items-center">
            <select
              className="ctq-filter-select"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
            >
              <option value="All Skills">All Skills</option>
              {['L0', 'L1', 'L2', 'L3', 'L4', 'L5'].map((sk) => (
                <option key={sk} value={sk}>
                  Level {sk}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {(deptFilter !== 'All Departments' ||
            statusFilter !== 'All Status' ||
            shiftFilter !== 'All Shifts' ||
            skillFilter !== 'All Skills' ||
            search) && (
            <button
              type="button"
              className="ctq-filter-clear-btn"
              onClick={() => {
                setDeptFilter('All Departments');
                setStatusFilter('All Status');
                setShiftFilter('All Shifts');
                setSkillFilter('All Skills');
                setSearch('');
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Action Buttons: Upload Excel & Add Employee */}
        <div className="d-flex align-items-center gap-2">
          {/* Upload Excel Button */}
          <button
            type="button"
            className="btn btn-outline-success px-3 py-2 fw-semibold rounded-pill d-flex align-items-center shadow-sm"
            onClick={handleOpenUploadModal}
            title="Import multiple employees from Excel (.xlsx, .xls)"
            style={{ fontSize: '0.88rem' }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="me-2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload Excel
          </button>

          {/* Add Employee Button */}
          <button
            type="button"
            className="btn btn-asti-gradient px-4 py-2 fw-semibold rounded-pill d-flex align-items-center"
            onClick={handleOpenAddModal}
          >
            <span className="me-1" style={{ fontSize: '1.1rem', lineHeight: 1 }}>+</span>
            Add Employee
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0 dept-table">
          <thead>
            <tr className="dept-table-header">
              <th className="py-3 px-3">Employee</th>
              <th className="py-3 px-3">Designation & Role</th>
              <th className="py-3 px-3">Department & Placement</th>
              <th className="py-3 px-3">Shift & Grade</th>
              <th className="py-3 px-3">Skill</th>
              <th className="py-3 px-3">Dojo</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-end">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <div className="mt-2 text-muted" style={{ fontSize: '0.85rem' }}>
                    Loading employees from server...
                  </div>
                </td>
              </tr>
            ) : filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-5 text-muted">
                  <div className="mb-2">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  No matching employees found.
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp) => {
                const deptName =
                  emp.department?.name ||
                  departmentsList.find((d) => d.id === emp.departmentId)?.name ||
                  `Dept #${emp.departmentId}`;

                const placementParts = [
                  emp.subDepartment?.name ||
                    subDepartmentsList.find((s) => s.id === emp.subDepartmentId)?.name,
                  emp.section?.name ||
                    sectionsList.find((s) => s.id === emp.sectionId)?.name,
                  emp.line?.name ||
                    linesList.find((l) => l.id === emp.lineId)?.name,
                ].filter(Boolean);

                return (
                  <tr key={emp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    {/* Employee Name & ID */}
                    <td className="px-3">
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center me-2 text-white fw-bold shadow-sm flex-shrink-0"
                          style={{
                            width: '36px',
                            height: '36px',
                            backgroundColor: emp.gender === 'Female' ? '#db2777' : '#2563eb',
                            fontSize: '0.85rem',
                          }}
                        >
                          {emp.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-semibold text-dark" style={{ fontSize: '0.92rem' }}>
                            {emp.fullName}
                          </div>
                          <div className="d-flex align-items-center gap-1 mt-1">
                            <span className="badge-dept-code" style={{ fontSize: '0.72rem', padding: '0.15rem 0.45rem' }}>
                              {emp.employeeId}
                            </span>
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                              {emp.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Designation & Category */}
                    <td className="px-3">
                      <div className="fw-medium text-dark">{emp.designation}</div>
                      {emp.category && (
                        <span
                          className="badge rounded-pill mt-1"
                          style={{
                            backgroundColor: emp.category === 'Staff' ? '#f0fdf4' : '#f8fafc',
                            color: emp.category === 'Staff' ? '#166534' : '#475569',
                            border: '1px solid #e2e8f0',
                            fontSize: '0.7rem',
                          }}
                        >
                          {emp.category}
                        </span>
                      )}
                    </td>

                    {/* Department & Placement */}
                    <td className="px-3">
                      <div className="fw-medium text-dark">{deptName}</div>
                      {placementParts.length > 0 && (
                        <div className="text-muted text-truncate" style={{ fontSize: '0.75rem', maxWidth: '200px' }}>
                          {placementParts.join(' • ')}
                        </div>
                      )}
                    </td>

                    {/* Shift & Grade */}
                    <td className="px-3">
                      <div className="d-flex align-items-center gap-1">
                        <span
                          className="badge"
                          style={{
                            backgroundColor: '#eff6ff',
                            color: '#1d4ed8',
                            border: '1px solid #bfdbfe',
                            fontSize: '0.75rem',
                          }}
                        >
                          Shift {emp.shift}
                        </span>
                      </div>
                      <div className="text-muted mt-1" style={{ fontSize: '0.72rem' }}>
                        {emp.grade}
                      </div>
                    </td>

                    {/* Skill Level */}
                    <td className="px-3">
                      <span
                        className="badge rounded-pill fw-bold"
                        style={{
                          backgroundColor: '#f5f3ff',
                          color: '#6d28d9',
                          border: '1px solid #ddd6fe',
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.6rem',
                        }}
                      >
                        {emp.skill}
                      </span>
                    </td>

                    {/* Dojo Certified */}
                    <td className="px-3">
                      {emp.isDojo ? (
                        <span
                          className="badge rounded-pill"
                          style={{
                            backgroundColor: '#ecfdf5',
                            color: '#059669',
                            border: '1px solid #a7f3d0',
                            fontSize: '0.72rem',
                          }}
                        >
                          Dojo ✓
                        </span>
                      ) : (
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                          -
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-3">
                      <span
                        className="px-2 py-1 rounded-pill fw-bold"
                        style={{
                          fontSize: '0.72rem',
                          background: emp.isActive ? '#ecfdf5' : '#fef2f2',
                          color: emp.isActive ? '#059669' : '#b91c1c',
                          border: emp.isActive ? '1px solid #a7f3d0' : '1px solid #fecaca',
                          letterSpacing: '0.04em',
                          display: 'inline-block',
                        }}
                      >
                        {emp.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-3 text-end">
                      {/* View Profile */}
                      <button
                        type="button"
                        className="btn-action-circle me-1"
                        title="View Full Profile"
                        onClick={() => setViewEmployee(emp)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        className="btn-action-circle me-1"
                        title="Edit Employee"
                        onClick={() => handleOpenEditModal(emp)}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        className="btn-action-delete"
                        title="Delete Employee"
                        onClick={() => handleDeleteEmployee(emp)}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ========================================================= */}
      {/* 1. EXCEL UPLOAD MODAL                                      */}
      {/* ========================================================= */}
      {showUploadModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content shadow-lg border-0 rounded-4">
                {/* Modal Header */}
                <div className="modal-header border-bottom pb-3">
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: '42px',
                        height: '42px',
                        backgroundColor: '#ecfdf5',
                        color: '#059669',
                      }}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="8" y1="13" x2="16" y2="13" />
                        <line x1="8" y1="17" x2="16" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="modal-title fw-bold text-dark mb-0">
                        Upload Employees via Excel
                      </h5>
                      <small className="text-muted">
                        Bulk import employee records from a spreadsheet (.xlsx or .xls)
                      </small>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    disabled={uploading}
                    onClick={() => setShowUploadModal(false)}
                  ></button>
                </div>

                {/* Modal Body */}
                <div className="modal-body p-4">
                  {/* Upload Alerts */}
                  {uploadError && (
                    <div className="alert alert-danger py-2 px-3 mb-3 rounded-3" role="alert" style={{ fontSize: '0.85rem', whiteSpace: 'pre-line' }}>
                      <strong>Upload Error:</strong> {uploadError}
                    </div>
                  )}

                  {uploadSuccess && (
                    <div className="alert alert-success py-2 px-3 mb-3 rounded-3" role="alert" style={{ fontSize: '0.85rem' }}>
                      <strong>Success!</strong> {uploadSuccess}
                    </div>
                  )}

                  {/* Template Download Banner */}
                  <div className="p-3 mb-4 rounded-3 d-flex align-items-center justify-content-between flex-wrap gap-2" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                    <div className="d-flex align-items-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" className="me-2 flex-shrink-0">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      <div>
                        <div className="fw-semibold text-dark" style={{ fontSize: '0.88rem' }}>
                          Need the standard template?
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.78rem' }}>
                          Download our pre-formatted template with all columns and sample rows ready to fill.
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-success px-3 rounded-pill fw-semibold shadow-sm"
                      onClick={handleDownloadTemplate}
                    >
                      Download Excel Template
                    </button>
                  </div>

                  {/* Drag & Drop Zone */}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDropFile}
                    onClick={() => fileInputRef.current?.click()}
                    className="p-4 rounded-4 text-center mb-3"
                    style={{
                      border: '2px dashed #93c5fd',
                      backgroundColor: '#f8faff',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="d-none"
                      accept=".xlsx, .xls"
                      onChange={handleFileChange}
                    />

                    <div className="mb-2">
                      <svg
                        width="44"
                        height="44"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="1.6"
                      >
                        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                        <path d="M12 12v9" />
                        <path d="m16 16-4-4-4 4" />
                      </svg>
                    </div>

                    <h6 className="fw-semibold text-dark mb-1">
                      Drag & Drop your Excel file here, or{' '}
                      <span className="text-primary text-decoration-underline">browse</span>
                    </h6>
                    <small className="text-muted">
                      Accepted formats: .xlsx or .xls (Max 15MB)
                    </small>

                    {/* Selected File Box */}
                    {uploadFile && (
                      <div
                        className="mt-3 p-2 bg-white rounded-3 border d-inline-flex align-items-center shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" className="me-2">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span className="fw-semibold text-dark me-2" style={{ fontSize: '0.85rem' }}>
                          {uploadFile.name}
                        </span>
                        <span className="badge bg-light text-dark border me-2" style={{ fontSize: '0.72rem' }}>
                          {(uploadFile.size / 1024).toFixed(1)} KB
                        </span>
                        <button
                          type="button"
                          className="btn-close"
                          style={{ fontSize: '0.65rem' }}
                          onClick={() => setUploadFile(null)}
                        ></button>
                      </div>
                    )}
                  </div>

                  {/* Column Reference Toggle */}
                  <div className="mt-3">
                    <button
                      type="button"
                      className="btn btn-link p-0 text-decoration-none d-flex align-items-center"
                      style={{ fontSize: '0.82rem', color: '#1d4ed8' }}
                      onClick={() => setShowColumnGuide(!showColumnGuide)}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="me-1"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                      {showColumnGuide ? 'Hide Column Reference Guide' : 'View Expected Columns & Formats Guide'}
                    </button>

                    {showColumnGuide && (
                      <div
                        className="table-responsive mt-2 border rounded-3 p-2"
                        style={{ maxHeight: '220px', overflowY: 'auto', fontSize: '0.75rem', backgroundColor: '#fafbfc' }}
                      >
                        <table className="table table-sm table-bordered mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Header / Field</th>
                              <th>Type</th>
                              <th>Required</th>
                              <th>Allowed Values / Example</th>
                            </tr>
                          </thead>
                          <tbody>
                            {EMPLOYEE_EXCEL_COLUMNS.map((col, idx) => (
                              <tr key={idx}>
                                <td className="fw-semibold">{col.header}</td>
                                <td>{col.type}</td>
                                <td>
                                  {col.required ? (
                                    <span className="text-danger fw-bold">Yes</span>
                                  ) : (
                                    <span className="text-muted">No</span>
                                  )}
                                </td>
                                <td>
                                  {col.allowedValues ? (
                                    <span className="badge bg-light text-primary border me-1">{col.allowedValues}</span>
                                  ) : (
                                    <code>{col.example || '-'}</code>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn btn-secondary rounded-pill px-4"
                    disabled={uploading}
                    onClick={() => setShowUploadModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-success rounded-pill px-4 fw-semibold d-flex align-items-center shadow-sm"
                    disabled={!uploadFile || uploading}
                    onClick={handleUploadSubmit}
                  >
                    {uploading && (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    )}
                    {uploading ? 'Importing Excel...' : 'Upload & Import'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* 2. ADD / EDIT EMPLOYEE MODAL                              */}
      {/* ========================================================= */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered modal-xl">
              <div className="modal-content shadow-lg border-0 rounded-4">
                {/* Modal Header */}
                <div className="modal-header border-bottom">
                  <h5 className="modal-title fw-bold text-dark">
                    {isEditing ? 'Edit Employee Details' : 'Add New Employee'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    disabled={submitting}
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                {/* Modal Form Body */}
                <form onSubmit={handleSubmitForm}>
                  <div className="modal-body p-4" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                    {formError && (
                      <div className="alert alert-danger py-2 px-3 mb-3 rounded-3" style={{ fontSize: '0.85rem' }}>
                        <strong>Error:</strong> {formError}
                      </div>
                    )}

                    {/* Section 1: Basic Information */}
                    <div className="mb-4">
                      <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                        <span className="badge rounded-circle bg-primary text-white me-2">1</span>
                        Basic Information
                      </h6>
                      <div className="row g-3">
                        <div className="col-md-4">
                          <label className="form-label small fw-semibold">
                            Full Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="e.g. Rajesh Kumar"
                            required
                          />
                        </div>

                        <div className="col-md-4">
                          <label className="form-label small fw-semibold">
                            Employee ID <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            name="employeeId"
                            value={formData.employeeId}
                            onChange={handleInputChange}
                            placeholder="e.g. EMP-1001"
                            required
                          />
                        </div>

                        <div className="col-md-4">
                          <label className="form-label small fw-semibold">
                            Father's Name
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            name="fatherName"
                            value={formData.fatherName}
                            onChange={handleInputChange}
                            placeholder="e.g. Ramesh Kumar"
                          />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label small fw-semibold">
                            Date of Birth <span className="text-danger">*</span>
                          </label>
                          <input
                            type="date"
                            className="form-control form-control-sm"
                            name="dob"
                            value={formData.dob}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label small fw-semibold">
                            Gender <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select form-select-sm"
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>

                        <div className="col-md-3">
                          <label className="form-label small fw-semibold">
                            Designation <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            name="designation"
                            value={formData.designation}
                            onChange={handleInputChange}
                            placeholder="e.g. Machine Operator"
                            required
                          />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label small fw-semibold">
                            Category
                          </label>
                          <select
                            className="form-select form-select-sm"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                          >
                            <option value="Worker">Worker</option>
                            <option value="Staff">Staff</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <hr className="my-3 text-muted" />

                    {/* Section 2: Organizational Hierarchy & Placement */}
                    <div className="mb-4">
                      <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                        <span className="badge rounded-circle bg-primary text-white me-2">2</span>
                        Hierarchy & Placement
                      </h6>
                      <div className="row g-3">
                        <div className="col-md-4">
                          <label className="form-label small fw-semibold">
                            Department <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select form-select-sm"
                            name="departmentId"
                            value={formData.departmentId}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Select Department</option>
                            {departmentsList.map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-4">
                          <label className="form-label small fw-semibold">
                            Sub Department
                          </label>
                          <select
                            className="form-select form-select-sm"
                            name="subDepartmentId"
                            value={formData.subDepartmentId}
                            onChange={handleInputChange}
                            disabled={!formData.departmentId}
                          >
                            <option value="">None / Optional</option>
                            {filteredSubDepts.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-4">
                          <label className="form-label small fw-semibold">
                            Section
                          </label>
                          <select
                            className="form-select form-select-sm"
                            name="sectionId"
                            value={formData.sectionId}
                            onChange={handleInputChange}
                            disabled={!formData.subDepartmentId}
                          >
                            <option value="">None / Optional</option>
                            {filteredSections.map((sec) => (
                              <option key={sec.id} value={sec.id}>
                                {sec.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-3">
                          <label className="form-label small fw-semibold">
                            Line
                          </label>
                          <select
                            className="form-select form-select-sm"
                            name="lineId"
                            value={formData.lineId}
                            onChange={handleInputChange}
                            disabled={!formData.sectionId}
                          >
                            <option value="">None / Optional</option>
                            {filteredLines.map((l) => (
                              <option key={l.id} value={l.id}>
                                {l.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-3">
                          <label className="form-label small fw-semibold">
                            Machine
                          </label>
                          <select
                            className="form-select form-select-sm"
                            name="machineId"
                            value={formData.machineId}
                            onChange={handleInputChange}
                            disabled={!formData.lineId}
                          >
                            <option value="">None / Optional</option>
                            {filteredMachines.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-3">
                          <label className="form-label small fw-semibold">
                            Grade <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select form-select-sm"
                            name="grade"
                            value={formData.grade}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="Direct">Direct</option>
                            <option value="Indirect">Indirect</option>
                            <option value="Manufacturing Indirect">Manufacturing Indirect</option>
                          </select>
                        </div>

                        <div className="col-md-3">
                          <label className="form-label small fw-semibold">
                            Division <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            name="division"
                            value={formData.division}
                            onChange={handleInputChange}
                            placeholder="e.g. Manufacturing"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <hr className="my-3 text-muted" />

                    {/* Section 3: Contact & Address */}
                    <div className="mb-4">
                      <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                        <span className="badge rounded-circle bg-primary text-white me-2">3</span>
                        Contact & Address
                      </h6>
                      <div className="row g-3">
                        <div className="col-md-4">
                          <label className="form-label small fw-semibold">
                            Email Address <span className="text-danger">*</span>
                          </label>
                          <input
                            type="email"
                            className="form-control form-control-sm"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="employee@example.com"
                            required
                          />
                        </div>

                        <div className="col-md-4">
                          <label className="form-label small fw-semibold">
                            Mobile Number <span className="text-danger">*</span>
                          </label>
                          <input
                            type="tel"
                            className="form-control form-control-sm"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            placeholder="min 7 digits"
                            required
                          />
                        </div>

                        <div className="col-md-4">
                          <label className="form-label small fw-semibold">
                            Unit
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            name="unit"
                            value={formData.unit}
                            onChange={handleInputChange}
                            placeholder="e.g. Unit 1"
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label small fw-semibold">
                            Address
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Residential address"
                          />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label small fw-semibold">
                            State
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            placeholder="e.g. Karnataka"
                          />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label small fw-semibold">
                            Pincode
                          </label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            placeholder="e.g. 560100"
                          />
                        </div>
                      </div>
                    </div>

                    <hr className="my-3 text-muted" />

                    {/* Section 4: Employment & Skills */}
                    <div className="mb-3">
                      <h6 className="fw-bold text-primary mb-3 d-flex align-items-center">
                        <span className="badge rounded-circle bg-primary text-white me-2">4</span>
                        Employment, Shift & Skill
                      </h6>
                      <div className="row g-3">
                        <div className="col-md-3">
                          <label className="form-label small fw-semibold">
                            Date of Joining <span className="text-danger">*</span>
                          </label>
                          <input
                            type="date"
                            className="form-control form-control-sm"
                            name="doj"
                            value={formData.doj}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label small fw-semibold">
                            Date of Leaving
                          </label>
                          <input
                            type="date"
                            className="form-control form-control-sm"
                            name="dol"
                            value={formData.dol}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label small fw-semibold">
                            Shift <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select form-select-sm"
                            name="shift"
                            value={formData.shift}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="A">Shift A</option>
                            <option value="B">Shift B</option>
                            <option value="C">Shift C</option>
                            <option value="General">General</option>
                          </select>
                        </div>

                        <div className="col-md-3">
                          <label className="form-label small fw-semibold">
                            Skill Level <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select form-select-sm"
                            name="skill"
                            value={formData.skill}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="L0">L0 (Novice)</option>
                            <option value="L1">L1 (Basic)</option>
                            <option value="L2">L2 (Capable)</option>
                            <option value="L3">L3 (Proficient)</option>
                            <option value="L4">L4 (Advanced)</option>
                            <option value="L5">L5 (Expert / Trainer)</option>
                          </select>
                        </div>

                        <div className="col-md-4">
                          <label className="form-label small fw-semibold">
                            First of Day
                          </label>
                          <input
                            type="date"
                            className="form-control form-control-sm"
                            name="firstOfDay"
                            value={formData.firstOfDay}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="col-md-4 d-flex align-items-center pt-3">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="isActiveSwitch"
                              name="isActive"
                              checked={formData.isActive}
                              onChange={handleInputChange}
                            />
                            <label className="form-check-label fw-semibold small" htmlFor="isActiveSwitch">
                              Active Employee Status
                            </label>
                          </div>
                        </div>

                        <div className="col-md-4 d-flex align-items-center pt-3">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="isDojoSwitch"
                              name="isDojo"
                              checked={formData.isDojo}
                              onChange={handleInputChange}
                            />
                            <label className="form-check-label fw-semibold small" htmlFor="isDojoSwitch">
                              Dojo Training Certified
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="modal-footer border-top">
                    <button
                      type="button"
                      className="btn btn-secondary rounded-pill px-4"
                      disabled={submitting}
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn text-white rounded-pill px-4 fw-semibold shadow-sm"
                      disabled={submitting}
                      style={{ background: '#1d4ed8', border: 'none' }}
                    >
                      {submitting && (
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      )}
                      {isEditing ? 'Update Employee' : 'Add Employee'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* 3. VIEW EMPLOYEE DETAILS MODAL                            */}
      {/* ========================================================= */}
      {viewEmployee && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content shadow-lg border-0 rounded-4">
                <div className="modal-header border-bottom">
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3 text-white fw-bold shadow-sm"
                      style={{
                        width: '46px',
                        height: '46px',
                        backgroundColor: viewEmployee.gender === 'Female' ? '#db2777' : '#2563eb',
                        fontSize: '1.1rem',
                      }}
                    >
                      {viewEmployee.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h5 className="modal-title fw-bold text-dark mb-0">
                        {viewEmployee.fullName}
                      </h5>
                      <span className="badge-dept-code me-2" style={{ fontSize: '0.75rem' }}>
                        {viewEmployee.employeeId}
                      </span>
                      <span className="text-muted" style={{ fontSize: '0.82rem' }}>
                        {viewEmployee.designation}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setViewEmployee(null)}
                  ></button>
                </div>

                <div className="modal-body p-4" style={{ fontSize: '0.88rem' }}>
                  <div className="row g-3">
                    {/* Status & Badges */}
                    <div className="col-12 d-flex flex-wrap gap-2 pb-2 border-bottom">
                      <span
                        className="px-2 py-1 rounded-pill fw-bold"
                        style={{
                          fontSize: '0.72rem',
                          background: viewEmployee.isActive ? '#ecfdf5' : '#fef2f2',
                          color: viewEmployee.isActive ? '#059669' : '#b91c1c',
                          border: viewEmployee.isActive ? '1px solid #a7f3d0' : '1px solid #fecaca',
                        }}
                      >
                        {viewEmployee.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                      <span className="badge bg-primary-subtle text-primary border">
                        Shift {viewEmployee.shift}
                      </span>
                      <span className="badge bg-purple-subtle text-indigo border">
                        Skill {viewEmployee.skill}
                      </span>
                      {viewEmployee.isDojo && (
                        <span className="badge bg-success-subtle text-success border">
                          Dojo Certified ✓
                        </span>
                      )}
                      {viewEmployee.category && (
                        <span className="badge bg-light text-dark border">
                          Category: {viewEmployee.category}
                        </span>
                      )}
                      <span className="badge bg-light text-dark border">
                        Grade: {viewEmployee.grade}
                      </span>
                    </div>

                    {/* Personal & Contact */}
                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded-3 h-100">
                        <h6 className="fw-bold text-primary mb-3">Personal & Contact Info</h6>
                        <div className="mb-2"><strong>Gender:</strong> {viewEmployee.gender}</div>
                        <div className="mb-2"><strong>Date of Birth:</strong> {formatDateForInput(viewEmployee.dob)}</div>
                        <div className="mb-2"><strong>Father's Name:</strong> {viewEmployee.fatherName || '-'}</div>
                        <div className="mb-2"><strong>Email:</strong> {viewEmployee.email}</div>
                        <div className="mb-2"><strong>Mobile:</strong> {viewEmployee.mobile}</div>
                        <div className="mb-2"><strong>Address:</strong> {viewEmployee.address || '-'}</div>
                        <div><strong>State / Pincode:</strong> {[viewEmployee.state, viewEmployee.pincode].filter(Boolean).join(' - ') || '-'}</div>
                      </div>
                    </div>

                    {/* Organizational Placement */}
                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded-3 h-100">
                        <h6 className="fw-bold text-primary mb-3">Placement & Deployment</h6>
                        <div className="mb-2"><strong>Department:</strong> {viewEmployee.department?.name || `ID #${viewEmployee.departmentId}`}</div>
                        <div className="mb-2"><strong>Sub Department:</strong> {viewEmployee.subDepartment?.name || '-'}</div>
                        <div className="mb-2"><strong>Section:</strong> {viewEmployee.section?.name || '-'}</div>
                        <div className="mb-2"><strong>Line:</strong> {viewEmployee.line?.name || '-'}</div>
                        <div className="mb-2"><strong>Machine:</strong> {viewEmployee.machine?.name || '-'}</div>
                        <div className="mb-2"><strong>Division:</strong> {viewEmployee.division}</div>
                        <div className="mb-2"><strong>Unit:</strong> {viewEmployee.unit || '-'}</div>
                        <div><strong>Date of Joining:</strong> {formatDateForInput(viewEmployee.doj)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn btn-outline-primary rounded-pill px-4"
                    onClick={() => {
                      const emp = viewEmployee;
                      setViewEmployee(null);
                      handleOpenEditModal(emp);
                    }}
                  >
                    Edit This Employee
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary rounded-pill px-4"
                    onClick={() => setViewEmployee(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default EmployeeManagement;