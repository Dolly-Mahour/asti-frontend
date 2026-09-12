import React, { useState } from "react";
import "../../../styles/attendance.css";

interface AttendanceRecord {
  srNo: number;
  empId: string;
  name: string;
  department: string;
  designation: string;
  paycode: string;
  cardNo: string;
  shift: string;
  start: string;
  inTime: string;
  outTime: string;
  hrs: string;
  status: "Present" | "Absent" | "Half Day" | "On Leave";
  late: string;
  early: string;
  otHrs: string;
  otAmt: string;
}

const ATTENDANCE_DATA: AttendanceRecord[] = [
  { srNo: 1, empId: "EMP1001", name: "Aarav Sharma", department: "Production", designation: "Operator", paycode: "PC1001", cardNo: "45021", shift: "Morning", start: "09:00", inTime: "08:56", outTime: "17:15", hrs: "08:19", status: "Present", late: "00:00", early: "00:00", otHrs: "00:15", otAmt: "₹120" },
  { srNo: 2, empId: "EMP1002", name: "Priya Patel", department: "Quality", designation: "Inspector", paycode: "PC1002", cardNo: "45022", shift: "Morning", start: "09:00", inTime: "08:50", outTime: "17:05", hrs: "08:15", status: "Present", late: "00:00", early: "00:00", otHrs: "00:05", otAmt: "₹40" },
  { srNo: 3, empId: "EMP1003", name: "Rohit Verma", department: "Assembly", designation: "Sr. Operator", paycode: "PC1003", cardNo: "45023", shift: "Morning", start: "09:00", inTime: "09:15", outTime: "17:00", hrs: "07:45", status: "Present", late: "00:15", early: "00:00", otHrs: "00:00", otAmt: "₹0" },
  { srNo: 4, empId: "EMP1004", name: "Ananya Iyer", department: "SMT", designation: "Technician", paycode: "PC1004", cardNo: "45024", shift: "Morning", start: "09:00", inTime: "-", outTime: "-", hrs: "00:00", status: "Absent", late: "00:00", early: "00:00", otHrs: "00:00", otAmt: "₹0" },
  { srNo: 5, empId: "EMP1005", name: "Rajesh Kumar", department: "Maintenance", designation: "Supervisor", paycode: "PC1005", cardNo: "45025", shift: "General", start: "08:30", inTime: "08:25", outTime: "18:00", hrs: "09:35", status: "Present", late: "00:00", early: "00:00", otHrs: "01:30", otAmt: "₹350" },
  { srNo: 6, empId: "EMP1006", name: "Sneha Reddy", department: "Testing", designation: "Engineer", paycode: "PC1006", cardNo: "45026", shift: "Morning", start: "09:00", inTime: "08:58", outTime: "17:30", hrs: "08:32", status: "Present", late: "00:00", early: "00:00", otHrs: "00:30", otAmt: "₹180" },
  { srNo: 7, empId: "EMP1007", name: "Vikram Singh", department: "Production", designation: "Operator", paycode: "PC1007", cardNo: "45027", shift: "Evening", start: "14:00", inTime: "13:52", outTime: "22:10", hrs: "08:18", status: "Present", late: "00:00", early: "00:00", otHrs: "00:10", otAmt: "₹80" },
  { srNo: 8, empId: "EMP1008", name: "Pooja Gupta", department: "HR", designation: "Executive", paycode: "PC1008", cardNo: "45028", shift: "General", start: "09:00", inTime: "09:02", outTime: "13:30", hrs: "04:28", status: "Half Day", late: "00:02", early: "03:30", otHrs: "00:00", otAmt: "₹0" },
  { srNo: 9, empId: "EMP1009", name: "Amit Mishra", department: "Logistics", designation: "Stores Lead", paycode: "PC1009", cardNo: "45029", shift: "Morning", start: "09:00", inTime: "-", outTime: "-", hrs: "00:00", status: "On Leave", late: "00:00", early: "00:00", otHrs: "00:00", otAmt: "₹0" },
  { srNo: 10, empId: "EMP1010", name: "Neha Joshi", department: "Quality", designation: "Auditor", paycode: "PC1010", cardNo: "45030", shift: "Morning", start: "09:00", inTime: "08:45", outTime: "17:15", hrs: "08:30", status: "Present", late: "00:00", early: "00:00", otHrs: "00:15", otAmt: "₹120" },
  { srNo: 11, empId: "EMP1011", name: "Kavita Nair", department: "Packaging", designation: "Operator", paycode: "PC1011", cardNo: "45031", shift: "Morning", start: "09:00", inTime: "08:55", outTime: "17:00", hrs: "08:05", status: "Present", late: "00:00", early: "00:00", otHrs: "00:00", otAmt: "₹0" },
  { srNo: 12, empId: "EMP1012", name: "Rahul Deshmukh", department: "Assembly", designation: "Operator", paycode: "PC1012", cardNo: "45032", shift: "Night", start: "22:00", inTime: "21:50", outTime: "06:10", hrs: "08:20", status: "Present", late: "00:00", early: "00:00", otHrs: "00:10", otAmt: "₹100" },
  { srNo: 13, empId: "EMP1013", name: "Deepak Yadav", department: "Production", designation: "Line Incharge", paycode: "PC1013", cardNo: "45033", shift: "Morning", start: "09:00", inTime: "08:40", outTime: "18:00", hrs: "09:20", status: "Present", late: "00:00", early: "00:00", otHrs: "01:00", otAmt: "₹250" },
  { srNo: 14, empId: "EMP1014", name: "Ritu Chauhan", department: "Testing", designation: "Technician", paycode: "PC1014", cardNo: "45034", shift: "Morning", start: "09:00", inTime: "09:20", outTime: "17:20", hrs: "08:00", status: "Present", late: "00:20", early: "00:00", otHrs: "00:20", otAmt: "₹150" },
  { srNo: 15, empId: "EMP1015", name: "Manoj Tiwari", department: "Maintenance", designation: "Electrician", paycode: "PC1015", cardNo: "45035", shift: "General", start: "08:30", inTime: "08:30", outTime: "17:00", hrs: "08:30", status: "Present", late: "00:00", early: "00:00", otHrs: "00:00", otAmt: "₹0" },
  { srNo: 16, empId: "EMP1016", name: "Sunita Rao", department: "Quality", designation: "Inspector", paycode: "PC1016", cardNo: "45036", shift: "Morning", start: "09:00", inTime: "-", outTime: "-", hrs: "00:00", status: "Absent", late: "00:00", early: "00:00", otHrs: "00:00", otAmt: "₹0" },
  { srNo: 17, empId: "EMP1017", name: "Suresh Pillai", department: "Stores", designation: "Assistant", paycode: "PC1017", cardNo: "45037", shift: "Morning", start: "09:00", inTime: "08:52", outTime: "17:10", hrs: "08:18", status: "Present", late: "00:00", early: "00:00", otHrs: "00:10", otAmt: "₹75" },
  { srNo: 18, empId: "EMP1018", name: "Divya Menon", department: "HR", designation: "Coordinator", paycode: "PC1018", cardNo: "45038", shift: "General", start: "09:00", inTime: "08:59", outTime: "17:30", hrs: "08:31", status: "Present", late: "00:00", early: "00:00", otHrs: "00:30", otAmt: "₹200" },
  { srNo: 19, empId: "EMP1019", name: "Anil Saxena", department: "SMT", designation: "Sr. Engineer", paycode: "PC1019", cardNo: "45039", shift: "Morning", start: "09:00", inTime: "08:48", outTime: "17:45", hrs: "08:57", status: "Present", late: "00:00", early: "00:00", otHrs: "00:45", otAmt: "₹320" },
  { srNo: 20, empId: "EMP1020", name: "Swati Kulkarni", department: "Production", designation: "Operator", paycode: "PC1020", cardNo: "45040", shift: "Morning", start: "09:00", inTime: "09:05", outTime: "17:05", hrs: "08:00", status: "Present", late: "00:05", early: "00:00", otHrs: "00:05", otAmt: "₹40" },
  { srNo: 21, empId: "EMP1021", name: "Manish Pandey", department: "Assembly", designation: "Operator", paycode: "PC1021", cardNo: "45041", shift: "Morning", start: "09:00", inTime: "08:51", outTime: "17:15", hrs: "08:24", status: "Present", late: "00:00", early: "00:00", otHrs: "00:15", otAmt: "₹120" },
  { srNo: 22, empId: "EMP1022", name: "Meera Nambiar", department: "Quality", designation: "Team Lead", paycode: "PC1022", cardNo: "45042", shift: "Morning", start: "09:00", inTime: "08:45", outTime: "18:15", hrs: "09:30", status: "Present", late: "00:00", early: "00:00", otHrs: "01:15", otAmt: "₹380" },
  { srNo: 23, empId: "EMP1023", name: "Gaurav Bhatia", department: "Logistics", designation: "Supervisor", paycode: "PC1023", cardNo: "45043", shift: "General", start: "08:30", inTime: "08:28", outTime: "17:30", hrs: "09:02", status: "Present", late: "00:00", early: "00:00", otHrs: "00:30", otAmt: "₹180" },
  { srNo: 24, empId: "EMP1024", name: "Shilpa Shetty", department: "Packaging", designation: "Operator", paycode: "PC1024", cardNo: "45044", shift: "Morning", start: "09:00", inTime: "-", outTime: "-", hrs: "00:00", status: "Absent", late: "00:00", early: "00:00", otHrs: "00:00", otAmt: "₹0" },
  { srNo: 25, empId: "EMP1025", name: "Alok Tripathi", department: "Production", designation: "Technician", paycode: "PC1025", cardNo: "45045", shift: "Morning", start: "09:00", inTime: "08:58", outTime: "17:00", hrs: "08:02", status: "Present", late: "00:00", early: "00:00", otHrs: "00:00", otAmt: "₹0" },
  { srNo: 26, empId: "EMP1026", name: "Jyoti Das", department: "Testing", designation: "Operator", paycode: "PC1026", cardNo: "45046", shift: "Evening", start: "14:00", inTime: "13:50", outTime: "22:00", hrs: "08:10", status: "Present", late: "00:00", early: "00:00", otHrs: "00:00", otAmt: "₹0" },
  { srNo: 27, empId: "EMP1027", name: "Harish Mehta", department: "Maintenance", designation: "Sr. Technician", paycode: "PC1027", cardNo: "45047", shift: "General", start: "08:30", inTime: "08:20", outTime: "17:40", hrs: "09:20", status: "Present", late: "00:00", early: "00:00", otHrs: "00:40", otAmt: "₹240" },
  { srNo: 28, empId: "EMP1028", name: "Tanvi Shah", department: "HR", designation: "HRBP", paycode: "PC1028", cardNo: "45048", shift: "General", start: "09:00", inTime: "-", outTime: "-", hrs: "00:00", status: "On Leave", late: "00:00", early: "00:00", otHrs: "00:00", otAmt: "₹0" },
  { srNo: 29, empId: "EMP1029", name: "Sandeep Bose", department: "SMT", designation: "Operator", paycode: "PC1029", cardNo: "45049", shift: "Morning", start: "09:00", inTime: "09:10", outTime: "17:10", hrs: "08:00", status: "Present", late: "00:10", early: "00:00", otHrs: "00:10", otAmt: "₹80" },
  { srNo: 30, empId: "EMP1030", name: "Preeti Sen", department: "Assembly", designation: "Operator", paycode: "PC1030", cardNo: "45050", shift: "Morning", start: "09:00", inTime: "08:57", outTime: "17:00", hrs: "08:03", status: "Present", late: "00:00", early: "00:00", otHrs: "00:00", otAmt: "₹0" },
  { srNo: 31, empId: "EMP1031", name: "Nitin Jain", department: "Production", designation: "Operator", paycode: "PC1031", cardNo: "45051", shift: "Night", start: "22:00", inTime: "21:55", outTime: "06:30", hrs: "08:35", status: "Present", late: "00:00", early: "00:00", otHrs: "00:30", otAmt: "₹220" },
  { srNo: 32, empId: "EMP1032", name: "Radhika Agarwal", department: "Quality", designation: "Quality Engg", paycode: "PC1032", cardNo: "45052", shift: "Morning", start: "09:00", inTime: "08:50", outTime: "17:25", hrs: "08:35", status: "Present", late: "00:00", early: "00:00", otHrs: "00:25", otAmt: "₹190" },
  { srNo: 33, empId: "EMP1033", name: "Pankaj Shukla", department: "Stores", designation: "Officer", paycode: "PC1033", cardNo: "45053", shift: "Morning", start: "09:00", inTime: "09:00", outTime: "13:30", hrs: "04:30", status: "Half Day", late: "00:00", early: "03:30", otHrs: "00:00", otAmt: "₹0" },
  { srNo: 34, empId: "EMP1034", name: "Rekha Bhatt", department: "Packaging", designation: "Operator", paycode: "PC1034", cardNo: "45054", shift: "Morning", start: "09:00", inTime: "08:49", outTime: "17:05", hrs: "08:16", status: "Present", late: "00:00", early: "00:00", otHrs: "00:05", otAmt: "₹40" },
  { srNo: 35, empId: "EMP1035", name: "Tarun Goswami", department: "Production", designation: "Operator", paycode: "PC1035", cardNo: "45055", shift: "Morning", start: "09:00", inTime: "-", outTime: "-", hrs: "00:00", status: "Absent", late: "00:00", early: "00:00", otHrs: "00:00", otAmt: "₹0" },
  { srNo: 36, empId: "EMP1036", name: "Vandana Kaul", department: "Testing", designation: "Engineer", paycode: "PC1036", cardNo: "45056", shift: "Morning", start: "09:00", inTime: "08:53", outTime: "17:15", hrs: "08:22", status: "Present", late: "00:00", early: "00:00", otHrs: "00:15", otAmt: "₹140" },
  { srNo: 37, empId: "EMP1037", name: "Ashok Roy", department: "Maintenance", designation: "Technician", paycode: "PC1037", cardNo: "45057", shift: "General", start: "08:30", inTime: "08:26", outTime: "17:35", hrs: "09:09", status: "Present", late: "00:00", early: "00:00", otHrs: "00:35", otAmt: "₹210" },
  { srNo: 38, empId: "EMP1038", name: "Pallavi Dubey", department: "Assembly", designation: "Operator", paycode: "PC1038", cardNo: "45058", shift: "Morning", start: "09:00", inTime: "08:59", outTime: "17:00", hrs: "08:01", status: "Present", late: "00:00", early: "00:00", otHrs: "00:00", otAmt: "₹0" },
  { srNo: 39, empId: "EMP1039", name: "Vinod Rawat", department: "SMT", designation: "Operator", paycode: "PC1039", cardNo: "45059", shift: "Evening", start: "14:00", inTime: "13:54", outTime: "22:15", hrs: "08:21", status: "Present", late: "00:00", early: "00:00", otHrs: "00:15", otAmt: "₹120" },
  { srNo: 40, empId: "EMP1040", name: "Komal Soni", department: "Quality", designation: "Inspector", paycode: "PC1040", cardNo: "45060", shift: "Morning", start: "09:00", inTime: "08:44", outTime: "17:10", hrs: "08:26", status: "Present", late: "00:00", early: "00:00", otHrs: "00:10", otAmt: "₹80" },
  { srNo: 41, empId: "EMP1041", name: "Ajay Mathur", department: "Production", designation: "Supervisor", paycode: "PC1041", cardNo: "45061", shift: "Morning", start: "09:00", inTime: "08:40", outTime: "18:00", hrs: "09:20", status: "Present", late: "00:00", early: "00:00", otHrs: "01:00", otAmt: "₹300" },
  { srNo: 42, empId: "EMP1042", name: "Bharti Thakur", department: "Logistics", designation: "Assistant", paycode: "PC1042", cardNo: "45062", shift: "Morning", start: "09:00", inTime: "-", outTime: "-", hrs: "00:00", status: "On Leave", late: "00:00", early: "00:00", otHrs: "00:00", otAmt: "₹0" },
  { srNo: 43, empId: "EMP1043", name: "Chetan Anand", department: "Assembly", designation: "Sr. Operator", paycode: "PC1043", cardNo: "45063", shift: "Morning", start: "09:00", inTime: "08:52", outTime: "17:30", hrs: "08:38", status: "Present", late: "00:00", early: "00:00", otHrs: "00:30", otAmt: "₹200" },
  { srNo: 44, empId: "EMP1044", name: "Dolly Arora", department: "Testing", designation: "Operator", paycode: "PC1044", cardNo: "45064", shift: "Morning", start: "09:00", inTime: "09:12", outTime: "17:12", hrs: "08:00", status: "Present", late: "00:12", early: "00:00", otHrs: "00:12", otAmt: "₹90" },
  { srNo: 45, empId: "EMP1045", name: "Hemant Chawla", department: "SMT", designation: "Technician", paycode: "PC1045", cardNo: "45065", shift: "Night", start: "22:00", inTime: "21:48", outTime: "06:15", hrs: "08:27", status: "Present", late: "00:00", early: "00:00", otHrs: "00:15", otAmt: "₹130" },
  { srNo: 46, empId: "EMP1046", name: "Isha Dewan", department: "HR", designation: "Executive", paycode: "PC1046", cardNo: "45066", shift: "General", start: "09:00", inTime: "08:55", outTime: "17:15", hrs: "08:20", status: "Present", late: "00:00", early: "00:00", otHrs: "00:15", otAmt: "₹120" },
  { srNo: 47, empId: "EMP1047", name: "Jatin Sethi", department: "Production", designation: "Operator", paycode: "PC1047", cardNo: "45067", shift: "Morning", start: "09:00", inTime: "-", outTime: "-", hrs: "00:00", status: "Absent", late: "00:00", early: "00:00", otHrs: "00:00", otAmt: "₹0" },
  { srNo: 48, empId: "EMP1048", name: "Kiran Bajaj", department: "Quality", designation: "Auditor", paycode: "PC1048", cardNo: "45068", shift: "Morning", start: "09:00", inTime: "08:50", outTime: "17:00", hrs: "08:10", status: "Present", late: "00:00", early: "00:00", otHrs: "00:00", otAmt: "₹0" },
  { srNo: 49, empId: "EMP1049", name: "Lalit Grover", department: "Packaging", designation: "Lead", paycode: "PC1049", cardNo: "45069", shift: "Morning", start: "09:00", inTime: "08:42", outTime: "17:45", hrs: "09:03", status: "Present", late: "00:00", early: "00:00", otHrs: "00:45", otAmt: "₹280" },
  { srNo: 50, empId: "EMP1050", name: "Madhu Kapoor", department: "Maintenance", designation: "Manager", paycode: "PC1050", cardNo: "45070", shift: "General", start: "08:30", inTime: "08:30", outTime: "18:30", hrs: "10:00", status: "Present", late: "00:00", early: "00:00", otHrs: "01:30", otAmt: "₹450" },
];

