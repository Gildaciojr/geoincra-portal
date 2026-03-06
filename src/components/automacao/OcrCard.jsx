"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select.jsx";

import { FileSearch } from "lucide-react";

import { useAuth } from "@/context/AuthContext.jsx";
import { iniciarOcr } from "@/services/ocr.js";

export function OcrCard({ document, open, onOpenChange }) {
  const { token } = useAuth();

  const [prompts, setPrompts] = useState([]);
  const [promptId, setPromptId] = useState("");
  const [promptText, setPromptText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    async function loadPrompts() {
      const res = await fetch("/api/ocr/prompts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setPrompts(data);
    }

    loadPrompts();
  }, [open, token]);

  const handlePromptChange = (id) => {
    setPromptId(id);

    const p = prompts.find((x) => String(x.id) === String(id));
    if (p) setPromptText(p.prompt);
  };

  const handleRunOcr = async () => {
    if (!document) return;

    setLoading(true);

    try {
      await iniciarOcr(token, {
        document_id: document.id,
        provider: "GOOGLE",
        prompt_id: promptId,
        prompt_text: promptText,
      });

      alert("OCR iniciado com sucesso.");
      onOpenChange(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!document) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-purple-600" />
            OCR / Extração de Dados
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">

          <div>
            <p className="text-gray-500 text-xs">Documento</p>
            <p className="font-semibold">
              {document.original_filename || document.stored_filename}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-xs mb-1">Modelo de extração</p>

            <Select onValueChange={handlePromptChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um modelo" />
              </SelectTrigger>

              <SelectContent>
                {prompts.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-gray-500 text-xs mb-1">Prompt de análise</p>

            <Textarea
              rows={8}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleRunOcr}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? "Executando..." : "Executar OCR"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}