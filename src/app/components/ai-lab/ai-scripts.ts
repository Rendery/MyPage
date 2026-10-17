// Sesiones de ejemplo que se "escriben" en la terminal de la sección IA.
// Son demostraciones ilustrativas basadas en el tipo de trabajo de mis proyectos reales.

export type LineKind = 'prompt' | 'user' | 'info' | 'plan' | 'tool' | 'ok' | 'dim';

export interface ScriptLine {
  k: LineKind;
  t: string;
}

export type Agent = 'claude' | 'codex';
export type Scenario = 'sunat' | 'cobranza' | 'tests';

export const SCENARIOS: { id: Scenario; label: string }[] = [
  { id: 'sunat', label: 'Comprobantes SUNAT' },
  { id: 'cobranza', label: 'Reporte de cobranza' },
  { id: 'tests', label: 'Tests E2E' },
];

export const SCRIPTS: Record<Agent, Record<Scenario, ScriptLine[]>> = {
  claude: {
    sunat: [
      { k: 'prompt', t: 'claude' },
      { k: 'user', t: 'Genera la boleta en PDF a partir del DNI y el monto. Agrega tests.' },
      { k: 'info', t: '● Leyendo el proyecto bienestar-sunat…' },
      { k: 'plan', t: '● Plan' },
      { k: 'dim', t: '   1. Validar DNI (8 dígitos) y monto mayor a 0' },
      { k: 'dim', t: '   2. Armar el comprobante y generar el PDF' },
      { k: 'dim', t: '   3. Cubrir los casos con pytest' },
      { k: 'tool', t: '● Update(src/comprobantes/boleta.py)   +46 −4' },
      { k: 'tool', t: '● Bash(pytest -q)' },
      { k: 'ok', t: '   ✓ 12 passed in 1.84s' },
      { k: 'ok', t: '✓ Listo. Reviso el diff antes de hacer commit.' },
    ],
    cobranza: [
      { k: 'prompt', t: 'claude' },
      { k: 'user', t: 'Cada mañana necesito el reporte de cobranza del día anterior.' },
      { k: 'info', t: '● Explorando agendas y pagos pendientes…' },
      { k: 'plan', t: '● Plan' },
      { k: 'dim', t: '   1. Consultar las citas del día con deuda' },
      { k: 'dim', t: '   2. Agrupar por terapeuta y medio de pago' },
      { k: 'dim', t: '   3. Armar el mensaje listo para WhatsApp' },
      { k: 'tool', t: '● Write(reportes/cobranza_diaria.py)   +88' },
      { k: 'tool', t: '● Bash(python -m reportes.cobranza_diaria --fecha ayer)' },
      { k: 'ok', t: '   ✓ reporte generado · mensaje listo para copiar' },
      { k: 'ok', t: '✓ Listo. Lo dejo documentado en el README.' },
    ],
    tests: [
      { k: 'prompt', t: 'claude' },
      { k: 'user', t: 'Escribe tests E2E con Playwright para el flujo de agendar cita.' },
      { k: 'info', t: '● Leyendo rutas y formularios…' },
      { k: 'tool', t: '● Write(tests/agendar-cita.spec.ts)   +64' },
      { k: 'tool', t: '● Bash(npx playwright test)' },
      { k: 'ok', t: '   ✓ agenda una cita con datos válidos' },
      { k: 'ok', t: '   ✓ muestra error si el DNI es inválido' },
      { k: 'ok', t: '   ✓ bloquea horarios ocupados' },
      { k: 'dim', t: '   3 passed (4.2s)' },
      { k: 'ok', t: '✓ Tests en verde. Siguiente paso: correrlos en CI.' },
    ],
  },
  codex: {
    sunat: [
      { k: 'prompt', t: 'codex "agrega validación de RUC para facturas"' },
      { k: 'info', t: '› Analizando el repositorio…' },
      { k: 'plan', t: '› Plan: 11 dígitos + dígito verificador, mensajes claros' },
      { k: 'tool', t: '› Editando src/comprobantes/factura.py' },
      { k: 'tool', t: '› Ejecutando pytest -q' },
      { k: 'ok', t: '  ✓ 15 passed' },
      { k: 'ok', t: '› Diff listo para revisión (+31 −2)' },
    ],
    cobranza: [
      { k: 'prompt', t: 'codex "consolida la caja del mes por medio de pago"' },
      { k: 'info', t: '› Leyendo finanzas/caja.py…' },
      { k: 'plan', t: '› Clasificando: efectivo · tarjeta · transferencia · extornos' },
      { k: 'tool', t: '› Editando finanzas/consolidado.py' },
      { k: 'tool', t: '› Ejecutando python -m finanzas.consolidado --mes actual' },
      { k: 'ok', t: '  ✓ consolidado.xlsx generado' },
      { k: 'ok', t: '› Diff listo para revisión (+52 −9)' },
    ],
    tests: [
      { k: 'prompt', t: 'codex "revisa el PR y busca casos sin cubrir"' },
      { k: 'info', t: '› Revisando 6 archivos cambiados…' },
      { k: 'plan', t: '› 2 casos sin test: monto con decimales, DNI con espacios' },
      { k: 'tool', t: '› Agregando tests/test_validaciones.py' },
      { k: 'tool', t: '› Ejecutando pytest -q' },
      { k: 'ok', t: '  ✓ 18 passed' },
      { k: 'dim', t: '› Sugerencia: normalizar el DNI antes de validar' },
    ],
  },
};

