// src/services/automacoes.js

/**
 * =========================
 * ONR / SIG-RI
 * =========================
 */
export async function criarJobOnr(token, payload) {
  // 🔒 Normalização defensiva (evita 422)
  const body = {
    project_id: Number(payload.project_id),
    modo: String(payload.modo).toUpperCase(),
    valor: String(payload.valor).trim(),
  };

  const res = await fetch("/api/automacoes/onr/consulta/jobs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    /* ignore */
  }

  if (!res.ok) {
    throw new Error(
      data?.detail ||
        `Erro ao criar job ONR (status ${res.status})`
    );
  }

  return data;
}

/**
 * =========================
 * RI DIGITAL
 * =========================
 */
export async function criarJobRiDigital(token, payload) {
  // Backend RI DIGITAL recebe via query params
  const params = new URLSearchParams({
    data_inicio: payload.data_inicio,
    data_fim: payload.data_fim,
    project_id: payload.project_id ? String(payload.project_id) : "",
  }).toString();

  const res = await fetch(
    `/api/automacoes/ri-digital/matriculas/jobs?${params}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  let data = {};
  try {
    data = await res.json();
  } catch {
    /* ignore */
  }

  if (!res.ok) {
    throw new Error(
      data?.detail ||
        `Erro ao criar job RI Digital (status ${res.status})`
    );
  }

  return data;
}

/**
 * =========================
 * JOBS
 * =========================
 */
export async function listarJobs(token) {
  const res = await fetch("/api/automacoes/jobs", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return [];
  return await res.json();
}

export async function detalheJob(token, jobId) {
  const res = await fetch(`/api/automacoes/jobs/${jobId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return null;
  return await res.json();
}

/**
 * =========================
 * DOWNLOAD
 * =========================
 */
export function downloadResultadoUrl(resultId) {
  return `/api/automacoes/results/${resultId}/download`;
}
