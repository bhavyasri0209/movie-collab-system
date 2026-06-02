import API from "./api";

export const getProjects = async () => {
  return await API.get("/projects");
};

export const createProject = async (data) => {
  return await API.post("/create-project", data);
};

export const assignCrew = async (data) => {
  return await API.post("/assign-crew", data);
};

export const getProjectCrew = async (projectId) => {
  return await API.get(`/project-crew/${projectId}`);
};