// src/components/AutomacaoTab.jsx

import { OnrConsultaCard } from "./automacao/OnrConsultaCard.jsx";
import { RiDigitalCard } from "./automacao/RiDigitalCard.jsx";
import { JobsList } from "./automacao/JobsList.jsx";
import { AutoCadTools } from "./AutoCadTools.jsx";

export function AutomacaoTab({ selectedProject }) {
  return (
    <div className="space-y-6">
      {/* ONR / SIG-RI */}
      <OnrConsultaCard selectedProject={selectedProject} />

      {/* RI DIGITAL */}
      <RiDigitalCard selectedProject={selectedProject} />

      {/* HISTÓRICO DE JOBS */}
      <JobsList selectedProject={selectedProject} />

      {/* FERRAMENTAS AUTOCAD (SCR / CSV) */}
      <AutoCadTools />
    </div>
  );
}
