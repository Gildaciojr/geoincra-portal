// src/components/AutomacaoTab.jsx

import { useState } from "react";

import { OnrConsultaCard } from "./automacao/OnrConsultaCard.jsx";
import { RiDigitalCard } from "./automacao/RiDigitalCard.jsx";
import { JobsList } from "./automacao/JobsList.jsx";
import { AutoCadTools } from "./AutoCadTools.jsx";
import { AutomationRunningModal } from "./automacao/AutomationRunningModal.jsx";

export function AutomacaoTab({ selectedProject }) {
  const [running, setRunning] = useState(false);

  return (
    <div className="space-y-6">
      {/* MODAL GLOBAL */}
      <AutomationRunningModal open={running} />

      {/* ONR / SIG-RI */}
      <OnrConsultaCard
        selectedProject={selectedProject}
        onCreated={() => setRunning(true)}
      />

      {/* RI DIGITAL */}
      <RiDigitalCard
        selectedProject={selectedProject}
        onCreated={() => setRunning(true)}
      />

      {/* HISTÓRICO DE JOBS */}
      <JobsList
        selectedProject={selectedProject}
        onFinished={() => setRunning(false)}
      />

      {/* FERRAMENTAS AUTOCAD */}
      <AutoCadTools />
    </div>
  );
}