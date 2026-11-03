import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit3,
  FileText,
  LayoutTemplate,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import {
  getProfile,
  getBmcList,
  getBmcLimit,
  deleteBmc,
} from "../api/bmc";

import MainLayout from "../layouts/MainLayout";

function MyPage() {
  const navigate = useNavigate();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [filter, setFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const [projects, setProjects] = useState([]);

  const [bmcLimit, setBmcLimit] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [user, setUser] = useState(null);

  const loadProfile = async () => {
    try {
      const response = await getProfile();

      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      console.error("프로필 조회 실패", error);
    }
  };

  const loadBmcLimit = async () => {
    try {
      const response = await getBmcLimit();

      if (response.success) {
        setBmcLimit(response.data);
      }
    } catch (error) {
      console.error("AI 사용량 조회 실패", error);
    }
  };

  const loadBmcList = async () => {
    try {
      const response = await getBmcList();

      if (response.success) {

        const mappedProjects = response.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((bmc) => ({
            id: bmc.bmcRecordId,

            icon:
              bmc.bmcType === "AI_GENERATED"
                ? <LayoutTemplate size={18} />
                : <BarChart3 size={18} />,

            // 제목: ideaText의 첫 번째 줄
            name: bmc.ideaText?.split(/\r?\n/)[0]?.trim() || "제목 없음",

            // 생성일
            createdAt: bmc.createdAt,

            // 타당성 점수
            score: bmc.validityScore,

            // 타입
            bmcType:
              bmc.bmcType === "AI_GENERATED"
                ? "AI 생성"
                : "직접 분석",

            bmcTypeCode:
              bmc.bmcType === "AI_GENERATED"
                ? "ai"
                : "direct",
          }));

        setProjects(mappedProjects);
      }

    } catch(error) {
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

  const formatDateTime = (date) => {
    if (!date) return "-";

    const [datePart, timePart] = date.split("T");

    return `${datePart.replaceAll("-", ".")} ${timePart.slice(0, 5)}`;
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesKeyword = project.name
        .toLowerCase()
        .includes(searchKeyword.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "ai" && project.bmcTypeCode === "ai") ||
        (filter === "direct" && project.bmcTypeCode === "direct");

      return matchesKeyword && matchesFilter;
    });
  }, [projects, searchKeyword, filter]);

  const totalPages = Math.ceil(
    filteredProjects.length / pageSize
  );


  const paginatedProjects = useMemo(() => {
    const start =
      (currentPage - 1) * pageSize;

    return filteredProjects.slice(
      start,
      start + pageSize
    );

  }, [filteredProjects, currentPage]);

  const showToast = (message) => {
    setToastMessage(message);

    setTimeout(() => {
      setToastMessage("");
    }, 2000);
  };

  const handleDelete = async (project) => {
    const confirmDelete = window.confirm(
      `${project.name} 프로젝트를 삭제하시겠습니까?`
    );
    if (!confirmDelete) {
      return;
    }
    try {
      const response = await deleteBmc(project.id);
      if(response.success){
        showToast(
          `${project.name} 프로젝트가 삭제되었습니다.`
        );
        setCurrentPage(1);
        loadBmcList();
      }else{
        showToast("삭제할 수 없습니다.");
      }
    } catch(error) {
      console.error("BMC 삭제 실패", error);
      showToast("프로젝트 삭제에 실패했습니다.");
    }
  };

  const handleEdit = (project) => {
    navigate(`/bmc/edit/${project.id}`);
  };

  const getTypeStyle = (type) => {
    if (type === "ai") {
      return "bg-blue-50 text-blue-600";
    }

    return "bg-purple-50 text-purple-600";
  };


  return (
    <MainLayout>
      <div className="w-full bg-white flex justify-center overflow-x-hidden">
        <div className="w-full max-w-[1440px] flex bg-white">
          {/* Main Content */}
          <main className="flex-1 px-6 py-6">
            {/* Profile Header */}
            <section className="flex items-center justify-between mb-7">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-[0_10px_24px_rgba(37,99,235,0.25)] overflow-hidden">
                  {user?.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt="프로필"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user?.name?.charAt(0) || "U"
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900">
                    {user?.name || "사용자"}
                  </h2>
                </div>
              </div>

              {bmcLimit && (
                <p className="text-sm text-gray-500">
                  오늘 남은 횟수: 탐색 {bmcLimit.remainingSearch} · 생성 {bmcLimit.remainingGeneration} · 분석 {bmcLimit.remainingAnalysis}
                </p>
              )}
            </section>

            <div>
              {/* Project Area */}
              <section>
                {/* Search / Filter / New Button */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-[210px] h-10 rounded-xl border border-gray-200 bg-white px-3 flex items-center gap-2">
                      <Search size={16} className="text-gray-300" />

                      <input
                        value={searchKeyword}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="검색"
                        className="w-full outline-none text-sm text-gray-700 placeholder:text-gray-300"
                      />
                    </div>

                    <div className="relative">
                      <select
                        value={filter}
                        onChange={(e) => handleFilterChange(e.target.value)}
                        className="
                          appearance-none
                          w-[120px]
                          h-10
                          rounded-xl
                          border
                          border-gray-200
                          bg-white
                          px-4
                          pr-9
                          text-sm
                          font-medium
                          text-gray-600
                          outline-none
                        "
                      >
                        <option value="all">전체</option>
                        <option value="ai">AI 생성</option>
                        <option value="direct">직접 분석</option>
                      </select>

                      <ChevronDown
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/idea", { state: { fresh: true } })}
                    className="
                      h-10
                      px-5
                      rounded-xl
                      bg-blue-600
                      text-white
                      text-sm
                      font-bold
                      flex
                      items-center
                      gap-2
                      hover:bg-blue-700
                      active:scale-[0.98]
                      transition
                    "
                  >
                    <Plus size={17} />
                    새 프로젝트
                  </button>
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                  <table className="w-full">
                    <thead>
                      <tr className="h-12 bg-[#F8FAFF] border-b border-gray-100 text-xs text-gray-500">
                        <th className="text-left px-5 font-bold">제목</th>
                        <th className="text-left px-3 font-bold">생성일</th>
                        <th className="text-center px-3 font-bold">점수</th>
                        <th className="text-center px-3 font-bold">타입</th>
                        <th className="px-3"><span className="sr-only">작업</span></th>
                      </tr>
                    </thead>

                    <tbody>
                      {paginatedProjects.map((project) => (
                        <tr
                          key={project.id}
                          className="h-[58px] border-b border-gray-100 last:border-b-0 hover:bg-blue-50/30 transition"
                        >
                          {/* 아이디어 제목 */}
                          <td className="px-5 max-w-[320px]">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="text-blue-500 shrink-0">
                                {project.icon}
                              </div>

                              <button
                                onClick={() => navigate(`/bmc/result/${project.id}`)}
                                className="
                                  text-sm
                                  font-bold
                                  text-[#071642]
                                  hover:text-blue-600
                                  transition
                                  text-left
                                  truncate
                                  min-w-0
                                "
                                title={project.name}
                              >
                                {project.name}
                              </button>
                            </div>
                          </td>

                          {/* 생성일 */}
                          <td className="px-3 text-xs font-medium text-[#3D4770]">
                            {formatDateTime(project.createdAt)}
                          </td>

                          {/* 타당성 점수 */}
                          <td className="px-3 text-center">
                            <span className="font-bold text-[#071642]">
                              {project.score ?? "-"}
                            </span>
                          </td>

                          {/* 타입 */}
                          <td className="px-3 text-center">
                            <span
                              className={`
                                px-3
                                py-1.5
                                rounded-full
                                text-xs
                                font-bold
                                ${getTypeStyle(project.bmcTypeCode)}
                              `}
                            >
                              {project.bmcType}
                            </span>
                          </td>

                          {/* 작업 */}
                          <td className="px-3">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => handleEdit(project)}
                                className="text-gray-400 hover:text-blue-600 transition"
                                title="수정"
                                aria-label={`${project.name} 수정`}
                              >
                                <Edit3 size={16} />
                              </button>

                              <button
                                onClick={() => navigate(`/bmc/result/${project.id}`)}
                                className="text-gray-400 hover:text-blue-600 transition"
                                title="결과 보기"
                                aria-label={`${project.name} 결과 보기`}
                              >
                                <FileText size={16} />
                              </button>

                              <button
                                onClick={() => handleDelete(project)}
                                className="text-gray-400 hover:text-red-500 transition"
                                title="삭제"
                                aria-label={`${project.name} 삭제`}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {isLoaded && filteredProjects.length === 0 && (
                    <div className="h-[180px] flex items-center justify-center text-sm text-gray-400">
                      {projects.length === 0 ? "아직 프로젝트가 없어요." : "검색 결과가 없어요."}
                    </div>
                  )}
                </div>

                {/* Pagination */}
                <div className={`items-center justify-center gap-2 mt-5 ${totalPages > 1 ? "flex" : "hidden"}`}>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-bold ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </section>

            </div>
          </main>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div
          className="
            fixed
            bottom-8
            left-1/2
            -translate-x-1/2
            z-[9999]
            rounded-full
            bg-[#071642]
            text-white
            px-6
            py-3
            text-sm
            font-bold
            shadow-[0_12px_32px_rgba(15,23,42,0.24)]
            animate-[toastUp_0.25s_ease]
          "
        >
          {toastMessage}
        </div>
      )}

      <style>
        {`
          @keyframes toastUp {
            from {
              opacity: 0;
              transform: translate(-50%, 12px);
            }

            to {
              opacity: 1;
              transform: translate(-50%, 0);
            }
          }
        `}
      </style>
    </MainLayout>
  );
}

export default MyPage;