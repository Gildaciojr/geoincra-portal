import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";

import { RequerimentosTab } from "./components/RequerimentosTab.jsx";
import { ProcessosTab } from "./components/ProcessosTab.jsx";
import { AutomacaoTab } from "./components/AutomacaoTab.jsx";
import { CronogramaTab } from "./components/CronogramaTab.jsx";
import { BudgetWizard } from "./components/BudgetWizard.jsx";
import { ProposalWizard } from "./components/ProposalWizard.jsx";
import { GeorreferenciamentoSection } from "./components/GeorreferenciamentoSection.jsx";
import { AuthModal } from "./components/AuthModal.jsx";
import { useAuth } from "./context/AuthContext.jsx";

import {
  MapPin,
  FileText,
  Calculator,
  Database,
  Workflow,
  CheckCircle2,
  Clock,
  Users,
  Settings,
  FileCheck,
  Layers,
  GitBranch,
  Plus,
  X,
  FileDown,
} from "lucide-react";

import "./App.css";

// 🔥 NOVO — serviço de municípios
import { searchMunicipios } from "./services/municipios";

function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showPanel, setShowPanel] = useState(false);
  const [projects, setProjects] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [lastBudgetPayload, setLastBudgetPayload] = useState(null);

 const { token: _token, user: _user, isAuthenticated, logout: _logout } = useAuth();
 const handleLogout = () => {
  _logout();
  setShowPanel(false);
  setSelectedProject(null);
  setActiveTab("overview");
};

  const [showAuthModal, setShowAuthModal] = useState(false);

  // ➤ Estados do formulário de novo projeto
  const [newProject, setNewProject] = useState({
  name: "",
  description: "",
  tipo_processo: "",
  area_hectares: "",
  municipio_id: null,
  municipio: "",
  uf: "",
  owner_name: "",
  owner_cpf: "",
  property_ccir: "",
  property_matricula: "",
  });


  // ================================
  // ESTADOS PARA MUNICÍPIOS (autocomplete)
  // ================================
  const [municipios, setMunicipios] = useState([]);
  const [municipioSearch, setMunicipioSearch] = useState("");

  const fetchMunicipios = async (search = "") => {
    try {
      const data = await searchMunicipios(search);
      setMunicipios(data);
    } catch (error) {
      console.error("Erro ao carregar municípios:", error);
    }
  };

  useEffect(() => {
    if (municipioSearch.length >= 2) {
      fetchMunicipios(municipioSearch);
    }
  }, [municipioSearch]);

  // ================================
  // FETCH PROJECTS
  // ================================
