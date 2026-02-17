// src/components/AutoCadTools.jsx

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Download, FileCode, Plus, X } from "lucide-react";

export function AutoCadTools() {
  const [perimetros, setPerimetros] = useState([
    { id: 1, x: "", y: "", segmentos: [{ distancia: "", azimute: "" }] },
  ]);

  const addPerimetro = () => {
    setPerimetros([
      ...perimetros,
      {
        id: Date.now(),
        x: "",
        y: "",
        segmentos: [{ distancia: "", azimute: "" }],
      },
    ]);
  };

  const removePerimetro = (id) => {
    setPerimetros(perimetros.filter((p) => p.id !== id));
  };

  const addSegmento = (perimetroId) => {
    setPerimetros(
      perimetros.map((p) =>
        p.id === perimetroId
          ? {
              ...p,
              segmentos: [...p.segmentos, { distancia: "", azimute: "" }],
            }
          : p
      )
    );
  };

  const updatePerimetro = (id, field, value) => {
    setPerimetros(
      perimetros.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  const updateSegmento = (perimetroId, segIndex, field, value) => {
    setPerimetros(
      perimetros.map((p) =>
        p.id === perimetroId
          ? {
              ...p,
              segmentos: p.segmentos.map((seg, i) =>
                i === segIndex ? { ...seg, [field]: value } : seg
              ),
            }
          : p
      )
    );
  };

  const generateSCR = () => {
    let scr = "ANGDIR 1\nANGBASE 90\n\n";

    perimetros.forEach((p, idx) => {
      if (!p.x || !p.y) return;

      scr += `; Perímetro ${idx + 1}\nLINE\n${p.x} ${p.y}\n`;
      p.segmentos.forEach((s) => {
        if (s.distancia && s.azimute) {
          scr += `@${s.distancia}<${s.azimute}\n`;
        }
      });
      scr += "CLOSE\n\n";
    });

    return scr;
  };

  const generateCSV = () => {
    let csv = "ID,X,Y\n";
    perimetros.forEach((p, i) => {
      if (!p.x || !p.y) return;
      csv += `Perimetro${i + 1},${p.x},${p.y}\n`;
    });
    return csv;
  };

  const download = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode className="w-5 h-5" />
            AutoCAD — SCR / CSV
          </CardTitle>
          <CardDescription>
            Gere arquivos automaticamente para AutoCAD Civil 3D
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {perimetros.map((p, idx) => (
            <div
              key={p.id}
              className="border rounded-lg p-4 space-y-3 bg-green-50"
            >
              <div className="flex justify-between items-center">
                <strong>Perímetro {idx + 1}</strong>
                {perimetros.length > 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removePerimetro(p.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="X inicial"
                  value={p.x}
                  onChange={(e) =>
                    updatePerimetro(p.id, "x", e.target.value)
                  }
                />
                <Input
                  placeholder="Y inicial"
                  value={p.y}
                  onChange={(e) =>
                    updatePerimetro(p.id, "y", e.target.value)
                  }
                />
              </div>

              {p.segmentos.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    placeholder="Distância"
                    value={s.distancia}
                    onChange={(e) =>
                      updateSegmento(
                        p.id,
                        i,
                        "distancia",
                        e.target.value
                      )
                    }
                  />
                  <Input
                    placeholder="Azimute"
                    value={s.azimute}
                    onChange={(e) =>
                      updateSegmento(
                        p.id,
                        i,
                        "azimute",
                        e.target.value
                      )
                    }
                  />
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => addSegmento(p.id)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Segmento
              </Button>
            </div>
          ))}

          <Button variant="outline" onClick={addPerimetro}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Perímetro
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() =>
                download(generateSCR(), "perimetros.scr", "text/plain")
              }
            >
              <Download className="w-4 h-4 mr-2" />
              SCR
            </Button>

            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() =>
                download(generateCSV(), "perimetros.csv", "text/csv")
              }
            >
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
