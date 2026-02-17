import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { criarJobRiDigital } from "@/services/automacoes";

export function RiDigitalCard({ selectedProject, onCreated }) {
  const { token } = useAuth();
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [loading, setLoading] = useState(false);

  const executar = async () => {
    setLoading(true);
    try {
      await criarJobRiDigital(token, {
        data_inicio: dataInicio,
        data_fim: dataFim,
        project_id: selectedProject?.id ?? "",
      });
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
        <CardTitle>RI Digital — Matrículas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Data Início</Label>
          <Input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
        </div>

        <div>
          <Label>Data Fim</Label>
          <Input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
        </div>

        <Button onClick={executar} disabled={loading}>
          {loading ? "Executando..." : "Executar Automação"}
        </Button>
      </CardContent>
    </Card>
  );
}
