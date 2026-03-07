import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { criarJobConsultarCertidao } from "@/services/automacoes";

export function RiDigitalConsultarCertidaoCard({ selectedProject, onCreated }) {
  const { token } = useAuth();

  const [protocolo, setProtocolo] = useState("");
  const [loading, setLoading] = useState(false);

  const executar = async () => {
    if (!selectedProject?.id) {
      alert("Selecione um projeto.");
      return;
    }

    if (!protocolo) {
      alert("Informe o número do protocolo.");
      return;
    }

    setLoading(true);

    try {
      await criarJobConsultarCertidao(token, {
        project_id: selectedProject.id,
        protocolo,
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
        <CardTitle>RI Digital — Consultar Certidão</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        <div>
          <Label>Número do Protocolo</Label>
          <Input
            value={protocolo}
            onChange={(e) => setProtocolo(e.target.value)}
            placeholder="Ex: 1234567"
          />
        </div>

        <Button onClick={executar} disabled={loading}>
          {loading ? "Consultando..." : "Consultar Certidão"}
        </Button>

      </CardContent>
    </Card>
  );
}