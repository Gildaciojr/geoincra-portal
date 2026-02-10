import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Calendar, CheckCircle, Clock, PlayCircle, Plus, Trash2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext.jsx' // ✅ JWT

export function CronogramaTab({ selectedProject, timeline, onRefresh }) {
  const { token } = useAuth() // ✅ JWT

  const [showAddStage, setShowAddStage] = useState(false)
  const [newStageName, setNewStageName] = useState('')
  const [newStageDesc, setNewStageDesc] = useState('')

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

  // ✅ BACKEND REAL:
  // POST /projects/{project_id}/timeline/
  // body: { project_id, titulo, descricao, status }
  const handleAddStage = async (stageName) => {
    if (!selectedProject) {
      alert('Selecione um projeto primeiro')
      return
    }

    try {
      const response = await fetch(`/api/projects/${selectedProject.id}/timeline/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ✅ JWT
        },
        body: JSON.stringify({
          project_id: selectedProject.id,
          titulo: stageName,
          descricao: newStageDesc || null,
          status: 'Pendente',
          created_by_user_id: null,
        })
      })

      if (response.ok) {
        onRefresh()
        setNewStageName('')
        setNewStageDesc('')
        setShowAddStage(false)
      } else {
        const data = await response.json().catch(() => ({}))
        throw new Error(data?.detail || 'Erro ao adicionar etapa')
      }
    } catch (error) {
      console.error('Error adding stage:', error)
      alert(error.message)
    }
  }

  // ✅ BACKEND REAL:
  // DELETE /timeline/{entry_id}
  const handleDeleteStage = async (timelineId) => {
    if (!selectedProject) return

    try {
      const response = await fetch(`/api/timeline/${timelineId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`, // ✅ JWT
        },
      })

      if (response.ok) {
        onRefresh()
      } else {
        const data = await response.json().catch(() => ({}))
        throw new Error(data?.detail || 'Erro ao deletar etapa')
      }
    } catch (error) {
      console.error('Error deleting stage:', error)
      alert(error.message)
    }
  }

  // ✅ Seu backend NÃO TEM PUT de timeline.
  // Então aqui eu mantive seus botões de “status” (0/25/50/75/100)
  // mas ao invés de PUT, eu registro uma nova entrada com status atualizado.
  // Isso mantém histórico e não inventa endpoint inexistente.
  const handleUpdateProgress = async (timelineId, newProgress) => {
    if (!selectedProject) return

    let newStatus = 'Pendente'
    if (newProgress > 0 && newProgress < 100) newStatus = 'Em Andamento'
    if (newProgress === 100) newStatus = 'Concluído'

    try {
      const current = (timeline || []).find((t) => t.id === timelineId)
      if (!current) return

      const response = await fetch(`/api/projects/${selectedProject.id}/timeline/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ✅ JWT
        },
        body: JSON.stringify({
          project_id: selectedProject.id,
          titulo: current.titulo,
          descricao: current.descricao || null,
          status: newStatus,
          created_by_user_id: null,
        })
      })

      if (response.ok) {
        onRefresh()
      } else {
        const data = await response.json().catch(() => ({}))
        throw new Error(data?.detail || 'Erro ao atualizar status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert(error.message)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pendente': { color: 'bg-gray-500', icon: Clock },
      'Em Andamento': { color: 'bg-blue-500', icon: PlayCircle },
      'Concluído': { color: 'bg-green-500', icon: CheckCircle },
      'Criado': { color: 'bg-gray-600', icon: Clock },
    }

    const config = statusConfig[status] || statusConfig['Pendente']
    const Icon = config.icon

    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="w-3 h-3 mr-1" />
        {status || 'Pendente'}
      </Badge>
    )
  }

  // ✅ Seu backend não tem progress, então esse cálculo vira “indicativo”
  // com base no status mais recente da mesma etapa (titulo).
  const calculateOverallProgress = () => {
    if (!timeline || timeline.length === 0) return 0

    // pegar o último status por titulo (mais recente já vem ordenado desc do backend)
    const latestByTitle = {}
    timeline.forEach((t) => {
      if (!latestByTitle[t.titulo]) latestByTitle[t.titulo] = t
    })

    const list = Object.values(latestByTitle)
    if (list.length === 0) return 0

    const score = list.reduce((sum, item) => {
      if (item.status === 'Concluído') return sum + 100
      if (item.status === 'Em Andamento') return sum + 50
      return sum + 0
    }, 0)

    return Math.round(score / list.length)
  }

  // ✅ lista sem duplicar visualmente: mostrar somente a última por titulo
  const getVisibleTimeline = () => {
    if (!timeline || timeline.length === 0) return []
    const latestByTitle = {}
    timeline.forEach((t) => {
      if (!latestByTitle[t.titulo]) latestByTitle[t.titulo] = t
    })
    return Object.values(latestByTitle)
  }

  const visibleTimeline = getVisibleTimeline()

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

                <div className="h-3 bg-green-100 rounded">
                  <div
                    className="h-3 bg-green-600 rounded"
                    style={{ width: `${calculateOverallProgress()}%` }}
                  />
                </div>

                <p className="text-sm text-green-600 mt-2">
                  {visibleTimeline.filter(t => t.status === 'Concluído').length} de {visibleTimeline.length} etapas concluídas
                </p>
              </div>

              {visibleTimeline.length === 0 ? (
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
                  {visibleTimeline.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-4 border-2 rounded-lg hover:shadow-md transition-shadow"
                      style={{
                        borderColor:
                          item.status === 'Concluído' ? '#22c55e'
                            : item.status === 'Em Andamento' ? '#3b82f6'
                              : '#d1d5db'
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-700">
                              {index + 1}. {item.titulo}
                            </span>
                          </div>

                          {item.descricao && (
                            <p className="text-sm text-gray-600 mb-2">{item.descricao}</p>
                          )}

                          <div className="flex gap-4 text-xs text-gray-500">
                            {item.created_at && (
                              <span>Criado em: {new Date(item.created_at).toLocaleDateString('pt-BR')}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {getStatusBadge(item.status)}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteStage(item.id)}
                            className="flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Status:</span>
                          <span className="font-semibold">{item.status || 'Pendente'}</span>
                        </div>

                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateProgress(item.id, 0)}
                            className="flex-1"
                          >
                            Pendente
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateProgress(item.id, 50)}
                            className="flex-1"
                          >
                            Em Andamento
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateProgress(item.id, 100)}
                            className="flex-1 bg-green-50 hover:bg-green-100"
                          >
                            Concluído
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {visibleTimeline.length > 0 && (
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

              <div className="space-y-2">
                <input
                  type="text"
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  placeholder="Nome da etapa personalizada"
                  className="w-full p-2 border rounded-md"
                />

                <textarea
                  value={newStageDesc}
                  onChange={(e) => setNewStageDesc(e.target.value)}
                  placeholder="Descrição (opcional)"
                  className="w-full p-2 border rounded-md"
                />

                <Button
                  onClick={() => newStageName && handleAddStage(newStageName)}
                  disabled={!newStageName}
                  className="bg-green-600 hover:bg-green-700 w-full"
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
