// geoincra-portal/src/components/BudgetWizard.jsx
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import {
  User,
  MapPin,
  FileText,
  Settings2,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  Calculator,
  CheckCircle2,
  Loader2,
  FileDown,
} from "lucide-react";

// 🧠 Hook correto para municípios
import { useMunicipios } from "../services/municipios.js";
import { useAuth } from "@/context/AuthContext.jsx"; // ✅ AJUSTE 1

const steps = [
  { id: 1, label: "Cliente", icon: User },
  { id: 2, label: "Imóvel", icon: MapPin },
  { id: 3, label: "Características", icon: Settings2 },
  { id: 4, label: "Finalidade", icon: FileText },
  { id: 5, label: "Adicionais", icon: ClipboardCheck },
  { id: 6, label: "Revisão", icon: CheckCircle2 },
];

const initialForm = {
  cliente: "",
  municipio: "",
  municipio_id: null,
  uf: "RO",
  descricao_imovel: "",
  area_ha: "",
  confrontacao_rios: false,
  proprietario_acompanha: false,
  mais_50_mata: false,
  finalidade: "averbacao",
  qtd_partes: "",
  ccir_atualizado: true,
  itr_atualizado: true,
  certificado_digital: true,
  estaqueamento_km: "",
  notificacao_confrontantes: "",
};

