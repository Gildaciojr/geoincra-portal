"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { useAuth } from "@/context/AuthContext.jsx";

export function UploadMatricula({ projectId, onUploaded }) {
  const { token } = useAuth();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

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
        `/api/uploads/matricula?project_id=${projectId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // ✅ CRÍTICO
          },
          body: formData,
        }
      );

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        throw new Error(data.detail || data.message || "Erro ao enviar arquivo");
      }

      alert("Matrícula enviada com sucesso!");
      if (onUploaded) onUploaded(data);

    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded-lg bg-white shadow">
      <h3 className="font-semibold mb-2">Enviar Matrícula (PDF ou Imagem)</h3>

      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-3"
      />

      <Button onClick={upload} disabled={loading}>
        {loading ? "Enviando..." : "Enviar Documento"}
      </Button>
    </div>
  );
}