export const PRINCIPLES = [
  {
    n: '01',
    title: 'Contexto primero',
    text: 'Antes de pedir código, le explico al agente el negocio, el proceso y la estructura del proyecto.',
    simpleTitle: 'Primero entiendo tu negocio',
    simpleText: 'Antes de construir nada, escucho cómo trabajas y qué te quita tiempo.',
  },
  {
    n: '02',
    title: 'Plan antes que código',
    text: 'Reviso el plan paso a paso. Si no lo entiendo, no lo ejecuto.',
    simpleTitle: 'Planifico antes de construir',
    simpleText: 'Defino paso a paso qué se va a hacer, para que no haya sorpresas.',
  },
  {
    n: '03',
    title: 'Verifico todo',
    text: 'Tests, revisión del diff y prueba manual antes de cada commit.',
    simpleTitle: 'Pruebo todo',
    simpleText: 'Reviso que cada cosa funcione bien antes de entregártela.',
  },
  {
    n: '04',
    title: 'La IA acelera, el criterio es mío',
    text: 'Respondo por cada línea que entrego, la haya escrito yo o un agente.',
    simpleTitle: 'La IA ayuda, la responsabilidad es mía',
    simpleText: 'Respondo por todo lo que entrego, de principio a fin.',
  },
];

/** Versión simple: un pedido real de negocio y cómo lo resuelvo con ayuda de IA. */
export const SIMPLE_REQUESTS = [
  {
    label: 'Resumen de ventas',
    text: 'Quiero recibir cada mañana un resumen de las ventas de ayer.',
    result: '📊 Resumen de ventas: llega a tu correo cada día a las 8:00 a. m.',
  },
  {
    label: 'Recordatorios de citas',
    text: 'Necesito que mis clientes reciban un recordatorio un día antes de su cita.',
    result: '📅 Recordatorios automáticos: se envían solos un día antes.',
  },
  {
    label: 'Ordenar mis Excel',
    text: 'Tengo muchos Excel desordenados y pierdo horas juntándolos.',
    result: '📁 Un solo reporte ordenado, con un clic.',
  },
];

export const SIMPLE_STEPS = [
  { icon: '👂', title: 'Entiendo lo que necesitas', text: 'Me cuentas cómo trabajas hoy.' },
  { icon: '✦', title: 'Lo construyo con ayuda de IA', text: 'La IA me ayuda a avanzar mucho más rápido.' },
  { icon: '🔍', title: 'Lo pruebo a fondo', text: 'Reviso que funcione en todos los casos.' },
  { icon: '🚀', title: 'Te lo entrego funcionando', text: 'Listo para usar desde el primer día.' },
];

export const AI_TOOLKIT_SIMPLE = ['Inteligencia artificial', 'Chatbots', 'Automatización', 'Asistentes de IA', 'Reportes automáticos', 'Apps para celular', 'Análisis de datos'];

export const AI_TOOLKIT = ['Claude Code', 'Codex', 'ChatGPT', 'APIs de IA', 'Agentes de código', 'Prompt engineering', 'NLP / Chatbots', 'TensorFlow', 'Machine Learning'];
