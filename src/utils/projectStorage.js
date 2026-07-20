export const getProjectData = () => {
  const data = localStorage.getItem("planb_project");
  return data ? JSON.parse(data) : null;
};

export const saveProjectData = (project) => {
  localStorage.setItem(
    "planb_project",
    JSON.stringify(project)
  );
};