const fetchProjects = async () => {
  if (!isAuthenticated) return;

  try {
    const response = await fetch("/api/projects/cards", {
      headers: {
        Authorization: `Bearer ${_token}`,
      },
    });

    if (!response.ok) return;

    const data = await response.json();
    setProjects(data);
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
};


  // ================================
  // FETCH DOCUMENTS
  // ================================
const fetchDocuments = async () => {
  if (!isAuthenticated || !selectedProject) return;

  try {
    const response = await fetch(
      `/api/documents?project_id=${selectedProject.id}`,
      {
        headers: {
          Authorization: `Bearer ${_token}`,
        },
      }
    );

    if (!response.ok) return;

    const data = await response.json();
    setDocuments(data);
  } catch (error) {
    console.error("Error fetching documents:", error);
  }
};


// ================================
// FETCH TIMELINE
// ================================
const fetchTimeline = async () => {
  if (!isAuthenticated || !selectedProject) return;

  try {
    const response = await fetch(
      `/api/projects/${selectedProject.id}/timeline/`,
      {
        headers: {
          Authorization: `Bearer ${_token}`,
        },
      }
    );

    if (!response.ok) {
      setTimeline([]);
      return;
    }

    const data = await response.json();
    setTimeline(data);
  } catch (error) {
    console.error("Error fetching timeline:", error);
    setTimeline([]);
  }
};

// ================================
// FETCH PROPOSALS 
// ================================
const fetchProposals = async () => {
  if (!isAuthenticated || !selectedProject) return;

  try {
    const response = await fetch(
      `/api/propostas/history/${selectedProject.id}`,
      {
        headers: {
          Authorization: `Bearer ${_token}`,
        },
      }
    );

    if (!response.ok) {
      setProposals([]);
      return;
    }

    const data = await response.json();
    setProposals(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Erro ao carregar histórico de propostas:", error);
    setProposals([]);
  }
};

// Load projects only when authenticated
useEffect(() => {
  if (isAuthenticated) {
    fetchProjects();
  } else {
    setProjects([]);
    setDocuments([]);
    setTimeline([]);
    setProposals([]);
    setSelectedProject(null);
    setActiveTab("overview");
  }
}, [isAuthenticated]);


// Load project-related data only when authenticated
useEffect(() => {
  if (isAuthenticated && selectedProject) {
    fetchDocuments();
    fetchTimeline();
    fetchProposals();
  }
}, [isAuthenticated, selectedProject]);


// ================================
// CREATE PROJECT
// ================================
const handleCreateProject = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("/api/projects/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${_token}`,
      },
      body: JSON.stringify({
        // PROJETO
        name: newProject.name,
        descricao_simplificada: newProject.description,
        tipo_processo: newProject.tipo_processo || null,

        municipio: newProject.municipio,
        uf: newProject.uf,

        codigo_imovel_rural: newProject.property_ccir,
        codigo_sncr: null,
        codigo_car: null,
        codigo_sigef: null,

        observacoes: null,

        // IMÓVEL
        area_hectares: parseFloat(newProject.area_hectares),
        municipio_id: newProject.municipio_id,
        ccir: newProject.property_ccir,
        matricula_principal: newProject.property_matricula,

        // PROPRIETÁRIO
        proprietario_nome: newProject.owner_name,
        proprietario_cpf: newProject.owner_cpf,
        proprietario_cnpj: null,
        proprietario_tipo: "FISICA",
      }),
    });

    if (response.ok) {
      alert("Projeto criado com sucesso!");

      setNewProject({
        name: "",
        description: "",
        tipo_processo: "",
        area_hectares: "",
        municipio_id: null,
        municipio: "",
        uf: "",
        owner_name: "",
        owner_cpf: "",
        property_ccir: "",
        property_matricula: "",
      });

      fetchProjects();
    } else {
      const err = await response.json();
      console.error("Erro backend:", err);
      alert("Erro ao criar projeto.");
    }
  } catch (error) {
    console.error("Error creating project:", error);
  }
};


  // ================================
  // METRICS
  // ================================
  const totalArea = projects.reduce(
    (sum, p) => sum + (p.area_hectares || 0),
    0
  );
  const totalDocuments = projects.reduce(
    (sum, p) => sum + (p.documents_generated || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* AUTH MODAL */}
        <AuthModal
       open={showAuthModal}
      onOpenChange={setShowAuthModal}
      />


      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-2 rounded-lg shadow-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Portal GeoINCRA
                </h1>
                <p className="text-sm text-gray-600">
                  Georreferenciamento e Regularização Fundiária
                </p>
              </div>
            </div>

<div className="flex items-center space-x-4">
  <Badge
    variant="outline"
    className="bg-green-100 text-green-700 border-green-300"
  >
    <CheckCircle2 className="w-4 h-4 mr-1" />
    Sistema Ativo
  </Badge>

  {!isAuthenticated ? (
    <Button
      className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
      onClick={() => setShowAuthModal(true)}
    >
      <Users className="w-4 h-4 mr-2" />
      Acessar Painel
    </Button>
  ) : (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        onClick={() => setShowPanel((v) => !v)}
      >
        <Users className="w-4 h-4 mr-2" />
        {showPanel ? "Fechar Painel" : "Painel"}
      </Button>

      <Button
        variant="destructive"
        onClick={handleLogout}
      >
        Sair
      </Button>
    </div>
  )}
</div>

          </div>
        </div>
      </header>

      {/* ADMIN PANEL */}
      {showPanel && isAuthenticated && (
        <div className="bg-white border-b border-green-200 shadow-lg">

          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Painel de Administração
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPanel(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* FORM NOVO PROJETO */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-green-700">
                    <Plus className="w-5 h-5 mr-2" />
                    Novo Projeto
                  </CardTitle>
                  <CardDescription>
                    Cadastre um novo projeto de georreferenciamento
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleCreateProject} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome do Projeto</Label>
                      <Input
                        id="name"
                        value={newProject.name}
                        onChange={(e) =>
                          setNewProject({ ...newProject, name: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={newProject.description}
                        onChange={(e) =>
                          setNewProject({
                            ...newProject,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="area">Área (ha)</Label>
                        <Input
                          id="area"
                          type="number"
                          step="0.01"
                          value={newProject.area_hectares}
                          onChange={(e) =>
                            setNewProject({
                              ...newProject,
                              area_hectares: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="owner">Proprietário</Label>
                        <Input
                          id="owner"
                          value={newProject.owner_name}
                          onChange={(e) =>
                            setNewProject({
                              ...newProject,
                              owner_name: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cpf">CPF</Label>
                        <Input
                          id="cpf"
                          value={newProject.owner_cpf}
                          onChange={(e) =>
                            setNewProject({
                              ...newProject,
                              owner_cpf: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="ccir">CCIR</Label>
                        <Input
                          id="ccir"
                          value={newProject.property_ccir}
                          onChange={(e) =>
                            setNewProject({
                              ...newProject,
                              property_ccir: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

{/* MUNICÍPIO — AUTOCOMPLETE */}
<div>
  <Label htmlFor="municipio">Município</Label>

  <Input
    id="municipio"
    placeholder="Digite para buscar…"
    value={municipioSearch}
    onChange={(e) => {
      const value = e.target.value;
      setMunicipioSearch(value);
      setNewProject({
        ...newProject,
        municipio: value,
      });
    }}
  />

{/* LISTA DE SUGESTÕES */}
{municipioSearch.length >= 2 && municipios.length > 0 && (
  <div className="mt-2 border rounded-lg bg-white shadow max-h-48 overflow-y-auto">
    {municipios.map((m) => (
      <div
        key={m.id}
        className="px-3 py-2 cursor-pointer hover:bg-green-50"
        onClick={() => {
          const label = `${m.nome} - ${m.estado}`;

          setMunicipioSearch(label);

          setNewProject({
            ...newProject,
            municipio: label,
            municipio_id: m.id,   // 🔥 OBRIGATÓRIO PARA O BACKEND
            uf: m.estado,         // 🔥 NECESSÁRIO PARA PROJECT
          });

          setMunicipios([]); // 🔒 fecha a lista após seleção
        }}
      >
        {m.nome} — {m.estado}
      </div>
    ))}
  </div>
)}
</div>



                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Projeto
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* LISTA DE PROJETOS */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-700">
                    <FileText className="w-5 h-5 mr-2" />
                    Projetos Cadastrados
                  </CardTitle>
                  <CardDescription>
                    Total de {projects.length} projeto(s)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {projects.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Nenhum projeto cadastrado
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {projects.map((project) => (
                        <div
                          key={project.id}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedProject?.id === project.id
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                          }`}
                          onClick={() => setSelectedProject(project)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">
                                {project.name}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {project.description}
                              </p>

                              <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                <span>Área: {project.area_hectares} ha</span>
                                <span>Proprietário: {project.owner_name}</span>
                              </div>

                              <div className="flex gap-2 mt-2 text-xs">
                                <span className="text-gray-500">
                                  CPF: {project.owner_cpf}
                                </span>
                                <span className="text-gray-500">
                                  CCIR: {project.property_ccir}
                                </span>
                              </div>

                              <Button
                                className="mt-3 bg-teal-600 hover:bg-teal-700 text-white"
                                onClick={() => {
                                  setSelectedProject(project);
                                  setActiveTab("proposals");
                                }}
                              >
                                Gerar Proposta
                              </Button>
                            </div>

                            {selectedProject?.id === project.id && (
                              <Badge className="bg-green-500 text-white">
                                Em Andamento
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="container mx-auto px-6 py-8">
        {/* HERO */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">
                Bem-vindo ao Portal GeoINCRA
              </h2>
              <p className="text-green-100 text-lg">
                Plataforma completa para automação de processos de
                georreferenciamento e regularização fundiária
              </p>
            </div>

            <div className="hidden md:block">
              <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl">
                <Layers className="w-20 h-20 text-white" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-green-100 text-sm mb-1">Projetos Ativos</p>
              <p className="text-3xl font-bold">{projects.length}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-green-100 text-sm mb-1">Área Total (ha)</p>
              <p className="text-3xl font-bold">{totalArea.toFixed(2)}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-green-100 text-sm mb-1">Documentos Gerados</p>
              <p className="text-3xl font-bold">{totalDocuments}</p>
            </div>
          </div>
        </div>

        {/* ================================ */}
        {/*             TABS                */}
        {/* ================================ */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6 bg-white shadow-md">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <Database className="w-4 h-4 mr-2" />
              Visão Geral
            </TabsTrigger>

            <TabsTrigger
              value="processes"
              className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
            >
              <Workflow className="w-4 h-4 mr-2" />
              Processos
            </TabsTrigger>

            <TabsTrigger
              value="automation"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              Automação
            </TabsTrigger>

            <TabsTrigger
              value="budget"
              className="data-[state=active]:bg-teal-600 data-[state=active]:text-white"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Orçamento
            </TabsTrigger>

            <TabsTrigger
            value="timeline"
           className="data-[state=active]:bg-pink-600 data-[state=active]:text-white"
          >
          <Clock className="w-4 h-4 mr-2" />
           Cronograma
          </TabsTrigger>

          <TabsTrigger
          value="requerimentos"
          className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
          >
          <FileCheck className="w-4 h-4 mr-2" />
          Requerimentos
          </TabsTrigger>


            <TabsTrigger
              value="proposals"
              className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              Propostas
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="space-y-6">
            {/* Cards superiores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 border-green-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <FileCheck className="w-12 h-12 text-green-600" />
                    <div className="text-right">
                      <CardTitle className="text-green-700">
                        Documentação
                      </CardTitle>
                      <CardDescription>Gestão de documentos</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Sistema completo para gerenciamento de confrontações e
                    documentos rurais.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Database className="w-12 h-12 text-blue-600" />
                    <div className="text-right">
                      <CardTitle className="text-blue-700">
                        Integração SIGEF
                      </CardTitle>
                      <CardDescription>Consolidação de dados</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Verificação automática de confrontações atualizadas no
                    SIGEF.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <GitBranch className="w-12 h-12 text-purple-600" />
                    <div className="text-right">
                      <CardTitle className="text-purple-700">
                        Automação
                      </CardTitle>
                      <CardDescription>Processos inteligentes</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Automação completa do processamento técnico.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Seção Georreferenciamento */}
            <GeorreferenciamentoSection />
          </TabsContent>

          {/* PROCESSES */}
          <TabsContent value="processes">
            <ProcessosTab
              selectedProject={selectedProject}
              documents={documents}
              onRefresh={fetchDocuments}
            />
          </TabsContent>

          {/* AUTOMATION */}
          <TabsContent value="automation">
            <AutomacaoTab />
          </TabsContent>

          <TabsContent value="requerimentos">
           <RequerimentosTab selectedProject={selectedProject} />
         </TabsContent>


{/* BUDGET */}
<TabsContent value="budget">
  <BudgetWizard
    projectId={selectedProject?.id}
    onGenerated={(payloadBase) => {
      // guarda o payload base do orçamento para a proposta
      setLastBudgetPayload(payloadBase);
    }}
  />
</TabsContent>

{/* TIMELINE */}
<TabsContent value="timeline">
  <CronogramaTab
    selectedProject={selectedProject}
    timeline={timeline}
    onRefresh={fetchTimeline}
  />
</TabsContent>

{/* PROPOSALS */}
<TabsContent value="proposals" className="space-y-6">

  {/* GERAÇÃO DE PROPOSTA */}
  <Card>
    <CardHeader>
      <CardTitle className="text-cyan-700 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Geração de Propostas e Contratos
      </CardTitle>
      <CardDescription>
        Utilize o motor oficial do sistema
      </CardDescription>
    </CardHeader>

    <CardContent>
      <ProposalWizard
        projectId={selectedProject?.id}
        payloadBase={lastBudgetPayload}
        onGenerated={fetchProposals}
      />
    </CardContent>
  </Card>

  {/* HISTÓRICO */}
  <Card>
    <CardHeader>
      <CardTitle>Histórico de Propostas</CardTitle>
      <CardDescription>
        Propostas geradas para este projeto
      </CardDescription>
    </CardHeader>

    <CardContent>
      {proposals.length === 0 ? (
        <p className="text-gray-600">
          Nenhuma proposta gerada ainda.
        </p>
      ) : (
        <div className="space-y-4">
          {proposals.map((p) => (
            <div
              key={p.id}
              className="p-4 border rounded-lg bg-gray-50 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  Proposta #{p.id}
                </p>
                <p className="text-sm text-gray-500">
                  Total R$ {Number(p.total).toFixed(2)} —{" "}
                  {new Date(p.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-3">
                {p.pdf_url && (
                  <a
                    href={p.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
                  >
                    <FileDown className="w-4 h-4" />
                    Proposta
                  </a>
                )}

                {p.contract_url && (
                  <a
                    href={p.contract_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
                  >
                    <FileDown className="w-4 h-4" />
                    Contrato
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>

</TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default App;