export function BudgetWizard({ projectId, onGenerated }) {
  const { token } = useAuth(); // ✅ AJUSTE 2

  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // 🧠 Hook oficial corrigido
  const {
    uf,
    setUf,
    search: municipioBusca,
    setSearch: setMunicipioBusca,
    municipios,
    loading: loadingMunicipios,
  } = useMunicipios("RO");

  const updateField = (field, value) =>
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

  const toggleField = (field) =>
    setForm((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));

  const handleSelectMunicipio = (m) => {
    updateField("municipio", m.nome);
    updateField("municipio_id", m.id ?? null);
    updateField("uf", m.estado ?? "RO");
    setMunicipioBusca(m.nome);
    setErrors((prev) => ({ ...prev, municipio: undefined }));
  };

const validateStep = () => {
  const newErrors = {};

  if (currentStep === 1) {
    if (!form.cliente.trim()) {
      newErrors.cliente = "Informe o nome do cliente";
    }

    if (!form.municipio_id) {
      newErrors.municipio = "Selecione um município da lista";
    }
  }

  if (currentStep === 2) {
    if (!form.descricao_imovel.trim()) {
      newErrors.descricao_imovel = "Descreva o imóvel";
    }

    if (!form.area_ha || Number(form.area_ha) <= 0) {
      newErrors.area_ha = "Informe uma área válida";
    }
  }

  if (currentStep === 4) {
    if (!form.finalidade) {
      newErrors.finalidade = "Selecione a finalidade";
    }

    if (form.finalidade === "desmembramento") {
      if (!form.qtd_partes || Number(form.qtd_partes) < 2) {
        newErrors.qtd_partes = "Mínimo de 2 partes";
      }
    }
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const nextStep = () =>
    validateStep() && setCurrentStep((s) => Math.min(s + 1, steps.length));

  const prevStep = () =>
    setCurrentStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!validateStep()) return;

    // ✅ AJUSTE 3 — bloqueio real
    if (!projectId) {
      setErrors({ submit: "Selecione um projeto antes de gerar a proposta." });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
const payload = {
  cliente: form.cliente,
  municipio: form.municipio,
  descricao_imovel: form.descricao_imovel,

  // 🔒 CAMPO CRÍTICO
  area_hectares: Number(form.area_ha),

  // 🔁 NOMES EXATOS DO BACKEND
  confrontacao_rios: form.confrontacao_rios,
  proprietario_acompanha: form.proprietario_acompanha,
  mata_mais_50: form.mais_50_mata,

  finalidade: form.finalidade,
  partes:
    form.finalidade === "desmembramento"
      ? Number(form.qtd_partes || 0)
      : null,

  ccir_atualizado: form.ccir_atualizado,
  itr_atualizado: form.itr_atualizado,
  certificado_digital: form.certificado_digital,

  estaqueamento_km: Number(form.estaqueamento_km || 0),
  notificacao_confrontantes: Number(form.notificacao_confrontantes || 0),
};


      // ✅ ENDPOINT CORRETO + JWT
      const resp = await fetch(
      `/api/propostas/generate/${projectId}`,
      {
         method: "POST",
         headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  }
);




const data = await resp.json().catch(() => ({}));

if (!resp.ok) {
  const errorMessage = Array.isArray(data.detail)
    ? data.detail[0]?.msg
    : data.detail || data.mensagem || "Erro ao gerar proposta";

  throw new Error(errorMessage);
}



      setResult(data);
      if (onGenerated) onGenerated();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // UI INDICADOR DE PASSO
  // ===============================
  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-6">
      {steps.map((step) => {
        const Icon = step.icon;
        const active = currentStep === step.id;
        const done = currentStep > step.id;

        return (
          <div key={step.id} className="flex-1 flex flex-col items-center">
            <div className="flex items-center w-full">
              <div
                className={`w-9 h-9 rounded-full flex justify-center items-center border-2
                  ${
                    done
                      ? "bg-green-600 border-green-600 text-white"
                      : active
                      ? "bg-white border-green-500 text-green-700"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              {step.id < steps.length && (
                <div
                  className={`flex-1 h-1 mx-2 rounded-full ${
                    done ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
            <span
              className={`mt-2 text-xs ${
                active ? "text-green-700" : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );

  // ===============================
  // RENDERIZAÇÃO POR ETAPA
  // ===============================

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label>Cliente</Label>
              <Input
                value={form.cliente}
                onChange={(e) => updateField("cliente", e.target.value)}
              />
              {errors.cliente && (
                <p className="text-xs text-red-600">{errors.cliente}</p>
              )}
            </div>

            {/* MUNICÍPIOS */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label>Município (base oficial RO)</Label>
                <Badge variant="outline" className="text-[10px]">
                  Multi-estado (futuro)
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[120px,1fr] gap-3">
                <div>
                  <Label className="text-xs text-gray-500">UF</Label>
                  <select
                    className="w-full border rounded px-2 py-2 text-sm"
                    value={uf}
                    onChange={(e) => {
                      setUf(e.target.value);
                      updateField("uf", e.target.value);
                      updateField("municipio", "");
                      updateField("municipio_id", null);
                      setMunicipioBusca("");
                    }}
                  >
                    <option value="RO">RO</option>
                  </select>
                </div>

                <div>
                  <Label className="text-xs text-gray-500">
                    Buscar município
                  </Label>
                  <Input
                    value={municipioBusca}
                    onChange={(e) => {
                      setMunicipioBusca(e.target.value);
                      updateField("municipio", e.target.value);
                      updateField("municipio_id", null);
                    }}
                    placeholder="Digite para buscar (ex: Ji-Paraná)"
                  />
                </div>
              </div>

              {loadingMunicipios && (
                <p className="text-xs text-gray-500 mt-1">
                  Carregando municípios...
                </p>
              )}

              {!loadingMunicipios && municipios.length > 0 && (
                <div className="mt-2 border rounded bg-white max-h-48 overflow-y-auto text-sm">
                  {municipios.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleSelectMunicipio(m)}
                      className={`w-full text-left px-3 py-2 hover:bg-green-50 flex items-center justify-between ${
                        form.municipio === m.nome ? "bg-green-50" : ""
                      }`}
                    >
                      <span>
                        {m.nome}{" "}
                        <span className="text-xs text-gray-500">
                          ({m.estado})
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {errors.municipio && (
                <p className="text-xs text-red-600 mt-1">{errors.municipio}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label>Descrição do Imóvel</Label>
              <Textarea
                value={form.descricao_imovel}
                onChange={(e) =>
                  updateField("descricao_imovel", e.target.value)
                }
              />
              {errors.descricao_imovel && (
                <p className="text-xs text-red-600">
                  {errors.descricao_imovel}
                </p>
              )}
            </div>
            <div>
              <Label>Área (ha)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.area_ha}
                onChange={(e) => updateField("area_ha", e.target.value)}
              />
              {errors.area_ha && (
                <p className="text-xs text-red-600">{errors.area_ha}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                variant={form.confrontacao_rios ? "default" : "outline"}
                className={form.confrontacao_rios ? "bg-green-600" : ""}
                onClick={() => toggleField("confrontacao_rios")}
              >
                Confronta com rios: {form.confrontacao_rios ? "Sim" : "Não"}
              </Button>

              <Button
                variant={form.proprietario_acompanha ? "default" : "outline"}
                className={form.proprietario_acompanha ? "bg-green-600" : ""}
                onClick={() => toggleField("proprietario_acompanha")}
              >
                Proprietário acompanha:{" "}
                {form.proprietario_acompanha ? "Sim" : "Não"}
              </Button>

              <Button
                variant={form.mais_50_mata ? "default" : "outline"}
                className={form.mais_50_mata ? "bg-green-600" : ""}
                onClick={() => toggleField("mais_50_mata")}
              >
                +50% mata: {form.mais_50_mata ? "Sim" : "Não"}
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <Label>Finalidade</Label>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: "averbacao", label: "Averbação" },
                { value: "desmembramento", label: "Desmembramento" },
                { value: "unificacao", label: "Unificação" },
                { value: "terra_legal", label: "Terra Legal" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateField("finalidade", opt.value)}
                  className={`border rounded px-3 py-2 text-sm text-left
                    ${
                      form.finalidade === opt.value
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {errors.finalidade && (
              <p className="text-xs text-red-600">{errors.finalidade}</p>
            )}

            {form.finalidade === "desmembramento" && (
              <div>
                <Label>Número de partes</Label>
                <Input
                  type="number"
                  min={2}
                  value={form.qtd_partes}
                  onChange={(e) => updateField("qtd_partes", e.target.value)}
                />
                {errors.qtd_partes && (
                  <p className="text-xs text-red-600">{errors.qtd_partes}</p>
                )}
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                variant={form.ccir_atualizado ? "default" : "outline"}
                className={form.ccir_atualizado ? "bg-green-600" : ""}
                onClick={() => toggleField("ccir_atualizado")}
              >
                CCIR atualizado: {form.ccir_atualizado ? "Sim" : "Não"}
              </Button>

              <Button
                variant={form.itr_atualizado ? "default" : "outline"}
                className={form.itr_atualizado ? "bg-green-600" : ""}
                onClick={() => toggleField("itr_atualizado")}
              >
                ITR atualizado: {form.itr_atualizado ? "Sim" : "Não"}
              </Button>

              <Button
                variant={form.certificado_digital ? "default" : "outline"}
                className={form.certificado_digital ? "bg-green-600" : ""}
                onClick={() => toggleField("certificado_digital")}
              >
                Certificado digital:{" "}
                {form.certificado_digital ? "Sim" : "Não"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Estaqueamento (km)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={form.estaqueamento_km}
                  onChange={(e) =>
                    updateField("estaqueamento_km", e.target.value)
                  }
                />
              </div>

              <div>
                <Label>Notificação de confrontantes</Label>
                <Input
                  type="number"
                  value={form.notificacao_confrontantes}
                  onChange={(e) =>
                    updateField("notificacao_confrontantes", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4 text-sm">
            <p className="text-gray-600">Revise antes de gerar:</p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold">Cliente</h4>
                <p>Nome: {form.cliente}</p>
                <p>
                  Município: {form.municipio}{" "}
                  {form.uf && (
                    <span className="text-xs text-gray-500">({form.uf})</span>
                  )}
                </p>

                <h4 className="font-semibold mt-4">Imóvel</h4>
                <p>Área: {form.area_ha} ha</p>
                <p>{form.descricao_imovel}</p>
              </div>

              <div>
                <h4 className="font-semibold">Parâmetros</h4>
                <p>
                  Confronta com rios: {form.confrontacao_rios ? "Sim" : "Não"}
                </p>
                <p>
                  Acompanha: {form.proprietario_acompanha ? "Sim" : "Não"}
                </p>
                <p>
                  Mais de 50% mata: {form.mais_50_mata ? "Sim" : "Não"}
                </p>
                <p>Finalidade: {form.finalidade}</p>
                {form.finalidade === "desmembramento" && (
                  <p>Partes: {form.qtd_partes}</p>
                )}
                <p>
                  CCIR atualizado: {form.ccir_atualizado ? "Sim" : "Não"}
                </p>
                <p>ITR atualizado: {form.itr_atualizado ? "Sim" : "Não"}</p>
                <p>
                  Certificado digital:{" "}
                  {form.certificado_digital ? "Sim" : "Não"}
                </p>
                <p>Estaqueamento: {form.estaqueamento_km} km</p>
                <p>Notificações: {form.notificacao_confrontantes}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {!projectId && (
        <Card className="border-red-300 border-2 p-6">
          <p className="text-red-700 font-semibold text-center">
            ⚠ Selecione um projeto antes de gerar uma proposta.
          </p>
        </Card>
      )}

      <Card className="border-teal-200 border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-teal-700">
            <Calculator className="w-5 h-5" />
            Motor de Cálculo e Proposta
          </CardTitle>
          <CardDescription>Wizard de múltiplos passos</CardDescription>
        </CardHeader>

        <CardContent>
          <StepIndicator />

          <div className="p-4 bg-white border rounded">{renderStep()}</div>

          {errors.submit && (
            <p className="mt-4 text-red-600 bg-red-50 border border-red-200 p-2 rounded">
              {errors.submit}
            </p>
          )}

          <div className="flex justify-between mt-4">
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
    <h2 className="text-xl font-semibold text-green-700 mb-4">
      Proposta Gerada com Sucesso
    </h2>

    <div className="grid md:grid-cols-3 gap-4">
      <div className="p-3 bg-green-50 border border-green-200 rounded">
        <p className="text-gray-600">Valor Base</p>
        <p className="text-xl text-green-700 font-bold">
          R$ {result.valor_base?.toFixed(2)}
        </p>
      </div>

      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded">
        <p className="text-gray-600">Extras</p>
        <p className="font-semibold">
          R$ {result.extras?.toFixed(2)}
        </p>
      </div>

      <div className="p-3 bg-teal-50 border border-teal-200 rounded">
        <p className="text-gray-600">Total</p>
        <p className="text-2xl text-teal-700 font-extrabold">
          R$ {result.total?.toFixed(2)}
        </p>
      </div>
    </div>

    <div className="flex gap-4 mt-4">
      {result.pdf_path && (
        <a
          href={result.pdf_path}
          target="_blank"
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Baixar Proposta PDF
        </a>
      )}

      {result.contract_pdf_path && (
        <a
          href={result.contract_pdf_path}
          target="_blank"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Baixar Contrato PDF
        </a>
      )}
    </div>
  </Card>
)}

  </div>
  );
}

