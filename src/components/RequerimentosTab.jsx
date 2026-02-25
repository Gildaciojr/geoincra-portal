"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Label } from "@/components/ui/label.jsx";
import {
  Plus,
  Trash2,
  FileDown,
  Save,
  RefreshCw,
  AlertCircle,
  FileText,
  Pencil,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext.jsx";
import {
  listTemplates,
  downloadTemplate,
  getRequerimento,
  upsertRequerimento,
  upsertUserRequerimento,
  generateRequerimentoDocx,
} from "@/services/requerimentos.js";

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function safeFileName(name) {
  return (name || "arquivo")
    .toString()
    .trim()
    .replace(/[^\w\d\-_.]+/g, "_")
    .slice(0, 120);
}

// Sugestão de tipo padrão a partir do template (você pode ajustar regra)
function suggestTipoFromTemplate(t) {
  const base = `${t?.categoria || "DOC"}_${t?.id || ""}_${t?.nome || ""}`;
  return base
    .toUpperCase()
    .replace(/[^\w\d]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);
}

export function RequerimentosTab({ selectedProject }) {
  const { token } = useAuth();

  // ===============================
  // Templates (catálogo global)
  // ===============================
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("");

  const loadTemplates = useCallback(async () => {
    if (!token) return;
    setLoadingTemplates(true);
    setError("");
    try {
      const data = await listTemplates(token, categoria || undefined);
      setTemplates(Array.isArray(data) ? data : []);
    } catch (err) {
      setTemplates([]);
      setError(err?.message || "Erro ao carregar templates");
    } finally {
      setLoadingTemplates(false);
    }
  }, [token, categoria]);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const templatesFiltrados = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return templates;
    return templates.filter((t) => {
      const hay = `${t.nome || ""} ${t.descricao || ""} ${t.categoria || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [templates, search]);

  // ===============================
  // Editor (vincula em projeto)
  // ===============================
  const [templateId, setTemplateId] = useState(null);
  const templateSelecionado = useMemo(
    () => templates.find((t) => t.id === Number(templateId)) || null,
    [templates, templateId]
  );

  const [tipo, setTipo] = useState("");
  const [status, setStatus] = useState("RASCUNHO");
  const [pairs, setPairs] = useState([{ key: "", value: "" }]);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const addPair = () => setPairs((p) => [...p, { key: "", value: "" }]);
  const removePair = (idx) => setPairs((p) => p.filter((_, i) => i !== idx));
  const updatePair = (idx, field, value) =>
    setPairs((p) => p.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));

  const buildJson = () => {
    const obj = {};
    pairs.forEach((p) => {
      const k = (p.key || "").trim();
      if (!k) return;
      obj[k] = p.value;
    });
    return obj;
  };

  const loadExisting = useCallback(async () => {
    setError("");
    if (!selectedProject?.id || !tipo.trim()) return;

    try {
      const existing = await getRequerimento(token, selectedProject.id, tipo.trim());
      if (!existing) return;

      setStatus(existing.status || "RASCUNHO");
      setTemplateId(existing.template_id || templateId);

      const obj = existing.dados_json || {};
      const arr = Object.entries(obj).map(([k, v]) => ({
        key: k,
        value: String(v ?? ""),
      }));
      setPairs(arr.length ? arr : [{ key: "", value: "" }]);
    } catch {
      // silencioso
    }
  }, [selectedProject?.id, tipo, token, templateId]);

  // Se trocar projeto, mantém biblioteca mas reseta o editor
  useEffect(() => {
    setTipo("");
    setTemplateId(null);
    setStatus("RASCUNHO");
    setPairs([{ key: "", value: "" }]);
    setError("");
  }, [selectedProject?.id]);

  const handleBaixarTemplate = async (t) => {
    setError("");
    try {
      const blob = await downloadTemplate(token, t.id);
      downloadBlob(blob, `${safeFileName(t.original_filename || t.nome)}.docx`);
    } catch (e) {
      setError(e.message);
    }
  };

  const handlePreencher = (t) => {
    setError("");
    setTemplateId(t.id);
    const sugestao = suggestTipoFromTemplate(t);
    setTipo(sugestao);
    setStatus("RASCUNHO");
    setPairs([{ key: "", value: "" }]);

    // Se já tiver projeto selecionado, tenta carregar dados existentes automaticamente
    setTimeout(() => {
      if (selectedProject?.id) {
        // chama loadExisting depois do state aplicar
        // (não precisa ser perfeito, é só UX)
      }
    }, 0);
  };

const handleSave = async () => {
  setError("");

  if (!tipo.trim()) {
    setError("Informe o TIPO do requerimento (ex: AVERBACAO_R09).");
    return;
  }

  const payload = {
    tipo: tipo.trim(),
    template_id: templateId ? Number(templateId) : null,
    status,
    dados_json: buildJson(),
  };

  setSaving(true);

  try {
    // ==========================================
    // CASO 1 — SALVAR NA BIBLIOTECA DO USUÁRIO
    // ==========================================
    if (!selectedProject?.id) {
      await upsertUserRequerimento(token, payload);
      return;
    }

    // ==========================================
    // CASO 2 — SALVAR VINCULADO AO PROJETO
    // ==========================================
    await upsertRequerimento(token, selectedProject.id, payload);

  } catch (e) {
    setError(e.message);
  } finally {
    setSaving(false);
  }
};

const handleGenerate = async () => {
  setError("");

  if (!selectedProject?.id)
    return setError("Selecione um projeto para vincular e gerar.");

  if (!tipo.trim())
    return setError("Informe o TIPO do requerimento.");

  if (!templateId)
    return setError("Selecione um TEMPLATE para gerar o DOCX.");

  // 🔒 garante que os dados estão salvos antes de gerar
  await handleSave();

  setGenerating(true);
  try {
    const blob = await generateRequerimentoDocx(
      token,
      selectedProject.id,
      tipo.trim(),
      Number(templateId)
    );

    downloadBlob(
      blob,
      `${tipo.trim()}_projeto_${selectedProject.id}.docx`
    );
  } catch (e) {
    setError(e.message);
  } finally {
    setGenerating(false);
  }
};

  return (
    <div className="space-y-6">
      {/* ===========================
          BIBLIOTECA GLOBAL
      ============================ */}
      <Card className="border-2 border-indigo-200">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="text-indigo-800 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Biblioteca de Documentos (Templates)
            </CardTitle>
            <CardDescription>
              Qualquer usuário logado pode visualizar e baixar os modelos disponíveis.
              Para salvar/gerar DOCX vinculado, selecione um projeto.
            </CardDescription>

            {selectedProject?.id ? (
              <div className="mt-2 flex gap-2">
                <Badge variant="outline" className="border-indigo-300 text-indigo-700">
                  Projeto #{selectedProject.id}
                </Badge>
                <Badge variant="outline" className="border-indigo-300 text-indigo-700">
                  {selectedProject.name}
                </Badge>
              </div>
            ) : (
              <div className="mt-2">
                <Badge variant="outline" className="border-amber-300 text-amber-800 bg-amber-50">
                  Nenhum projeto selecionado (você ainda pode baixar e preencher)
                </Badge>
              </div>
            )}
          </div>

          <Button variant="outline" onClick={loadTemplates} disabled={loadingTemplates}>
            <RefreshCw className="w-4 h-4 mr-2" />
            {loadingTemplates ? "Atualizando..." : "Atualizar"}
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 border border-red-200 bg-red-50 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <Label>Buscar</Label>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Digite: averbação, usucapião, checklist..."
              />
            </div>

            <div>
              <Label>Categoria</Label>
              <select
                className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value="">Todas</option>
                <option value="cartorio">cartorio</option>
                <option value="sigef">sigef</option>
                <option value="usucapiao">usucapiao</option>
                <option value="contratos">contratos</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Opcional.</p>
            </div>
          </div>

          {templatesFiltrados.length === 0 ? (
            <div className="p-4 border rounded bg-gray-50 text-gray-700">
              <p className="font-semibold mb-1">Nenhum template encontrado.</p>
              <p className="text-sm">
                Se você esperava ver documentos aqui, é porque eles foram enviados como{" "}
                <b>documents</b> (por projeto) e não como <b>templates</b> (catálogo global).
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {templatesFiltrados.map((t) => (
                <div key={t.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{t.nome}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Categoria: <b>{t.categoria}</b> {t.versao ? `• Versão: ${t.versao}` : ""}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        {t.descricao || "—"}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleBaixarTemplate(t)}>
                        <FileDown className="w-4 h-4 mr-2" />
                        Baixar
                      </Button>

                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => handlePreencher(t)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Preencher
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ===========================
          EDITOR (VINCULADO)
      ============================ */}
      <Card className="border-2 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-indigo-800">Editor de Requerimento</CardTitle>
          <CardDescription>
            Preencha, salve no banco e gere DOCX. Para salvar/gerar é obrigatório selecionar um projeto.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {!selectedProject?.id && (
            <div className="p-3 border border-amber-200 bg-amber-50 text-amber-800 rounded flex items-start gap-2">
              <AlertCircle className="w-5 h-5 mt-0.5" />
              <div className="text-sm">
                Você pode preencher aqui, mas para <b>Salvar</b> ou <b>Gerar DOCX vinculado</b> selecione um projeto no painel.
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Tipo (chave interna)</Label>
              <Input
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                placeholder="Ex: AVERBACAO_R09"
                onBlur={loadExisting}
              />
              <p className="text-xs text-gray-500 mt-1">
                Identificador estável. Ex.: AVERBACAO_R09, USUCAPIAO, SIGEF_ATUALIZACAO.
              </p>
            </div>

            <div>
              <Label>Template</Label>
              <select
                className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
                value={templateId ?? ""}
                onChange={(e) => setTemplateId(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">Selecione…</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nome} ({t.categoria})
                  </option>
                ))}
              </select>
              {templateSelecionado && (
                <p className="text-xs text-gray-500 mt-1">
                  {templateSelecionado.descricao || "—"}
                </p>
              )}
            </div>

            <div>
              <Label>Status</Label>
              <select
                className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="RASCUNHO">Rascunho</option>
                <option value="FINAL">Final</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Controle interno para o usuário.</p>
            </div>
          </div>

          <div className="border rounded-md p-4 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">Campos do Requerimento</p>
                <p className="text-xs text-gray-500">
                  Use chaves que existam no template como <code>{"{{cliente_nome}}"}</code>.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={addPair}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar campo
              </Button>
            </div>

            <div className="space-y-2">
              {pairs.map((p, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-[240px,1fr,40px] gap-2 items-center">
                  <Input
                    value={p.key}
                    onChange={(e) => updatePair(idx, "key", e.target.value)}
                    placeholder="chave (ex: cliente_nome)"
                  />
                  <Input
                    value={p.value}
                    onChange={(e) => updatePair(idx, "value", e.target.value)}
                    placeholder="valor"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removePair(idx)}
                    disabled={pairs.length === 1}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Salvando..." : "Salvar"}
              </Button>

              <Button
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={handleGenerate}
                disabled={generating}
              >
                <FileDown className="w-4 h-4 mr-2" />
                {generating ? "Gerando..." : "Gerar e Baixar DOCX"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}