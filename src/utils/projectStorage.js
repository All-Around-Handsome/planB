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

export const getDraftData = () => {
  const data = localStorage.getItem("currentProjectDraft");
  return data ? JSON.parse(data) : null;
};

export const saveDraftData = (project) => {
  localStorage.setItem(
    "currentProjectDraft",
    JSON.stringify({
      ...project,
      updatedAt: new Date().toISOString(),
    })
  );
};

export const removeDraftData = () => {
  localStorage.removeItem("currentProjectDraft");
};