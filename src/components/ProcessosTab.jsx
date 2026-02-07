"use client";

import { useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { ScrollArea } from "@/components/ui/scroll-area.jsx";
import { UploadMatricula } from "./UploadMatricula.jsx";
import {
  FileText,
  FileDown,
  RefreshCw,
  ClipboardList,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

export function ProcessosTab({ selectedProject, documents, onRefresh }) {
  const hasDocuments = useMemo(
    () => Array.isArray(documents) && documents.length > 0,
    [documents]
  );

  if (!selectedProject) {
    return (
      <Card className="border-2 border-amber-200 bg-amber-50/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <AlertCircle className="w-5 h-5" />
            Nenhum projeto selecionado
          </CardTitle>
          <CardDescription>
            Selecione um projeto para visualizar documentos e enviar matrícula.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr,1.3fr] gap-6">
      {/* COLUNA ESQUERDA – DOCUMENTOS DO PROJETO */}
      <Card className="border-2 border-sky-200">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-sky-800">
              <ClipboardList className="w-5 h-5" />
              Documentos do Projeto
            </CardTitle>
            <CardDescription>
              Todos os documentos enviados e vinculados ao projeto.
            </CardDescription>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className="border-sky-300 text-sky-700">
              Projeto #{selectedProject.id}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-sky-700 border-sky-300"
              onClick={onRefresh}
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {!hasDocuments ? (
            <div className="rounded-lg border border-dashed border-sky-200 bg-sky-50/60 p-6 text-center text-sm text-sky-700">
              Nenhum documento foi enviado ainda.
            </div>
          ) : (
            <ScrollArea className="max-h-[420px] rounded-md border border-sky-100 bg-white">
              <div className="divide-y">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-start justify-between gap-3 px-4 py-3 hover:bg-sky-50/60 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <FileText className="w-5 h-5 text-sky-600" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-gray-900">
                            {doc.original_filename || doc.stored_filename}
                          </span>
                          {doc.doc_type && (
                            <Badge
                              variant="outline"
                              className="text-[10px] uppercase tracking-wide border-sky-300 text-sky-700"
                            >
                              {doc.doc_type}
                            </Badge>
                          )}
                        </div>

                        {doc.description && (
                          <p className="text-xs text-gray-600 mb-1">
                            {doc.description}
                          </p>
                        )}

                        {doc.uploaded_at && (
                          <p className="text-[11px] text-gray-400 mt-1">
                            Enviado em{" "}
                            {new Date(doc.uploaded_at).toLocaleString("pt-BR")}
                          </p>
                        )}
                      </div>
                    </div>

                    {doc.stored_filename && (
                      <a
                        href={doc.download_url || doc.stored_filename}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-sky-300 text-sky-700 hover:bg-sky-50"
                      >
                        <FileDown className="w-3 h-3" />
                        Abrir
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* COLUNA DIREITA – UPLOAD DE MATRÍCULA */}
      <Card className="border-2 border-emerald-200 bg-emerald-50/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            Envio de Matrícula
          </CardTitle>
          <CardDescription>
            Envie a matrícula (PDF ou imagem). Em breve: OCR automático.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <UploadMatricula
            projectId={selectedProject.id}
            onUploaded={onRefresh}
          />

          <div className="rounded-md border border-emerald-200 bg-white/80 px-3 py-2 text-xs text-emerald-800">
            <p className="font-semibold mb-1">Boas práticas:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Envie PDFs nítidos ou imagens legíveis.</li>
              <li>Evite fotos com reflexo ou baixa resolução.</li>
              <li>
                No futuro, o OCR extrairá automaticamente nome, matrícula, área,
                confrontantes e mais.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
