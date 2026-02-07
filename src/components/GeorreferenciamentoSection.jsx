import { useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { MapPin, Database, TrendingUp, Layers, Info } from "lucide-react";

import { useMunicipios } from "../services/municipios.js";

export function GeorreferenciamentoSection() {
  const {
    uf,
    setUf,
    search,
    setSearch,
    municipios = [],
    loading = false,
    estadosOptions = [],
  } = useMunicipios("RO");

  const municipioSelecionado = useMemo(() => {
    if (!search || municipios.length === 0) return null;

    return (
      municipios.find(
        (m) => m.nome.toLowerCase() === search.toLowerCase()
      ) || null
    );
  }, [search, municipios]);

  const sugestoes = useMemo(() => {
    if (!search || municipios.length === 0) return [];

    const termo = search.toLowerCase();
    return municipios
      .filter((m) => m.nome.toLowerCase().includes(termo))
      .slice(0, 8);
  }, [search, municipios]);

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LOCALIZAÇÃO */}
        <Card className="border-2 border-emerald-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-emerald-700">
                <MapPin className="w-5 h-5" />
                Localização do Imóvel Rural
              </CardTitle>
              <Badge className="bg-emerald-600 text-white">Municípios RO</Badge>
            </div>
            <CardDescription>
              Base oficial de municípios com parâmetros técnicos.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>UF</Label>
                <select
                  className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
                  value={uf}
                  onChange={(e) => setUf(e.target.value)}
                >
                  {estadosOptions.map((estado) => (
                    <option
                      key={estado.value}
                      value={estado.value}
                      disabled={estado.disabled}
                    >
                      {estado.label}
                      {estado.disabled ? " (em breve)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Município</Label>
                <Input
                  placeholder="Digite para buscar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {loading && (
              <p className="text-xs text-gray-500">
                Carregando municípios...
              </p>
            )}

            {!loading && sugestoes.length > 0 && (
              <div className="border rounded bg-white max-h-48 overflow-y-auto">
                {sugestoes.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSearch(m.nome)}
                    className="w-full px-3 py-2 text-left hover:bg-emerald-50 flex justify-between"
                  >
                    <span>{m.nome}</span>
                    <span className="text-xs text-gray-500">
                      {m.estado}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {!loading && search && sugestoes.length === 0 && (
              <p className="text-xs text-gray-500">
                Nenhum município encontrado.
              </p>
            )}
          </CardContent>
        </Card>

        {/* VTI / VTN */}
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Database className="w-5 h-5" />
                Parâmetros de VTI / VTN
              </CardTitle>

              {municipioSelecionado ? (
                <Badge className="bg-blue-600 text-white">
                  {municipioSelecionado.nome} /{" "}
                  {municipioSelecionado.estado}
                </Badge>
              ) : (
                <Badge variant="outline">Selecione um município</Badge>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {municipioSelecionado ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs">VTI mínimo</p>
                  <p className="text-lg font-bold">
                    R${" "}
                    {municipioSelecionado.vti_min?.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs">VTN mínimo</p>
                  <p className="text-lg font-bold">
                    R${" "}
                    {municipioSelecionado.vtn_min?.toFixed(2)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                Selecione um município para visualizar os valores.
              </p>
            )}
          </CardContent>
        </Card>

        {/* ESTRATÉGIA */}
        <Card className="border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <TrendingUp className="w-5 h-5" />
              Estratégia Técnica
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-sm">
            <div className="flex gap-2">
              <Layers className="w-4 h-4 mt-1" />
              <p>Base municipal garante padronização técnica.</p>
            </div>
            <div className="flex gap-2">
              <Database className="w-4 h-4 mt-1" />
              <p>Expansão futura para outros estados sem refatoração.</p>
            </div>
            <div className="flex gap-2">
              <Info className="w-4 h-4 mt-1" />
              <p>Valores são referenciais para o motor de cálculo.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
