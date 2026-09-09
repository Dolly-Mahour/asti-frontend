import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import profileSvg1 from "../../../assets/purple-profile.png";
import profileSvg2 from "../../../assets/pink-profile.png";
import profileSvg3 from "../../../assets/blue-profile.png";
import profileSvg4 from "../../../assets/yellow-profile.png";

import {
  Chart as ChartJS,
  CategoryScale,
  ArcElement,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  ArcElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);
function CTQMonitoring() {
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string }>({});
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleClearFilters = () => {
    setSelectedFilters({});
    setFromDate("");
    setToDate("");
  };

  const data: ChartData<"bar"> = {
    labels: [
      "26 Jul",
      "27 Jul",
      "28 Jul",
      "29 Jul",
      "30 Jul",
      "31 Jul",
      "1 Aug",
      "2 Aug",
      "3 Aug",
      "4 Aug",
    ],
    datasets: [
      {
        label: "Required",
        data: [75, 60, 55, 70, 65, 20, 32, 56, 43, 23],
        backgroundColor: "#466ad5",
        borderRadius: 5,
        barThickness: 25,
        inflateAmount: -2,
        // categoryPercentage: 0.5,
        // barPercentage: 0.9,
      },
      {
        label: "Actual Present/Holiday",
        data: [55, 50, 45, 60, 55, 70, 60, 95, 70, 65],
        backgroundColor: "#ec2471",
        borderRadius: 5,
        barThickness: 25,
        inflateAmount: -2,
        // categoryPercentage: 0.5,
        // barPercentage: 0.9,
      },
      {
        label: "Current Headcount",
        data: [60, 30, 28, 40, 38, 50, 50, 45, 60, 55],
        backgroundColor: "#6740d5",
        borderRadius: 5,
        barThickness: 25,
        inflateAmount: -2,
        // categoryPercentage: 0.5,
        // barPercentage: 0.9,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,

        grid: {
          color: "#d9d9d9",
          // borderDash: [10, 10],
          // drawBorder: false,
        },

        ticks: {
          display: true,
        },

        border: {
          display: false,
        },
      },
    },
  };

  const dailyAbsenteeismData: ChartData<"bar"> = {
    labels: [
      "26 Jul",
      "27 Jul",
      "28 Jul",
      "29 Jul",
      "30 Jul",
      "31 Jul",
      "1 Aug",
      "2 Aug",
      "3 Aug",
      "4 Aug",
    ],
    datasets: [
      {
        label: "Daily Absenteeism",
        data: [15, 18, 12, 20, 16, 8, 14, 22, 17, 10],
        backgroundColor: "#e22b6e",
        hoverBackgroundColor: "#c81e5b",
        borderRadius: 6,
        barThickness: 22,
      },
    ],
  };

  const dailyAbsenteeismOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5,
        },
        grid: {
          color: "#e5e5e5",
        },
      },
    },
  };

  const dailyAttritionData: ChartData<"bar"> = {
    labels: [
      "26 Jul",
      "27 Jul",
      "28 Jul",
      "29 Jul",
      "30 Jul",
      "31 Jul",
      "1 Aug",
      "2 Aug",
      "3 Aug",
      "4 Aug",
    ],
    datasets: [
      {
        label: "Daily Attrition",
        data: [2, 4, 1, 3, 5, 1, 2, 4, 3, 1],
        backgroundColor: "#3e6db5",
        hoverBackgroundColor: "#2f5793",
        borderRadius: 6,
        barThickness: 22,
      },
    ],
  };

  const dailyAttritionOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 2,
        },
        grid: {
          color: "#e5e5e5",
        },
      },
    },
  };

  const genderDistributionData: ChartData<"doughnut"> = {
    labels: ["Male", "Female"],
    datasets: [
      {
        label: "Employees",
        data: [780, 470],
        backgroundColor: [
          "#3e6db5", // Male (ASTI Blue)
          "#e22b6e", // Female (ASTI Pink)
        ],
        borderColor: "#ffffff",
        borderWidth: 3,
        hoverOffset: 10,
      },
    ],
  };

  const genderDistributionOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 30,
          boxHeight: 8,
          padding: 20,
        },
      },
    },
  };
  return (
    <>
      <div className="h-auto shadow border p-4">

        {/* FOUR KPI CARDS ----------------------  */}
        <div className="row g-0 g-0 my-4">
          <div className="col-lg-3 col-md-6 col-sm-12 p-2">
            <div className="row g-0 p-3  border shadow scale-transition rounded-4">
              <div className="col center-elements">
                <img
                  className="h-60px my-fade-purple rounded-pill p-1"
                  src={profileSvg1}
                  alt=""
                />
              </div>
              <div className="col d-flex flex-column justify-content-center align-items-start">
                <p className="text-secondary" style={{fontSize: '0.85rem'}}>Total Manpower</p>
                <p className="fw-semibold fs-5">1,250</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 p-2">
            <div className="row g-0 p-3 border shadow scale-transition rounded-4">
              <div className="col center-elements">
                <img
                  className="h-60px my-fade-pink rounded-pill p-1"
                  src={profileSvg2}
                  alt=""
                />
              </div>
              <div className="col d-flex flex-column justify-content-center align-items-start">
                <p className="text-secondary" style={{fontSize: '0.85rem'}}>Total Present</p>
                <p className="fw-semibold fs-5" style={{color: '#2e7d32'}}>1,148</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 p-2">
            <div className="row g-0 p-3 border shadow scale-transition rounded-4">
              <div className="col center-elements">
                <img
                  className="h-60px my-fade-blue rounded-circle p-1"
                  src={profileSvg3}
                  alt=""
                />
              </div>
              <div className="col d-flex flex-column justify-content-center align-items-start">
                <p className="text-secondary" style={{fontSize: '0.85rem'}}>Total Absent</p>
                <p className="fw-semibold fs-5" style={{color: '#c62828'}}>102</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 p-2">
            <div className="row g-0 p-3 border shadow scale-transition rounded-4">
              <div className="col center-elements">
                <img
                  className="h-60px my-fade-yellow rounded-circle p-1"
                  src={profileSvg4}
                  alt=""
                />
              </div>
              <div className="col d-flex flex-column justify-content-center align-items-start">
                <p className="text-secondary" style={{fontSize: '0.85rem'}}>Attendance %</p>
                <p className="fw-semibold fs-5" style={{color: '#e65100'}}>91.8%</p>
              </div>
            </div>
          </div>
        </div>
        {/* FILTERS DIV--------------------------------------------- */}
        <div className="ctq-filter-bar border rounded-4 shadow-sm p-3 mt-3" style={{background: '#fafbff'}}>
          <div className="d-flex align-items-center flex-wrap gap-2">
            {/* Filter label */}
            <div className="d-flex align-items-center me-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e22b6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <span className="ms-1 fw-semibold" style={{fontSize: '0.82rem', color: '#3d3d3d'}}>Filters</span>
            </div>

            {/* Select filters */}
            {["Units", "Departments", "Sections", "Lines", "Shifts"].map((label) => (
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
            ))}

            {/* Date range filters */}
            <div className="d-flex align-items-center ms-auto gap-2">
              <div className="ctq-filter-date-group">
                <label style={{fontSize: '0.72rem', color: '#888', fontWeight: 600, letterSpacing: '0.03em'}}>FROM</label>
                <input type="date" className="ctq-filter-date-input" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              </div>
              <div className="ctq-filter-date-group">
                <label style={{fontSize: '0.72rem', color: '#888', fontWeight: 600, letterSpacing: '0.03em'}}>TO</label>
                <input type="date" className="ctq-filter-date-input" value={toDate} onChange={(e) => setToDate(e.target.value)} />
              </div>

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
          </div>
        </div>
        {/* TRIPPLE BAR GRAPH ------------------------------------- */}
        <div className="my-3 rounded-4 shadow scale-transition-sm border bg-white">
          <div className="d-flex align-items-center justify-content-between p-4 pb-2">
            <div className="d-flex align-items-center w-auto flex-shrink-0 p-1">
              <svg
                className="me-3 my-fade-pink rounded-circle p-2"
                width="45px"
                height="45px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 19V18C18 15.7909 16.2091 14 14 14H10C7.79086 14 6 15.7909 6 18V19M23 19V18C23 15.7909 21.2091 14 19 14H18.5M1 19V18C1 15.7909 2.79086 14 5 14H5.5M17 11C18.6569 11 20 9.65685 20 8C20 6.34315 18.6569 5 17 5M7 11C5.34315 11 4 9.65685 4 8C4 6.34315 5.34315 5 7 5M15 8C15 9.65685 13.6569 11 12 11C10.3431 11 9 9.65685 9 8C9 6.34315 10.3431 5 12 5C13.6569 5 15 6.34315 15 8Z"
                  stroke="#e22b6e"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              <h5 className="mb-0 fw-bold">Daily CTQMonitoring Trend</h5>
            </div>
          </div>
          {/* CHART DIV--------------------------- */}
          <div style={{ overflowX: "auto" }}>
            <div
              className="p-4 pt-2"
              style={{
                width: `${(data.labels?.length ?? 0) * 140}px`,
                height: "400px",
              }}
            >
              <Bar data={data} options={options} />
            </div>
          </div>
          {/* FIXED BOTTOM INFORMATION (NOT HORIZONTALLY SCROLLABLE) */}
          <div
            className="d-flex align-items-center justify-content-center flex-wrap gap-4 py-3 px-4 border-top"
            style={{
              background: "#fafbff",
              borderBottomLeftRadius: "1rem",
              borderBottomRightRadius: "1rem",
            }}
          >
            <div className="d-flex align-items-center">
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  backgroundColor: "#466ad5",
                  display: "inline-block",
                  marginRight: 8,
                }}
              ></span>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#3d3d3d" }}>
                Required
              </span>
            </div>
            <div className="d-flex align-items-center">
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  backgroundColor: "#ec2471",
                  display: "inline-block",
                  marginRight: 8,
                }}
              ></span>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#3d3d3d" }}>
                Actual Present/Holiday
              </span>
            </div>
            <div className="d-flex align-items-center">
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  backgroundColor: "#6740d5",
                  display: "inline-block",
                  marginRight: 8,
                }}
              ></span>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#3d3d3d" }}>
                Current Headcount
              </span>
            </div>
          </div>
        </div>
        {/* DAILY ABSENTEEISM AND DAILY ATTRITION ----------------------------------------- */}
        <div className="row g-0 my-4 g-3">
          {/* Daily Absenteeism chart-------- */}
          <div className="col-lg-6 col-12 pe-2">
            <div className="p-4 rounded-4 border shadow scale-transition-sm">
              {/* HEADINGSS----------------- */}
              <div className="d-flex align-items-center mb-1">
                <svg
                  className="me-2 my-fade-pink rounded-circle p-2 flex-shrink-0"
                  width="38px"
                  height="38px"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#e22b6e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="17" y1="8" x2="22" y2="13" />
                  <line x1="22" y1="8" x2="17" y2="13" />
                </svg>
                <div>
                  <p className="fw-bold">Daily Absenteeism</p>
                  <p className="text-secondary" style={{fontSize: "0.85rem"}}>
                    Daily absences in selected month
                  </p>
                </div>
              </div>

              {/* SINGLE BAR GRAPH OF DAILY ABSENTEEISM */}
              <div
                className="p-4"
                style={{
                  width: "100%",
                  height: "300px",
                }}
              >
                <Bar
                  data={dailyAbsenteeismData}
                  options={dailyAbsenteeismOptions}
                />
              </div>
            </div>
          </div>
          {/* Daily Attrition chart-------- */}
          <div className="col-lg-6 col-12 ps-2">
            <div className="p-4 border shadow rounded-4 scale-transition-sm">
              {/* HEADINGSS----------------- */}
              <div className="d-flex align-items-center mb-1">
                <svg
                  className="me-2 my-fade-blue rounded-circle p-2 flex-shrink-0"
                  width="38px"
                  height="38px"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3e6db5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <polyline points="16 11 18 13 22 9" />
                </svg>
                <div>
                  <p className="fw-bold">Daily Attrition</p>
                  <p className="text-secondary" style={{fontSize: "0.85rem"}}>
                    Daily employee attrition trend
                  </p>
                </div>
              </div>

              {/* SINGLE BAR GRAPH OF DAILY ATTRITION */}
              <div
                className="p-4"
                style={{
                  width: "100%",
                  height: "300px",
                }}
              >
                <Bar
                  data={dailyAttritionData}
                  options={dailyAttritionOptions}
                />
              </div>
            </div>
          </div>
        </div>
        {/* GENDER DISTRIBUTION DOUGHNUT -------------------------------------------- */}
        <div className="row g-0 ">
          <div className="col-lg-6 col-12 pe-2 ">
            {/* DOUGHNUT CHART----------------------- */}
            <div className="shadow border rounded-4 p-4 scale-transition-sm">
              {/* HEADINGSS----------------- */}
              <div className="d-flex align-items-center mb-1">
                <svg
                  className="me-2 my-fade-purple rounded-circle p-2 flex-shrink-0"
                  width="38px"
                  height="38px"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6740d5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
                <div>
                  <p className="fw-bold">Gender Distribution</p>
                  <p className="text-secondary" style={{fontSize: "0.85rem"}}>
                    Workforce gender ratio
                  </p>
                </div>
              </div>
              <div style={{ height: "300px", width: "100%" }} className="p-4">
                <Doughnut
                  data={genderDistributionData}
                  options={genderDistributionOptions}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default CTQMonitoring;
