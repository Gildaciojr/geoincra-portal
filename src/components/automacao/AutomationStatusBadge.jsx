import { Badge } from "@/components/ui/badge";
import { Clock, Loader2, CheckCircle2, XCircle } from "lucide-react";

export function AutomationStatusBadge({ status }) {
  const map = {
    PENDING: { label: "Pendente", color: "bg-gray-200 text-gray-800" },
    PROCESSING: { label: "Processando", color: "bg-blue-100 text-blue-800" },
    COMPLETED: { label: "Concluído", color: "bg-green-100 text-green-800" },
    FAILED: { label: "Erro", color: "bg-red-100 text-red-800" },
  };

  const cfg = map[status] || map.PENDING;

  return (
    <span
      className={`text-xs px-2 py-1 rounded font-semibold ${cfg.color}`}
    >
      {cfg.label}
    </span>
  );
}
