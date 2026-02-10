// src/services/requerimentos.js
export async function listTemplates(token, categoria) {
  const url = categoria ? `/api/templates?categoria=${encodeURIComponent(categoria)}` : `/api/templates`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  return await res.json();
}

export async function listRequerimentosByProject(token, projectId) {
  const res = await fetch(`/api/requerimentos/project/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  return await res.json();
}

export async function getRequerimento(token, projectId, tipo) {
  const res = await fetch(`/api/requerimentos/project/${projectId}/one?tipo=${encodeURIComponent(tipo)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return await res.json();
}

export async function upsertRequerimento(token, projectId, payload) {
  const res = await fetch(`/api/requerimentos/project/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.detail || "Erro ao salvar requerimento");
  return data;
}

export async function deleteRequerimento(token, projectId, tipo) {
  const res = await fetch(`/api/requerimentos/project/${projectId}?tipo=${encodeURIComponent(tipo)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.detail || "Erro ao remover requerimento");
  return data;
}

export async function generateRequerimentoDocx(token, projectId, tipo, templateId) {
  const res = await fetch(
    `/api/requerimentos/project/${projectId}/generate?tipo=${encodeURIComponent(tipo)}&template_id=${templateId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.detail || "Erro ao gerar DOCX");
  }

  const blob = await res.blob();
  return blob;
}
