import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { criarJobOnr } from "@/services/automacoes";

export function OnrConsultaCard({ selectedProject, onCreated }) {
  const { token } = useAuth();
  const [modo, setModo] = useState("CAR");
  const [valor, setValor] = useState("");
  const [loading, setLoading] = useState(false);

const executar = async () => {
  if (!selectedProject?.id) {
    alert("Selecione um projeto válido antes de executar a automação.");
    return;
  }

  if (!valor.trim()) {
    alert("Informe um valor para consulta.");
    return;
  }

  setLoading(true);
  try {
    await criarJobOnr(token, {
      project_id: selectedProject.id,
      modo,
      valor: valor.trim(),
    });
    setValor("");
    if (onCreated) onCreated();
  } catch (e) {
    alert(e.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <Card>
      <CardHeader>
        <CardTitle>Consulta Fundiária — ONR / SIG-RI</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Modo de Consulta</Label>
          <select
            value={modo}
            onChange={(e) => setModo(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="CAR">Número do CAR</option>
            <option value="ENDERECO">Endereço</option>
          </select>
        </div>

        <div>
          <Label>Valor</Label>
          <Input
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder={modo === "CAR" ? "Ex: RO-1100012-..." : "Endereço completo"}
          />
        </div>

        <Button onClick={executar} disabled={loading}>
          {loading ? "Processando..." : "Executar Consulta"}
        </Button>
      </CardContent>
    </Card>
  );
}
