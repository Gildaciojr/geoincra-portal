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
import { UploadDocumento } from "./UploadDocumento.jsx";
import { useAuth } from "@/context/AuthContext.jsx";

import {
  FileText,
  FileDown,
  RefreshCw,
  ClipboardList,
  AlertCircle,
} from "lucide-react";

import {
  downloadDocument,
  // deleteDocument, // 🔥 pronto se quiser habilitar
} from "@/services/documents.js";

export function ProcessosTab({ selectedProject, documents, onRefresh }) {
  const { token } = useAuth();

  const hasDocuments = useMemo(
    () => Array.isArray(documents) && documents.length > 0,
    [documents]
  );

  const handleDownload = async (doc) => {
    try {
      const blob = await downloadDocument(token, doc.id);

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        doc.original_filename ||
        doc.stored_filename ||
        `documento_${doc.id}`;

      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    }
  };

  /*
  const handleDelete = async (doc) => {
    if (!confirm("Deseja realmente remover este documento?")) return;
    try {
      await deleteDocument(token, doc.id);
      onRefresh();
    } catch (err) {
      alert(err.message);
    }
  };
  */

  if (!selectedProject) {
    return (
      <Card className="border-2 border-amber-200 bg-amber-50/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <AlertCircle className="w-5 h-5" />
            Nenhum projeto selecionado
          </CardTitle>
          <CardDescription>
            Selecione um projeto para visualizar documentos e enviar arquivos.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr,1.3fr] gap-6">
      {/* DOCUMENTOS */}
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
                      <FileText className="w-5 h-5 text-sky-600 mt-1" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">
                            {doc.original_filename || doc.stored_filename}
                          </span>
                          {doc.doc_type && (
                            <Badge
                              variant="outline"
                              className="text-[10px] border-sky-300 text-sky-700"
                            >
                              {doc.doc_type}
                            </Badge>
                          )}
                        </div>

                        {doc.uploaded_at && (
                          <p className="text-[11px] text-gray-400">
                            Enviado em{" "}
                            {new Date(doc.uploaded_at).toLocaleString("pt-BR")}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-sky-700 border-sky-300"
                        onClick={() => handleDownload(doc)}
                      >
                        <FileDown className="w-3 h-3 mr-1" />
                        Baixar
                      </Button>

                      {/*
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(doc)}
                      >
                        Remover
                      </Button>
                      */}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* UPLOAD */}
      <Card className="border-2 border-emerald-200 bg-emerald-50/60">
        <CardHeader>
          <CardTitle className="text-emerald-800">
            Upload de Documentos
          </CardTitle>
          <CardDescription>
            Envie documentos vinculados ao projeto selecionado.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <UploadDocumento
            projectId={selectedProject.id}
            onUploaded={onRefresh}
          />
        </CardContent>
      </Card>
    </div>
  );
}
