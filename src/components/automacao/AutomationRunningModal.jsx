import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.jsx";
import { Loader2 } from "lucide-react";

export function AutomationRunningModal({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            Consulta em execução
          </DialogTitle>
        </DialogHeader>

        <div className="text-sm text-gray-600 space-y-2">
          <p>O sistema está realizando a consulta automaticamente.</p>
          <p>
            Este processo pode levar alguns instantes.
            Você pode acompanhar o status no histórico abaixo quando finalizado.
          </p>
          <p className="text-xs text-gray-500">
            Você pode fechar este modal a qualquer momento.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}