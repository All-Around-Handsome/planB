import { Loader2 } from "lucide-react";

function AILoading({ title }) {
  return (
    <div className="flex flex-col items-center gap-4" role="status">
      <Loader2 size={40} className="text-blue-600 animate-spin" />
      <p className="text-lg font-bold text-gray-900">{title}</p>
    </div>
  );
}

export default AILoading;
