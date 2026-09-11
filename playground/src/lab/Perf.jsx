import { useEffect, useState } from "react";
import { Btn, FormShell, Note, Pre, Row, Section } from "../ui";
import { markRestoreAndReload, readStoredRun, subscribePerf } from "./perfMetrics";
import { SCENARIOS } from "./scenarios";

function fmt(run) {
  if (!run) return "sin runs";
  return JSON.stringify(run, null, 2);
}

export default function Perf() {
  const [perf, setPerf] = useState(null);
  const [running, setRunning] = useState(null);
  const stored = readStoredRun();

  useEffect(() => subscribePerf(setPerf), []);

  async function run(scenario) {
    setRunning(scenario.id);
    try {
      await scenario.run();
    } finally {
      setRunning(null);
    }
  }

  return (
    <FormShell title="Perf" testId="form-perf">
      <Note>
        React Profiler API sobre FenestraeContainer. No usa Lighthouse ni React DevTools.
      </Note>
      <Section title="Escenarios">
        <Row>
          {SCENARIOS.map((scenario) => (
            <Btn
              key={scenario.id}
              id={`perf-${scenario.id}`}
              disabled={Boolean(running)}
              kind={running === scenario.id ? "primary" : "default"}
              onClick={() => run(scenario)}
            >
              {scenario.label}
            </Btn>
          ))}
          <Btn id="perf-restore-cold" disabled={Boolean(running)} onClick={markRestoreAndReload}>
            restore-cold (F5)
          </Btn>
        </Row>
      </Section>
      <Section title="Último run">
        <Pre testId="perf-last">{fmt(perf?.lastRun || stored)}</Pre>
      </Section>
      <Section title="Commits Profiler">
        <Pre testId="perf-commits">{JSON.stringify({
          restoreMs: perf?.lastRestoreMs ?? null,
          summary: perf ? {
            count: perf.commits.length,
            last: perf.commits.slice(-5).map((c) => ({
              phase: c.phase,
              actual: Number(c.actualDuration.toFixed(2)),
            })),
          } : null,
        }, null, 2)}</Pre>
      </Section>
    </FormShell>
  );
}
