import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Download, FileCode, Plus, X, PlayCircle } from 'lucide-react'

export function AutomacaoTab() {
  const [perimetros, setPerimetros] = useState([
    { id: 1, x: '', y: '', segmentos: [{ distancia: '', azimute: '' }] }
  ])

  const addPerimetro = () => {
    setPerimetros([
      ...perimetros,
      { id: Date.now(), x: '', y: '', segmentos: [{ distancia: '', azimute: '' }] }
    ])
  }

  const removePerimetro = (id) => {
    setPerimetros(perimetros.filter(p => p.id !== id))
  }

  const addSegmento = (perimetroId) => {
    setPerimetros(perimetros.map(p => 
      p.id === perimetroId 
        ? { ...p, segmentos: [...p.segmentos, { distancia: '', azimute: '' }] }
        : p
    ))
  }

  const removeSegmento = (perimetroId, segIndex) => {
    setPerimetros(perimetros.map(p => 
      p.id === perimetroId 
        ? { ...p, segmentos: p.segmentos.filter((_, i) => i !== segIndex) }
        : p
    ))
  }

  const updatePerimetro = (id, field, value) => {
    setPerimetros(perimetros.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  const updateSegmento = (perimetroId, segIndex, field, value) => {
    setPerimetros(perimetros.map(p => 
      p.id === perimetroId 
        ? {
            ...p,
            segmentos: p.segmentos.map((seg, i) => 
              i === segIndex ? { ...seg, [field]: value } : seg
            )
          }
        : p
    ))
  }

  const generateSCR = () => {
    let scrContent = "ANGDIR 1\nANGBASE 90\n\n"
    
    perimetros.forEach((perimetro, index) => {
      if (!perimetro.x || !perimetro.y) return
      
      scrContent += `; Perímetro ${index + 1}\n`
      scrContent += "LINE\n"
      scrContent += `${perimetro.x} ${perimetro.y}\n`
      
      perimetro.segmentos.forEach(seg => {
        if (seg.distancia && seg.azimute) {
          scrContent += `@${seg.distancia}<${seg.azimute}\n`
        }
      })
      
      scrContent += "CLOSE\n\n"
    })
    
    return scrContent
  }

  const downloadSCR = () => {
    const content = generateSCR()
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'perimetros.scr'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateCSV = () => {
    let csvContent = "ID,X,Y"
    
    // Find max number of segments
    const maxSegmentos = Math.max(...perimetros.map(p => p.segmentos.length))
    
    for (let i = 0; i < maxSegmentos; i++) {
      csvContent += `,Dist${i + 1},Azim${i + 1}`
    }
    csvContent += "\n"
    
    perimetros.forEach((perimetro, index) => {
      if (!perimetro.x || !perimetro.y) return
      
      csvContent += `Perimetro${index + 1},${perimetro.x},${perimetro.y}`
      
      perimetro.segmentos.forEach(seg => {
        csvContent += `,${seg.distancia || ''},${seg.azimute || ''}`
      })
      
      // Fill empty segments
      for (let i = perimetro.segmentos.length; i < maxSegmentos; i++) {
        csvContent += ",,"
      }
      
      csvContent += "\n"
    })
    
    return csvContent
  }

  const downloadCSV = () => {
    const content = generateCSV()
    const blob = new Blob([content], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'perimetros.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode className="w-5 h-5" />
            Gerador de Arquivos para AutoCAD
          </CardTitle>
          <CardDescription>
            Crie arquivos .scr e .csv para importação automática no AutoCAD Civil 3D
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {perimetros.map((perimetro, pIndex) => (
              <div key={perimetro.id} className="p-4 border-2 border-green-200 rounded-lg bg-green-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-green-800">Perímetro {pIndex + 1}</h3>
                  {perimetros.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePerimetro(perimetro.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Coordenada X (inicial)</Label>
                    <Input
                      type="number"
                      value={perimetro.x}
                      onChange={(e) => updatePerimetro(perimetro.id, 'x', e.target.value)}
                      placeholder="Ex: 1000.00"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Coordenada Y (inicial)</Label>
                    <Input
                      type="number"
                      value={perimetro.y}
                      onChange={(e) => updatePerimetro(perimetro.id, 'y', e.target.value)}
                      placeholder="Ex: 2000.00"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Segmentos (Distância e Azimute)</Label>
                  {perimetro.segmentos.map((seg, sIndex) => (
                    <div key={sIndex} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Label className="text-xs">Distância (m)</Label>
                        <Input
                          type="number"
                          value={seg.distancia}
                          onChange={(e) => updateSegmento(perimetro.id, sIndex, 'distancia', e.target.value)}
                          placeholder="Ex: 100.50"
                          className="mt-1"
                        />
                      </div>
                      <div className="flex-1">
                        <Label className="text-xs">Azimute (°)</Label>
                        <Input
                          type="number"
                          value={seg.azimute}
                          onChange={(e) => updateSegmento(perimetro.id, sIndex, 'azimute', e.target.value)}
                          placeholder="Ex: 45.00"
                          className="mt-1"
                        />
                      </div>
                      {perimetro.segmentos.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSegmento(perimetro.id, sIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addSegmento(perimetro.id)}
                    className="w-full border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Segmento
                  </Button>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              onClick={addPerimetro}
              className="w-full border-green-600 text-green-700 hover:bg-green-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Novo Perímetro
            </Button>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button
                onClick={downloadSCR}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar Arquivo .SCR
              </Button>
              <Button
                onClick={downloadCSV}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar Arquivo .CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="w-5 h-5" />
            Como Usar no AutoCAD
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Para Arquivo .SCR:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                <li>Abra o AutoCAD Civil 3D</li>
                <li>Digite <code className="bg-gray-100 px-1 rounded">SCRIPT</code> na linha de comando</li>
                <li>Selecione o arquivo <code className="bg-gray-100 px-1 rounded">perimetros.scr</code></li>
                <li>Pressione Enter - os perímetros serão desenhados automaticamente</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Para Arquivo .CSV:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                <li>Use o script AutoLISP fornecido na documentação</li>
                <li>Carregue o script com <code className="bg-gray-100 px-1 rounded">APPLOAD</code></li>
                <li>Execute o comando <code className="bg-gray-100 px-1 rounded">IMPORTIMOVEIS</code></li>
                <li>Selecione o arquivo CSV gerado</li>
              </ol>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Nota:</strong> Certifique-se de que as unidades do AutoCAD correspondem às unidades dos dados (metros).
                Os azimutes devem estar em graus decimais (0° = Norte, 90° = Leste).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
