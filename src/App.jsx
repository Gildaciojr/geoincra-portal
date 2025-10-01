import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  MapPin, 
  FileText, 
  Calculator, 
  Database, 
  Workflow, 
  CheckCircle2, 
  Clock, 
  Users, 
  Building2,
  TrendingUp,
  Settings,
  FileCheck,
  Layers,
  GitBranch
} from 'lucide-react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-2 rounded-lg shadow-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Portal GeoINCRA</h1>
                <p className="text-sm text-gray-600">Georreferenciamento e Regularização Fundiária</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Sistema Ativo
              </Badge>
              <Button variant="default" className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800">
                <Users className="w-4 h-4 mr-2" />
                Acessar Painel
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="mb-8 bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Bem-vindo ao Portal GeoINCRA</h2>
              <p className="text-green-100 text-lg mb-4">
                Plataforma completa para automação de processos de georreferenciamento e regularização fundiária
              </p>
              <div className="flex space-x-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-sm text-green-100">Projetos Ativos</p>
                  <p className="text-2xl font-bold">127</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-sm text-green-100">Área Total (ha)</p>
                  <p className="text-2xl font-bold">15.432</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-sm text-green-100">Documentos Gerados</p>
                  <p className="text-2xl font-bold">1.843</p>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Layers className="w-32 h-32 text-white/80" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm border border-green-200 shadow-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Workflow className="w-4 h-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="processes" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <GitBranch className="w-4 h-4 mr-2" />
              Processos
            </TabsTrigger>
            <TabsTrigger value="automation" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Automação
            </TabsTrigger>
            <TabsTrigger value="calculator" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Calculator className="w-4 h-4 mr-2" />
              Orçamento
            </TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Clock className="w-4 h-4 mr-2" />
              Cronograma
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-green-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-700">
                    <FileText className="w-5 h-5 mr-2" />
                    Documentação
                  </CardTitle>
                  <CardDescription>Gestão completa de documentos</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Sistema completo para gerenciamento de confrontações, registros e georreferenciamento de imóveis rurais.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                      Declarações de anuência
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                      Memoriais descritivos
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                      Averbações de matrícula
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-blue-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-700">
                    <Database className="w-5 h-5 mr-2" />
                    Integração SIGEF
                  </CardTitle>
                  <CardDescription>Consolidação de dados</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Verificação automática de confrontações atualizadas no SIGEF para integração ao sistema.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-blue-600" />
                      Validação de limites
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-blue-600" />
                      Geração de planilhas ODS
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-blue-600" />
                      Integração com ARTs
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-purple-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-700">
                    <Settings className="w-5 h-5 mr-2" />
                    Automação
                  </CardTitle>
                  <CardDescription>Processamento inteligente</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Automação completa do processamento de dados e geração de documentos técnicos.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-purple-600" />
                      Processamento AutoCAD
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-purple-600" />
                      Geração de peças técnicas
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-purple-600" />
                      Fluxo automatizado
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Features Grid */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-2xl text-green-700">Funcionalidades Principais</CardTitle>
                <CardDescription>Recursos completos para gestão de projetos de georreferenciamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Mapeamento de Processos</h4>
                        <p className="text-sm text-gray-600">
                          Documentação completa de confrontações, registros e delimitações in loco sem litígios.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Workflow className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Fluxo de Trabalho</h4>
                        <p className="text-sm text-gray-600">
                          Gestão eficiente de profissionais de campo e integração com cartórios.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <FileCheck className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Validação Técnica</h4>
                        <p className="text-sm text-gray-600">
                          Verificação automática de conformidade com normas do INCRA e legislação vigente.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-orange-100 p-2 rounded-lg">
                        <Calculator className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Motor de Cálculo</h4>
                        <p className="text-sm text-gray-600">
                          Sistema flexível para cálculo de orçamentos, despesas cartorárias e emolumentos.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-emerald-100 p-2 rounded-lg">
                        <Building2 className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Integração com Cartórios</h4>
                        <p className="text-sm text-gray-600">
                          Conexão direta com sistemas de registro de imóveis para agilizar processos.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-pink-100 p-2 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-pink-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Relatórios e Análises</h4>
                        <p className="text-sm text-gray-600">
                          Dashboards completos com métricas de desempenho e acompanhamento de projetos.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Processes Tab */}
          <TabsContent value="processes" className="space-y-6">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-2xl text-green-700">Mapeamento de Processos e Fluxos</CardTitle>
                <CardDescription>Gestão completa do ciclo de vida dos projetos de georreferenciamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Documentação e Registros
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-2">Confrontações</h4>
                        <p className="text-sm text-gray-600">
                          Sistema completo para gerenciamento de declarações de anuência de confrontantes, incluindo validação de limites e memorial descritivo.
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-2">Georreferenciamento</h4>
                        <p className="text-sm text-gray-600">
                          Processamento de dados geodésicos conforme Sistema Geodésico Brasileiro e normas do INCRA.
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-2">Averbações</h4>
                        <p className="text-sm text-gray-600">
                          Atualização automática de informações cadastrais e averbações necessárias na matrícula do imóvel.
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-2">Delimitações</h4>
                        <p className="text-sm text-gray-600">
                          Validação de delimitações in loco, garantindo ausência de litígios e conformidade legal.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                      <Database className="w-5 h-5 mr-2" />
                      Consolidação de Dados SIGEF
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">Verificação Automática</p>
                          <p className="text-sm text-gray-600">
                            Consolidação de dados e verificação de confrontações atualizadas no SIGEF para integração ao sistema.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">Validação de Limites</p>
                          <p className="text-sm text-gray-600">
                            Verificação de conformidade dos limites descritos com as informações do SIGEF.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">Integração Completa</p>
                          <p className="text-sm text-gray-600">
                            Sincronização automática com o Sistema de Gestão Fundiária (SIGEF) do INCRA.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Automation Tab */}
          <TabsContent value="automation" className="space-y-6">
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-700">Automação de Processos</CardTitle>
                <CardDescription>Fluxo automatizado de geração de documentos e processamento de dados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                      <Settings className="w-5 h-5 mr-2" />
                      Processamento AutoCAD e Gestão de Campo
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <Workflow className="w-4 h-4 mr-2 text-purple-600" />
                          Arquitetura de Automação
                        </h4>
                        <p className="text-sm text-gray-600">
                          Detalhamento da arquitetura de automação, focando na extração de dados e integração com cartórios. Garantia de fluxo eficiente na fase inicial do projeto, alinhando processos técnicos e facilitando futuras implementações.
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-purple-600" />
                          Documentação Completa
                        </h4>
                        <p className="text-sm text-gray-600">
                          Documentação completa do fluxo de automação, incluindo processamento e geração de peças técnicas.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                      <Layers className="w-5 h-5 mr-2" />
                      Integração SIGEF e Geração de Documentos
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-2">Planilhas ODS</h4>
                        <p className="text-sm text-gray-600">
                          Geração automática de planilhas no formato ODS com dados do projeto.
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-2">ARTs</h4>
                        <p className="text-sm text-gray-600">
                          Criação automatizada de Anotações de Responsabilidade Técnica.
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-2">Integração SIGEF</h4>
                        <p className="text-sm text-gray-600">
                          Sincronização direta com o sistema do INCRA.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-lg border border-emerald-200">
                    <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
                      <FileCheck className="w-5 h-5 mr-2" />
                      Geração Automatizada de Peças Técnicas
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">Validação da Integração</p>
                          <p className="text-sm text-gray-600">
                            Foco na validação da integração das peças técnicas ao fluxo geral e no funcionamento automatizado.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">Coesão e Operacionalidade</p>
                          <p className="text-sm text-gray-600">
                            Garantia de que toda a arquitetura de automação esteja coesa e operacional na plataforma GEOINCRA.COM.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">Documento Consolidado</p>
                          <p className="text-sm text-gray-600">
                            Preparação do documento consolidado para entrega com toda a documentação técnica.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="space-y-6">
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="text-2xl text-orange-700">Motor de Cálculo de Orçamento</CardTitle>
                <CardDescription>Sistema flexível para cálculo de despesas cartorárias e orçamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-lg border border-orange-200">
                    <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
                      <Calculator className="w-5 h-5 mr-2" />
                      Parâmetros Orçamentários
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-2">Flexibilidade e Atualização</h4>
                        <p className="text-sm text-gray-600">
                          O sistema permite flexibilidade e atualizações fáceis para parâmetros de orçamento e despesas cartorárias, garantindo precisão nos cálculos.
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-2">Regras de Negócio</h4>
                        <p className="text-sm text-gray-600">
                          Estruturas alinhadas às regras de negócio, permitindo cálculo preciso com tabelas escaláveis para faixas de preço e variáveis de ajuste.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                      <Database className="w-5 h-5 mr-2" />
                      Modelagem do Banco de Dados
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-2">Faixas de Preço por Área</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Tabelas para faixas de preço por área e variáveis de ajuste, garantindo flexibilidade e atualização fácil.
                        </p>
                        <div className="bg-gray-50 p-3 rounded border border-gray-200">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-300">
                                <th className="text-left py-2">Faixa (ha)</th>
                                <th className="text-right py-2">Preço/ha</th>
                                <th className="text-right py-2">Limite Mínimo</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-gray-200">
                                <td className="py-2">0 - 50</td>
                                <td className="text-right">R$ 120,00</td>
                                <td className="text-right">R$ 3.000,00</td>
                              </tr>
                              <tr className="border-b border-gray-200">
                                <td className="py-2">51 - 200</td>
                                <td className="text-right">R$ 95,00</td>
                                <td className="text-right">R$ 6.000,00</td>
                              </tr>
                              <tr>
                                <td className="py-2">201+</td>
                                <td className="text-right">R$ 75,00</td>
                                <td className="text-right">R$ 15.000,00</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-2">Variáveis de Ajuste</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Modificadores percentuais ou fixos aplicáveis conforme características do projeto.
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-sm">Tabela de Emolumentos</span>
                            <Badge variant="outline">Variável</Badge>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-sm">Impostos Municipais</span>
                            <Badge variant="outline">Por Estado</Badge>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-sm">Complexidade Técnica</span>
                            <Badge variant="outline">0% - 30%</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                      <Settings className="w-5 h-5 mr-2" />
                      Motor de Cálculo
                    </h3>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        Consolidação da especificação técnica do motor de cálculo, integrando todas as regras para execução eficiente.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                          <p className="text-2xl font-bold text-green-600">100%</p>
                          <p className="text-xs text-gray-600">Precisão</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                          <p className="text-2xl font-bold text-blue-600">&lt; 2s</p>
                          <p className="text-xs text-gray-600">Tempo de Cálculo</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                          <p className="text-2xl font-bold text-purple-600">15+</p>
                          <p className="text-xs text-gray-600">Variáveis</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <Card className="border-indigo-200">
              <CardHeader>
                <CardTitle className="text-2xl text-indigo-700">Cronograma de Implementação</CardTitle>
                <CardDescription>Planejamento detalhado das etapas de desenvolvimento e entrega</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
                    <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Especificações de Entrega
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">Tarefas Técnicas</h4>
                          <Badge className="bg-indigo-100 text-indigo-700">Em Andamento</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Detalhamento das tarefas técnicas de cada etapa do cronograma, focando na integração dos componentes do motor de cálculo e APIs.
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">Clareza na Implementação</h4>
                          <Badge className="bg-green-100 text-green-700">Ativo</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Garantia de continuidade e clareza na implementação através de reuniões de micro entrega.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                      <GitBranch className="w-5 h-5 mr-2" />
                      Integração e Entregáveis
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">Scripts de Migração</p>
                          <p className="text-sm text-gray-600">
                            Desenvolvimento de scripts para migração de dados e estruturação do banco de dados.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">Componentes React</p>
                          <p className="text-sm text-gray-600">
                            Criação de componentes reutilizáveis para interface do usuário.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">Endpoints API</p>
                          <p className="text-sm text-gray-600">
                            Desenvolvimento de APIs RESTful para integração com sistemas externos.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">Planos de Seed de Dados</p>
                          <p className="text-sm text-gray-600">
                            Preparação de dados iniciais para testes e demonstrações.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Estrutura e Manutenção
                    </h3>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600 mb-4">
                        Garantia de que cada fase seja bem alinhada, assegurando uma implementação estruturada, eficiente e de fácil manutenção.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h5 className="font-semibold text-gray-900 text-sm">Modelo de Pagamento</h5>
                          <p className="text-xs text-gray-600">
                            Entrada + quinzenas para manter o projeto alinhado com visibilidade constante do progresso.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h5 className="font-semibold text-gray-900 text-sm">Reuniões de Micro Entrega</h5>
                          <p className="text-xs text-gray-600">
                            Sessões regulares para validação de entregas e ajustes de escopo conforme necessário.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg border border-amber-200">
                    <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center">
                      <FileCheck className="w-5 h-5 mr-2" />
                      Próximos Passos
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-600">
                          <strong>Modelagem do Banco de Dados:</strong> Aprofundar na estruturação das tabelas e relacionamentos para garantir escalabilidade e performance.
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-600">
                          <strong>Ferramentas de Automação:</strong> Definição final das ferramentas e frameworks para implementação do fluxo automatizado.
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-600">
                          <strong>Sistema de Afiliados:</strong> Implementação do painel de administração e robustez das automações.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-green-200 mt-12">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-2 rounded-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Portal GeoINCRA</h3>
              </div>
              <p className="text-sm text-gray-600">
                Plataforma completa para automação de processos de georreferenciamento e regularização fundiária, em conformidade com as normas do INCRA.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Funcionalidades</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Mapeamento de Processos</li>
                <li>• Integração SIGEF</li>
                <li>• Automação de Documentos</li>
                <li>• Motor de Cálculo</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Documentação Técnica</li>
                <li>• Treinamento</li>
                <li>• Suporte Técnico</li>
                <li>• FAQ</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-6 text-center">
            <p className="text-sm text-gray-600">
              © 2025 Portal GeoINCRA. Todos os direitos reservados. Sistema desenvolvido em conformidade com a Lei nº 10.267/2001 e Decreto nº 4.449/2002.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
