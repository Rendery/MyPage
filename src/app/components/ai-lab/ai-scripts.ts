// Tipos de las sesiones de ejemplo de la terminal de IA.
// Los textos de cada sesión (en cada idioma) están en src/app/i18n/ → ai.scripts.

export type LineKind = 'prompt' | 'user' | 'info' | 'plan' | 'tool' | 'ok' | 'dim';

export interface ScriptLine {
  k: string;
  t: string;
}

export type Agent = 'claude' | 'codex';
export type Scenario = 'sunat' | 'cobranza' | 'tests';

export const SCENARIO_IDS: Scenario[] = ['sunat', 'cobranza', 'tests'];
