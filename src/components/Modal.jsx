import { useEffect } from "react";

// 공통 팝업 틀. onClose 를 넘기면 바깥 클릭과 Esc 로 닫힌다.
function Modal({ open, onClose, title, description, children, width = "max-w-md" }) {
  useEffect(() => {
    if (!open || !onClose) return;

    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-gray-900/30 backdrop-blur-[2px] flex items-center justify-center p-5"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${width} rounded-2xl bg-white p-6 shadow-2xl animate-fade-up`}
      >
        {title && <h2 className="text-lg font-bold text-gray-900">{title}</h2>}
        {description && <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{description}</p>}
        <div className={title || description ? "mt-6" : ""}>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
