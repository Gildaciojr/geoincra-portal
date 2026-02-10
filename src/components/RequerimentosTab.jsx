"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Plus, Trash2, FileDown, Save, RefreshCw, AlertCircle } from "lucide-react";
import { useCallback } from "react";


import { useAuth } from "@/context/AuthContext.jsx";
import {
  listTemplates,
  getRequerimento,
  upsertRequerimento,
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

export function RequerimentosTab({ selectedProject }) {
  const { token } = useAuth();

  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  const [templateId, setTemplateId] = useState(null);
  const templateSelecionado = useMemo(
    () => templates.find((t) => t.id === Number(templateId)) || null,
    [templates, templateId]
  );

  // tipo: você pode padronizar com base no template (ex: categoria + id)
  const [tipo, setTipo] = useState("");
  const [status, setStatus] = useState("RASCUNHO");

  const [pairs, setPairs] = useState([{ key: "", value: "" }]);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

    const loadTemplates = useCallback(async () => {
  setLoadingTemplates(true);
  setError("");
  try {
    const data = await listTemplates(token);
    setTemplates(Array.isArray(data) ? data : []);
  } catch (err) {
    setTemplates([]);
    setError(err?.message || "Erro ao carregar templates");
  } finally {
    setLoadingTemplates(false);
  }
}, [token]);


  const loadExisting = async () => {
    setError("");
    if (!selectedProject?.id || !tipo) return;

    try {
      const existing = await getRequerimento(token, selectedProject.id, tipo);
      if (!existing) return;

      setStatus(existing.status || "RASCUNHO");
      setTemplateId(existing.template_id || templateId);

      const obj = existing.dados_json || {};
      const arr = Object.entries(obj).map(([k, v]) => ({ key: k, value: String(v ?? "") }));
      setPairs(arr.length ? arr : [{ key: "", value: "" }]);
    } catch {
     // silencioso
    }

  };

    useEffect(() => {
    if (!token) return;
     loadTemplates();
    }, [token, loadTemplates]);


  useEffect(() => {
    // ao trocar projeto, reseta
    setTipo("");
    setTemplateId(null);
    setStatus("RASCUNHO");
    setPairs([{ key: "", value: "" }]);
    setError("");
  }, [selectedProject?.id]);

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

  const handleSave = async () => {
    setError("");
    if (!selectedProject?.id) {
      setError("Selecione um projeto.");
      return;
    }
    if (!tipo.trim()) {
      setError("Informe o TIPO do requerimento (ex: AVERBACAO_R09).");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        tipo: tipo.trim(),
        template_id: templateId ? Number(templateId) : null,
        status,
        dados_json: buildJson(),
      };

      await upsertRequerimento(token, selectedProject.id, payload);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerate = async () => {
    setError("");
    if (!selectedProject?.id) return setError("Selecione um projeto.");
    if (!tipo.trim()) return setError("Informe o TIPO do requerimento.");
    if (!templateId) return setError("Selecione um TEMPLATE para gerar o DOCX.");

    // salva antes de gerar (boa prática)
    await handleSave();

    setGenerating(true);
    try {
      const blob = await generateRequerimentoDocx(token, selectedProject.id, tipo.trim(), Number(templateId));
      downloadBlob(blob, `${tipo.trim()}_projeto_${selectedProject.id}.docx`);
    } catch (e) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  };

  if (!selectedProject) {
    return (
      <Card className="border-2 border-amber-200 bg-amber-50/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <AlertCircle className="w-5 h-5" />
            Nenhum projeto selecionado
          </CardTitle>
          <CardDescription>Selecione um projeto para criar/editar requerimentos.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-indigo-200">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="text-indigo-800">Requerimentos do Projeto</CardTitle>
            <CardDescription>
              Preencha no sistema, salve no banco e gere o DOCX para download (vinculado ao projeto).
            </CardDescription>
            <div className="mt-2 flex gap-2">
              <Badge variant="outline" className="border-indigo-300 text-indigo-700">
                Projeto #{selectedProject.id}
              </Badge>
              <Badge variant="outline" className="border-indigo-300 text-indigo-700">
                {selectedProject.name}
              </Badge>
            </div>
          </div>

          <Button variant="outline" onClick={loadTemplates} disabled={loadingTemplates}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar Templates
          </Button>
        </CardHeader>

        <CardContent className="space-y-5">
          {error && (
            <div className="p-3 border border-red-200 bg-red-50 text-red-700 rounded">
              {error}
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
                Use um identificador estável (você padroniza). Ex.: AVERBACAO_R09, USUCAPIAO, SIGEF_ATUALIZACAO.
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
                <p className="text-xs text-gray-500 mt-1">{templateSelecionado.descricao || "—"}</p>
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
