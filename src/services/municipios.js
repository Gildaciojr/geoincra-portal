import { useEffect, useRef, useState } from "react";

/* ============================================================
   🔎 Busca de municípios — ALINHADO AO BACKEND
   ============================================================ */
export async function searchMunicipios(query = "", uf = "RO") {
  if (!query || query.length < 2) return [];

  try {
    const params = new URLSearchParams();
    params.append("search", query); // ✅ CORRETO
    if (uf) params.append("uf", uf);

    const response = await fetch(`/api/municipios?${params.toString()}`);

    if (!response.ok) return [];

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Erro ao buscar municípios:", err);
    return [];
  }
}

/* ============================================================
   🧠 Hook oficial e seguro
   ============================================================ */
export function useMunicipios(defaultUF = "RO") {
  const [uf, setUf] = useState(defaultUF);
  const [search, setSearch] = useState("");
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(false);

  const cacheRef = useRef({});
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!search || search.length < 2) {
      setMunicipios([]);
      return;
    }

    const key = `${uf}_${search.toLowerCase()}`;

    if (cacheRef.current[key]) {
      setMunicipios(cacheRef.current[key]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setLoading(true);

      const result = await searchMunicipios(search, uf);
      cacheRef.current[key] = result;

      setMunicipios(result);
      setLoading(false);
    }, 300);
  }, [search, uf]);

  return {
    uf,
    setUf,
    search,
    setSearch,
    municipios,
    loading,
  };
}
