import { useEffect, useState } from 'react';
import DateRangePicker from '../utils/dateRangePicker';
import type {
  Course,
  CourseFormData,
  CourseStatus,
  StatusFilter,
  StatusBadgeStyle,
} from '../models/coursemanagement';
import '../../../styles/departments.css';

function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>('All Status');

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [formData, setFormData] = useState<CourseFormData>({
    id: null,
    title: '',
    code: '',
    instructor: '',
    startDate: '',
    endDate: '',
    enrolled: 0,
    status: 'DRAFT',
  });

  const statuses: StatusFilter[] = [
    'All Status',
    'PUBLISHED',
    'DRAFT',
    'ARCHIVED',
  ];

  const instructors: string[] = [
    'Dr. Ananya Krishnan',
    'Prof. Manoj Tiwari',
    'Ms. Divya Pillai',
    'Dr. Rajesh Kumar',
    'Prof. Sunita Sharma',
  ];

  // --------------------------------------------------
  // Load courses
  // --------------------------------------------------

  useEffect(() => {
    const savedCourses = localStorage.getItem(
      'courseManagementCourses'
    );

    if (savedCourses) {
      try {
        const parsedCourses: Course[] = JSON.parse(savedCourses);
        setCourses(parsedCourses);
      } catch (error) {
        console.error('Failed to parse saved courses:', error);
      }
    } else {
      const defaultCourses: Course[] = [
        {
          id: 1,
          title: 'CNC Machine Operation Basics',
          code: 'CRS-101',
          instructor: 'Dr. Ananya Krishnan',
          startDate: '2024-01-01',
          endDate: '2024-03-01',
          enrolled: 18,
          status: 'PUBLISHED',
        },
        {
          id: 2,
          title: 'Workplace Safety & Compliance',
          code: 'CRS-102',
          instructor: 'Ms. Divya Pillai',
          startDate: '2024-03-15',
          endDate: '2024-04-15',
          enrolled: 25,
          status: 'PUBLISHED',
        },
        {
          id: 3,
          title: 'Quality Inspection Techniques',
          code: 'CRS-103',
          instructor: 'Prof. Manoj Tiwari',
          startDate: '2024-05-01',
          endDate: '2024-06-01',
          enrolled: 10,
          status: 'DRAFT',
        },
      ];

      setCourses(defaultCourses);

      localStorage.setItem(
        'courseManagementCourses',
        JSON.stringify(defaultCourses)
      );
    }
  }, []);

  // --------------------------------------------------
  // Save courses
  // --------------------------------------------------

  const saveCoursesToLocal = (updatedCourses: Course[]): void => {
    setCourses(updatedCourses);

    localStorage.setItem(
      'courseManagementCourses',
      JSON.stringify(updatedCourses)
    );
  };

  // --------------------------------------------------
  // Status badge
  // --------------------------------------------------

  const statusStyle = (
    status: CourseStatus
  ): { bg: string; color: string; border: string } => {
    const map: Record<CourseStatus, { bg: string; color: string; border: string }> = {
      PUBLISHED: {
        bg: '#ecfdf5',
        color: '#059669',
        border: '1px solid #a7f3d0',
      },
      DRAFT: {
        bg: '#fef3c7',
        color: '#d97706',
        border: '1px solid #fde68a',
      },
      ARCHIVED: {
        bg: '#f1f5f9',
        color: '#64748b',
        border: '1px solid #cbd5e1',
      },
    };

    return map[status];
  };

  // --------------------------------------------------
  // Filter
  // --------------------------------------------------

  const filtered: Course[] = courses.filter((course) => {
    const searchValue = search.toLowerCase();

    const matchSearch =
      course.title.toLowerCase().includes(searchValue) ||
      course.code.toLowerCase().includes(searchValue);

    const matchStatus =
      statusFilter === 'All Status' ||
      course.status === statusFilter;

    return matchSearch && matchStatus;
  });

  // --------------------------------------------------
  // Stats
  // --------------------------------------------------

  const publishedCount = courses.filter(
    (course) => course.status === 'PUBLISHED'
  ).length;

  const totalEnrolled = courses.reduce(
    (sum, course) => sum + course.enrolled,
    0
  );

  // --------------------------------------------------
  // Input change
  // --------------------------------------------------

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ): void => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'enrolled'
          ? Number(value)
          : value,
    }));
  };

  // --------------------------------------------------
  // Add course
  // --------------------------------------------------

  const handleAddCourse = (): void => {
    const newCode = generateCourseCode();

    setFormData({
      id: null,
      title: '',
      code: newCode,
      instructor: '',
      startDate: '',
      endDate: '',
      enrolled: 0,
      status: 'DRAFT',
    });

    setIsEditing(false);
    setShowModal(true);
  };

  // --------------------------------------------------
  // Edit course
  // --------------------------------------------------

  const handleEditCourse = (
    course: Course
  ): void => {
    setFormData({
      id: course.id,
      title: course.title,
      code: course.code,
      instructor: course.instructor,
      startDate: course.startDate,
      endDate: course.endDate,
      enrolled: course.enrolled,
      status: course.status,
    });

    setIsEditing(true);
    setShowModal(true);
  };

  // --------------------------------------------------
  // Delete course
  // --------------------------------------------------

  const handleDeleteCourse = (
    id: number
  ): void => {
    if (
      window.confirm(
        'Are you sure you want to delete this course?'
      )
    ) {
      const updatedCourses = courses.filter(
        (course) => course.id !== id
      );

      saveCoursesToLocal(updatedCourses);
    }
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  const handleSubmit = (): void => {
    if (
      !formData.title ||
      !formData.code ||
      !formData.instructor ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.status
    ) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.enrolled < 0) {
      alert('Enrolled count cannot be negative');
      return;
    }

    // Duplicate course code check
    const isDuplicate = courses.some(
      (course) =>
        course.code.toLowerCase() ===
          formData.code.toLowerCase() &&
        (isEditing
          ? course.id !== formData.id
          : true)
    );

    if (isDuplicate) {
      alert(
        'Course code already exists. Please use a unique code.'
      );
      return;
    }

    if (isEditing && formData.id !== null) {
      const updatedCourses = courses.map(
        (course) =>
          course.id === formData.id
            ? {
                ...formData,
                id: formData.id,
              }
            : course
      );

      saveCoursesToLocal(updatedCourses);
    } else {
      const newCourse: Course = {
        ...formData,
        id: Date.now(),
      };

      saveCoursesToLocal([
        ...courses,
        newCourse,
      ]);
    }

    setShowModal(false);
  };

  // --------------------------------------------------
  // Generate Course Code
  // --------------------------------------------------

  const generateCourseCode = (): string => {
    const lastCourseNumber =
      courses.length > 0
        ? courses.reduce((max, course) => {
            const parts = course.code.split('-');
            const number = Number(parts[1]);

            return number > max ? number : max;
          }, 100)
        : 100;

    return `CRS-${lastCourseNumber + 1}`;
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="h-auto bg-white shadow-sm rounded border p-4">

      {/* Header */}
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Course Management</h4>
          <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
            Design, schedule, and publish training programs and courses
          </p>
        </div>

        <button
          className="btn btn-asti-gradient px-4 py-2 fw-semibold rounded-pill"
          onClick={handleAddCourse}
        >
          + Create Course
        </button>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          {
            label: "Total Courses",
            value: courses.length,
            color: "#3e6db5",
            bgClass: "my-fade-blue",
            stroke: "#3e6db5",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            ),
          },
          {
            label: "Published Courses",
            value: `${publishedCount} Published`,
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
            label: "Total Enrollments",
            value: `${totalEnrolled} Enrolled`,
            color: "#6740d5",
            bgClass: "my-fade-purple",
            stroke: "#6740d5",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
              placeholder="Search by title or course code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
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

          {(statusFilter !== "All Status" || search) && (
            <button
              type="button"
              className="ctq-filter-clear-btn"
              onClick={() => {
                setStatusFilter("All Status");
                setSearch("");
              }}
            >
              Clear
            </button>
          )}
        </div>

        <div className="ctq-filter-count-info ms-auto">
          Showing <strong>{filtered.length}</strong> of {courses.length} courses
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0 dept-table">
          <thead>
            <tr className="dept-table-header">
              {[
                'Course Title',
                'Course Code',
                'Instructor',
                'Duration',
                'Enrolled',
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
            {filtered.map((course) => {
              const badge = statusStyle(
                course.status
              );

              return (
                <tr
                  key={course.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                  }}
                >
                  <td className="px-3 fw-semibold text-dark">
                    {course.title}
                  </td>

                  <td className="px-3">
                    <span className="badge-dept-code">
                      {course.code}
                    </span>
                  </td>

                  <td className="px-3 text-dark">
                    {course.instructor}
                  </td>

                  <td className="px-3 text-muted" style={{ fontSize: "0.85rem" }}>
                    {course.startDate} →{' '}
                    {course.endDate}
                  </td>

                  <td className="px-3">
                    <span
                      className="fw-bold"
                      style={{
                        color: '#e22b6e',
                      }}
                    >
                      {course.enrolled}
                    </span>
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
                      {course.status}
                    </span>
                  </td>

                  <td className="px-3 text-end">
                    {/* Edit */}
                    <button
                      className="btn-action-circle me-1"
                      title="Edit"
                      onClick={() =>
                        handleEditCourse(course)
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
                        handleDeleteCourse(
                          course.id
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
                      ? 'Edit Course'
                      : 'Create New Course'}
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

                  {/* Course Title */}
                  <div className="mb-3">
                    <label className="form-label">
                      Course Title{' '}
                      <span className="text-danger">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter course title"
                    />
                  </div>

                  {/* Course Code */}
                  <div className="mb-3">
                    <label className="form-label">
                      Course Code{' '}
                      <span className="text-danger">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder="Enter course code"
                      readOnly={
                        !isEditing &&
                        formData.code !== ''
                      }
                    />

                    <small className="text-muted">
                      Must be unique (auto-generated
                      for new courses)
                    </small>
                  </div>

                  {/* Instructor */}
                  <div className="mb-3">
                    <label className="form-label">
                      Instructor{' '}
                      <span className="text-danger">
                        *
                      </span>
                    </label>

                    <select
                      className="form-select"
                      name="instructor"
                      value={formData.instructor}
                      onChange={handleInputChange}
                    >
                      <option value="">
                        Select Instructor
                      </option>

                      {instructors.map(
                        (instructor) => (
                          <option
                            key={instructor}
                            value={instructor}
                          >
                            {instructor}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* Date Range */}
                  <DateRangePicker
                    startDate={
                      formData.startDate
                    }
                    endDate={
                      formData.endDate
                    }
                    onChange={(
                      field,
                      value
                    ) =>
                      setFormData((prev) => ({
                        ...prev,
                        [field]:
                          value,
                      }))
                    }
                  />

                  {/* Enrolled */}
                  <div className="mb-3">
                    <label className="form-label">
                      Enrolled Students
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      name="enrolled"
                      value={formData.enrolled}
                      onChange={handleInputChange}
                      min="0"
                    />
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
                    >
                      <option value="DRAFT">
                        DRAFT
                      </option>

                      <option value="PUBLISHED">
                        PUBLISHED
                      </option>

                      <option value="ARCHIVED">
                        ARCHIVED
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
                      ? 'Update Course'
                      : 'Create Course'}
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

export default CourseManagement;