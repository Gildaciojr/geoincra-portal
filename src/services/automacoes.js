// src/services/automacoes.js

export async function criarJobOnr(token, payload) {
  const res = await fetch("/api/automacoes/onr/consulta/jobs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.detail || "Erro ao criar job ONR");
  return data;
}

export async function criarJobRiDigital(token, payload) {
  const params = new URLSearchParams(payload).toString();

  const res = await fetch(`/api/automacoes/ri-digital/matriculas/jobs?${params}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.detail || "Erro ao criar job RI Digital");
  return data;
}

export async function listarJobs(token) {
  const res = await fetch("/api/automacoes/jobs", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return [];
  return await res.json();
}

export async function detalheJob(token, jobId) {
  const res = await fetch(`/api/automacoes/jobs/${jobId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return null;
  return await res.json();
}

export function downloadResultadoUrl(resultId) {
  return `/api/automacoes/results/${resultId}/download`;
}
