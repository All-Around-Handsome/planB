import { ChevronRight, PenLine, Sparkles } from "lucide-react";
import Modal from "./Modal";

const CHOICES = [
  {
    key: "ai",
    icon: Sparkles,
    title: "AI로 생성",
    description: "아이디어를 바탕으로 9개 블록을 자동으로 채워요.",
  },
  {
    key: "write",
    icon: PenLine,
    title: "직접 작성",
    description: "BMC를 직접 쓰고 AI 분석을 받아요.",
  },
];

function BMCSelectModal({ open, onClose, onAI, onWrite }) {
  const handlers = { ai: onAI, write: onWrite };

  return (
    <Modal open={open} onClose={onClose} title="BMC를 어떻게 작성할까요?">
      <div className="flex flex-col gap-2">
        {CHOICES.map(({ key, icon: Icon, title, description }) => (
          <button
            key={key}
            onClick={handlers[key]}
            className="group w-full rounded-xl border border-gray-200 p-4 flex items-center gap-4 text-left hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <span className="w-10 h-10 shrink-0 rounded-lg bg-accent-soft text-accent flex items-center justify-center">
              <Icon size={18} />
            </span>
            <span className="flex-1">
              <span className="block font-semibold text-gray-900">{title}</span>
              <span className="block mt-0.5 text-sm text-gray-500">{description}</span>
            </span>
            <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-500" />
          </button>
        ))}
      </div>

      <button
        onClick={onClose}
        className="mt-4 w-full h-10 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100"
      >
        취소
      </button>
    </Modal>
  );
}

export default BMCSelectModal;
