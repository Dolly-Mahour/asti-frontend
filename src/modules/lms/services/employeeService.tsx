import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => {
    const token = sessionStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export interface EmployeePayload {
    employeeId: string;
    fullName: string;
    fatherName?: string | null;
    dob: string;
    gender: "Male" | "Female";
    designation: string;
    category?: "Staff" | "Worker" | null;
    departmentId: number;
    subDepartmentId?: number | null;
    sectionId?: number | null;
    lineId?: number | null;
    machineId?: number | null;
    grade: "Manufacturing Indirect" | "Direct" | "Indirect";
    division: string;
    address?: string | null;
    state?: string | null;
    pincode?: number | null;
    email: string;
    mobile: string;
    qualification?: string;
    doj: string;
    dol?: string | null;
    firstOfDay?: string | null;
    unit?: string | null;
    shift: "A" | "B" | "C" | "General";
    isDojo: boolean;
    skill: "L0" | "L1" | "L2" | "L3" | "L4" | "L5";
    isActive: boolean;
}

export interface EmployeeQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    departmentId?: number | string;
    subDepartmentId?: number | string;
    sectionId?: number | string;
    lineId?: number | string;
    machineId?: number | string;
    shift?: string;
    unit?: string;
    gender?: string;
    grade?: string;
    skill?: string;
    isActive?: boolean | string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export async function createEmployee(payload: EmployeePayload) {
    const res = await axios.post(
        `${API_BASE_URL}/v1/employees`,
        payload,
        getHeaders()
    );
    return res;
}

export async function getEmployee(
    params?: EmployeeQueryParams | "asc" | "desc",
    sortBy?: "id" | "name" | "createdAt"
) {
    let query = "";
    if (typeof params === "object" && params !== null) {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== "") {
                queryParams.append(k, String(v));
            }
        });
        query = queryParams.toString() ? `?${queryParams.toString()}` : "";
    } else {
        const sortOrder = params || "asc";
        const sBy = sortBy || "id";
        query = `?sortBy=${sBy}&sortOrder=${sortOrder}`;
    }

    const res = await axios.get(
        `${API_BASE_URL}/v1/employees${query}`,
        getHeaders()
    );
    return res;
}

export async function getEmployeeById(id: string | number) {
    const res = await axios.get(
        `${API_BASE_URL}/v1/employees/${id}`,
        getHeaders()
    );
    return res;
}

export async function updateEmployee(
    id: string | number,
    payload: Partial<EmployeePayload>
) {
    const res = await axios.patch(
        `${API_BASE_URL}/v1/employees/${id}`,
        payload,
        getHeaders()
    );
    return res;
}

export async function deleteEmployee(id: string | number) {
    const res = await axios.delete(
        `${API_BASE_URL}/v1/employees/${id}`,
        getHeaders()
    );
    return res;
}

export async function uploadEmployeesExcel(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const token = sessionStorage.getItem("token");

    const res = await axios.post(
        `${API_BASE_URL}/v1/employees/upload-excel`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return res;
}
