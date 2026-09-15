import axios from "axios";
const API_BASE_URL = import.meta.env.API_BASE_URL;

const getHeaders = () => {
    const token = sessionStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export async function getSections(sortOrder: 'asc' | 'desc' = 'asc', sortBy: string = 'id') {
    const res = await axios.get(
        `${API_BASE_URL}/v1/sections`,
        getHeaders()
    );
    return res;
}

export async function createSection(name: string, departmentId: number | string, subDepartmentId: number | string) {
    const res = await axios.post(
        `${API_BASE_URL}/v1/sections`,
        {
            name,
            departmentId: Number(departmentId),
            subDepartmentId: Number(subDepartmentId),
        },
        getHeaders()
    );
    return res;
}

export async function updateSection(id: string | number, name: string) {
    const res = await axios.patch(
        `${API_BASE_URL}/v1/sections/${id}`,
        { name },
        getHeaders()
    );
    return res;
}

export async function deleteSection(id: string | number) {
    const res = await axios.delete(
        `${API_BASE_URL}/v1/sections/${id}`,
        getHeaders()
    );
    return res;
}
