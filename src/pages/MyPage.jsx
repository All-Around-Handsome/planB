import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Edit3,
  FileText,
  Heart,
  Plus,
  Search,
  Settings,
  Sparkles,
  Trash2,
  User,
  X,
} from "lucide-react";

import MainLayout from "../layouts/MainLayout";

function MyPage() {
  const navigate = useNavigate();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [filter, setFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState("");
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  const user = {
    name: "가이드님",
    email: "guide@example.com",
    joinedAt: "2024.05.20 14:30",
  };

  const stats = [
    {
      icon: <FileText size={22} />,
      title: "전체 프로젝트",
      value: 12,
      unit: "개",
      change: "+3",
      desc: "지난 7일",
    },
    {
      icon: <FileText size={22} />,
      title: "분석 완료 프로젝트",
      value: 9,
      unit: "개",
      change: "+2",
      desc: "지난 7일",
    },
    {
      icon: <FileText size={22} />,
      title: "저장된 BMC",
      value: 12,
      unit: "개",
      change: null,
      desc: "",
    },
    {
      icon: <Heart size={22} />,
      title: "스크랩 서비스",
      value: 15,
      unit: "개",
      change: null,
      desc: "",
    },
  ];

  const projects = [
    {
      id: 1,
      icon: <FileText size={18} />,
      name: "AI 기반 맞춤형 헬스케어 플랫폼",
      createdAt: "2024.05.20 14:30",
      updatedAt: "2024.05.20 14:30",
      status: "분석 완료",
      statusType: "complete",
    },
    {
      id: 2,
      icon: <Sparkles size={18} />,
      name: "마케팅 자동화 서비스",
      createdAt: "2024.05.20 11:20",
      updatedAt: "2024.05.20 11:20",
      status: "분석 완료",
      statusType: "complete",
    },
    {
      id: 3,
      icon: <BarChart3 size={18} />,
      name: "스마트 물류 관리 솔루션",
      createdAt: "2024.05.19 18:45",
      updatedAt: "2024.05.19 18:45",
      status: "분석 중",
      statusType: "progress",
    },
    {
      id: 4,
      icon: <Heart size={18} />,
      name: "시니어 케어 매칭 서비스",
      createdAt: "2024.05.18 09:10",
      updatedAt: "2024.05.18 09:10",
      status: "임시 저장",
      statusType: "draft",
    },
    {
      id: 5,
      icon: <FileText size={18} />,
      name: "스마트 대중교통 플랫폼",
      createdAt: "2024.05.17 13:50",
      updatedAt: "2024.05.17 13:50",
      status: "임시 저장",
      statusType: "draft",
    },
  ];

  const recentActivities = [
    {
      title: "AI 기반 맞춤형 헬스케어...",
      time: "10분 전",
    },
    {
      title: "마케팅 자동화 서비스",
      time: "1시간 전",
    },
    {
      title: "스마트 물류 관리 솔루션",
      time: "3시간 전",
    },
  ];

  const favoriteBmcs = [
    "AI 기반 맞춤형 헬스케어 플랫폼",
    "스마트 물류 관리 솔루션",
  ];

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesKeyword = project.name
        .toLowerCase()
        .includes(searchKeyword.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "complete" && project.statusType === "complete") ||
        (filter === "progress" && project.statusType === "progress") ||
        (filter === "draft" && project.statusType === "draft");

      return matchesKeyword && matchesFilter;
    });
  }, [searchKeyword, filter]);

  const showToast = (message) => {
    setToastMessage(message);

    setTimeout(() => {
      setToastMessage("");
    }, 2000);
  };

  const getStatusStyle = (type) => {
    if (type === "complete") {
      return "bg-emerald-50 text-emerald-600";
    }

    if (type === "progress") {
      return "bg-blue-50 text-blue-600";
    }

    return "bg-gray-100 text-gray-500";
  };

  const handleCopy = (project) => {
    navigator.clipboard.writeText(project.name);
    showToast("프로젝트명이 복사되었습니다.");
  };

  const handleDelete = (project) => {
    showToast(`${project.name} 프로젝트가 삭제되었습니다.`);
  };

  const handleEdit = (project) => {
    localStorage.setItem("editing_project_id", project.id);
    showToast(`${project.name} 프로젝트를 불러옵니다.`);

    setTimeout(() => {
      navigate("/idea");
    }, 500);
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
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-[0_10px_24px_rgba(37,99,235,0.25)]">
                  G
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-extrabold text-gray-900">
                      {user.name}
                    </h2>

                    <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-bold">
                      Pro 플랜
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mb-1">{user.email}</p>
                  <p className="text-xs text-gray-400">
                    마지막 로그인&nbsp;&nbsp; {user.joinedAt}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsSettingOpen(true)}
                className="
                  h-11
                  px-5
                  rounded-xl
                  border
                  border-gray-200
                  text-gray-600
                  text-sm
                  font-bold
                  flex
                  items-center
                  gap-2
                  hover:border-blue-200
                  hover:bg-blue-50
                  hover:text-blue-600
                  transition
                "
              >
                <Settings size={17} />
                계정 설정
              </button>
            </section>

            {/* Stat Cards */}
            <section className="grid grid-cols-4 gap-5 mb-7">
              {stats.map((item) => (
                <div
                  key={item.title}
                  className="
                    h-[160px]
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    px-6
                    py-6
                    shadow-sm
                  "
                >
                  <div className="flex items-center gap-2 text-blue-500 mb-7">
                    {item.icon}
                    <span className="text-sm font-bold text-gray-500">
                      {item.title}
                    </span>
                  </div>

                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-extrabold text-[#071642]">
                      {item.value}
                    </span>
                    <span className="text-lg font-bold text-gray-500 mb-1">
                      {item.unit}
                    </span>
                  </div>

                  {item.change && (
                    <p className="text-xs text-gray-400 mt-3">
                      <span className="text-emerald-500 font-bold">
                        {item.change}
                      </span>{" "}
                      {item.desc}
                    </p>
                  )}
                </div>
              ))}
            </section>

            <div className="grid grid-cols-[1fr_260px] gap-6">
              {/* Project Area */}
              <section>
                <div className="border-b border-gray-200 mb-5">
                  <div className="h-11 inline-flex items-center px-2 border-b-2 border-blue-500">
                    <span className="text-sm font-bold text-blue-600">
                      내 프로젝트
                    </span>
                  </div>
                </div>
                
                {/* Search / Filter / New Button */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-[210px] h-10 rounded-xl border border-gray-200 bg-white px-3 flex items-center gap-2">
                      <Search size={16} className="text-gray-300" />

                      <input
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder="프로젝트명 검색"
                        className="w-full outline-none text-sm text-gray-700 placeholder:text-gray-300"
                      />
                    </div>

                    <div className="relative">
                      <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
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
                        <option value="all">전체 상태</option>
                        <option value="complete">분석 완료</option>
                        <option value="progress">분석 중</option>
                        <option value="draft">임시 저장</option>
                      </select>

                      <ChevronDown
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/idea")}
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
                    새 프로젝트 만들기
                  </button>
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                  <table className="w-full">
                    <thead>
                      <tr className="h-12 bg-[#F8FAFF] border-b border-gray-100 text-xs text-gray-500">
                        <th className="text-left px-5 font-bold">프로젝트명</th>
                        <th className="text-left px-3 font-bold">생성일</th>
                        <th className="text-left px-3 font-bold">최종 수정일</th>
                        <th className="text-left px-3 font-bold">상태</th>
                        <th className="text-center px-3 font-bold">작업</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredProjects.map((project) => (
                        <tr
                          key={project.id}
                          className="h-[58px] border-b border-gray-100 last:border-b-0 hover:bg-blue-50/30 transition"
                        >
                          <td className="px-5">
                            <div className="flex items-center gap-3">
                              <div className="text-blue-500">{project.icon}</div>

                              <button
                                onClick={() => handleEdit(project)}
                                className="text-sm font-bold text-[#071642] hover:text-blue-600 transition text-left"
                              >
                                {project.name}
                              </button>
                            </div>
                          </td>

                          <td className="px-3 text-xs font-medium text-[#3D4770]">
                            {project.createdAt}
                          </td>

                          <td className="px-3 text-xs font-medium text-[#3D4770]">
                            {project.updatedAt}
                          </td>

                          <td className="px-3">
                            <span
                              className={`
                                px-3
                                py-1.5
                                rounded-full
                                text-xs
                                font-bold
                                ${getStatusStyle(project.statusType)}
                              `}
                            >
                              {project.status}
                            </span>
                          </td>

                          <td className="px-3">
                            <div className="flex items-center justify-center gap-3 text-gray-400">
                              <button
                                onClick={() => handleEdit(project)}
                                className="hover:text-blue-600 transition"
                                title="편집"
                              >
                                <Edit3 size={16} />
                              </button>

                              <button
                                onClick={() => handleCopy(project)}
                                className="hover:text-blue-600 transition"
                                title="복사"
                              >
                                <Copy size={16} />
                              </button>

                              <button
                                onClick={() => handleDelete(project)}
                                className="hover:text-red-500 transition"
                                title="삭제"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredProjects.length === 0 && (
                    <div className="h-[180px] flex items-center justify-center text-sm text-gray-400">
                      검색 결과가 없습니다.
                    </div>
                  )}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2 mt-5">
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100">
                    <ChevronLeft size={16} />
                  </button>

                  <button className="w-8 h-8 rounded-lg bg-blue-600 text-white text-sm font-bold">
                    1
                  </button>

                  <button className="w-8 h-8 rounded-lg text-gray-500 text-sm font-bold hover:bg-gray-100">
                    2
                  </button>

                  <button className="w-8 h-8 rounded-lg text-gray-500 text-sm font-bold hover:bg-gray-100">
                    3
                  </button>

                  <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </section>

              {/* Right Cards */}
              <aside className="flex flex-col gap-5">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-extrabold text-gray-900">
                      최근 활동
                    </h3>

                    <button className="text-xs text-gray-400 font-bold hover:text-blue-600 transition">
                      더보기
                    </button>
                  </div>

                  <div className="flex flex-col gap-4">
                    {recentActivities.map((item) => (
                      <div
                        key={item.title}
                        className="flex items-center gap-3"
                      >
                        <FileText size={16} className="text-blue-500 shrink-0" />

                        <p className="flex-1 text-xs font-medium text-[#3D4770] truncate">
                          {item.title}
                        </p>

                        <span className="text-[11px] text-gray-400 shrink-0">
                          {item.time}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    className="
                      w-full
                      h-10
                      mt-5
                      rounded-xl
                      border
                      border-blue-100
                      text-blue-600
                      text-sm
                      font-bold
                      hover:bg-blue-50
                      transition
                    "
                  >
                    전체 활동 보기
                  </button>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-extrabold text-gray-900">
                      즐겨찾기 BMC
                    </h3>

                    <button className="text-xs text-gray-400 font-bold hover:text-blue-600 transition">
                      더보기
                    </button>
                  </div>

                  <div className="flex flex-col gap-4">
                    {favoriteBmcs.map((item) => (
                      <button
                        key={item}
                        onClick={() => navigate("/bmc/result")}
                        className="flex items-center gap-3 text-left group"
                      >
                        <Heart
                          size={16}
                          className="text-gray-400 shrink-0 group-hover:text-blue-500"
                        />

                        <p className="text-xs font-medium text-[#3D4770] group-hover:text-blue-600 transition truncate">
                          {item}
                        </p>
                      </button>
                    ))}
                  </div>

                  <button
                    className="
                      w-full
                      h-10
                      mt-5
                      rounded-xl
                      border
                      border-blue-100
                      text-blue-600
                      text-sm
                      font-bold
                      hover:bg-blue-50
                      transition
                    "
                  >
                    전체 즐겨찾기 보기
                  </button>
                </div>
              </aside>
            </div>
          </main>
        </div>
      </div>

      {/* Setting Modal */}
      {isSettingOpen && (
        <div className="fixed inset-0 z-[9998] bg-black/30 flex items-center justify-center">
          <div className="w-[460px] rounded-3xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.2)] p-7">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-extrabold text-gray-900">
                계정 설정
              </h3>

              <button
                onClick={() => setIsSettingOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <User size={22} />
                </div>

                <div>
                  <p className="font-bold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Bell size={18} className="text-blue-500" />
                  <h4 className="font-bold text-gray-900">알림 설정</h4>
                </div>

                <p className="text-sm text-gray-500 leading-6">
                  프로젝트 분석 완료, BMC 저장 알림 등의 설정 영역입니다.
                  실제 설정 저장은 백엔드 연동 후 연결하면 됩니다.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarDays size={18} className="text-blue-500" />
                  <h4 className="font-bold text-gray-900">가입 정보</h4>
                </div>

                <p className="text-sm text-gray-500">
                  가입일: {user.joinedAt}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsSettingOpen(false);
                showToast("계정 설정이 저장되었습니다.");
              }}
              className="
                w-full
                h-12
                mt-6
                rounded-xl
                bg-blue-600
                text-white
                font-bold
                hover:bg-blue-700
                active:scale-[0.98]
                transition
              "
            >
              저장하기
            </button>
          </div>
        </div>
      )}

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