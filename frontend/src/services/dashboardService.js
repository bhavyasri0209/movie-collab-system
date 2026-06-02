import API from "./api";

export const getCrew =
  () => API.get("/crew");

export const getSchedules =
  () => API.get("/schedules");

export const getAssets =
  () => API.get("/assets");

export const getApprovals =
  () => API.get("/approvals");