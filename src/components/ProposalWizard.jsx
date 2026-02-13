"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileDown,
  CheckCircle2,
  FileText,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext.jsx";

const steps = [
  { id: 1, label: "Revisão", icon: FileText },
  { id: 2, label: "Confirmação", icon: CheckCircle2 },
];

export function ProposalWizard({ projectId, payloadBase, onGenerated }) {
  const { token } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);

  const nextStep = () =>
    setCurrentStep((s) => Math.min(s + 1, steps.length));

  const prevStep = () =>
    setCurrentStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!projectId) {
      setErrors({ submit: "Projeto não selecionado." });
      return;
    }

    if (!payloadBase) {
      setErrors({ submit: "Dados da proposta não encontrados." });
      return;
    }

    setLoading(true);
    setErrors({});
    setResult(null);

    try {
      const resp = await fetch(
        `/api/propostas/generate/${projectId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payloadBase),
        }
      );

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.detail || "Erro ao gerar proposta");
      }

      setResult(data);
      onGenerated?.();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-6">
      {steps.map((step) => {
        const Icon = step.icon;
        const active = currentStep === step.id;
        const done = currentStep > step.id;

        return (
          <div key={step.id} className="flex-1 flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center border-2 ${
                done
                  ? "bg-green-600 text-white border-green-600"
                  : active
                  ? "border-green-600 text-green-700"
                  : "border-gray-300 text-gray-400"
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <span className="mt-2 text-xs">{step.label}</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="border-teal-200 border-2">
        <CardHeader>
          <CardTitle className="text-teal-700">
            Proposta e Contrato
          </CardTitle>
          <CardDescription>
            Confirme os dados e gere os documentos oficiais
          </CardDescription>
        </CardHeader>

        <CardContent>
          <StepIndicator />

          {currentStep === 1 && (
            <div className="text-sm text-gray-700 space-y-2">
              <p>
                <strong>Atenção:</strong> ao gerar a proposta, os valores
                calculados no orçamento serão formalizados.
              </p>
              <p>
                Após esta etapa, o contrato poderá ser aceito e o fluxo de
                pagamento será liberado.
              </p>
            </div>
          )}

          {currentStep === 2 && (
            <div className="text-sm text-gray-700">
              <p>
                Confirme para gerar a proposta e o contrato em PDF.
              </p>
            </div>
          )}

          {errors.submit && (
            <p className="text-red-600 mt-3">{errors.submit}</p>
          )}

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1 || loading}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Voltar
            </Button>

            {currentStep < steps.length ? (
              <Button onClick={nextStep} disabled={loading}>
                Avançar
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                className="bg-teal-600 hover:bg-teal-700"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4 mr-2" />
                    Gerar Proposta e Contrato
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-green-300 border-2 p-6">
          <h2 className="text-green-700 font-semibold mb-4">
            Proposta gerada com sucesso
          </h2>

          <div className="flex gap-4">
            {result.pdf_url && (
              <a
                href={result.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Proposta PDF
              </a>
            )}

            {result.contract_url && (
              <a
                href={result.contract_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-purple-600 text-white rounded"
              >
                Contrato PDF
              </a>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
