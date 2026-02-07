import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Calendar, CheckCircle, Clock, PlayCircle, Plus } from 'lucide-react'

export function CronogramaTab({ selectedProject, timeline, onRefresh }) {
  const [showAddStage, setShowAddStage] = useState(false)
  const [newStageName, setNewStageName] = useState('')

  const predefinedStages = [
    'Upload de Documentos',
    'Extração de Dados (OCR)',
    'Solicitação de Matrículas',
    'Validação de Dados',
    'Processamento AutoCAD',
    'Geração de Peças Técnicas',
    'Revisão Final',
    'Entrega ao Cliente'
  ]

  const handleAddStage = async (stageName) => {
    if (!selectedProject) {
      alert('Selecione um projeto primeiro')
      return
    }

    try {
      const response = await fetch('/api/timeline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: selectedProject.id,
          stage: stageName,
          status: 'Pendente',
          progress: 0
        })
      })
      
      if (response.ok) {
        onRefresh()
        setNewStageName('')
        setShowAddStage(false)
      }
    } catch (error) {
      console.error('Error adding stage:', error)
    }
  }

  const handleUpdateProgress = async (timelineId, newProgress) => {
    let newStatus = 'Pendente'
    if (newProgress > 0 && newProgress < 100) {
      newStatus = 'Em Andamento'
    } else if (newProgress === 100) {
      newStatus = 'Concluído'
    }

    try {
      const response = await fetch(`/api/timeline/${timelineId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          progress: newProgress,
          status: newStatus
        })
      })
      
      if (response.ok) {
        onRefresh()
      }
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pendente': { color: 'bg-gray-500', icon: Clock },
      'Em Andamento': { color: 'bg-blue-500', icon: PlayCircle },
      'Concluído': { color: 'bg-green-500', icon: CheckCircle }
    }
    
    const config = statusConfig[status] || statusConfig['Pendente']
    const Icon = config.icon
    
    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    )
  }

  const calculateOverallProgress = () => {
    if (timeline.length === 0) return 0
    const total = timeline.reduce((sum, item) => sum + item.progress, 0)
    return Math.round(total / timeline.length)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Cronograma do Projeto
          </CardTitle>
          <CardDescription>
            {selectedProject 
              ? `Acompanhamento de etapas: ${selectedProject.name}`
              : 'Selecione um projeto para visualizar o cronograma'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedProject ? (
            <div className="text-center py-8 text-gray-500">
              Selecione um projeto no painel de administração para visualizar o cronograma
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-green-800">Progresso Geral</span>
                  <span className="text-2xl font-bold text-green-600">
                    {calculateOverallProgress()}%
                  </span>
                </div>
                <Progress value={calculateOverallProgress()} className="h-3" />
                <p className="text-sm text-green-600 mt-2">
                  {timeline.filter(t => t.status === 'Concluído').length} de {timeline.length} etapas concluídas
                </p>
              </div>

              {timeline.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Nenhuma etapa cadastrada ainda</p>
                  <Button
                    onClick={() => setShowAddStage(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Primeira Etapa
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {timeline.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-4 border-2 rounded-lg hover:shadow-md transition-shadow"
                      style={{
                        borderColor: item.status === 'Concluído' ? '#22c55e' : 
                                   item.status === 'Em Andamento' ? '#3b82f6' : '#d1d5db'
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-700">
                              {index + 1}. {item.stage}
                            </span>
                          </div>
                          {item.notes && (
                            <p className="text-sm text-gray-600 mb-2">{item.notes}</p>
                          )}
                          <div className="flex gap-4 text-xs text-gray-500">
                            {item.started_at && (
                              <span>Início: {new Date(item.started_at).toLocaleDateString('pt-BR')}</span>
                            )}
                            {item.completed_at && (
                              <span>Conclusão: {new Date(item.completed_at).toLocaleDateString('pt-BR')}</span>
                            )}
                          </div>
                        </div>
                        <div>
                          {getStatusBadge(item.status)}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Progresso:</span>
                          <span className="font-semibold">{item.progress}%</span>
                        </div>
                        <Progress value={item.progress} className="h-2" />
                        
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateProgress(item.id, 0)}
                            disabled={item.progress === 0}
                            className="flex-1"
                          >
                            0%
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateProgress(item.id, 25)}
                            disabled={item.progress === 25}
                            className="flex-1"
                          >
                            25%
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateProgress(item.id, 50)}
                            disabled={item.progress === 50}
                            className="flex-1"
                          >
                            50%
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateProgress(item.id, 75)}
                            disabled={item.progress === 75}
                            className="flex-1"
                          >
                            75%
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateProgress(item.id, 100)}
                            disabled={item.progress === 100}
                            className="flex-1 bg-green-50 hover:bg-green-100"
                          >
                            100%
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {timeline.length > 0 && (
                <Button
                  onClick={() => setShowAddStage(true)}
                  variant="outline"
                  className="w-full border-green-600 text-green-700 hover:bg-green-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Nova Etapa
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {showAddStage && (
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Nova Etapa</CardTitle>
            <CardDescription>
              Escolha uma etapa predefinida ou crie uma personalizada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {predefinedStages.map((stage) => (
                  <Button
                    key={stage}
                    variant="outline"
                    onClick={() => handleAddStage(stage)}
                    className="justify-start hover:bg-green-50 hover:border-green-600"
                  >
                    {stage}
                  </Button>
                ))}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Ou crie uma personalizada</span>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  placeholder="Nome da etapa personalizada"
                  className="flex-1 p-2 border rounded-md"
                />
                <Button
                  onClick={() => newStageName && handleAddStage(newStageName)}
                  disabled={!newStageName}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Adicionar
                </Button>
              </div>

              <Button
                variant="ghost"
                onClick={() => setShowAddStage(false)}
                className="w-full"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
