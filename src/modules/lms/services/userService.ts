import axios from "axios";

const getHeaders = () => {
  const token = sessionStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export interface UserPayload {
  name: string;
  email: string;
  password?: string;
  role: string;
}

export async function createUser(payload: UserPayload) {
  const res = await axios.post(
    "http://localhost:3001/api/v1/users",
    payload,
    getHeaders()
  );
  return res;
}

export async function getUser(
  sortOrder: "asc" | "desc" = "asc",
  sortBy: "id" | "name" | "createdAt" = "id"
) {
  const res = await axios.get(
    `http://localhost:3001/api/v1/users?sortBy=${sortBy}&sortOrder=${sortOrder}`,
    getHeaders()
  );
  return res;
}

export async function updateUser(
  id: string | number,
  payload: Partial<UserPayload>
) {
  const res = await axios.patch(
    `http://localhost:3001/api/v1/users/${id}`,
    payload,
    getHeaders()
  );
  return res;
}

export async function deleteUser(id: string | number) {
  const res = await axios.delete(
    `http://localhost:3001/api/v1/users/${id}`,
    getHeaders()
  );
  return res;
}
