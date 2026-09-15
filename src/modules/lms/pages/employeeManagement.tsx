import { useEffect, useState } from 'react';
import type {
  Employee,
  EmployeeFormData,
  EmployeeStatus,
  Department,
  DepartmentFilter,
  StatusFilter,
  StatusBadgeStyle,
} from '../models/employeeManagement';
import '../../../styles/departments.css';

function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState<string>('');
  const [deptFilter, setDeptFilter] =
    useState<DepartmentFilter>('All Departments');
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>('All Status');

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [formData, setFormData] = useState<EmployeeFormData>({
    id: null,
    name: '',
    empId: '',
    email: '',
    designation: '',
    department: '',
    status: 'ACTIVE',
  });

  const departments: DepartmentFilter[] = [
    'All Departments',
    'Production',
    'Quality',
    'Engineering',
    'HR',
    'Finance',
    'IT',
    'Marketing',
  ];

  const statuses: StatusFilter[] = [
    'All Status',
    'ACTIVE',
    'INACTIVE',
  ];

  // ----------------------------------------
  // Load employees from local storage
  // ----------------------------------------

  useEffect(() => {
    const savedEmployees = localStorage.getItem(
      'employeeManagementEmployees'
    );

    if (savedEmployees) {
      try {
        const parsedEmployees: Employee[] = JSON.parse(savedEmployees);
        setEmployees(parsedEmployees);
      } catch (error) {
        console.error('Failed to parse employees:', error);
      }
    } else {
      const defaultEmployees: Employee[] = [
        {
          id: 1,
          name: 'Suresh Nair',
          empId: 'EMP-1021',
          email: 'suresh.nair@asti.in',
          designation: 'Machine Operator',
          department: 'Production',
          status: 'ACTIVE',
        },
        {
          id: 2,
          name: 'Kavita Rao',
          empId: 'EMP-1045',
          email: 'kavita.rao@asti.in',
          designation: 'Quality Analyst',
          department: 'Quality',
          status: 'ACTIVE',
        },
        {
          id: 3,
          name: 'Deepak Singh',
          empId: 'EMP-1063',
          email: null,
          designation: 'Maintenance Tech',
          department: 'Engineering',
          status: 'INACTIVE',
        },
      ];

      setEmployees(defaultEmployees);

      localStorage.setItem(
        'employeeManagementEmployees',
        JSON.stringify(defaultEmployees)
      );
    }
  }, []);

  // ----------------------------------------
  // Save employees
  // ----------------------------------------

  const saveEmployeesToLocal = (
    updatedEmployees: Employee[]
  ): void => {
    setEmployees(updatedEmployees);

    localStorage.setItem(
      'employeeManagementEmployees',
      JSON.stringify(updatedEmployees)
    );
  };

  // ----------------------------------------
  // Status badge
  // ----------------------------------------

  const statusStyle = (
    status: EmployeeStatus
  ): { bg: string; color: string; border: string } => {
    const styles: Record<EmployeeStatus, { bg: string; color: string; border: string }> = {
      ACTIVE: {
        bg: '#ecfdf5',
        color: '#059669',
        border: '1px solid #a7f3d0',
      },

      INACTIVE: {
        bg: '#fee8f1',
        color: '#e22b6e',
        border: '1px solid #fca5c0',
      },
    };

    return styles[status];
  };

  // ----------------------------------------
  // Filter employees
  // ----------------------------------------

  const filtered: Employee[] = employees.filter(
    (employee: Employee) => {
      const searchValue = search.toLowerCase();

      const matchSearch =
        employee.name.toLowerCase().includes(searchValue) ||
        employee.empId.toLowerCase().includes(searchValue);

      const matchDept =
        deptFilter === 'All Departments' ||
        employee.department === deptFilter;

      const matchStatus =
        statusFilter === 'All Status' ||
        employee.status === statusFilter;

      return matchSearch && matchDept && matchStatus;
    }
  );

  // ----------------------------------------
  // Stats
  // ----------------------------------------

  const activeCount: number = employees.filter(
    (employee) => employee.status === 'ACTIVE'
  ).length;

  const deptCount: number = new Set(
    employees.map((employee) => employee.department)
  ).size;

  // ----------------------------------------
  // Input change
  // ----------------------------------------

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ): void => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ----------------------------------------
  // Generate Employee ID
  // ----------------------------------------

  const generateEmpId = (): string => {
    const lastEmpNumber: number =
      employees.length > 0
        ? employees.reduce((max, employee) => {
            const parts = employee.empId.split('-');
            const number = Number(parts[1]);

            return Number.isNaN(number)
              ? max
              : Math.max(max, number);
          }, 1020)
        : 1020;

    return `EMP-${lastEmpNumber + 1}`;
  };

  // ----------------------------------------
  // Add employee
  // ----------------------------------------

  const handleAddEmployee = (): void => {
    const newEmpId = generateEmpId();

    setFormData({
      id: null,
      name: '',
      empId: newEmpId,
      email: '',
      designation: '',
      department: '',
      status: 'ACTIVE',
    });

    setIsEditing(false);
    setShowModal(true);
  };

  // ----------------------------------------
  // Edit employee
  // ----------------------------------------

  const handleEditEmployee = (
    employee: Employee
  ): void => {
    setFormData({
      id: employee.id,
      name: employee.name,
      empId: employee.empId,
      email: employee.email ?? '',
      designation: employee.designation,
      department: employee.department,
      status: employee.status,
    });

    setIsEditing(true);
    setShowModal(true);
  };

  // ----------------------------------------
  // Delete employee
  // ----------------------------------------

  const handleDeleteEmployee = (
    id: number
  ): void => {
    if (
      window.confirm(
        'Are you sure you want to delete this employee?'
      )
    ) {
      const updatedEmployees = employees.filter(
        (employee) => employee.id !== id
      );

      saveEmployeesToLocal(updatedEmployees);
    }
  };

  // ----------------------------------------
  // Submit
  // ----------------------------------------

  const handleSubmit = (): void => {
    if (
      !formData.name.trim() ||
      !formData.empId.trim() ||
      !formData.designation.trim() ||
      !formData.department ||
      !formData.status
    ) {
      alert('Please fill in all required fields');
      return;
    }

    // Check duplicate Employee ID
    const isDuplicate = employees.some(
      (employee) =>
        employee.empId.toLowerCase() ===
          formData.empId.toLowerCase() &&
        (isEditing
          ? employee.id !== formData.id
          : true)
    );

    if (isDuplicate) {
      alert(
        'Employee ID already exists. Please use a unique Employee ID.'
      );
      return;
    }

    if (isEditing && formData.id !== null) {
      // Update employee
      const updatedEmployees: Employee[] =
        employees.map((employee) =>
          employee.id === formData.id
            ? {
                id: formData.id,
                name: formData.name.trim(),
                empId: formData.empId.trim(),
                email: formData.email.trim() || null,
                designation:
                  formData.designation.trim(),
                department:
                  formData.department as Department,
                status: formData.status,
              }
            : employee
        );

      saveEmployeesToLocal(updatedEmployees);
    } else {
      // Add employee
      const newEmployee: Employee = {
        id: Date.now(),
        name: formData.name.trim(),
        empId: formData.empId.trim(),
        email: formData.email.trim() || null,
        designation: formData.designation.trim(),
        department:
          formData.department as Department,
        status: formData.status,
      };

      saveEmployeesToLocal([
        ...employees,
        newEmployee,
      ]);
    }

    setShowModal(false);
  };

  return (
    <div className="h-auto bg-white shadow-sm rounded border p-4">

      {/* Header */}
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Employee Management</h4>
          <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
            Manage employee directories, roles, and department assignments
          </p>
        </div>

        <button
          className="btn btn-asti-gradient px-4 py-2 fw-semibold rounded-pill"
          onClick={handleAddEmployee}
        >
          + Add Employee
        </button>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          {
            label: "Total Employees",
            value: employees.length,
            color: "#3e6db5",
            bgClass: "my-fade-blue",
            stroke: "#3e6db5",
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
            label: "Active Employees",
            value: `${activeCount} Active`,
            color: "#e22b6e",
            bgClass: "my-fade-pink",
            stroke: "#e22b6e",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            ),
          },
          {
            label: "Departments",
            value: `${deptCount} Depts`,
            color: "#6740d5",
            bgClass: "my-fade-purple",
            stroke: "#6740d5",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            ),
          },
        ].map((stat, index) => (
          <div key={index} className="col-md-4">
            <div className="stat-card-box d-flex align-items-center p-3">
              <div
                className={`me-3 rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0 ${stat.bgClass}`}
                style={{ width: "46px", height: "46px", color: stat.stroke }}
              >
                {stat.icon}
              </div>
              <div>
                <div className="stat-card-label">{stat.label}</div>
                <div className="stat-card-value" style={{ color: stat.color }}>
                  {stat.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      {/* Filter Bar */}
      <div className="ctq-filter-bar border rounded-4 shadow-sm p-3 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div className="d-flex align-items-center flex-wrap gap-2">
          {/* Filter label */}
          <div className="d-flex align-items-center me-1">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e22b6e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span className="ms-1 fw-semibold" style={{ fontSize: "0.82rem", color: "#3d3d3d" }}>
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
              placeholder="Search by name, employee ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Department Filter */}
          <div className="d-flex align-items-center">
            <select
              className="ctq-filter-select"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value as DepartmentFilter)}
            >
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="d-flex align-items-center">
            <select
              className="ctq-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {(deptFilter !== "All Departments" || statusFilter !== "All Status" || search) && (
            <button
              type="button"
              className="ctq-filter-clear-btn"
              onClick={() => {
                setDeptFilter("All Departments");
                setStatusFilter("All Status");
                setSearch("");
              }}
            >
              Clear
            </button>
          )}
        </div>

        <div className="ctq-filter-count-info ms-auto">
          Showing <strong>{filtered.length}</strong> of {employees.length} employees
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0 dept-table">
          <thead>
            <tr className="dept-table-header">
              {[
                'Employee Name',
                'Employee ID',
                'Email Address',
                'Designation',
                'Department',
                'Status',
                'Actions',
              ].map((heading, index) => (
                <th
                  key={heading}
                  className="py-3 px-3"
                  style={{
                    textAlign: index === 6 ? 'right' : 'left',
                  }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.map((employee) => {
              const badge = statusStyle(
                employee.status
              );

              return (
                <tr
                  key={employee.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                  }}
                >
                  <td className="px-3 fw-semibold text-dark">
                    {employee.name}
                  </td>

                  <td className="px-3">
                    <span className="badge-dept-code">
                      {employee.empId}
                    </span>
                  </td>

                  <td
                    className="px-3"
                    style={{
                      color: employee.email
                        ? '#475569'
                        : '#94a3b8',
                      fontStyle: employee.email
                        ? 'normal'
                        : 'italic',
                    }}
                  >
                    {employee.email || 'NULL'}
                  </td>

                  <td className="px-3 text-dark">
                    {employee.designation}
                  </td>

                  <td className="px-3 text-muted">
                    {employee.department}
                  </td>

                  <td className="px-3">
                    <span
                      className="px-2 py-1 rounded-pill fw-bold"
                      style={{
                        fontSize: '0.72rem',
                        background: badge.bg,
                        color: badge.color,
                        border: badge.border,
                        letterSpacing: '0.04em',
                        display: 'inline-block',
                      }}
                    >
                      {employee.status}
                    </span>
                  </td>

                  <td className="px-3 text-end">
                    {/* Edit */}
                    <button
                      className="btn-action-circle me-1"
                      title="Edit"
                      onClick={() =>
                        handleEditEmployee(employee)
                      }
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
                      className="btn-action-delete"
                      title="Delete"
                      onClick={() =>
                        handleDeleteEmployee(
                          employee.id
                        )
                      }
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
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-5 text-muted">
            No records found.
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>

          <div
            className="modal fade show d-block"
            tabIndex={-1}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">

                {/* Modal Header */}
                <div className="modal-header">
                  <h5 className="modal-title">
                    {isEditing
                      ? 'Edit Employee'
                      : 'Add New Employee'}
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={() =>
                      setShowModal(false)
                    }
                  ></button>
                </div>

                {/* Modal Body */}
                <div className="modal-body">

                  {/* Employee Name */}
                  <div className="mb-3">
                    <label className="form-label">
                      Employee Name{' '}
                      <span className="text-danger">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter employee name"
                      required
                    />
                  </div>

                  {/* Employee ID */}
                  <div className="mb-3">
                    <label className="form-label">
                      Employee ID{' '}
                      <span className="text-danger">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="empId"
                      value={formData.empId}
                      onChange={handleInputChange}
                      placeholder="Enter employee ID"
                      required
                      readOnly={
                        !isEditing &&
                        formData.empId !== ''
                      }
                    />

                    <small className="text-muted">
                      Must be unique (auto-generated
                      for new employees)
                    </small>
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label">
                      Email Address
                    </label>

                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                    />
                  </div>

                  {/* Designation */}
                  <div className="mb-3">
                    <label className="form-label">
                      Designation{' '}
                      <span className="text-danger">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      placeholder="Enter designation"
                      required
                    />
                  </div>

                  {/* Department */}
                  <div className="mb-3">
                    <label className="form-label">
                      Department{' '}
                      <span className="text-danger">
                        *
                      </span>
                    </label>

                    <select
                      className="form-select"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">
                        Select Department
                      </option>

                      {departments
                        .filter(
                          (
                            department
                          ): department is Department =>
                            department !==
                            'All Departments'
                        )
                        .map((department) => (
                          <option
                            key={department}
                            value={department}
                          >
                            {department}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div className="mb-3">
                    <label className="form-label">
                      Status{' '}
                      <span className="text-danger">
                        *
                      </span>
                    </label>

                    <select
                      className="form-select"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="ACTIVE">
                        ACTIVE
                      </option>

                      <option value="INACTIVE">
                        INACTIVE
                      </option>
                    </select>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary rounded-pill"
                    onClick={() =>
                      setShowModal(false)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="btn text-white rounded-pill"
                    onClick={handleSubmit}
                    style={{
                      background:
                        'linear-gradient(130deg, #e22b6e 0%, #3e6db5 100%)',
                      border: 'none',
                    }}
                  >
                    {isEditing
                      ? 'Update Employee'
                      : 'Add Employee'}
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