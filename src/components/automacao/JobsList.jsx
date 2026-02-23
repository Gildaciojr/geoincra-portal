import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext.jsx";

import { listarJobs, downloadResultadoUrl } from "@/services/automacoes";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";

import { AutomationStatusBadge } from "./AutomationStatusBadge.jsx";
import { Download, RefreshCw } from "lucide-react";

/**
 * JobsList
 * - Lista jobs do usuário
 * - EXIGE projeto válido (id)
 * - Atualiza automaticamente jobs em PROCESSING
 */
  export function JobsList({ selectedProject, onFinished }) {
  const { token } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadJobs = async () => {
    if (!token || !selectedProject?.id) {
      setJobs([]);
      return;
    }

    setLoading(true);
    try {
      const data = await listarJobs(token);

      // 🔒 FILTRAGEM SEGURA POR PROJETO
      const filtered = data.filter(
        (j) => j.project_id === selectedProject.id
      );

      setJobs(filtered);
            const stillRunning = filtered.some(
        (j) => j.status === "PENDING" || j.status === "PROCESSING"
      );

      if (!stillRunning && onFinished) {
        onFinished();
      }
    } catch (err) {
      console.error("Erro ao carregar jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 CARGA INICIAL / TROCA DE PROJETO
  useEffect(() => {
    loadJobs();
  }, [selectedProject?.id]);

  // 🔄 POLLING AUTOMÁTICO PARA JOBS EM PROCESSAMENTO
  useEffect(() => {
    const hasProcessing = jobs.some(
      (j) => j.status === "PENDING" || j.status === "PROCESSING"
    );

    if (!hasProcessing) return;

    const interval = setInterval(() => {
      loadJobs();
    }, 5000); // 5s — produção segura

    return () => clearInterval(interval);
  }, [jobs]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Histórico de Automações</CardTitle>

        <Button
          variant="outline"
          size="sm"
          onClick={loadJobs}
          disabled={loading || !selectedProject?.id}
        >
          <RefreshCw
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
          />
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* SEM PROJETO */}
        {!selectedProject?.id && (
          <p className="text-sm text-gray-500">
            Selecione um projeto para visualizar as automações.
          </p>
        )}

        {/* COM PROJETO, SEM JOBS */}
        {selectedProject?.id && jobs.length === 0 && !loading && (
          <p className="text-sm text-gray-500">
            Nenhuma automação encontrada para este projeto.
          </p>
        )}

        {/* LISTAGEM */}
        {jobs.map((job) => (
          <div
            key={job.id}
            className="border rounded-lg p-4 bg-gray-50 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">
                  {job.type === "RI_DIGITAL_MATRICULA"
                    ? "RI Digital — Matrículas"
                    : job.type === "ONR_SIGRI_CONSULTA"
                    ? "ONR / SIG-RI — Consulta Fundiária"
                    : job.type}
                </p>

                <p className="text-xs text-gray-500">
                  Criado em{" "}
                  {new Date(job.created_at).toLocaleString("pt-BR")}
                </p>
              </div>

              <AutomationStatusBadge status={job.status} />
            </div>

            {/* RESULTADOS */}
            {job.resultados && job.resultados.length > 0 && (
              <div className="space-y-2">
                {job.resultados.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between bg-white border rounded p-2"
                  >
                    <div className="text-sm text-gray-700">
                      {r.protocolo && (
                        <span className="mr-2">
                          Protocolo: <strong>{r.protocolo}</strong>
                        </span>
                      )}
                      {r.matricula && (
                        <span>
                          Matrícula: <strong>{r.matricula}</strong>
                        </span>
                      )}
                      {r.metadata_json?.pdf_status === "NAO_DISPONIVEL" && (
                    <div className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-1 mt-1">
                   PDF não disponível no RI Digital (prazo expirado)
                   </div>
                    )}
                    
                    {r.metadata_json?.fonte === "ONR_SIGRI" &&
                  r.metadata_json?.download_disponivel === false && (
                 <div className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-1 mt-1">
                 Polígono não disponível no ONR/SIG-RI
                </div>
               )}
                    </div>

                    <a
                      href={downloadResultadoUrl(r.id)}
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="w-4 h-4" />
                      Baixar
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* ERRO */}
            {job.status === "FAILED" && job.error_message && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                {job.error_message}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
