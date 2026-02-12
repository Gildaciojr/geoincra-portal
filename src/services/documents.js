// geoincra-portal/src/services/documents.js

export async function listDocumentsByProject(token, projectId) {
  const res = await fetch(`/api/documents?project_id=${projectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return [];
  return await res.json();
}

export async function downloadDocument(token, documentId) {
  const res = await fetch(`/api/files/documents/${documentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.detail || "Erro ao baixar documento");
  }

  return await res.blob();
}

export async function deleteDocument(token, documentId) {
  const res = await fetch(`/api/documents/${documentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.detail || "Erro ao remover documento");
  }

  return data;
}
