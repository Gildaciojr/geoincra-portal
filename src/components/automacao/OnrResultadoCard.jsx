import { Badge } from "@/components/ui/badge";

export function OnrResultadoCard({ imovel }) {
  if (!imovel) return null;

  const Item = ({ label, value }) =>
    value ? (
      <div className="text-sm">
        <span className="text-gray-500">{label}:</span>{" "}
        <span className="font-medium text-gray-800">{value}</span>
      </div>
    ) : null;

  return (
    <div className="mt-3 p-3 border rounded-lg bg-white space-y-1">
      <div className="flex items-center justify-between mb-2">
        <strong className="text-sm text-emerald-700">
          Informações do Imóvel
        </strong>
        <Badge variant="outline">ONR / SIG-RI</Badge>
      </div>

      <Item label="Camada" value={imovel.camada} />
      <Item label="Código SIGEF" value={imovel.codigo_sigef} />
      <Item label="Nome da Área" value={imovel.nome_area} />
      <Item label="Matrícula" value={imovel.matricula} />
      <Item label="Município" value={imovel.municipio} />
      <Item label="UF" value={imovel.uf} />
      <Item label="CCIR / SNCR" value={imovel.ccir_sncr} />
    </div>
  );
}