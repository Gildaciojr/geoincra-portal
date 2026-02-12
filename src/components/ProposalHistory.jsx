// src/components/ProposalHistory.jsx
"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext.jsx"; // ✅ JWT

export function ProposalHistory({ projectId }) {
  const { token } = useAuth(); // ✅ JWT
  const [loading, setLoading] = useState(false);
  const [proposals, setProposals] = useState([]);

  const loadHistory = async () => {
    if (!projectId) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/propostas/history/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setProposals([]);
        return;
      }

      const data = await res.json();
      setProposals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar histórico de propostas:", error);
      setProposals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [projectId]);

  return (
    <Card className="p-6 border-2 border-teal-300 shadow-sm">
      <h2 className="text-xl font-semibold text-teal-700 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Histórico de Propostas
      </h2>

      {loading && <p className="text-gray-600">Carregando...</p>}

      {!loading && proposals.length === 0 && (
        <p className="text-gray-500">Nenhuma proposta gerada ainda.</p>
      )}

      {!loading && proposals.length > 0 && (
        <div className="space-y-4">
          {proposals.map((p) => (
            <Card
              key={p.id}
              className="p-4 border border-gray-200 hover:border-teal-400 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Proposta #{p.id}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Área: {p.area} ha — Total:{" "}
                    <span className="font-semibold text-teal-700">
                      R$ {Number(p.total).toFixed(2)}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Criada em: {new Date(p.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  {p.pdf_url && (
                    <a
                      href={p.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Proposta PDF
                    </a>
                  )}

                  {p.contract_url && (
                    <a
                      href={p.contract_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Contrato PDF
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
}