function Attendance() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string }>({});
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleClearFilters = () => {
    setSelectedFilters({});
    setFromDate("");
    setToDate("");
  };

  const totalRecords = ATTENDANCE_DATA.length;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);
  const currentRecords = ATTENDANCE_DATA.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getStatusBadgeClass = (status: AttendanceRecord["status"]) => {
    switch (status) {
      case "Present":
        return "status-present";
      case "Absent":
        return "status-absent";
      case "Half Day":
        return "status-halfday";
      case "On Leave":
        return "status-leave";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="container-fluid g-0 p-3">
        {/* ATTENDANCE FILTERS & HEADER -------------------------- */}
        <div className="border shadow rounded-4 p-4 mb-4 bg-white">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 my-2">
            <div className="d-flex align-items-center">
              <h4 className="fw-bold mb-0" style={{ color: "#222" }}>Attendance</h4>
              <button
                className="gradient-bg text-white px-3 py-1 rounded-pill btn mx-3 shadow-sm border-0"
                style={{ fontSize: "0.85rem", fontWeight: 600 }}
              >
                {totalRecords} Records
              </button>
            </div>
            <button
              className="gradient-bg text-white px-3 py-2 rounded-pill btn shadow-sm border-0 scale-transition"
              style={{ fontSize: "0.85rem", fontWeight: 600 }}
            >
              Upload Excel
            </button>
          </div>

          {/* FILTERS DIV--------------------------------------------- */}
          <div
            className="ctq-filter-bar border rounded-4 shadow-sm p-3 mt-3"
            style={{ background: "#fafbff" }}
          >
            <div className="d-flex align-items-center flex-wrap gap-2 px-4">
              <div className="w-100 d-flex justify-content-between align-items-center">
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
                  <span
                    className="ms-1 fw-semibold"
                    style={{ fontSize: "0.82rem", color: "#3d3d3d" }}
                  >
                    Filters
                  </span>
                </div>

                {/* Select filters */}
                {["Units", "Departments", "Sub Departments", "Sections", "Lines", "Shifts"].map(
                  (label) => (
                    <select
                      key={label}
                      className="ctq-filter-select me-1"
                      value={selectedFilters[label] || ""}
                      onChange={(e) =>
                        setSelectedFilters((prev) => ({ ...prev, [label]: e.target.value }))
                      }
                    >
                      <option value="">{label}</option>
                      <option value="Option 1">Option 1</option>
                      <option value="Option 2">Option 2</option>
                      <option value="Option 3">Option 3</option>
                    </select>
                  ),
                )}

                {/* Clear button */}
                <button
                  type="button"
                  className="ctq-filter-clear-btn ms-1"
                  onClick={handleClearFilters}
                  title="Clear all filters"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Clear
                </button>
              </div>

              {/* Date range filters */}
              <div className="d-flex align-items-center gap-2 ps-5 ms-4">
                <div className="d-flex align-items-center gap-2">
                  <label
                    style={{
                      fontSize: "0.72rem",
                      color: "#888",
                      fontWeight: 600,
                      letterSpacing: "0.03em",
                    }}
                  >
                    FROM
                  </label>
                  <input
                    type="date"
                    className="ctq-filter-date-input"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
                <div className="d-flex align-items-center gap-">
                  <label
                    style={{
                      fontSize: "0.72rem",
                      color: "#888",
                      fontWeight: 600,
                      letterSpacing: "0.03em",
                    }}
                  >
                    TO
                  </label>
                  <input
                    type="date"
                    className="ctq-filter-date-input"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* ATTENDANCE TABLE & PAGINATION ------------------------------ */}
        <div className="border shadow rounded-4 p-4 mb-4 bg-white">
          <div className="overflow-x-auto">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>SR.NO</th>
                  <th>EMP ID</th>
                  <th>NAME</th>
                  <th>DEPARTMENT</th>
                  <th>DESIGNATION</th>
                  <th>PAYCODE</th>
                  <th>CARD NO</th>
                  <th>SHIFT</th>
                  <th>START</th>
                  <th>IN</th>
                  <th>OUT</th>
                  <th>HRS</th>
                  <th>STATUS</th>
                  <th>LATE</th>
                  <th>EARLY</th>
                  <th>OT HRS</th>
                  <th>OT AMT</th>
                </tr>
              </thead>

              <tbody>
                {currentRecords.map((record) => (
                  <tr key={record.srNo}>
                    <td style={{ fontWeight: 600, color: "#6c757d" }}>{record.srNo}</td>
                    <td style={{ fontWeight: 600, color: "#3e6db5" }}>{record.empId}</td>
                    <td style={{ fontWeight: 600 }}>{record.name}</td>
                    <td>{record.department}</td>
                    <td>{record.designation}</td>
                    <td>{record.paycode}</td>
                    <td>{record.cardNo}</td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {record.shift}
                      </span>
                    </td>
                    <td>{record.start}</td>
                    <td>{record.inTime}</td>
                    <td>{record.outTime}</td>
                    <td style={{ fontWeight: 600 }}>{record.hrs}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td style={{ color: record.late !== "00:00" ? "#c62828" : "#6c757d" }}>
                      {record.late}
                    </td>
                    <td style={{ color: record.early !== "00:00" ? "#e65100" : "#6c757d" }}>
                      {record.early}
                    </td>
                    <td>{record.otHrs}</td>
                    <td style={{ fontWeight: 600, color: record.otAmt !== "₹0" ? "#2e7d32" : "#6c757d" }}>
                      {record.otAmt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION BAR --------------------------------- */}
          <div className="attendance-pagination border-top mt-3 pt-3">
            <div className="text-secondary" style={{ fontSize: "0.85rem" }}>
              Showing <span className="fw-semibold text-dark">{startIndex + 1}</span> to{" "}
              <span className="fw-semibold text-dark">{endIndex}</span> of{" "}
              <span className="fw-semibold text-dark">{totalRecords}</span> entries
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span>Prev</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  className={`pagination-btn ${currentPage === pageNum ? "active" : ""}`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              ))}

              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <span>Next</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Attendance;
