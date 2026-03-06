import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { useAuth } from "@/context/AuthContext.jsx";

export function RiDigitalSolicitarCertidaoCard({ selectedProject, onCreated }) {
  const { token } = useAuth();

  const [cidade, setCidade] = useState("");
  const [cartorio, setCartorio] = useState("");
  const [matricula, setMatricula] = useState("");
  const [finalidade, setFinalidade] = useState("1");

  const [loading, setLoading] = useState(false);

  const executar = async () => {
    if (!selectedProject?.id) {
      alert("Selecione um projeto.");
      return;
    }

    if (!cidade || !cartorio || !matricula) {
      alert("Preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/automacoes/ri-digital/solicitar/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          project_id: selectedProject.id,
          cidade,
          cartorio,
          matricula,
          finalidade,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail || "Erro ao criar automação");
      }

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
        <CardTitle>RI Digital — Solicitar Certidão</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        <div>
          <Label>Cidade</Label>
          <Input
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Ex: CACOAL"
          />
        </div>

        <div>
          <Label>Cartório</Label>
          <Input
            value={cartorio}
            onChange={(e) => setCartorio(e.target.value)}
            placeholder="Ex: 01º - CACOAL"
          />
        </div>

        <div>
          <Label>Matrícula / CNM</Label>
          <Input
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
          />
        </div>

        <div>
          <Label>Finalidade</Label>
          <select
            className="border rounded w-full p-2"
            value={finalidade}
            onChange={(e) => setFinalidade(e.target.value)}
          >
            <option value="1">
              Investigação jurídico-econômica para avaliação de crédito
            </option>

            <option value="2">
              Investigação jurídica sobre o imóvel
            </option>

            <option value="3">
              Investigação para processos judiciais
            </option>

            <option value="4">
              Titular de direito real sobre o imóvel
            </option>

            <option value="5">
              Não declarar finalidade
            </option>
          </select>
        </div>

        <Button onClick={executar} disabled={loading}>
          {loading ? "Executando..." : "Solicitar Certidão"}
        </Button>

      </CardContent>
    </Card>
  );
}