import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  PenLine,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";

import {
  getProfile,
  getBmcList,
  getBmcLimit,
  deleteBmc,
} from "../api/bmc";

import MainLayout from "../layouts/MainLayout";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";

// 분석을 받았는지(타당성 점수가 있는지)로 나눈다
const FILTERS = [
  ["all", "전체", () => true],
  ["created", "생성한 BMC", (project) => project.score == null],
  ["analyzed", "분석한 BMC", (project) => project.score != null],
];

const PAGE_SIZE = 10;

function formatDateTime(date) {
  if (!date) return "-";

  const [datePart, timePart] = date.split("T");

  return `${datePart.replaceAll("-", ".")} ${timePart.slice(0, 5)}`;
}

function MyPage() {
  const navigate = useNavigate();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [filter, setFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [projects, setProjects] = useState([]);
  const [bmcLimit, setBmcLimit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState(null);

  const loadProfile = async () => {
    try {
      const response = await getProfile();

      if (response?.success) {
        setUser(response.data);
      }
    } catch (error) {
      console.error("프로필 조회 실패", error);
    }
  };

  const loadBmcLimit = async () => {
    try {
      const response = await getBmcLimit();

      if (response?.success) {
        setBmcLimit(response.data);
      }
    } catch (error) {
      console.error("AI 사용량 조회 실패", error);
    }
  };

  const loadBmcList = async () => {
    try {
      const response = await getBmcList();

      if (response?.success) {
        const mappedProjects = response.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((bmc) => ({
            id: bmc.bmcRecordId,
            // 제목: ideaText의 첫 번째 줄
            name: bmc.ideaText?.split(/\r?\n/)[0]?.trim() || "제목 없음",
            createdAt: bmc.createdAt,
            score: bmc.validityScore,
            bmcType: bmc.bmcType === "AI_GENERATED" ? "AI 생성" : "직접 작성",
            bmcTypeCode: bmc.bmcType === "AI_GENERATED" ? "ai" : "direct",
          }));

        setProjects(mappedProjects);
      }
    } catch (error) {
      console.error("BMC 목록 조회 실패", error);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 비동기 응답에서 상태를 갱신한다
    loadProfile();
    loadBmcList();
    loadBmcLimit();
  }, []);

  const handleSearchChange = (value) => {
    setSearchKeyword(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value) => {
    setFilter(value);
    setCurrentPage(1);
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesKeyword = project.name
        .toLowerCase()
        .includes(searchKeyword.toLowerCase());

      const matchesFilter = FILTERS.find(([value]) => value === filter)[2](project);

      return matchesKeyword && matchesFilter;
    });
  }, [projects, searchKeyword, filter]);

  const totalPages = Math.ceil(filteredProjects.length / PAGE_SIZE);

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;

    return filteredProjects.slice(start, start + PAGE_SIZE);
  }, [filteredProjects, currentPage]);

  const showToast = (message) => {
    setToastMessage(message);

    setTimeout(() => {
      setToastMessage("");
    }, 2000);
  };

  const handleDelete = async (project) => {
    const confirmDelete = window.confirm(
      `'${project.name}'을(를) 삭제할까요? 삭제하면 되돌릴 수 없어요.`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await deleteBmc(project.id);

      if (response?.success) {
        showToast("삭제했어요.");
        setCurrentPage(1);
        loadBmcList();
      } else {
        showToast("삭제할 수 없어요.");
      }
    } catch (error) {
      console.error("BMC 삭제 실패", error);
      showToast("삭제하지 못했어요.");
    }
  };

  const startNew = () => navigate("/idea", { state: { fresh: true } });

  const usage = bmcLimit
    ? [
        ["탐색", bmcLimit.remainingSearch, bmcLimit.searchLimit],
        ["생성", bmcLimit.remainingGeneration, bmcLimit.generationLimit],
        ["분석", bmcLimit.remainingAnalysis, bmcLimit.analysisLimit],
      ]
    : [];

  return (
    <MainLayout>
      <main className="w-full max-w-6xl mx-auto px-5 md:px-8 pt-10 pb-16 animate-fade-up">
        {/* 프로필과 오늘 사용량 */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-900 text-white flex items-center justify-center text-xl font-bold overflow-hidden">
              {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || "U"
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                {user?.name || "사용자"}님의 BMC
              </h1>
              <p className="mt-1 text-sm text-gray-500 min-h-5">
                {isLoaded && `지금까지 ${projects.length}개를 만들었어요`}
              </p>
            </div>
          </div>

          {usage.length > 0 && (
            <div className="flex gap-2">
              {usage.map(([label, remaining, limit]) => (
                <div key={label} className="min-w-24 rounded-xl border border-gray-200 px-4 py-3">
                  <p className="text-xs text-gray-400">오늘 {label}</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900 tabular-nums">
                    {remaining}
                    <span className="text-gray-300 font-medium"> / {limit}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 검색, 필터, 새로 만들기 */}
        <section className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <label className="h-10 w-full sm:w-64 rounded-lg border border-gray-200 px-3 flex items-center gap-2 focus-within:border-gray-400">
              <Search size={16} className="text-gray-400" />
              <input
                value={searchKeyword}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="제목으로 검색"
                aria-label="제목으로 검색"
                className="w-full bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-400"
              />
            </label>

            <div className="h-10 p-1 rounded-lg bg-gray-100 flex gap-1" role="tablist" aria-label="종류">
              {FILTERS.map(([value, label, matches]) => (
                <button
                  key={value}
                  role="tab"
                  aria-selected={filter === value}
                  onClick={() => handleFilterChange(value)}
                  className={`flex-1 sm:flex-none px-3 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                    filter === value
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {label}
                  {isLoaded && (
                    <span className="ml-1 text-xs text-gray-400 tabular-nums">
                      {projects.filter(matches).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <Button icon={Plus} onClick={startNew}>
            새 아이디어
          </Button>
        </section>

        {/* 목록 */}
        <section className="mt-5">
          {!isLoaded ? (
            <div className="flex flex-col gap-2 animate-pulse" aria-label="불러오는 중">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-[68px] rounded-xl bg-gray-100" />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <EmptyState
              icon={projects.length === 0 ? Sparkles : Search}
              title={
                projects.length === 0
                  ? "아직 만든 BMC가 없어요"
                  : searchKeyword
                    ? "검색 결과가 없어요"
                    : filter === "analyzed"
                      ? "아직 분석한 BMC가 없어요"
                      : "분석 전인 BMC가 없어요"
              }
              description={projects.length === 0 ? "아이디어 한 줄로 첫 BMC를 만들어 보세요." : undefined}
              action={projects.length === 0 && <Button onClick={startNew}>첫 BMC 만들기</Button>}
            />
          ) : (
            <ul className="rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
              {paginatedProjects.map((project) => (
                <li
                  key={project.id}
                  className="group flex items-center gap-4 px-4 sm:px-5 py-4 hover:bg-gray-50/70 transition-colors"
                >
                  <span
                    className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center ${
                      project.bmcTypeCode === "ai"
                        ? "bg-accent-soft text-accent"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {project.bmcTypeCode === "ai" ? <Sparkles size={16} /> : <PenLine size={16} />}
                  </span>

                  <button
                    onClick={() => navigate(`/bmc/result/${project.id}`)}
                    className="flex-1 min-w-0 text-left"
                    title={project.name}
                  >
                    <p className="font-semibold text-gray-900 truncate group-hover:text-accent transition-colors">
                      {project.name}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                      {/* 휴대폰에서는 분석 상태를 제목 아래에 둔다 */}
                      <AnalysisBadge score={project.score} className="inline-flex sm:hidden" />
                      <span className="truncate">
                        {project.bmcType} · {formatDateTime(project.createdAt)}
                      </span>
                    </p>
                  </button>

                  <AnalysisBadge score={project.score} className="hidden sm:inline-flex" />

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => navigate(`/bmc/edit/${project.id}`)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                      title="수정"
                      aria-label={`${project.name} 수정`}
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(project)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50"
                      title="삭제"
                      aria-label={`${project.name} 삭제`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                aria-label="이전 페이지"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium tabular-nums ${
                    currentPage === page
                      ? "bg-gray-900 text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                aria-label="다음 페이지"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </section>
      </main>

      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 rounded-full bg-gray-900 text-white px-5 py-2.5 text-sm font-medium shadow-lg"
        >
          {toastMessage}
        </div>
      )}
    </MainLayout>
  );
}

function AnalysisBadge({ score, className = "" }) {
  return score != null ? (
    <span className={`${className} shrink-0 h-6 sm:h-7 px-2 sm:px-2.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold items-center gap-0.5 tabular-nums`}>
      분석 {score}
      <span className="font-medium text-emerald-600/60">/10</span>
    </span>
  ) : (
    <span className={`${className} shrink-0 h-6 sm:h-7 px-2 sm:px-2.5 rounded-md bg-gray-100 text-gray-500 text-xs font-medium items-center`}>
      분석 전
    </span>
  );
}

export default MyPage;
