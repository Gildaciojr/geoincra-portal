import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext.jsx";

import { listarJobs } from "@/services/automacoes";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";

import { AutomationStatusBadge } from "./AutomationStatusBadge.jsx";
import { OnrResultadoCard } from "./OnrResultadoCard.jsx";

import { Download, RefreshCw } from "lucide-react";

/**
 * JobsList
 * - Lista jobs do usuário
 * - Exige projeto válido
 * - Polling automático enquanto houver job rodando
 * - Fecha modal automaticamente quando o job atual finaliza
 * - Exibe resultados ONR / SIG-RI de forma profissional
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

      // 🔒 filtra somente jobs do projeto atual
      const filtered = data.filter(
        (j) => j.project_id === selectedProject.id
      );

      setJobs(filtered);

      // 🔥 FECHAMENTO AUTOMÁTICO DO MODAL
      // considera sempre o job mais recente
      const lastJob = filtered[0];

      if (
        lastJob &&
        (lastJob.status === "COMPLETED" || lastJob.status === "FAILED")
      ) {
        onFinished?.();
      }
    } catch (err) {
      console.error("Erro ao carregar jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // carga inicial / troca de projeto
  useEffect(() => {
    loadJobs();
  }, [selectedProject?.id]);

  // polling automático somente se houver job em execução
  useEffect(() => {
    const hasProcessing = jobs.some(
      (j) => j.status === "PENDING" || j.status === "PROCESSING"
    );

    if (!hasProcessing) return;

    const interval = setInterval(loadJobs, 5000);
    return () => clearInterval(interval);
  }, [jobs]);

  // 🔐 DOWNLOAD AUTENTICADO
  const handleDownload = async (resultId) => {
    try {
      const res = await fetch(
        `/api/automacoes/results/${resultId}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail || "Erro ao baixar arquivo");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "resultado";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert(e.message);
    }
  };

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
        {!selectedProject?.id && (
          <p className="text-sm text-gray-500">
            Selecione um projeto para visualizar as automações.
          </p>
        )}

        {selectedProject?.id && jobs.length === 0 && !loading && (
          <p className="text-sm text-gray-500">
            Nenhuma automação encontrada para este projeto.
          </p>
        )}

        {jobs.map((job) => (
          <div
            key={job.id}
            className="border rounded-lg p-4 bg-gray-50 space-y-3"
          >
            {/* CABEÇALHO DO JOB */}
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
            {job.resultados?.length > 0 && (
              <div className="space-y-3">
                {job.resultados.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white border rounded-lg p-3 space-y-2"
                  >
                    {/* INFO BÁSICA */}
                    <div className="text-sm text-gray-700">
                      {r.protocolo && (
                        <div>
                          Protocolo:{" "}
                          <strong>{r.protocolo}</strong>
                        </div>
                      )}

                      {r.matricula && (
                        <div>
                          Matrícula:{" "}
                          <strong>{r.matricula}</strong>
                        </div>
                      )}
                    </div>

                    {/* ALERTAS */}
                    {r.metadata_json?.pdf_status === "NAO_DISPONIVEL" && (
                      <div className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded px-2 py-1">
                        PDF não disponível no RI Digital (prazo expirado)
                      </div>
                    )}

                    {r.metadata_json?.fonte === "ONR_SIGRI" &&
                      r.metadata_json?.download_disponivel === false && (
                        <div className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded px-2 py-1">
                          Polígono não disponível no ONR / SIG-RI
                        </div>
                      )}

                    {/* 🔥 DADOS DO IMÓVEL — ONR */}
                    {r.metadata_json?.fonte === "ONR_SIGRI" && (
                      <OnrResultadoCard
                        imovel={r.metadata_json.imovel}
                      />
                    )}

                    {/* DOWNLOAD */}
                    {r.file_path &&
                    r.metadata_json?.pdf_status === "OK" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(r.id)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Baixar arquivo
                      </Button>
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        Arquivo não disponível
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ERRO DO JOB */}
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