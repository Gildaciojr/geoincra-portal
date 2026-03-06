"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { Label } from "@/components/ui/label.jsx";

const DOCUMENT_TYPES = [
  { value: "matricula", label: "Matrícula do Imóvel" },
  { value: "ccir", label: "CCIR" },
  { value: "car", label: "CAR" },
  { value: "cpf_rg", label: "CPF / RG" },
  { value: "comprovante_residencia", label: "Comprovante de Residência" },
  { value: "contrato_particular", label: "Contrato Particular" },
  { value: "planta_memorial", label: "Planta / Memorial" },
  { value: "tecnico", label: "Documento Técnico" },
  { value: "outros", label: "Outros Documentos" },
];

export function UploadDocumento({ projectId, onUploaded }) {
  const { token } = useAuth();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState("matricula");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected =
      e.target.files && e.target.files.length > 0
        ? e.target.files[0]
        : null;

    setFile(selected);
  };

  const upload = async () => {
    if (!projectId) {
      alert("Selecione um projeto antes de enviar documentos.");
      return;
    }

    if (!file) {
      alert("Selecione um arquivo!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const resp = await fetch(
        `/api/uploads/document?project_id=${projectId}&doc_type=${docType}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        throw new Error(data.detail || data.message || "Erro ao enviar arquivo");
      }

      alert("Documento enviado com sucesso!");

      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (onUploaded) onUploaded(data);

    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded-lg bg-white shadow space-y-4">

      <h3 className="font-semibold text-emerald-800">
        Enviar Documento
      </h3>

      <div>
        <Label>Tipo de Documento</Label>

        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
        >
          {DOCUMENT_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label>Arquivo</Label>

        <div className="flex items-center gap-3">

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            Escolher arquivo
          </Button>

          <span className="text-sm text-gray-500 truncate max-w-[220px]">
            {file ? file.name : "Nenhum arquivo selecionado"}
          </span>

        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <Button
        type="button"
        onClick={upload}
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700"
      >
        {loading ? "Enviando..." : "Enviar Documento"}
      </Button>

    </div>
  );
}