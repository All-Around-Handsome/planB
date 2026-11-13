import { useEffect, useState } from "react";

import { requestAi } from "../api/bmc";
import { getProjectData, saveProjectData } from "./projectStorage";

// 제목을 비워 둔 아이디어는 AI가 제목을 짓는다.
// 다음 화면으로 바로 넘어가고, 제목이 오면 저장한 뒤 이 이벤트로 화면에 알린다.
const TITLE_EVENT = "planb:idea-title";
const FALLBACK_LENGTH = 20;

// AI 제목이 오기 전이나 실패했을 때 쓰는 임시 제목: 아이디어 첫 줄 앞부분
export function fallbackTitle(content = "") {
  const firstLine = content.trim().split(/\r?\n/)[0].trim();

  return firstLine.length > FALLBACK_LENGTH
    ? `${firstLine.slice(0, FALLBACK_LENGTH).trim()}…`
    : firstLine;
}

export function getProjectTitle(project) {
  return project?.ideaTitle || fallbackTitle(project?.ideaContent);
}

export function requestIdeaTitle(ideaContent) {
  requestAi("title", { idea: ideaContent })
    .then((data) => data?.title?.trim())
    .catch((error) => {
      console.error("제목 생성 실패", error);
      return null;
    })
    .then((title) => {
      const project = getProjectData();

      // 그 사이 다른 아이디어로 바뀌었거나 사용자가 제목을 직접 넣었으면 건드리지 않는다
      if (!project || project.ideaContent !== ideaContent || project.ideaTitle) {
        return;
      }

      const ideaTitle = title || fallbackTitle(ideaContent);

      saveProjectData({ ...project, ideaTitle });
      window.dispatchEvent(new CustomEvent(TITLE_EVENT, { detail: ideaTitle }));
    });
}

// 제목이 나중에 도착하면 그때 다시 그린다
export function useIdeaTitleListener(onTitle) {
  useEffect(() => {
    const handle = (event) => onTitle(event.detail);

    window.addEventListener(TITLE_EVENT, handle);
    return () => window.removeEventListener(TITLE_EVENT, handle);
  }, [onTitle]);
}

export function useProjectTitle(project) {
  const [title, setTitle] = useState(() => getProjectTitle(project));

  useIdeaTitleListener(setTitle);

  return title;
}
