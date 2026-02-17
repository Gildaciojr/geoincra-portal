import { Badge } from "@/components/ui/badge";
import { Clock, Loader2, CheckCircle2, XCircle } from "lucide-react";

export function AutomationStatusBadge({ status }) {
  switch (status) {
    case "PENDING":
      return (
        <Badge variant="outline" className="text-gray-600 border-gray-300">
          <Clock className="w-3 h-3" /> Pendente
        </Badge>
      );
    case "PROCESSING":
      return (
        <Badge className="bg-yellow-500 text-white">
          <Loader2 className="w-3 h-3 animate-spin" /> Processando
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge className="bg-green-600 text-white">
          <CheckCircle2 className="w-3 h-3" /> Concluído
        </Badge>
      );
    case "FAILED":
      return (
        <Badge variant="destructive">
          <XCircle className="w-3 h-3" /> Erro
        </Badge>
      );
    default:
      return null;
  }
}
