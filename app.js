const STORAGE_KEY = "forma.onboarding.v2";
const CONFIG_KEY = "forma.workspaceConfig.v2";
const DATA_KEY = "forma.workspaceData.v2";
const DEV_MODE_KEY = "forma.developerMode.v1";
const DEV_MODE_ENABLED = true;

const app = document.querySelector("#app");

const personaOptions = [
  { id: "student", label: "Student", hint: "Coursework, deadlines, learning, exams." },
  { id: "professional", label: "Working professional", hint: "Execution, priorities, projects, follow-through." },
  { id: "athlete", label: "Athlete", hint: "Training consistency, recovery, performance." },
  { id: "builder", label: "Builder", hint: "Projects, shipping, experiments, momentum." },
  { id: "creator", label: "Creator", hint: "Ideas, notes, publishing, creative output." },
  { id: "freelancer", label: "Freelancer", hint: "Client work, admin, goals, money clarity." },
  { id: "finance-focused", label: "Finance-focused", hint: "Saving, spending, planning, financial control." },
  { id: "life-organization", label: "General life organization", hint: "Routines, notes, priorities, personal order." },
];

const outcomeOptions = [
  { id: "work-control", label: "Stay on top of work" },
  { id: "study-consistently", label: "Study consistently" },
  { id: "train-consistently", label: "Train consistently" },
  { id: "save-money", label: "Save more money" },
  { id: "better-routines", label: "Build better routines" },
  { id: "major-goal", label: "Make progress on a major goal" },
  { id: "organize-thinking", label: "Organize thoughts and decisions" },
];

const frictionOptions = [
  { id: "too-many-tasks", label: "Too many tasks" },
  { id: "unclear-priorities", label: "No clear priorities" },
  { id: "inconsistent-habits", label: "Inconsistent habits" },
  { id: "poor-planning", label: "Poor planning" },
  { id: "money-unclear", label: "Money feels unclear" },
  { id: "forget-ideas", label: "I forget ideas and decisions" },
  { id: "goals-stall", label: "I start goals but do not finish" },
];

const horizonOptions = [
  { id: "today", label: "Today" },
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
  { id: "semester", label: "This semester" },
  { id: "training-cycle", label: "This training cycle" },
  { id: "savings-period", label: "This savings period" },
];

const structureOptions = [
  { id: "light", label: "Light", hint: "One clear focus, fewer prompts." },
  { id: "balanced", label: "Balanced", hint: "A useful plan without heavy pressure." },
  { id: "strict", label: "Strict", hint: "More structure, tighter limits, stronger guidance." },
];

const currencyOptions = [
  { code: "EUR", label: "EUR (€)" },
  { code: "USD", label: "USD ($)" },
  { code: "GBP", label: "GBP (£)" },
  { code: "CAD", label: "CAD ($)" },
  { code: "AUD", label: "AUD ($)" },
];

const moduleLabels = {
  tasks: "Tasks",
  habits: "Habits",
  goals: "Goals",
  notes: "Notes",
  finance: "Finance",
};

const moduleRegistry = Object.keys(moduleLabels);

const scoring = {
  profile: {
    student: { tasks: 2, habits: 1, goals: 2, notes: 3, finance: 0 },
    professional: { tasks: 3, habits: 1, goals: 2, notes: 1, finance: 0 },
    athlete: { tasks: 1, habits: 3, goals: 2, notes: 1, finance: 0 },
    builder: { tasks: 3, habits: 1, goals: 3, notes: 2, finance: 0 },
    creator: { tasks: 1, habits: 2, goals: 2, notes: 4, finance: 0 },
    freelancer: { tasks: 3, habits: 1, goals: 2, notes: 2, finance: 2 },
    "finance-focused": { tasks: 1, habits: 0, goals: 2, notes: 1, finance: 4 },
    "life-organization": { tasks: 2, habits: 2, goals: 2, notes: 2, finance: 0 },
  },
  outcome: {
    "work-control": { tasks: 4, habits: 1, goals: 1, notes: 1, finance: 0 },
    "study-consistently": { tasks: 2, habits: 2, goals: 2, notes: 3, finance: 0 },
    "train-consistently": { tasks: 1, habits: 4, goals: 2, notes: 1, finance: 0 },
    "save-money": { tasks: 1, habits: 1, goals: 2, notes: 1, finance: 4 },
    "better-routines": { tasks: 1, habits: 4, goals: 1, notes: 1, finance: 0 },
    "major-goal": { tasks: 2, habits: 1, goals: 4, notes: 1, finance: 0 },
    "organize-thinking": { tasks: 1, habits: 0, goals: 1, notes: 4, finance: 0 },
  },
  friction: {
    "too-many-tasks": { tasks: 4, habits: 0, goals: 2, notes: 1, finance: 0 },
    "unclear-priorities": { tasks: 3, habits: 0, goals: 3, notes: 1, finance: 0 },
    "inconsistent-habits": { tasks: 1, habits: 4, goals: 1, notes: 0, finance: 0 },
    "poor-planning": { tasks: 3, habits: 1, goals: 2, notes: 2, finance: 0 },
    "money-unclear": { tasks: 1, habits: 0, goals: 2, notes: 1, finance: 4 },
    "forget-ideas": { tasks: 1, habits: 0, goals: 1, notes: 4, finance: 0 },
    "goals-stall": { tasks: 2, habits: 2, goals: 4, notes: 1, finance: 0 },
  },
};

let state = loadState();
let workspaceData = loadWorkspaceData();
let developerMode = loadDeveloperMode();

function defaultState() {
  return {
    view: "landing",
    step: 0,
    activeTab: "home",
    answers: {
      name: "",
      personas: [],
      outcome: "",
      friction: "",
      horizon: "",
      structure: "balanced",
      monthlyIncome: "",
      savingsTarget: "",
    },
    workspaceConfig: readJson(CONFIG_KEY, null),
  };
}

function defaultWorkspaceData() {
  return {
    tasks: { items: [] },
    habits: { items: [] },
    goals: { items: [], templates: goalTemplates(), timeline: [], reviews: [], activeFilter: "active" },
    notes: {
      items: [],
      templates: [],
      categories: ["General", "Daily Journal", "Knowledge Vault", "Decisions", "Training", "Study", "Projects"],
      tags: [],
      activeFilter: "all",
      search: "",
    },
    finance: {
      currency: "USD",
      monthlyIncome: 0,
      savingsTarget: 0,
      currentSavings: 0,
      transactions: [],
      budgets: [],
      savingsGoals: [],
      investments: [],
      recurringPayments: [],
      debts: [],
      months: {},
    },
    generatedFor: "",
  };
}

function loadState() {
  const saved = readJson(STORAGE_KEY, {});
  const answers = { ...defaultState().answers, ...(saved.answers || {}) };
  if (!answers.personas?.length && answers.profile) answers.personas = [answers.profile];
  delete answers.profile;
  return { ...defaultState(), ...saved, answers };
}

function loadWorkspaceData() {
  return mergeWorkspaceData(readJson(DATA_KEY, {}));
}

function loadDeveloperMode() {
  const saved = readJson(DEV_MODE_KEY, {});
  return {
    unlocked: DEV_MODE_ENABLED && Boolean(saved.unlocked),
    error: "",
  };
}

function saveDeveloperMode() {
  if (!DEV_MODE_ENABLED) {
    localStorage.removeItem(DEV_MODE_KEY);
    return;
  }
  localStorage.setItem(DEV_MODE_KEY, JSON.stringify({ unlocked: developerMode.unlocked }));
}

function mergeWorkspaceData(saved = {}) {
  const defaults = defaultWorkspaceData();
  return {
    ...defaults,
    ...saved,
    tasks: { ...defaults.tasks, ...(saved.tasks || {}) },
    habits: { ...defaults.habits, ...(saved.habits || {}) },
    goals: normalizeGoalsData({ ...defaults.goals, ...(saved.goals || {}) }),
    notes: normalizeNotesData({ ...defaults.notes, ...(saved.notes || {}) }),
    finance: normalizeFinanceData({ ...defaults.finance, ...(saved.finance || {}) }),
  };
}

function normalizeFinanceData(finance) {
  const monthKey = currentMonthKey();
  const normalized = {
    ...finance,
    currency: currencyOptions.some((option) => option.code === finance.currency) ? finance.currency : "USD",
    transactions: Array.isArray(finance.transactions) ? finance.transactions : [],
    budgets: Array.isArray(finance.budgets) ? finance.budgets : [],
    savingsGoals: Array.isArray(finance.savingsGoals) ? finance.savingsGoals : [],
    investments: Array.isArray(finance.investments) ? finance.investments : [],
    recurringPayments: Array.isArray(finance.recurringPayments) ? finance.recurringPayments.map(normalizeRecurringPayment) : [],
    debts: Array.isArray(finance.debts) ? finance.debts.map(normalizeDebt) : [],
    months: finance.months && typeof finance.months === "object" ? finance.months : {},
  };
  const hasLegacyMonthData = normalized.transactions.length || normalized.budgets.length || normalized.savingsGoals.length;
  if (!normalized.months[monthKey]) {
    normalized.months[monthKey] = {
      transactions: hasLegacyMonthData ? normalized.transactions.map((item) => ({ ...item, month: item.month || monthKey })) : [],
      budgets: hasLegacyMonthData ? normalized.budgets.map((item) => ({ ...item, month: item.month || monthKey })) : [],
      savingsGoals: hasLegacyMonthData ? normalized.savingsGoals.map((item) => ({ ...item, month: item.month || monthKey })) : [],
    };
  }
  return syncFinanceLegacyArrays(normalized);
}

function normalizeRecurringPayment(payment) {
  return {
    ...payment,
    dueDate: payment.dueDate || currentMonthDate(payment.dueDay || new Date().getDate()),
    active: payment.active !== false,
  };
}

function normalizeDebt(debt) {
  return {
    ...debt,
    dueDate: debt.dueDate || currentMonthDate(debt.dueDay || new Date().getDate()),
    originalBalance: numberOrZero(debt.originalBalance) || numberOrZero(debt.remainingBalance),
    active: debt.active !== false,
  };
}

function syncFinanceLegacyArrays(finance = workspaceData.finance) {
  const month = finance.months?.[currentMonthKey()] || { transactions: [], budgets: [], savingsGoals: [] };
  finance.transactions = month.transactions || [];
  finance.budgets = month.budgets || [];
  finance.savingsGoals = month.savingsGoals || [];
  return finance;
}

function normalizeNotesData(notes) {
  const defaults = defaultWorkspaceData().notes;
  const items = Array.isArray(notes.items) ? notes.items : [];
  const normalizedItems = items.map((note) => normalizeNote(note));
  const categories = Array.from(new Set([...(notes.categories || defaults.categories), ...normalizedItems.map((note) => note.category).filter(Boolean)]));
  const tags = Array.from(new Set([...(notes.tags || []), ...normalizedItems.flatMap((note) => note.tags || [])]));
  return {
    ...defaults,
    ...notes,
    items: normalizedItems,
    templates: normalizeNoteTemplates(notes.templates),
    categories,
    tags,
    activeFilter: notes.activeFilter || "all",
    search: notes.search || "",
  };
}

function normalizeGoalsData(goals) {
  const defaults = { items: [], templates: goalTemplates(), timeline: [], reviews: [], activeFilter: "active", setupPrompt: null };
  const items = Array.isArray(goals.items) ? goals.items.map(normalizeGoal) : [];
  return {
    ...defaults,
    ...goals,
    items,
    templates: Array.isArray(goals.templates) && goals.templates.length ? goals.templates : goalTemplates(),
    timeline: Array.isArray(goals.timeline) ? goals.timeline : [],
    reviews: Array.isArray(goals.reviews) ? goals.reviews : [],
    activeFilter: goals.activeFilter || "active",
    setupPrompt: goals.setupPrompt || null,
  };
}

function normalizeGoal(goal) {
  const now = new Date().toISOString();
  const startDate = goal.startDate || todayIso();
  const targetDate = goal.targetDate || todayIso(90);
  const milestones = Array.isArray(goal.milestones)
    ? goal.milestones.map((milestone, index) =>
        typeof milestone === "string"
          ? {
              id: createId(),
              title: milestone,
              description: "",
              completed: goal.progress ? goal.progress >= (index + 1) * (100 / goal.milestones.length) : false,
              dueDate: todayIso((index + 1) * 14),
              completedAt: goal.progress && goal.progress >= (index + 1) * (100 / goal.milestones.length) ? goal.updatedAt || now : null,
            }
          : {
              id: milestone.id || createId(),
              title: milestone.title || "Milestone",
              description: milestone.description || "",
              completed: Boolean(milestone.completed),
              dueDate: milestone.dueDate || todayIso((index + 1) * 14),
              completedAt: milestone.completedAt || null,
            }
      )
    : [];
  return {
    id: goal.id || createId(),
    title: goal.title || "Untitled Goal",
    description: goal.description || "",
    category: goal.category || "Personal",
    startDate,
    targetDate,
    priority: goal.priority || "Medium",
    status: goal.status || "Active",
    focus: Boolean(goal.focus),
    nextAction: goal.nextAction || "Define the next action",
    milestones,
    connections: {
      tasks: goal.connections?.tasks || [],
      habits: goal.connections?.habits || [],
      notes: goal.connections?.notes || [],
      finance: goal.connections?.finance || [],
    },
    createdAt: goal.createdAt || now,
    updatedAt: goal.updatedAt || now,
    completedAt: goal.completedAt || null,
    timeline: Array.isArray(goal.timeline) ? goal.timeline : [{ date: goal.createdAt || now, type: "created", detail: "Goal created" }],
    reviews: Array.isArray(goal.reviews) ? goal.reviews : [],
  };
}

function normalizeNote(note) {
  const now = new Date().toISOString();
  if (typeof note === "string" || note.text) {
    const content = typeof note === "string" ? note : note.text;
    return {
      id: note.id || createId(),
      title: note.title || content.split("\n")[0].slice(0, 60) || "Untitled Note",
      content,
      createdAt: note.createdAt || now,
      updatedAt: note.updatedAt || note.createdAt || now,
      tags: note.tags || [],
      category: note.category || "General",
      favorite: Boolean(note.favorite),
      pinned: Boolean(note.pinned),
      archived: Boolean(note.archived),
      type: note.type || "note",
      mood: note.mood || "",
      attachments: note.attachments || [],
      connections: note.connections || [],
    };
  }
  return {
    id: note.id || createId(),
    title: note.title || "Untitled Note",
    content: note.content || "",
    createdAt: note.createdAt || now,
    updatedAt: note.updatedAt || note.createdAt || now,
    tags: Array.isArray(note.tags) ? note.tags : [],
    category: note.category || "General",
    favorite: Boolean(note.favorite),
    pinned: Boolean(note.pinned),
    archived: Boolean(note.archived),
    type: note.type || "note",
    mood: note.mood || "",
    attachments: Array.isArray(note.attachments) ? note.attachments : [],
    connections: Array.isArray(note.connections) ? note.connections : [],
  };
}

function normalizeNoteTemplates(templates = []) {
  const required = requiredNoteTemplates();
  if (!templates.length) return required;
  const mapped = templates.map((template) => (typeof template === "string" ? { name: template.split("/")[0].trim() || "Template", category: "General", content: template } : template));
  const names = new Set(mapped.map((template) => template.name));
  return [...mapped, ...required.filter((template) => !names.has(template.name))];
}

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function removeLocal(key) {
  localStorage.removeItem(key);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function saveWorkspaceData() {
  localStorage.setItem(DATA_KEY, JSON.stringify(workspaceData));
}

function render() {
  saveState();
  if (state.view === "workspace") {
    renderWorkspace();
    return;
  }
  if (state.step === 0) {
    renderLanding();
    return;
  }
  renderOnboarding();
}

function renderLanding() {
  app.className = "app-shell";
  app.innerHTML = `
    <section class="screen landing">
      <div>
        <div class="brand-mark">F</div>
        <p class="eyebrow">Personal operating system</p>
        <h1>Forma</h1>
        <p class="tagline">Your life, structured around you.</p>
        <p class="intro">
          Describe your context and goals. Forma decides the modules, priorities, navigation, and first actions for you.
        </p>
        <div class="actions">
          <button class="button primary" data-action="start">Start</button>
          ${state.workspaceConfig ? '<button class="button ghost" data-action="open-workspace">Open Forma</button>' : ""}
        </div>
      </div>
      <aside class="preview-stack" aria-label="Forma preview">
        <div class="preview-card">
          <span class="label">Decision engine</span>
          <strong>Modules are inferred from your situation.</strong>
          <div class="preview-bars">
            <span style="--fill: 76%"></span>
            <span style="--fill: 58%"></span>
            <span style="--fill: 88%"></span>
          </div>
        </div>
        <div class="preview-card">
          <span class="label">Guided action</span>
          <strong>Home tells you what deserves attention today.</strong>
          <div class="preview-bars">
            <span style="--fill: 64%"></span>
            <span style="--fill: 46%"></span>
          </div>
        </div>
      </aside>
    </section>
  `;
  bind("[data-action='start']", "click", () => {
    state.view = "onboarding";
    state.step = 1;
    render();
  });
  bind("[data-action='open-workspace']", "click", openWorkspace);
}

function renderOnboarding(error = "") {
  app.className = "app-shell";
  const answerSteps = requiresFinanceBaseline() ? 7 : 6;
  const total = answerSteps + 1;
  const progress = `${Math.round((state.step / total) * 100)}%`;
  app.innerHTML = `
    <section class="screen">
      <div class="flow-card">
        <header class="flow-header">
          <div class="topline">
            <div class="brand-mark">F</div>
            <span class="step-count">Step ${state.step} of ${total}</span>
          </div>
          <div class="progress" aria-label="Onboarding progress"><span style="--progress: ${progress}"></span></div>
        </header>
        <div class="flow-body">${onboardingStepMarkup()}</div>
        <footer class="flow-footer">
          <button class="button ghost" data-action="back">${state.step === 1 ? "Exit" : "Back"}</button>
          <div class="error" role="status">${error}</div>
          <button class="button primary" data-action="next">${nextOnboardingLabel(answerSteps, total)}</button>
        </footer>
      </div>
    </section>
  `;
  attachOnboardingHandlers();
  bind("[data-action='back']", "click", goBack);
  bind("[data-action='next']", "click", goNext);
}

function onboardingStepMarkup() {
  if (state.step === 1) {
    return `
      <h2>What should Forma call you?</h2>
      <p class="copy">Forma uses your name to make the generated system feel personal.</p>
      <div class="form-grid single">
        <div class="field">
          <label for="name">Name</label>
          <input id="name" data-answer="name" value="${escapeHtml(state.answers.name)}" autocomplete="name" placeholder="Alex" />
        </div>
      </div>
    `;
  }
  if (state.step === 2) {
    return optionStep("Which identities fit you right now?", "Choose every identity that matters. Forma combines them to infer your operating system.", "personas", personaOptions, true);
  }
  if (state.step === 3) {
    return optionStep("What are you trying to improve first?", "Forma uses this as the primary outcome for module scoring.", "outcome", outcomeOptions);
  }
  if (state.step === 4) {
    return optionStep("What usually gets in the way?", "The strongest friction shapes recommendations and secondary modules.", "friction", frictionOptions);
  }
  if (state.step === 5) {
    return optionStep("What time horizon matters most right now?", "Forma uses this to frame goals, priorities, and status.", "horizon", horizonOptions);
  }
  if (state.step === 6) {
    return optionStep("How much structure do you want?", "This controls how assertive Forma should be.", "structure", structureOptions);
  }
  if (state.step === 7 && requiresFinanceBaseline()) {
    return `
    <h2>Set the financial baseline.</h2>
    <p class="copy">Forma only asks this because your answers indicate Finance should be part of your operating system.</p>
    <div class="form-grid">
      <div class="field">
        <label for="monthlyIncome">Monthly income</label>
        <input id="monthlyIncome" data-answer="monthlyIncome" type="number" value="${escapeHtml(state.answers.monthlyIncome)}" placeholder="3200" />
      </div>
      <div class="field">
        <label for="savingsTarget">Savings target</label>
        <input id="savingsTarget" data-answer="savingsTarget" type="number" value="${escapeHtml(state.answers.savingsTarget)}" placeholder="750" />
      </div>
    </div>
  `;
  }
  const preview = state.workspaceConfig || generateWorkspaceConfig();
  return `
    <h2>Your Forma is ready.</h2>
    <p class="copy">Forma inferred your modules, primary system, navigation order, starter content, and first recommendations.</p>
    <div class="summary-grid">
      <div class="summary-box">
        <span class="stat-label">Primary system</span>
        <strong>${escapeHtml(moduleLabels[preview.workspace.primaryModule])}</strong>
      </div>
      <div class="summary-box">
        <span class="stat-label">Generated modules</span>
        <strong>${preview.modules.length}</strong>
        <div class="pill-list">${preview.modules.map((module) => pillMarkup(module.label)).join("")}</div>
      </div>
      <div class="summary-box">
        <span class="stat-label">Structure</span>
        <strong>${escapeHtml(labelFor(preview.profile.structure, structureOptions))}</strong>
      </div>
    </div>
  `;
}

function nextOnboardingLabel(answerSteps, total) {
  if (state.step === total) return "Enter Forma";
  if (state.step === answerSteps) return "Generate Forma";
  return "Continue";
}

function optionStep(title, copy, key, options, multi = false) {
  return `
    <h2>${title}</h2>
    <p class="copy">${copy}</p>
    <div class="option-grid">
      ${options
        .map(
          (option) => `
            <button class="option ${isSelectedAnswer(key, option.id, multi) ? "selected" : ""}" data-choice="${key}" data-value="${option.id}" data-multi="${multi}" type="button">
              <strong>${option.label}</strong>
              ${option.hint ? `<span>${option.hint}</span>` : ""}
            </button>
          `
        )
        .join("")}
    </div>
  `;
}

function isSelectedAnswer(key, value, multi) {
  return multi ? (state.answers[key] || []).includes(value) : state.answers[key] === value;
}

function attachOnboardingHandlers() {
  document.querySelectorAll("[data-answer]").forEach((input) => {
    input.addEventListener("input", () => {
      state.answers[input.dataset.answer] = input.value.trimStart();
      state.workspaceConfig = null;
      saveState();
    });
  });
  document.querySelectorAll("[data-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.choice;
      const value = button.dataset.value;
      if (button.dataset.multi === "true") {
        const current = state.answers[key] || [];
        state.answers[key] = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
      } else {
        state.answers[key] = value;
      }
      state.workspaceConfig = null;
      render();
    });
  });
}

function goBack() {
  if (state.step === 1) {
    state.step = 0;
    state.view = "landing";
  } else {
    state.step -= 1;
  }
  render();
}

function goNext() {
  const error = validateStep();
  if (error) {
    renderOnboarding(error);
    return;
  }
  const answerSteps = requiresFinanceBaseline() ? 7 : 6;
  const total = answerSteps + 1;
  if (state.step === total) {
    if (!state.workspaceConfig) {
      state.workspaceConfig = generateWorkspaceConfig();
      localStorage.setItem(CONFIG_KEY, JSON.stringify(state.workspaceConfig));
      seedWorkspaceData(state.workspaceConfig);
    }
    state.view = "workspace";
    state.activeTab = "home";
    render();
    return;
  }
  if (state.step === answerSteps) {
    state.workspaceConfig = generateWorkspaceConfig();
    localStorage.setItem(CONFIG_KEY, JSON.stringify(state.workspaceConfig));
    seedWorkspaceData(state.workspaceConfig);
    state.step += 1;
    render();
    return;
  }
  state.step += 1;
  render();
}

function validateStep() {
  if (state.step === 1 && !state.answers.name.trim()) return "Add your name to continue.";
  if (state.step === 2 && selectedPersonas().length === 0) return "Choose at least one identity.";
  if (state.step === 3 && !state.answers.outcome) return "Choose the first outcome.";
  if (state.step === 4 && !state.answers.friction) return "Choose the main friction.";
  if (state.step === 5 && !state.answers.horizon) return "Choose a time horizon.";
  if (state.step === 6 && !state.answers.structure) return "Choose a structure level.";
  if (state.step === 7 && requiresFinanceBaseline()) {
    if (!Number(state.answers.monthlyIncome)) return "Add monthly income.";
    if (!Number(state.answers.savingsTarget)) return "Add a savings target.";
  }
  return "";
}

function requiresFinanceBaseline() {
  const scores = scoreModules();
  return scores.finance >= 4 || selectedPersonas().includes("finance-focused") || state.answers.outcome === "save-money" || state.answers.friction === "money-unclear";
}

function scoreModules() {
  const scores = { tasks: 0, habits: 0, goals: 0, notes: 0, finance: 0 };
  selectedPersonas().forEach((persona) => addScore(scores, scoring.profile[persona]));
  addScore(scores, scoring.outcome[state.answers.outcome]);
  addScore(scores, scoring.friction[state.answers.friction]);
  if (["month", "semester", "training-cycle", "savings-period"].includes(state.answers.horizon)) scores.goals += 2;
  if (state.answers.structure === "strict") {
    scores.tasks += 1;
    scores.habits += 1;
  }
  if (state.answers.structure === "light") scores.notes += 1;
  if (requiresFinanceSignal()) scores.finance += 1;
  return scores;
}

function requiresFinanceSignal() {
  return selectedPersonas().includes("finance-focused") || state.answers.outcome === "save-money" || state.answers.friction === "money-unclear";
}

function selectedPersonas() {
  return Array.isArray(state.answers.personas) ? state.answers.personas : [];
}

function addScore(target, source = {}) {
  Object.entries(source).forEach(([moduleId, value]) => {
    target[moduleId] += value;
  });
}

function generateWorkspaceConfig() {
  const scores = scoreModules();
  let included = Object.keys(scores).filter((moduleId) => scores[moduleId] >= 3);
  if (requiresFinanceSignal() && !included.includes("finance")) included.push("finance");
  if (included.length === 0) included = ["tasks", "goals", "notes"];
  const primary = [...included].sort((a, b) => compareModules(a, b, scores))[0];
  const ordered = [primary, ...included.filter((id) => id !== primary).sort((a, b) => compareModules(a, b, scores))];
  const modules = ordered.map((id, index) => ({
    id,
    label: moduleLabels[id],
    order: index + 1,
    score: scores[id],
    primary: id === primary,
    settings: moduleSettings(id),
  }));
  return {
    app: "Forma",
    version: 2,
    generatedAt: new Date().toISOString(),
    profile: {
      name: state.answers.name.trim(),
      personas: selectedPersonas(),
      focus: selectedPersonas()[0] || "",
      outcome: state.answers.outcome,
      friction: state.answers.friction,
      horizon: state.answers.horizon,
      structure: state.answers.structure,
    },
    moduleScores: scores,
    modules,
    workspace: {
      layout: "personal-os",
      primaryModule: primary,
      tabs: ["home", ...modules.map((module) => module.id), "settings"],
      aiFeaturesEnabled: false,
      analyticsEnabled: false,
    },
  };
}

function generateDeveloperWorkspaceConfig(baseConfig = state.workspaceConfig || readJson(CONFIG_KEY, null)) {
  const profile = baseConfig?.profile || {
    name: state.answers.name.trim() || "Developer",
    personas: selectedPersonas(),
    focus: selectedPersonas()[0] || "developer",
    outcome: state.answers.outcome || "work-control",
    friction: state.answers.friction || "unclear-priorities",
    horizon: state.answers.horizon || "today",
    structure: state.answers.structure || "balanced",
  };
  const scores = moduleRegistry.reduce((target, moduleId) => {
    target[moduleId] = Math.max(baseConfig?.moduleScores?.[moduleId] || 0, 99);
    return target;
  }, {});
  const modules = moduleRegistry.map((id, index) => ({
    id,
    label: moduleLabels[id],
    order: index + 1,
    score: scores[id],
    primary: index === 0,
    settings: moduleSettings(id),
  }));
  return {
    app: "Forma",
    version: 2,
    generatedAt: baseConfig?.developerMode ? baseConfig.generatedAt : `${baseConfig?.generatedAt || "first-launch"}::developer-mode`,
    developerMode: true,
    profile,
    moduleScores: scores,
    modules,
    workspace: {
      layout: "personal-os",
      primaryModule: modules[0]?.id || "home",
      tabs: ["home", ...modules.map((module) => module.id), "settings"],
      aiFeaturesEnabled: false,
      analyticsEnabled: false,
    },
  };
}

function activeWorkspaceConfig() {
  const config = state.workspaceConfig || readJson(CONFIG_KEY, null);
  return DEV_MODE_ENABLED && developerMode.unlocked ? generateDeveloperWorkspaceConfig(config) : config;
}

function compareModules(a, b, scores) {
  const scoreDelta = scores[b] - scores[a];
  if (scoreDelta !== 0) return scoreDelta;
  return moduleTieRank(a) - moduleTieRank(b);
}

function moduleTieRank(moduleId) {
  const outcomePriority = {
    "save-money": ["finance", "goals", "tasks", "notes", "habits"],
    "study-consistently": ["notes", "tasks", "goals", "habits", "finance"],
    "train-consistently": ["habits", "goals", "tasks", "notes", "finance"],
    "work-control": ["tasks", "goals", "notes", "habits", "finance"],
    "better-routines": ["habits", "tasks", "goals", "notes", "finance"],
    "major-goal": ["goals", "tasks", "habits", "notes", "finance"],
    "organize-thinking": ["notes", "goals", "tasks", "habits", "finance"],
  };
  const priority = outcomePriority[state.answers.outcome] || ["tasks", "goals", "habits", "notes", "finance"];
  const index = priority.indexOf(moduleId);
  return index === -1 ? priority.length : index;
}

function moduleSettings(moduleId) {
  if (moduleId === "tasks") return { dailyLimit: structureLimit() };
  if (moduleId === "finance") {
    return {
      monthlyIncome: numberOrZero(state.answers.monthlyIncome),
      savingsTarget: numberOrZero(state.answers.savingsTarget),
    };
  }
  return {};
}

function structureLimit() {
  if (state.answers.structure === "light") return 3;
  if (state.answers.structure === "strict") return 5;
  return 4;
}

function seedWorkspaceData(config) {
  const data = defaultWorkspaceData();
  const context = config.profile;
  config.modules.forEach((module) => {
    if (module.id === "tasks") {
      data.tasks.items = starterTasks(context).map((title, index) => ({
        id: createId(),
        title,
        tier: index === 0 ? "must" : index === 1 ? "should" : "later",
        completed: false,
      }));
    }
    if (module.id === "habits") {
      data.habits.items = starterHabits(context).map((name) => ({
        id: createId(),
        name,
        streak: 0,
        completedToday: false,
      }));
    }
    if (module.id === "goals") {
      data.goals.items = starterGoals(context).map((goal) => normalizeGoal({
        id: createId(),
        title: goal.title,
        description: goal.description || "",
        category: goal.category || "Personal",
        priority: "Medium",
        status: "Active",
        nextAction: goal.nextAction,
        milestones: goal.milestones,
      }));
    }
    if (module.id === "notes") {
      data.notes.templates = noteTemplates(context);
    }
    if (module.id === "finance") {
      const monthKey = currentMonthKey();
      const seededSavingsGoals = module.settings.savingsTarget
        ? [
            {
              id: createId(),
              name: "Primary savings target",
              targetAmount: module.settings.savingsTarget,
              currentAmount: 0,
              month: monthKey,
            },
          ]
        : [];
      data.finance = {
        ...data.finance,
        monthlyIncome: module.settings.monthlyIncome,
        savingsTarget: module.settings.savingsTarget,
        currentSavings: 0,
        transactions: [],
        budgets: [],
        savingsGoals: seededSavingsGoals,
        investments: [],
        months: {
          [monthKey]: {
            transactions: [],
            budgets: [],
            savingsGoals: seededSavingsGoals,
          },
        },
      };
    }
  });
  data.generatedFor = config.generatedAt;
  workspaceData = data;
  saveWorkspaceData();
}

function starterTasks(context) {
  if (context.outcome === "save-money" || context.friction === "money-unclear") return ["Update current savings", "Review one recurring expense", "Check upcoming payments"];
  if (context.outcome === "study-consistently") return ["Complete one study block", "Review the next deadline", "Create a class recap note"];
  if (context.outcome === "train-consistently") return ["Confirm training window", "Prepare recovery work", "Log today's training status"];
  if (context.friction === "too-many-tasks") return ["Choose today's must-do", "Move two items to later", "Block one focus session"];
  return ["Choose today's top priority", "Block focus time", "Close one loose end"];
}

function starterHabits(context) {
  if (context.outcome === "train-consistently" || context.personas?.includes("athlete")) return ["Training session", "Mobility", "Hydration"];
  if (context.personas?.includes("creator")) return ["Capture one idea", "Publish or refine", "Creative review"];
  if (context.personas?.includes("builder")) return ["Ship one small improvement", "Review project momentum", "Document a decision"];
  if (context.outcome === "study-consistently") return ["Study block", "Daily review", "No-phone focus"];
  if (context.outcome === "save-money") return ["Check spending", "Log savings", "Review one purchase"];
  return ["Plan the day", "Focused work", "Evening reset"];
}

function starterGoals(context) {
  if (context.outcome === "save-money") {
    return [
      { title: "Build this savings period buffer", progress: 0, nextAction: "Update current savings", milestones: ["Set baseline", "Save first 25%", "Review spending leak"] },
    ];
  }
  if (context.outcome === "study-consistently") {
    return [
      { title: "Finish the term with control", progress: 10, nextAction: "Map upcoming deadlines", milestones: ["List deadlines", "Complete weekly study plan", "Review weak subject"] },
    ];
  }
  if (context.outcome === "train-consistently") {
    return [
      { title: "Complete the training cycle", progress: 5, nextAction: "Complete today's session", milestones: ["Week 1 consistency", "Recovery rhythm", "Cycle review"] },
    ];
  }
  return [
    { title: "Make visible progress on the main outcome", progress: 0, nextAction: "Define the first milestone", milestones: ["Define outcome", "Choose next action", "Review progress"] },
  ];
}

function goalTemplates() {
  return [
    { name: "Football Goal", category: "Football", title: "Reach the next football level", description: "Improve performance and visibility.", milestones: ["Assess current level", "Build weekly training plan", "Complete evaluation session", "Review progress with coach"] },
    { name: "Fitness Goal", category: "Fitness", title: "Build consistent fitness", description: "Create a repeatable training rhythm.", milestones: ["Set baseline", "Complete first week", "Increase training load", "Review recovery"] },
    { name: "Academic Goal", category: "Academic", title: "Finish the academic cycle strong", description: "Stay ahead of coursework and exams.", milestones: ["Map deadlines", "Complete study plan", "Review weak areas", "Submit final work"] },
    { name: "Financial Goal", category: "Finance", title: "Build financial stability", description: "Improve savings and reduce pressure.", milestones: ["Set baseline", "Choose savings target", "Review expenses", "Hit target checkpoint"] },
    { name: "Project Goal", category: "Project", title: "Ship the project milestone", description: "Move a project from idea to visible progress.", milestones: ["Define scope", "Build first version", "Test with feedback", "Ship milestone"] },
    { name: "Business Goal", category: "Business", title: "Validate a business opportunity", description: "Test demand and clarify the offer.", milestones: ["Define customer", "Create offer", "Talk to prospects", "Review traction"] },
  ];
}

function noteTemplates(context) {
  const templates = requiredNoteTemplates();
  if (context.outcome === "save-money") templates.push({ name: "Money Decision", category: "Decisions", content: "# Money Decision\n\n## Tradeoff\n\n## Keep / Reduce / Remove\n\n## Next Action\n" });
  if (context.outcome === "organize-thinking") templates.push({ name: "Idea Capture", category: "Knowledge Vault", content: "# Idea\n\n## Why it matters\n\n## Next step\n" });
  return templates;
}

function requiredNoteTemplates() {
  return [
    { name: "Daily Review", category: "Daily Journal", content: "# Daily Review\n\n## Wins\n\n## Mistakes\n\n## Lessons\n\n## Tomorrow\n" },
    { name: "Decision Log", category: "Decisions", content: "# Decision Log\n\n## Decision\n\n## Context\n\n## Alternatives\n\n## Reason\n\n## Expected Outcome\n" },
    { name: "Training Reflection", category: "Training", content: "# Training Reflection\n\n## Session\n\n## What went well\n\n## What went poorly\n\n## Improvements\n\n## Next Focus\n" },
    { name: "Meeting Notes", category: "Projects", content: "# Meeting Notes\n\n## Agenda\n\n## Key Points\n\n## Decisions\n\n## Action Items\n" },
    { name: "Study Notes", category: "Study", content: "# Study Notes\n\n## Topic\n\n## Summary\n\n## Key Concepts\n\n## Questions\n" },
    { name: "Project Notes", category: "Projects", content: "# Project Notes\n\n## Goal\n\n## Current Status\n\n## Problems\n\n## Next Steps\n" },
  ];
}

function openWorkspace() {
  if (!state.workspaceConfig) state.workspaceConfig = readJson(CONFIG_KEY, null);
  if (!state.workspaceConfig) {
    state.view = "onboarding";
    state.step = 1;
  } else {
    ensureWorkspaceData(state.workspaceConfig);
    state.view = "workspace";
    state.activeTab = "home";
  }
  render();
}

function ensureWorkspaceData(config) {
  workspaceData = mergeWorkspaceData(workspaceData);
  if (config.developerMode) {
    if (workspaceData.generatedFor !== config.generatedAt) {
      workspaceData.generatedFor = config.generatedAt;
      saveWorkspaceData();
    }
    return;
  }
  if (workspaceData.generatedFor !== config.generatedAt) {
    seedWorkspaceData(config);
  }
}

function renderWorkspace() {
  const config = activeWorkspaceConfig();
  if (!config) {
    renderLanding();
    return;
  }
  if (!config.developerMode) state.workspaceConfig = config;
  ensureWorkspaceData(config);
  const tabs = workspaceTabs(config);
  if (!tabs.some((tab) => tab.id === state.activeTab)) state.activeTab = "home";
  const active = tabs.find((tab) => tab.id === state.activeTab) || tabs[0];
  app.className = "app-shell workspace-shell";
  app.innerHTML = `
    <section class="workspace-screen">
      <aside class="os-sidebar">
        <div class="os-brand">
          <div class="brand-mark">F</div>
          <div>
            <strong>Forma</strong>
            <span>${escapeHtml(personaSummary(config.profile.personas || [config.profile.focus].filter(Boolean)))}</span>
          </div>
        </div>
        ${DEV_MODE_ENABLED && developerMode.unlocked ? `<div class="developer-badge">Developer Mode</div>` : ""}
        <nav class="os-nav" aria-label="Generated navigation">
          ${tabs.filter((tab) => tab.group !== "settings").map((tab) => tabButton(tab, config)).join("")}
        </nav>
        ${DEV_MODE_ENABLED && developerMode.unlocked ? renderSidebarDeveloperCard() : ""}
        <nav class="os-nav settings-nav" aria-label="Settings">
          ${tabs.filter((tab) => tab.group === "settings").map((tab) => tabButton(tab, config)).join("")}
        </nav>
      </aside>
      <section class="os-workspace">
        <header class="os-topbar">
          <div>
            <span class="eyebrow">${active.id === "home" ? "Command center" : active.primary ? "Primary module" : "Generated module"}</span>
            <h1>${escapeHtml(active.title)}</h1>
            <p>${escapeHtml(active.description)}</p>
          </div>
        </header>
        <main class="os-content">${renderActiveTab(config, active.id)}</main>
      </section>
    </section>
  `;
  attachWorkspaceHandlers();
}

function renderSidebarDeveloperCard() {
  return `
    <section class="developer-sidebar-card">
      <strong>Developer Mode</strong>
      <span>Enabled</span>
      <button data-action="load-demo-workspace">Load Demo Workspace</button>
      <button data-action="reset-onboarding">Reset Onboarding</button>
      <button data-action="reset-all-data">Reset All Data</button>
      <button data-action="disable-developer-mode">Disable Developer Mode</button>
    </section>
  `;
}

function workspaceTabs(config) {
  return [
    { id: "home", label: "Home", title: "Today Command Center", description: "Forma decides what deserves attention now.", group: "work" },
    ...config.modules.map((module) => ({
      id: module.id,
      label: module.label,
      title: module.primary ? `${module.label}: Primary System` : `${module.label} System`,
      description: moduleDescription(module.id),
      primary: module.primary,
      group: "work",
    })),
    { id: "settings", label: "Settings", title: "Settings", description: "Export configuration and review generated structure.", group: "settings" },
  ];
}

function tabButton(tab, config) {
  const primary = tab.id === config.workspace.primaryModule;
  return `<button class="os-nav-item ${state.activeTab === tab.id ? "active" : ""} ${primary ? "primary-module" : ""}" data-tab="${tab.id}">${escapeHtml(tab.label)}${primary ? "<small>Primary</small>" : ""}</button>`;
}

function renderActiveTab(config, tabId) {
  if (tabId === "home") return renderHome(config);
  if (tabId === "tasks") return renderTasks(config);
  if (tabId === "habits") return renderHabits(config);
  if (tabId === "goals") return renderGoals(config);
  if (tabId === "notes") return renderNotes(config);
  if (tabId === "finance") return renderFinance(config);
  return renderSettings(config);
}

function renderHome(config) {
  const focus = todayFocus(config);
  const queue = priorityQueue(config);
  const statuses = systemStatus(config);
  const signals = moduleSignals(config);
  const adjustment = recommendedAdjustment(config);
  return `
    <section class="command-layout">
      <article class="focus-panel">
        <span class="stat-label">Today's Focus</span>
        <h2>${escapeHtml(focus.title)}</h2>
        <p>${escapeHtml(focus.reason)}</p>
        <button class="button primary" data-tab="${focus.tab}">${escapeHtml(focus.action)}</button>
      </article>
      <section class="command-grid">
        <article class="workspace-panel large-panel">
          <div class="section-head">
            <span class="stat-label">Priority Queue</span>
            <h2>Do these first</h2>
          </div>
          <div class="priority-list">${queue.map(priorityMarkup).join("")}</div>
        </article>
        <article class="workspace-panel">
          <span class="stat-label">Recommended Adjustment</span>
          <h2>${escapeHtml(adjustment.title)}</h2>
          <p>${escapeHtml(adjustment.body)}</p>
        </article>
      </section>
      <section class="status-grid">
        <article class="workspace-panel">
          <span class="stat-label">System Status</span>
          <div class="status-list">${statuses.map(statusMarkup).join("")}</div>
        </article>
        <article class="workspace-panel">
          <span class="stat-label">Module Signals</span>
          <div class="signal-list">${signals.map(signalMarkup).join("")}</div>
        </article>
      </section>
    </section>
  `;
}

function todayFocus(config) {
  const primary = config.workspace.primaryModule;
  if (primary === "finance") return { title: "Update your savings position.", reason: "Money felt important in onboarding, so Forma needs the current number before suggesting anything else.", action: "Open Finance", tab: "finance" };
  if (primary === "habits") return { title: "Complete the next habit today.", reason: "Consistency is the main lever in this Forma.", action: "Open Habits", tab: "habits" };
  if (primary === "goals") return { title: "Attach a next action to your primary goal.", reason: "Progress stalls when goals do not have a concrete next move.", action: "Open Goals", tab: "goals" };
  if (primary === "notes") return { title: "Capture the decision or thought before it disappears.", reason: "Your system depends on preserving context.", action: "Open Notes", tab: "notes" };
  return { title: "Reduce today to the next useful action.", reason: "Forma is keeping the day inside your structure limit.", action: "Open Tasks", tab: "tasks" };
}

function priorityQueue(config) {
  const items = [];
  if (hasModule(config, "tasks")) {
    const task = workspaceData.tasks.items.find((item) => !item.completed);
    items.push({ module: "Tasks", title: task?.title || "Choose one priority task", detail: "Keep the day actionable.", tab: "tasks" });
  }
  if (hasModule(config, "finance")) {
    const finance = financeState();
    items.push({ module: "Finance", title: finance.nextAction, detail: finance.detail, tab: "finance" });
  }
  if (hasModule(config, "habits")) {
    const habit = recommendedHabit();
    items.push({ module: "Habits", title: habit.name, detail: habit.reason, tab: "habits" });
  }
  if (hasModule(config, "goals")) {
    const goal = goalHealth()[0];
    items.push({ module: "Goals", title: goal?.nextAction || "Define the first milestone", detail: goal?.status || "Progress needs a next action.", tab: "goals" });
  }
  if (hasModule(config, "notes")) items.push({ module: "Notes", title: workspaceData.notes.templates[0]?.name || "Capture a useful note", detail: "Preserve context for later decisions.", tab: "notes" });
  return items.slice(0, structureLimit() + 1);
}

function systemStatus(config) {
  const statuses = [];
  if (hasModule(config, "tasks")) {
    const open = workspaceData.tasks.items.filter((item) => !item.completed).length;
    const limit = config.modules.find((module) => module.id === "tasks")?.settings.dailyLimit || structureLimit();
    statuses.push({ label: "Tasks", state: open > limit ? "Warning" : "Healthy", detail: `${open} open / ${limit} daily limit` });
  }
  if (hasModule(config, "habits")) {
    const done = workspaceData.habits.items.filter((item) => item.completedToday).length;
    statuses.push({ label: "Habits", state: done ? "Healthy" : "Needs action", detail: `${done}/${workspaceData.habits.items.length} completed today` });
  }
  if (hasModule(config, "goals")) {
    const unhealthy = goalHealth().filter((goal) => !["Healthy", "Completed"].includes(goal.health)).length;
    statuses.push({ label: "Goals", state: unhealthy ? "Needs action" : "Healthy", detail: `${unhealthy} goals need attention` });
  }
  if (hasModule(config, "finance")) {
    const finance = financeState();
    statuses.push({ label: "Finance", state: finance.status, detail: finance.detail });
  }
  if (hasModule(config, "notes")) statuses.push({ label: "Notes", state: activeNotes().length ? "Healthy" : "Needs capture", detail: `${activeNotes().length} active / ${workspaceData.notes.items.filter((note) => note.archived).length} archived` });
  return statuses;
}

function moduleSignals(config) {
  return config.modules.map((module) => {
    if (module.id === "tasks") return { label: "Tasks", value: `${workspaceData.tasks.items.filter((item) => !item.completed).length} open` };
    if (module.id === "habits") return { label: "Habits", value: `${workspaceData.habits.items.filter((item) => item.completedToday).length} done today` };
    if (module.id === "goals") return { label: "Goals", value: `${averageGoalProgress()}% average progress` };
    if (module.id === "finance") {
      const summary = financeSummary();
      return { label: "Finance", value: `${summary.savingsRate}% savings rate` };
    }
    return { label: "Notes", value: `${activeNotes().length} active` };
  });
}

function recommendedAdjustment(config) {
  if (hasModule(config, "tasks")) {
    const open = workspaceData.tasks.items.filter((item) => !item.completed).length;
    const limit = config.modules.find((module) => module.id === "tasks")?.settings.dailyLimit || structureLimit();
    if (open > limit) return { title: "Reduce today's scope.", body: `You have ${open} open tasks and a ${limit}-task structure limit. Move lower-value items to later.` };
  }
  if (hasModule(config, "finance")) {
    const insight = financeInsights()[0];
    if (insight) return { title: insight.title, body: insight.body };
  }
  if (hasModule(config, "habits") && !workspaceData.habits.items.some((item) => item.completedToday)) return { title: "Restart with one habit.", body: "Do not rebuild the whole routine. Complete the easiest habit today." };
  if (hasModule(config, "goals") && goalHealth().some((goal) => goal.health === "Stalled")) return { title: "Add a next action.", body: "At least one goal has no momentum. Connect it to a concrete action." };
  return { title: "Keep the system small.", body: "Use the primary module first, then return Home for the next decision." };
}

function renderFinance() {
  const month = currentFinanceMonth();
  const cycle = financeCycleInfo();
  const summary = financeSummary();
  const insights = financeInsights();
  return `
    <section class="module-app">
      <div class="module-command">
        <div>
          <span class="stat-label">Finance</span>
          <h2>${escapeHtml(summary.status)}</h2>
          <p>${escapeHtml(summary.statusDetail)}</p>
          <div class="finance-cycle">
            <strong>${escapeHtml(cycle.monthName)} Finance Cycle</strong>
            <span>Today: ${escapeHtml(cycle.todayLabel)}</span>
            <span>${cycle.daysLeft} days left this month</span>
          </div>
        </div>
        <strong class="metric">${formatMoney(summary.netWorth)}</strong>
      </div>
      <div class="finance-toolbar">
        <button class="button primary" data-action="load-finance-demo">Load demo data</button>
      </div>
      <div class="finance-metrics">
        ${financeMetricMarkup("Total balance", formatMoney(summary.totalBalance), summary.totalBalance >= 0 ? "Healthy" : "Negative")}
        ${financeMetricMarkup("Monthly income", formatMoney(summary.incomeTotal), `${month.transactions.filter((item) => item.type === "income").length} extra entries`)}
        ${financeMetricMarkup("Monthly expenses", formatMoney(summary.expenseTotal), summary.expenseTotal > summary.incomeTotal ? "Overspending" : "Controlled")}
        ${financeMetricMarkup("Fixed monthly costs", formatMoney(summary.fixedCosts), `${summary.fixedCostRatio}% of income`)}
        ${financeMetricMarkup("Debt payments", formatMoney(summary.debtPayments), `${summary.debtPaymentRatio}% of income`)}
        ${financeMetricMarkup("Disposable income", formatMoney(summary.disposableIncome), summary.disposableIncome < 0 ? "Negative" : "Available")}
        ${financeMetricMarkup("After fixed obligations", formatMoney(summary.incomeAfterFixedObligations), summary.incomeAfterFixedObligations < 0 ? "Overcommitted" : "Remaining")}
        ${financeMetricMarkup("Savings rate", `${summary.savingsRate}%`, summary.savingsRate < 10 ? "Low" : "On track")}
        ${financeMetricMarkup("Estimated net worth", formatMoney(summary.netWorth), `${summary.investmentReturn}% portfolio return`)}
      </div>
      <article class="workspace-panel finance-profile">
        <div class="section-head">
          <span class="stat-label">Finance Settings</span>
          <h2>Financial Profile</h2>
        </div>
        <form class="finance-form profile-form" data-form="finance-profile">
          <label>
            <span>Current Balance</span>
            <input name="currentSavings" type="number" value="${workspaceData.finance.currentSavings}" />
          </label>
          <label>
            <span>Monthly Income</span>
            <input name="monthlyIncome" type="number" value="${workspaceData.finance.monthlyIncome}" />
          </label>
          <label>
            <span>Currency</span>
            <select name="currency">
              ${currencyOptions.map((option) => `<option value="${option.code}" ${workspaceData.finance.currency === option.code ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}
            </select>
          </label>
          <button class="button primary">Save profile</button>
          <button class="button danger-button" type="button" data-action="reset-finance-data">Reset Finance Data</button>
        </form>
      </article>
      <section class="finance-section-grid">
        <article class="workspace-panel large-panel">
          <div class="section-head">
            <span class="stat-label">Recurring Payments & Debt</span>
            <h2>Fixed monthly obligations</h2>
          </div>
          <form class="finance-form recurring-form" data-form="recurring-payment">
            <input name="id" type="hidden" />
            <input name="name" placeholder="Name" />
            <select name="category" aria-label="Recurring category">
              ${["Rent", "Mortgage", "Phone bill", "Subscriptions", "Insurance", "Utilities", "Gym membership", "Transport pass", "Other"].map((category) => `<option value="${category}">${category}</option>`).join("")}
            </select>
            <input name="amount" type="number" placeholder="Amount" />
            <input name="dueDate" type="date" value="${todayIso()}" />
            <select name="importance" aria-label="Essential or optional"><option value="essential">Essential</option><option value="optional">Optional</option></select>
            <select name="active" aria-label="Status"><option value="true">Active</option><option value="false">Inactive</option></select>
            <button class="button primary">Save payment</button>
          </form>
          <div class="finance-list">${workspaceData.finance.recurringPayments.map(recurringPaymentMarkup).join("") || emptyState("No recurring payments yet.", "Add fixed costs so Forma can calculate disposable income.")}</div>
        </article>
        <article class="workspace-panel">
          <div class="section-head">
            <span class="stat-label">Debt Tracking</span>
            <h2>Debt payoff pressure</h2>
          </div>
          <form class="finance-form debt-form" data-form="debt">
            <input name="id" type="hidden" />
            <input name="name" placeholder="Debt name" />
            <select name="type" aria-label="Debt type"><option>Credit card</option><option>Loan</option><option>Mortgage</option><option>Personal debt</option><option>Other</option></select>
            <input name="originalBalance" type="number" placeholder="Original balance" />
            <input name="remainingBalance" type="number" placeholder="Remaining" />
            <input name="monthlyPayment" type="number" placeholder="Monthly payment" />
            <input name="interestRate" type="number" placeholder="APR %" />
            <input name="dueDate" type="date" value="${todayIso()}" />
            <button class="button primary">Save debt</button>
          </form>
          <div class="finance-list">${workspaceData.finance.debts.map(debtMarkup).join("") || emptyState("No debts tracked yet.", "Add debts to see payment load and payoff progress.")}</div>
        </article>
      </section>
      <section class="finance-section-grid">
        <article class="workspace-panel large-panel">
          <div class="section-head">
            <span class="stat-label">Transactions</span>
            <h2>Where money is moving</h2>
          </div>
          <form class="finance-form" data-form="transaction">
            <select name="type" aria-label="Transaction type">
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <input name="amount" type="number" placeholder="Amount" />
            <input name="category" placeholder="Category" />
            <input name="description" placeholder="Description" />
            <input name="date" type="date" value="${todayIso()}" />
            <button class="button primary">Add</button>
          </form>
          ${transactionTable()}
        </article>
        <article class="workspace-panel">
          <div class="section-head">
            <span class="stat-label">Insights Center</span>
            <h2>Next financial action</h2>
          </div>
          <div class="finance-insight-list">${insights.map(financeInsightMarkup).join("")}</div>
        </article>
      </section>
      <section class="finance-section-grid">
        <article class="workspace-panel">
          <div class="section-head">
            <span class="stat-label">Budgeting</span>
            <h2>Category limits</h2>
          </div>
          <form class="finance-form compact-form" data-form="budget">
            <input name="category" placeholder="Category" />
            <input name="limit" type="number" placeholder="Budget" />
            <button class="button primary">Set</button>
          </form>
          <div class="finance-list">${budgetUsage().map(budgetMarkup).join("") || emptyState("No budgets yet.", "Set category limits to unlock overspending warnings.")}</div>
        </article>
        <article class="workspace-panel">
          <div class="section-head">
            <span class="stat-label">Savings goals</span>
            <h2>Progress tracking</h2>
          </div>
          <form class="finance-form compact-form" data-form="savings-goal">
            <input name="name" placeholder="Goal name" />
            <input name="targetAmount" type="number" placeholder="Target" />
            <input name="currentAmount" type="number" placeholder="Saved" />
            <button class="button primary">Create</button>
          </form>
          <div class="finance-list">${month.savingsGoals.map(savingsGoalMarkup).join("") || emptyState("No savings goals yet.", "Create one goal to track your next financial milestone.")}</div>
        </article>
      </section>
      <section class="finance-section-grid">
        <article class="workspace-panel">
          <div class="section-head">
            <span class="stat-label">Investments</span>
            <h2>Portfolio summary</h2>
          </div>
          <form class="finance-form investment-form" data-form="investment">
            <input name="id" type="hidden" />
            <input name="assetName" placeholder="Asset" />
            <input name="amountInvested" type="number" placeholder="Invested" />
            <input name="currentValue" type="number" placeholder="Current value" />
            <input name="category" placeholder="Category" />
            <input name="notes" placeholder="Notes" />
            <button class="button primary">Save asset</button>
          </form>
          <div class="finance-list">${workspaceData.finance.investments.map(investmentMarkup).join("") || emptyState("No investments yet.", "Add assets manually to see returns and concentration warnings.")}</div>
        </article>
        <article class="workspace-panel">
          <div class="section-head">
            <span class="stat-label">Analytics</span>
            <h2>Financial summary</h2>
          </div>
          ${financeCharts(summary)}
        </article>
      </section>
    </section>
  `;
}

function financeState() {
  const summary = financeSummary();
  const firstInsight = financeInsights()[0];
  return {
    status: summary.status,
    progress: summary.primarySavingsProgress,
    remaining: summary.primarySavingsRemaining,
    detail: summary.statusDetail,
    nextAction: firstInsight?.title || "Review your money map",
    recovery: firstInsight?.body || "Keep income, spending, savings, and investments updated.",
  };
}

function currentFinanceMonth() {
  return financeMonth(currentMonthKey());
}

function financeMonth(monthKey) {
  workspaceData.finance.months ||= {};
  workspaceData.finance.months[monthKey] ||= { transactions: [], budgets: [], savingsGoals: [] };
  const month = workspaceData.finance.months[monthKey];
  month.transactions ||= [];
  month.budgets ||= [];
  month.savingsGoals ||= [];
  workspaceData.finance = syncFinanceLegacyArrays(workspaceData.finance);
  return month;
}

function financeSummary() {
  const finance = workspaceData.finance;
  const month = currentFinanceMonth();
  const incomeEntries = month.transactions.filter((item) => item.type === "income");
  const expenseEntries = month.transactions.filter((item) => item.type === "expense");
  const transactionIncome = sumBy(incomeEntries, "amount");
  const incomeTotal = numberOrZero(finance.monthlyIncome) + transactionIncome;
  const variableExpenses = sumBy(expenseEntries, "amount");
  const activeRecurringPayments = finance.recurringPayments.filter((item) => item.active !== false);
  const activeDebts = finance.debts.filter((item) => item.active !== false);
  const fixedCosts = sumBy(activeRecurringPayments, "amount");
  const debtPayments = sumBy(activeDebts, "monthlyPayment");
  const expenseTotal = variableExpenses + fixedCosts + debtPayments;
  const incomeAfterFixedObligations = incomeTotal - fixedCosts - debtPayments;
  const disposableIncome = incomeAfterFixedObligations - variableExpenses;
  const cashFlow = incomeTotal - expenseTotal;
  const investmentCurrentValue = sumBy(finance.investments, "currentValue");
  const investmentCost = sumBy(finance.investments, "amountInvested");
  const investmentProfit = investmentCurrentValue - investmentCost;
  const investmentReturn = investmentCost ? Math.round((investmentProfit / investmentCost) * 100) : 0;
  const totalBalance = numberOrZero(finance.currentSavings);
  const netWorth = totalBalance + investmentCurrentValue;
  const savingsRate = incomeTotal ? Math.round((Math.max(0, cashFlow) / incomeTotal) * 100) : 0;
  const fixedCostRatio = incomeTotal ? Math.round((fixedCosts / incomeTotal) * 100) : 0;
  const debtPaymentRatio = incomeTotal ? Math.round((debtPayments / incomeTotal) * 100) : 0;
  const primaryGoal = month.savingsGoals[0];
  const primarySavingsProgress = primaryGoal ? progressPercent(primaryGoal.currentAmount, primaryGoal.targetAmount) : progressPercent(finance.currentSavings, finance.savingsTarget);
  const primarySavingsRemaining = primaryGoal ? Math.max(0, primaryGoal.targetAmount - primaryGoal.currentAmount) : Math.max(0, finance.savingsTarget - finance.currentSavings);
  const status = expenseTotal > incomeTotal && incomeTotal > 0 ? "Overspending risk" : savingsRate < 10 ? "Low savings rate" : "Stable money map";
  const statusDetail =
    expenseTotal > incomeTotal && incomeTotal > 0
      ? "Expenses are higher than income for this period."
      : savingsRate < 10
        ? "Savings rate is below the 10% minimum guidance."
        : "Income, spending, savings, and portfolio data are in a usable range.";
  return {
    incomeTotal,
    expenseTotal,
    variableExpenses,
    fixedCosts,
    debtPayments,
    incomeAfterFixedObligations,
    disposableIncome,
    cashFlow,
    totalBalance,
    netWorth,
    savingsRate,
    fixedCostRatio,
    debtPaymentRatio,
    investmentCurrentValue,
    investmentCost,
    investmentProfit,
    investmentReturn,
    primarySavingsProgress,
    primarySavingsRemaining,
    status,
    statusDetail,
  };
}

function financeInsights() {
  const summary = financeSummary();
  const month = currentFinanceMonth();
  const insights = [];
  const overspentBudgets = budgetUsage().filter((budget) => budget.percent > 100);
  const concentration = portfolioConcentration();
  const upcoming = upcomingFinanceObligations();
  const optionalRecurring = workspaceData.finance.recurringPayments.filter((item) => item.active !== false && item.importance === "optional");
  if (month.transactions.length === 0) {
    insights.push({ type: "info", title: "Load demo data or add transactions", body: "Transactions unlock cash flow, budget usage, and spending category insights." });
  }
  if (summary.fixedCostRatio > 50) {
    insights.push({ type: "warning", title: "Fixed costs are above 50% of income", body: `Recurring payments use ${summary.fixedCostRatio}% of income. Review fixed obligations before adding variable spending.` });
  }
  if (summary.debtPaymentRatio > 20) {
    insights.push({ type: "warning", title: "Debt payments are above 20% of income", body: `Debt payments use ${summary.debtPaymentRatio}% of income. Prioritize payoff structure and avoid adding new obligations.` });
  }
  if (upcoming.length) {
    const hasOverdue = upcoming.some((item) => item.due.state === "overdue");
    const hasUrgent = upcoming.some((item) => item.due.state === "urgent");
    insights.push({
      type: hasOverdue || hasUrgent ? "warning" : "info",
      title: hasOverdue ? "You have overdue payments" : hasUrgent ? "You have payments due within 3 days" : "You have payments due within 7 days",
      body: upcoming.map((item) => `${item.name}: ${item.due.remainingLabel}`).slice(0, 3).join(", "),
    });
  }
  if (optionalRecurring.length) {
    insights.push({ type: "recommendation", title: "Optional recurring costs could be reviewed", body: `${optionalRecurring.length} optional payments total ${formatMoney(sumBy(optionalRecurring, "amount"))} per month.` });
  }
  if (summary.disposableIncome < Math.max(100, summary.incomeTotal * 0.1) && summary.incomeTotal > 0) {
    insights.push({ type: "warning", title: "Your disposable income is low this month", body: `${formatMoney(summary.disposableIncome)} remains after fixed obligations, debt, and variable expenses.` });
  }
  if (summary.expenseTotal > summary.incomeTotal && summary.incomeTotal > 0) {
    insights.push({ type: "warning", title: "Expenses exceed income", body: "Pause new discretionary spending and review the largest expense category first." });
  }
  if (summary.savingsRate < 10 && summary.incomeTotal > 0) {
    insights.push({ type: "warning", title: "Savings rate is low", body: "Aim for at least 10%. Start by moving one recurring expense into review." });
  }
  overspentBudgets.forEach((budget) => {
    insights.push({ type: "warning", title: `${budget.category} is over budget`, body: `${budget.category} is at ${budget.percent}% of its limit. Reduce or pause this category.` });
  });
  month.savingsGoals.forEach((goal) => {
    const percent = progressPercent(goal.currentAmount, goal.targetAmount);
    if (percent < 25) insights.push({ type: "recommendation", title: `${goal.name} needs momentum`, body: `Progress is ${percent}%. Schedule the next contribution before adding a new goal.` });
  });
  if (concentration && concentration.percent > 60) {
    insights.push({ type: "warning", title: "Portfolio concentration risk", body: `${concentration.assetName} is ${concentration.percent}% of the portfolio. Review diversification before adding more.` });
  }
  if (summary.investmentProfit < 0) {
    insights.push({ type: "info", title: "Portfolio is down", body: "Review asset allocation and avoid reacting without a plan." });
  }
  if (insights.length === 0) {
    insights.push({ type: "recommendation", title: "Keep the money map current", body: "Update transactions weekly and check savings goal progress before making new spending decisions." });
  }
  return insights.slice(0, 6);
}

function budgetUsage() {
  const month = currentFinanceMonth();
  const expensesByCategory = spendingByCategory();
  return month.budgets.map((budget) => {
    const spent = expensesByCategory[budget.category] || 0;
    return {
      ...budget,
      spent,
      remaining: budget.limit - spent,
      percent: budget.limit ? Math.round((spent / budget.limit) * 100) : 0,
    };
  });
}

function spendingByCategory() {
  return currentFinanceMonth().transactions
    .filter((item) => item.type === "expense")
    .reduce((totals, item) => {
      totals[item.category] = (totals[item.category] || 0) + numberOrZero(item.amount);
      return totals;
    }, {});
}

function portfolioConcentration() {
  const total = sumBy(workspaceData.finance.investments, "currentValue");
  if (!total) return null;
  const largest = [...workspaceData.finance.investments].sort((a, b) => b.currentValue - a.currentValue)[0];
  return { ...largest, percent: Math.round((largest.currentValue / total) * 100) };
}

function upcomingFinanceObligations() {
  return [
    ...workspaceData.finance.recurringPayments
      .filter((item) => item.active !== false)
      .map((item) => ({ name: item.name, dueDate: item.dueDate, due: dueDateState(item.dueDate) })),
    ...workspaceData.finance.debts
      .filter((item) => item.active !== false)
      .map((item) => ({ name: item.name, dueDate: item.dueDate, due: dueDateState(item.dueDate) })),
  ].filter((item) => item.due.daysRemaining <= 7);
}

function financeMetricMarkup(label, value, status) {
  return `<article class="finance-metric"><span class="stat-label">${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(status)}</small></article>`;
}

function financeInsightMarkup(insight) {
  return `<div class="finance-insight ${insight.type}"><strong>${escapeHtml(insight.title)}</strong><p>${escapeHtml(insight.body)}</p></div>`;
}

function transactionTable() {
  const rows = [...currentFinanceMonth().transactions].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  if (!rows.length) return emptyState("No transactions yet.", "Add income and expenses, or load demo data to see the money map.");
  return `
    <div class="finance-table-wrap">
      <table class="finance-table">
        <thead><tr><th>Date</th><th>Type</th><th>Category</th><th>Description</th><th>Amount</th><th></th></tr></thead>
        <tbody>
          ${rows
            .map(
              (item) => `
                <tr>
                  <td>${escapeHtml(item.date)}</td>
                  <td>${escapeHtml(item.type)}</td>
                  <td>${escapeHtml(item.category)}</td>
                  <td>${escapeHtml(item.description)}</td>
                  <td class="${item.type === "income" ? "positive" : "negative"}">${item.type === "income" ? "+" : "-"}${formatMoney(item.amount)}</td>
                  <td><button class="text-button" data-delete-transaction="${item.id}">Delete</button></td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function budgetMarkup(budget) {
  return `
    <div class="finance-row ${budget.percent > 100 ? "warning" : ""}">
      <div>
        <strong>${escapeHtml(budget.category)}</strong>
        <span>${formatMoney(budget.spent)} of ${formatMoney(budget.limit)} used</span>
      </div>
      <div class="finance-row-actions">
        <small>${budget.percent}%</small>
        <button class="text-button" data-delete-budget="${budget.id}">Delete</button>
      </div>
      <div class="meter"><span style="--fill: ${clamp(budget.percent, 0, 100)}%"></span></div>
    </div>
  `;
}

function savingsGoalMarkup(goal) {
  const percent = progressPercent(goal.currentAmount, goal.targetAmount);
  const status = percent >= 100 ? "Reached" : percent >= 50 ? "On track" : "Needs momentum";
  return `
    <div class="finance-row">
      <div>
        <strong>${escapeHtml(goal.name)}</strong>
        <span>${formatMoney(goal.currentAmount)} of ${formatMoney(goal.targetAmount)} saved</span>
      </div>
      <div class="finance-row-actions">
        <small>${status} / ${percent}%</small>
        <button class="text-button" data-delete-savings-goal="${goal.id}">Delete</button>
      </div>
      <div class="meter"><span style="--fill: ${clamp(percent, 0, 100)}%"></span></div>
    </div>
  `;
}

function investmentMarkup(investment) {
  const portfolioTotal = sumBy(workspaceData.finance.investments, "currentValue");
  const profit = investment.currentValue - investment.amountInvested;
  const returnPercent = investment.amountInvested ? Math.round((profit / investment.amountInvested) * 100) : 0;
  const allocation = portfolioTotal ? Math.round((numberOrZero(investment.currentValue) / portfolioTotal) * 100) : 0;
  return `
    <div class="finance-row">
      <div>
        <strong>${escapeHtml(investment.assetName)}</strong>
        <span>${formatMoney(investment.amountInvested)} invested / ${formatMoney(investment.currentValue)} current</span>
        <span>${escapeHtml(investment.category || "Uncategorized")} / ${allocation}% allocation</span>
        ${investment.notes ? `<span>${escapeHtml(investment.notes)}</span>` : ""}
      </div>
      <div class="finance-row-actions">
        <small class="${profit >= 0 ? "positive" : "negative"}">${profit >= 0 ? "+" : ""}${formatMoney(profit)} / ${returnPercent}%</small>
        <button class="text-button" data-edit-investment="${investment.id}">Edit</button>
        <button class="text-button" data-delete-investment="${investment.id}">Delete</button>
      </div>
    </div>
  `;
}

function recurringPaymentMarkup(payment) {
  const due = dueDateState(payment.dueDate);
  return `
    <div class="finance-row due-${due.state}">
      <div>
        <strong>${escapeHtml(payment.name)}</strong>
        <span>${escapeHtml(payment.category)} / ${formatMoney(payment.amount)}</span>
        <span>Due: ${escapeHtml(due.label)}</span>
        <span>${escapeHtml(due.remainingLabel)}</span>
      </div>
      <div class="finance-row-actions">
        <span class="status-badge due-badge ${due.state}">${due.state === "scheduled" ? "Scheduled" : due.state}</span>
        <span class="status-badge ${payment.active === false ? "inactive" : ""}">${payment.active === false ? "Inactive" : "Active"}</span>
        <span class="status-badge ${payment.importance === "optional" ? "optional" : ""}">${payment.importance === "optional" ? "Optional" : "Essential"}</span>
        <button class="text-button" data-edit-recurring="${payment.id}">Edit</button>
        <button class="text-button" data-delete-recurring="${payment.id}">Delete</button>
      </div>
    </div>
  `;
}

function debtMarkup(debt) {
  const due = dueDateState(debt.dueDate);
  const original = numberOrZero(debt.originalBalance) || numberOrZero(debt.remainingBalance);
  const progress = original ? Math.round(((original - numberOrZero(debt.remainingBalance)) / original) * 100) : 0;
  return `
    <div class="finance-row due-${due.state}">
      <div>
        <strong>${escapeHtml(debt.name)}</strong>
        <span>${escapeHtml(debt.type)} / ${formatMoney(debt.remainingBalance)} remaining / ${formatMoney(debt.monthlyPayment)} monthly</span>
        <span>Due: ${escapeHtml(due.label)}</span>
        <span>${escapeHtml(due.remainingLabel)}</span>
      </div>
      <div class="finance-row-actions">
        <span class="status-badge due-badge ${due.state}">${due.state === "scheduled" ? "Scheduled" : due.state}</span>
        <span class="status-badge">${clamp(progress, 0, 100)}% paid</span>
        <small>${numberOrZero(debt.interestRate)}% APR</small>
        <button class="text-button" data-edit-debt="${debt.id}">Edit</button>
        <button class="text-button" data-delete-debt="${debt.id}">Delete</button>
      </div>
      <div class="meter"><span style="--fill: ${clamp(progress, 0, 100)}%"></span></div>
    </div>
  `;
}

function financeCharts(summary) {
  const categories = Object.entries(spendingByCategory()).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxCategory = Math.max(...categories.map(([, value]) => value), 1);
  const month = currentFinanceMonth();
  const savingsTotal = sumBy(month.savingsGoals, "currentAmount") || workspaceData.finance.currentSavings;
  const savingsTarget = sumBy(month.savingsGoals, "targetAmount") || workspaceData.finance.savingsTarget;
  return `
    <div class="chart-block">
      <span class="stat-label">Spending by category</span>
      ${categories.length ? categories.map(([category, value]) => chartBar(category, value, maxCategory)).join("") : emptyState("No spending chart yet.", "Add expenses or load demo data.")}
    </div>
    <div class="chart-block">
      <span class="stat-label">Monthly cash flow</span>
      ${chartBar("Income", summary.incomeTotal, Math.max(summary.incomeTotal, summary.expenseTotal, 1), "positive")}
      ${chartBar("Expenses", summary.expenseTotal, Math.max(summary.incomeTotal, summary.expenseTotal, 1), "negative")}
      ${chartBar("Net cash flow", Math.max(0, summary.cashFlow), Math.max(summary.incomeTotal, summary.expenseTotal, 1), "positive")}
    </div>
    <div class="chart-block">
      <span class="stat-label">Savings trend</span>
      ${chartBar("Saved", savingsTotal, Math.max(savingsTarget, 1), "positive")}
      ${chartBar("Remaining", Math.max(0, savingsTarget - savingsTotal), Math.max(savingsTarget, 1))}
    </div>
  `;
}

function chartBar(label, value, max, tone = "") {
  const percent = max ? Math.round((value / max) * 100) : 0;
  return `<div class="chart-row ${tone}"><div><span>${escapeHtml(label)}</span><strong>${formatMoney(value)}</strong></div><div class="chart-track"><span style="--fill: ${clamp(percent, 0, 100)}%"></span></div></div>`;
}

function loadFinanceDemoData() {
  const month = currentFinanceMonth();
  const monthKey = currentMonthKey();
  workspaceData.finance.monthlyIncome = 5200;
  workspaceData.finance.savingsTarget = 1200;
  workspaceData.finance.currentSavings = 4200;
  month.transactions = month.transactions.filter((item) => item.source !== "demo").concat([
    { id: createId(), source: "demo", month: monthKey, type: "expense", amount: 420, category: "Food", description: "Groceries", date: currentMonthDate(6) },
    { id: createId(), source: "demo", month: monthKey, type: "expense", amount: 180, category: "Transport", description: "Transit and fuel", date: currentMonthDate(8) },
    { id: createId(), source: "demo", month: monthKey, type: "expense", amount: 360, category: "Dining", description: "Restaurants", date: currentMonthDate(12) },
    { id: createId(), source: "demo", month: monthKey, type: "income", amount: 650, category: "Freelance", description: "Side project", date: currentMonthDate(14) },
  ]);
  month.budgets = month.budgets.filter((item) => item.source !== "demo").concat([
    { id: createId(), source: "demo", month: monthKey, category: "Food", limit: 500 },
    { id: createId(), source: "demo", month: monthKey, category: "Dining", limit: 250 },
    { id: createId(), source: "demo", month: monthKey, category: "Subscriptions", limit: 180 },
    { id: createId(), source: "demo", month: monthKey, category: "Transport", limit: 220 },
  ]);
  month.savingsGoals = month.savingsGoals.filter((item) => item.source !== "demo").concat([
    { id: createId(), source: "demo", month: monthKey, name: "Emergency fund", targetAmount: 8000, currentAmount: 4200 },
    { id: createId(), source: "demo", month: monthKey, name: "Travel reserve", targetAmount: 1800, currentAmount: 650 },
  ]);
  workspaceData.finance.investments = workspaceData.finance.investments.filter((item) => item.source !== "demo").concat([
    { id: createId(), source: "demo", assetName: "Index fund", amountInvested: 3200, currentValue: 3560, category: "ETF", notes: "Core long-term holding" },
    { id: createId(), source: "demo", assetName: "Tech ETF", amountInvested: 1400, currentValue: 1280, category: "ETF", notes: "Higher volatility position" },
    { id: createId(), source: "demo", assetName: "Bonds", amountInvested: 900, currentValue: 930, category: "Bonds", notes: "Stability allocation" },
  ]);
  workspaceData.finance.recurringPayments = workspaceData.finance.recurringPayments.filter((item) => item.source !== "demo").concat([
    { id: createId(), source: "demo", name: "Rent", category: "Rent", amount: 1650, dueDate: currentMonthDate(3), importance: "essential", active: true },
    { id: createId(), source: "demo", name: "Phone plan", category: "Phone bill", amount: 55, dueDate: todayIso(5), importance: "essential", active: true },
    { id: createId(), source: "demo", name: "Streaming bundle", category: "Subscriptions", amount: 72, dueDate: todayIso(2), importance: "optional", active: true },
    { id: createId(), source: "demo", name: "Gym membership", category: "Gym membership", amount: 48, dueDate: currentMonthDate(18), importance: "optional", active: true },
    { id: createId(), source: "demo", name: "Utilities", category: "Utilities", amount: 210, dueDate: currentMonthDate(20), importance: "essential", active: true },
  ]);
  workspaceData.finance.debts = workspaceData.finance.debts.filter((item) => item.source !== "demo").concat([
    { id: createId(), source: "demo", name: "Credit card", type: "Credit card", originalBalance: 4200, remainingBalance: 3100, monthlyPayment: 240, interestRate: 18.9, dueDate: todayIso(3), active: true },
    { id: createId(), source: "demo", name: "Auto loan", type: "Loan", originalBalance: 14000, remainingBalance: 9200, monthlyPayment: 380, interestRate: 6.2, dueDate: currentMonthDate(22), active: true },
  ]);
  workspaceData.finance = syncFinanceLegacyArrays(workspaceData.finance);
  persistWorkspace();
}

function resetFinanceData() {
  if (!confirm("Reset all Finance data? This deletes transactions, budgets, savings goals, investments, history, settings, and currency.")) return;
  workspaceData.finance = defaultWorkspaceData().finance;
  persistWorkspace();
}

function sumBy(items, key) {
  return items.reduce((total, item) => total + numberOrZero(item[key]), 0);
}

function progressPercent(current, target) {
  return target ? Math.round((numberOrZero(current) / numberOrZero(target)) * 100) : 0;
}

function todayIso(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return localIsoDate(date);
}

function currentMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthKeyFromDate(value) {
  const date = value ? new Date(`${value}T00:00:00`) : new Date();
  return currentMonthKey(Number.isNaN(date.getTime()) ? new Date() : date);
}

function financeCycleInfo() {
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const monthName = today.toLocaleDateString(undefined, { month: "long" });
  return {
    monthName,
    todayLabel: today.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }),
    daysLeft: Math.max(0, lastDay - today.getDate()),
  };
}

function dueDateState(value) {
  const dueDate = parseLocalDate(value);
  const today = parseLocalDate(todayIso());
  const daysRemaining = Math.ceil((dueDate - today) / 86400000);
  let state = "scheduled";
  if (daysRemaining < 0) state = "overdue";
  else if (daysRemaining <= 3) state = "urgent";
  else if (daysRemaining <= 7) state = "soon";
  return {
    date: dueDate,
    daysRemaining,
    state,
    label: dueDate.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }),
    remainingLabel: daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : daysRemaining === 0 ? "Due today" : `${daysRemaining} days remaining`,
  };
}

function parseLocalDate(value) {
  if (!value) return parseLocalDate(todayIso());
  const [year, month, day] = String(value).split("-").map(Number);
  const date = new Date(year, (month || 1) - 1, day || 1);
  return Number.isNaN(date.getTime()) ? parseLocalDate(todayIso()) : date;
}

function currentMonthDate(day) {
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const date = new Date(today.getFullYear(), today.getMonth(), clamp(day, 1, lastDay));
  return localIsoDate(date);
}

function localIsoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function renderGoals() {
  const goals = goalHealth();
  const focus = goals.find((goal) => goal.focus && goal.status !== "Archived") || goals.find((goal) => goal.status === "Active");
  const dashboard = goalDashboard(goals);
  const recommendations = goalRecommendations(goals);
  const achievements = goals.filter((goal) => goal.status === "Completed");
  const activeGoals = goals.filter((goal) => goal.status !== "Completed" && goal.status !== "Archived" && goal.id !== focus?.id);
  return `
    <section class="module-app">
      <div class="module-command">
        <div>
          <span class="stat-label">Goals</span>
          <h2>Focus, milestones, next action.</h2>
          <p>Goals stay readable by keeping progress and the next useful step at the center.</p>
        </div>
        <strong class="metric">${averageGoalProgress()}%</strong>
      </div>
      <nav class="goal-nav-strip" aria-label="Goal sections">
        <a href="#focus-goal">Focus Goal</a>
        <a href="#active-goals">Active Goals</a>
        <a href="#goal-achievements">Achievements</a>
      </nav>
      <section id="focus-goal" class="goal-section">
        <div class="section-head"><span class="stat-label">Focus Goal</span><h2>One outcome gets priority</h2></div>
        ${focus ? goalSystemMarkup(focus, true) : emptyState("No focus goal.", "Create a goal or mark one goal as Focus Goal.")}
      </section>
      <section class="goal-dashboard-grid">
        ${Object.entries(dashboard).map(([label, value]) => financeMetricMarkup(label, String(value), "Goals")).join("")}
      </section>
      <section class="goal-layout">
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Create Goal</span><h2>Goal system</h2></div>
          <form class="goal-form" data-form="goal">
            <input name="id" type="hidden" />
            <input name="title" placeholder="Goal title" />
            <textarea name="description" rows="3" placeholder="Description"></textarea>
            <input name="category" placeholder="Category" />
            <input name="startDate" type="date" value="${todayIso()}" />
            <input name="targetDate" type="date" value="${todayIso(90)}" />
            <select name="priority"><option>Critical</option><option>High</option><option selected>Medium</option><option>Low</option></select>
            <select name="status"><option>Active</option><option>Paused</option><option>Completed</option><option>Archived</option></select>
            <input name="nextAction" placeholder="Next action" />
            <select name="taskConnections" multiple aria-label="Linked tasks">${workspaceData.tasks.items.map((task) => `<option value="${task.id}">${escapeHtml(task.title)}</option>`).join("")}</select>
            <select name="habitConnections" multiple aria-label="Linked habits">${workspaceData.habits.items.map((habit) => `<option value="${habit.id}">${escapeHtml(habit.name)}</option>`).join("")}</select>
            <select name="noteConnections" multiple aria-label="Linked notes">${workspaceData.notes.items.map((note) => `<option value="${note.id}">${escapeHtml(note.title)}</option>`).join("")}</select>
            <select name="financeConnections" multiple aria-label="Linked finance goals">${(workspaceData.finance.savingsGoals || []).map((goal) => `<option value="${goal.id}">${escapeHtml(goal.name)}</option>`).join("")}</select>
            <button class="button primary">Save goal</button>
          </form>
          <div class="template-list goal-template-list">${workspaceData.goals.templates.map((template) => `<button data-goal-template="${escapeHtml(template.name)}">${escapeHtml(template.name)}</button>`).join("")}</div>
        </article>
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Recommendations</span><h2>Goal guidance</h2></div>
          <div class="finance-insight-list">${recommendations.length ? recommendations.map(financeInsightMarkup).join("") : emptyState("No goal recommendations.", "Your goals have next actions and current milestones.")}</div>
        </article>
      </section>
      <section id="active-goals" class="goal-section">
        <div class="section-head"><span class="stat-label">Active Goals</span><h2>Current outcomes</h2></div>
        <div class="goal-system-list">
          ${activeGoals.length ? activeGoals.map((goal) => goalSystemMarkup(goal)).join("") : emptyState("No active goals.", "Create a goal or resume a paused one.")}
        </div>
      </section>
      <section id="goal-achievements" class="goal-layout goal-section">
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Achievements</span><h2>Completed goals</h2></div>
          <div class="goal-achievement-list">${achievements.length ? achievements.map(achievementMarkup).join("") : emptyState("No achievements yet.", "Completed goals move here automatically.")}</div>
        </article>
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Timeline</span><h2>Goal history</h2></div>
          <div class="notes-timeline">${goalTimeline(goals).map(timelineMarkup).join("") || emptyState("No goal timeline yet.", "Create goals and complete milestones to build history.")}</div>
        </article>
      </section>
    </section>
  `;
}

function goalSystemMarkup(goal, compact = false) {
  const progress = goalProgress(goal);
  const forecast = goalForecast(goal);
  const needsSetup = workspaceData.goals.setupPrompt === goal.id || !goal.milestones.length || !goal.nextAction?.trim();
  return `
    <article class="${compact ? "workspace-panel focus-goal-panel goal-card compact-focus" : "workspace-panel goal-card"}">
      <div class="goal-system-head">
        <div>
          <h2>${escapeHtml(goal.title)}</h2>
          <p>${escapeHtml(goal.description)}</p>
        </div>
        ${goal.focus ? `<span class="status-badge">Focus</span>` : ""}
      </div>
      <div class="goal-meta-row">
        <span>Status: ${escapeHtml(goal.status)}</span>
        <span>Priority: ${escapeHtml(goal.priority)}</span>
        <span>Target: ${escapeHtml(formatDateLabel(goal.targetDate))}</span>
      </div>
      <div class="goal-progress-block">
        <div>
          <span class="stat-label">Progress</span>
          <strong>${progress}%</strong>
          <small>Milestone Progress</small>
        </div>
        <div class="meter"><span style="--fill: ${clamp(progress, 0, 100)}%"></span></div>
      </div>
      <div class="goal-next-action ${goal.nextAction?.trim() ? "" : "needs-input"}">
        <span class="stat-label">Next Action</span>
        <p>${goal.nextAction?.trim() ? escapeHtml(goal.nextAction) : "Set one concrete next action so Forma can guide the next step."}</p>
      </div>
      ${needsSetup ? goalSetupPrompt(goal) : ""}
      <div class="goal-block">
        <div class="section-head compact"><span class="stat-label">Milestones</span><h2>Progress steps</h2></div>
        ${goal.milestones.length ? `<div class="milestone-list">${goal.milestones.map((milestone) => milestoneMarkup(goal, milestone)).join("")}</div>` : emptyState("No milestones yet.", "Add 2-4 concrete checkpoints so progress can be calculated automatically.")}
      </div>
      <form class="milestone-form" data-form="milestone" data-goal-id="${goal.id}">
        <input name="title" placeholder="Milestone title" />
        <input name="description" placeholder="Description" />
        <input name="dueDate" type="date" value="${todayIso(14)}" />
        <button class="button">Add milestone</button>
      </form>
      <details class="goal-disclosure">
        <summary>Related Items</summary>
        <div class="goal-connections">${goalConnectionsMarkup(goal)}</div>
      </details>
      <div class="goal-health-block">
        <span class="stat-label">Goal Health</span>
        <strong>${escapeHtml(goal.health)}</strong>
        <p>${escapeHtml(goal.statusDetail)}</p>
      </div>
      <details class="goal-disclosure">
        <summary>Forecasting</summary>
        <p>${escapeHtml(forecast)}</p>
      </details>
      <details class="goal-disclosure">
        <summary>Reviews</summary>
        <form class="review-form" data-form="goal-review" data-goal-id="${goal.id}">
          <select name="type"><option value="weekly">Weekly review</option><option value="monthly">Monthly review</option></select>
          <input name="progress" placeholder="Progress" />
          <input name="obstacles" placeholder="Obstacles" />
          <input name="nextActions" placeholder="Next actions / forecast" />
          <button class="button">Save review</button>
        </form>
        <div class="goal-review-list">${goal.reviews.length ? goal.reviews.slice(-3).reverse().map(goalReviewMarkup).join("") : emptyState("No reviews yet.", "Save a weekly or monthly review when there is something to reflect on.")}</div>
      </details>
      <details class="goal-disclosure">
        <summary>Timeline</summary>
        <div class="notes-timeline">${goalTimeline([goal]).map(timelineMarkup).join("") || emptyState("No timeline yet.", "Goal events appear here automatically.")}</div>
      </details>
      <div class="goal-actions">
        <button data-edit-goal="${goal.id}">Edit</button>
        <button data-focus-goal="${goal.id}">${goal.focus ? "Focused" : "Mark Focus"}</button>
        <button data-toggle-goal-status="${goal.id}" data-status="${goal.status === "Paused" ? "Active" : "Paused"}">${goal.status === "Paused" ? "Resume" : "Pause"}</button>
        <button data-toggle-goal-status="${goal.id}" data-status="Completed">Complete</button>
        <button data-toggle-goal-status="${goal.id}" data-status="Archived">Archive</button>
        <button data-delete-goal="${goal.id}" class="danger-button">Delete</button>
      </div>
    </article>
  `;
}

function goalSetupPrompt(goal) {
  const steps = [];
  if (!goal.milestones.length) steps.push("Create milestones");
  if (!goal.nextAction?.trim()) steps.push("Set next action");
  return `
    <div class="goal-setup-prompt">
      <strong>Finish setting up this goal</strong>
      <p>${escapeHtml(steps.join(" and ") || "Review the next milestone")} so the goal does not become an empty container.</p>
    </div>
  `;
}

function goalReviewMarkup(review) {
  return `
    <div class="goal-review-card">
      <strong>${escapeHtml(review.type)} review</strong>
      <span>${escapeHtml(formatDateLabel(review.date))}</span>
      <p>${escapeHtml(review.nextActions || review.progress || review.obstacles || "Review saved")}</p>
    </div>
  `;
}

function goalHealth() {
  return workspaceData.goals.items.map((goal) => ({ ...goal, health: goalHealthStatus(goal), statusDetail: goalStatusDetail(goal), progress: goalProgress(goal) }));
}

function goalProgress(goal) {
  if (!goal.milestones?.length) return 0;
  return Math.round((goal.milestones.filter((milestone) => milestone.completed).length / goal.milestones.length) * 100);
}

function goalHealthStatus(goal) {
  if (goal.status === "Completed") return "Completed";
  const lastProgress = lastMilestoneProgressDate(goal);
  const days = daysSince(lastProgress || goal.createdAt);
  if (days >= 30) return "Stalled";
  if (days >= 14) return "At Risk";
  return "Healthy";
}

function goalStatusDetail(goal) {
  if (goal.status === "Completed") return "Completed and moved to achievements.";
  if (!goal.nextAction?.trim()) return "No next action is defined.";
  const overdue = goal.milestones.some((milestone) => !milestone.completed && dueDateState(milestone.dueDate).state === "overdue");
  if (overdue) return "At least one milestone is overdue.";
  return `${goalProgress(goal)}% from completed milestones.`;
}

function lastMilestoneProgressDate(goal) {
  const dates = goal.milestones.filter((milestone) => milestone.completedAt).map((milestone) => milestone.completedAt).sort();
  return dates.at(-1);
}

function daysSince(value) {
  const date = value ? new Date(value) : new Date();
  return Math.floor((new Date() - date) / 86400000);
}

function goalDashboard(goals) {
  return {
    "Active Goals": goals.filter((goal) => goal.status === "Active").length,
    "Completed Goals": goals.filter((goal) => goal.status === "Completed").length,
    "Paused Goals": goals.filter((goal) => goal.status === "Paused").length,
    "At Risk Goals": goals.filter((goal) => goal.health === "At Risk").length,
    "Stalled Goals": goals.filter((goal) => goal.health === "Stalled").length,
  };
}

function milestoneMarkup(goal, milestone) {
  const due = dueDateState(milestone.dueDate);
  return `
    <div class="milestone-card ${milestone.completed ? "done" : ""} due-${due.state}">
      <label><input type="checkbox" data-toggle-milestone="${goal.id}" data-milestone-id="${milestone.id}" ${milestone.completed ? "checked" : ""} /> <strong>${escapeHtml(milestone.title)}</strong></label>
      <span>${escapeHtml(milestone.description || "No description")}</span>
      <small>Due ${escapeHtml(due.label)} / ${escapeHtml(due.remainingLabel)}</small>
      <div class="goal-actions">
        <button data-edit-milestone="${goal.id}" data-milestone-id="${milestone.id}">Edit</button>
        <button data-delete-milestone="${goal.id}" data-milestone-id="${milestone.id}">Delete</button>
      </div>
    </div>
  `;
}

function goalConnectionsMarkup(goal) {
  const tasks = goal.connections.tasks.map((id) => workspaceData.tasks.items.find((item) => item.id === id)?.title).filter(Boolean);
  const habits = goal.connections.habits.map((id) => workspaceData.habits.items.find((item) => item.id === id)?.name).filter(Boolean);
  const notes = goal.connections.notes.map((id) => workspaceData.notes.items.find((item) => item.id === id)?.title).filter(Boolean);
  const finance = goal.connections.finance.map((id) => (workspaceData.finance.savingsGoals || []).find((item) => item.id === id)?.name || id).filter(Boolean);
  const chips = [...tasks, ...habits, ...notes, ...finance].slice(0, 8);
  return chips.length ? chips.map((chip) => `<span>${escapeHtml(chip)}</span>`).join("") : "<p class=\"goal-empty-note\">No related items yet. Edit this goal to link tasks, habits, notes, or finance goals.</p>";
}

function goalForecast(goal) {
  const completed = goal.milestones.filter((milestone) => milestone.completed && milestone.completedAt);
  const remaining = goal.milestones.filter((milestone) => !milestone.completed).length;
  if (!completed.length || !remaining) return remaining ? "Needs more milestone data" : "Completed";
  const first = new Date(goal.createdAt);
  const last = new Date(completed.map((milestone) => milestone.completedAt).sort().at(-1));
  const pace = Math.max(1, (last - first) / 86400000 / completed.length);
  const forecast = new Date();
  forecast.setDate(forecast.getDate() + Math.ceil(pace * remaining));
  return forecast.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
}

function goalRecommendations(goals) {
  const active = goals.filter((goal) => goal.status === "Active");
  const recommendations = [];
  if (active.length > 4) recommendations.push({ type: "warning", title: "Too many active goals", body: "Reduce active goals so focus and next actions stay realistic." });
  active.forEach((goal) => {
    if (!goal.nextAction?.trim()) recommendations.push({ type: "warning", title: `${goal.title} has no next action`, body: "Add a concrete next action before adding more milestones." });
    if (goal.health === "At Risk") recommendations.push({ type: "warning", title: `${goal.title} has no progress in 14 days`, body: "Complete or revise one milestone this week." });
    if (goal.health === "Stalled") recommendations.push({ type: "warning", title: `${goal.title} is stalled`, body: "No milestone progress in 30 days. Pause, archive, or restart with one milestone." });
    goal.milestones.filter((milestone) => !milestone.completed && dueDateState(milestone.dueDate).state === "overdue").forEach((milestone) => {
      recommendations.push({ type: "warning", title: `${milestone.title} is overdue`, body: `Milestone in ${goal.title} needs review.` });
    });
  });
  return recommendations.slice(0, 8);
}

function goalTimeline(goals) {
  return goals
    .flatMap((goal) => [
      { date: goal.createdAt, title: "Goal created", detail: goal.title },
      ...goal.timeline.map((item) => ({ date: item.date, title: item.type, detail: `${goal.title}: ${item.detail}` })),
      ...goal.milestones.filter((milestone) => milestone.completedAt).map((milestone) => ({ date: milestone.completedAt, title: "Milestone completed", detail: `${goal.title}: ${milestone.title}` })),
      ...(goal.completedAt ? [{ date: goal.completedAt, title: "Goal completed", detail: goal.title }] : []),
    ])
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, 30);
}

function achievementMarkup(goal) {
  const completedAt = goal.completedAt || goal.updatedAt;
  return `
    <div class="goal-achievement">
      <div>
        <strong>${escapeHtml(goal.title)}</strong>
        <span>Completed ${escapeHtml(formatDateLabel(completedAt))}</span>
        <small>${goal.milestones.filter((milestone) => milestone.completed).length}/${goal.milestones.length} milestones / ${daysBetween(goal.createdAt, completedAt)} days</small>
      </div>
      <button data-delete-goal="${goal.id}" class="danger-button">Delete</button>
    </div>
  `;
}

function daysBetween(start, end) {
  return Math.max(0, Math.ceil((new Date(end) - new Date(start)) / 86400000));
}

function renderHabits() {
  const habit = recommendedHabit();
  const done = workspaceData.habits.items.filter((item) => item.completedToday).length;
  return `
    <section class="module-app">
      <div class="module-command">
        <div>
          <span class="stat-label">Habits</span>
          <h2>${done ? "Consistency is active today." : "Recovery starts with one habit."}</h2>
          <p>${escapeHtml(habit.reason)}</p>
        </div>
        <strong class="metric">${done}/${workspaceData.habits.items.length}</strong>
      </div>
      <div class="module-grid">
        <article class="workspace-panel large-panel">
          <div class="section-head">
            <span class="stat-label">Today's habits</span>
            <h2>Complete the loop</h2>
          </div>
          <div class="item-list">${workspaceData.habits.items.map(habitMarkup).join("")}</div>
        </article>
        <aside class="workspace-panel">
          <span class="stat-label">Recommended habit</span>
          <h2>${escapeHtml(habit.name)}</h2>
          <p>${escapeHtml(habit.recovery)}</p>
        </aside>
      </div>
    </section>
  `;
}

function recommendedHabit() {
  const next = workspaceData.habits.items.find((item) => !item.completedToday) || workspaceData.habits.items[0];
  if (!next) return { name: "Add one habit", reason: "No routine exists yet.", recovery: "Start with the smallest repeatable action." };
  if (next.streak === 0) return { name: next.name, reason: "This is the easiest place to restart.", recovery: "Complete it once today. Streaks can rebuild later." };
  return { name: next.name, reason: `${next.streak} day streak is worth protecting.`, recovery: "Keep the loop alive before adding more habits." };
}

function renderTasks(config) {
  const taskModule = config.modules.find((module) => module.id === "tasks");
  const limit = taskModule?.settings.dailyLimit || structureLimit();
  const open = workspaceData.tasks.items.filter((item) => !item.completed);
  return `
    <section class="module-app">
      <div class="module-command">
        <div>
          <span class="stat-label">Tasks</span>
          <h2>${open.length > limit ? "The day is overloaded." : "The day is actionable."}</h2>
          <p>Forma separates tasks into must-do, should-do, and later so the next action is clear.</p>
        </div>
        <strong class="metric">${open.length}/${limit}</strong>
      </div>
      <article class="workspace-panel large-panel">
        <form class="inline-form" data-form="task">
          <input name="task" placeholder="Add a task" />
          <button class="icon-button" title="Add task" aria-label="Add task">+</button>
        </form>
        <div class="task-lanes">${["must", "should", "later"].map((tier) => taskLane(tier)).join("")}</div>
      </article>
    </section>
  `;
}

function taskLane(tier) {
  const labels = { must: "Must do", should: "Should do", later: "Later" };
  const items = workspaceData.tasks.items.filter((task) => task.tier === tier);
  return `
    <section class="task-lane">
      <span class="stat-label">${labels[tier]}</span>
      ${items.length ? items.map(taskMarkup).join("") : emptyState("Clear", "No tasks in this lane.")}
    </section>
  `;
}

function renderNotes() {
  const notes = filteredNotes();
  const active = activeNotes();
  const pinned = active.filter((note) => note.pinned && !note.archived);
  const recent = recentNotes(5);
  const vault = workspaceData.notes.items.filter((note) => note.type === "vault" && !note.archived);
  const journal = workspaceData.notes.items.filter((note) => note.type === "journal").sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  const timeline = notesTimeline();
  return `
    <section class="module-app">
      <div class="module-command">
        <div>
          <span class="stat-label">Notes</span>
          <h2>Your thinking system and knowledge vault.</h2>
          <p>Capture notes, journal entries, decisions, knowledge, links, and connections that can become tasks, habits, or goals.</p>
        </div>
        <strong class="metric">${active.length}</strong>
      </div>
      <section class="notes-layout">
        <aside class="workspace-panel notes-sidebar">
          <input class="notes-search" data-notes-search placeholder="Search title, content, tag, category, date" value="${escapeHtml(workspaceData.notes.search || "")}" />
          <div class="notes-filter-list">
            ${["all", "favorites", "archived", "recent", "journal", "vault"].map((filter) => notesFilterButton(filter)).join("")}
          </div>
          <span class="stat-label">Categories</span>
          <div class="notes-filter-list">${workspaceData.notes.categories.map((category) => notesFilterButton(`category:${category}`, category)).join("")}</div>
          <span class="stat-label">Tags</span>
          <div class="notes-filter-list">${workspaceData.notes.tags.length ? workspaceData.notes.tags.map((tag) => notesFilterButton(`tag:${tag}`, `#${tag}`)).join("") : emptyState("No tags yet.", "Tags appear after saving notes.")}</div>
        </aside>
        <section class="notes-main">
          <article class="workspace-panel notes-editor">
            <div class="section-head">
              <span class="stat-label">Create / Edit</span>
              <h2>Thinking workspace</h2>
            </div>
            <form data-form="note" class="note-system-form">
              <input name="id" type="hidden" />
              <div class="notes-form-grid">
                <input name="title" placeholder="Note title" />
                <select name="type" aria-label="Note type"><option value="note">Note</option><option value="vault">Knowledge Vault</option></select>
                <input name="category" list="note-category-options" placeholder="Category" />
                <input name="tags" placeholder="Tags, comma separated" />
              </div>
              <datalist id="note-category-options">${workspaceData.notes.categories.map((category) => `<option value="${escapeHtml(category)}"></option>`).join("")}</datalist>
              <div class="rich-toolbar">
                ${[
                  ["bold", "B"],
                  ["italic", "I"],
                  ["underline", "U"],
                  ["h1", "H1"],
                  ["h2", "H2"],
                  ["h3", "H3"],
                  ["bullet", "Bullets"],
                  ["numbered", "Numbers"],
                  ["check", "Checklist"],
                  ["quote", "Quote"],
                  ["divider", "Divider"],
                  ["highlight", "Highlight"],
                ].map(([format, label]) => `<button type="button" data-rich-format="${format}">${label}</button>`).join("")}
              </div>
              <textarea name="content" rows="10" placeholder="Write what you are thinking, learning, deciding, or planning..."></textarea>
              <div class="notes-form-grid attachment-grid">
                <input name="attachmentLink" placeholder="Link attachment URL" />
                <input name="attachmentImage" type="file" accept="image/*" />
                <input name="attachmentPdf" type="file" accept="application/pdf" />
                <select name="connections" multiple aria-label="Connected notes">${workspaceData.notes.items.map((note) => `<option value="${note.id}">${escapeHtml(note.title)}</option>`).join("")}</select>
              </div>
              <div class="footer-actions">
                <button class="button primary">Save note</button>
                <button class="button" type="button" data-action="clear-note-editor">Clear editor</button>
              </div>
            </form>
          </article>
          <section class="notes-utility-grid">
            <article class="workspace-panel">
              <span class="stat-label">Templates</span>
              <div class="template-list notes-template-list">${workspaceData.notes.templates.map((template) => `<button data-note-template="${escapeHtml(template.name)}">${escapeHtml(template.name)}</button>`).join("")}</div>
            </article>
            <article class="workspace-panel">
              <span class="stat-label">Daily Journal</span>
              <form data-form="journal" class="journal-form">
                <input name="mood" placeholder="Mood" />
                <textarea name="wins" rows="2" placeholder="Wins"></textarea>
                <textarea name="challenges" rows="2" placeholder="Challenges"></textarea>
                <textarea name="lessons" rows="2" placeholder="Lessons"></textarea>
                <textarea name="tomorrow" rows="2" placeholder="Tomorrow's focus"></textarea>
                <button class="button primary">Save today's journal</button>
              </form>
            </article>
          </section>
          <section class="notes-section">
            <div class="section-head"><span class="stat-label">Pinned</span><h2>Keep visible</h2></div>
            <div class="note-list">${pinned.length ? pinned.map(noteMarkup).join("") : emptyState("No pinned notes.", "Pin important notes to keep them visible.")}</div>
          </section>
          <section class="notes-section">
            <div class="section-head"><span class="stat-label">Results</span><h2>${escapeHtml(notesFilterTitle())}</h2></div>
            <div class="note-list">${notes.length ? notes.map(noteMarkup).join("") : emptyState(notesEmptyTitle(), notesEmptyBody())}</div>
          </section>
          <section class="notes-utility-grid">
            <article class="workspace-panel">
              <span class="stat-label">Recent Notes</span>
              <div class="note-list compact">${recent.length ? recent.map(noteCompactMarkup).join("") : emptyState("No recent notes.", "Create a note to start the timeline.")}</div>
            </article>
            <article class="workspace-panel">
              <span class="stat-label">Knowledge Vault</span>
              <div class="note-list compact">${vault.length ? vault.map(noteCompactMarkup).join("") : emptyState("No knowledge vault content.", "Save permanent knowledge as Vault notes.")}</div>
            </article>
          </section>
          <section class="workspace-panel">
            <div class="section-head"><span class="stat-label">Timeline</span><h2>Thinking history</h2></div>
            <div class="notes-timeline">${timeline.length ? timeline.map(timelineMarkup).join("") : emptyState("No timeline yet.", "Notes, edits, journals, and linked notes appear here.")}</div>
          </section>
          <section class="workspace-panel">
            <div class="section-head"><span class="stat-label">Journal Archive</span><h2>Previous days</h2></div>
            <div class="note-list compact">${journal.length ? journal.map(noteCompactMarkup).join("") : emptyState("No journal entries.", "Save today's journal to begin.")}</div>
          </section>
        </section>
      </section>
    </section>
  `;
}

function activeNotes() {
  return workspaceData.notes.items.filter((note) => !note.archived);
}

function recentNotes(limit = 8) {
  return activeNotes()
    .slice()
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
    .slice(0, limit);
}

function filteredNotes() {
  const filter = workspaceData.notes.activeFilter || "all";
  const query = (workspaceData.notes.search || "").toLowerCase();
  let notes = workspaceData.notes.items.slice();
  if (filter === "all") notes = notes.filter((note) => !note.archived);
  if (filter === "favorites") notes = notes.filter((note) => note.favorite && !note.archived);
  if (filter === "archived") notes = notes.filter((note) => note.archived);
  if (filter === "recent") notes = recentNotes(12);
  if (filter === "journal") notes = notes.filter((note) => note.type === "journal");
  if (filter === "vault") notes = notes.filter((note) => note.type === "vault" && !note.archived);
  if (filter.startsWith("category:")) notes = notes.filter((note) => note.category === filter.slice(9) && !note.archived);
  if (filter.startsWith("tag:")) notes = notes.filter((note) => note.tags.includes(filter.slice(4)) && !note.archived);
  if (query) {
    notes = notes.filter((note) => {
      const haystack = [note.title, note.content, note.category, note.createdAt, note.updatedAt, ...(note.tags || [])].join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }
  return notes.sort((a, b) => Number(b.pinned) - Number(a.pinned) || String(b.updatedAt).localeCompare(String(a.updatedAt)));
}

function notesFilterButton(filter, label = null) {
  const active = workspaceData.notes.activeFilter === filter || (!workspaceData.notes.activeFilter && filter === "all");
  const text = label || filter.replace("-", " ");
  return `<button class="${active ? "active" : ""}" data-notes-filter="${escapeHtml(filter)}">${escapeHtml(text)}</button>`;
}

function notesFilterTitle() {
  const filter = workspaceData.notes.activeFilter || "all";
  if (filter.startsWith("category:")) return `Category: ${filter.slice(9)}`;
  if (filter.startsWith("tag:")) return `Tag: #${filter.slice(4)}`;
  return {
    all: "All Notes",
    favorites: "Favorites",
    archived: "Archived",
    recent: "Recent",
    journal: "Daily Journal",
    vault: "Knowledge Vault",
  }[filter] || "All Notes";
}

function notesEmptyTitle() {
  const filter = workspaceData.notes.activeFilter || "all";
  if (workspaceData.notes.search) return "No search results.";
  if (filter === "favorites") return "No favorites yet.";
  if (filter === "archived") return "No archived notes.";
  if (filter === "journal") return "No journal entries.";
  if (filter === "vault") return "No knowledge vault content.";
  return "No notes yet.";
}

function notesEmptyBody() {
  if (workspaceData.notes.search) return "Try a different title, tag, category, date, or content search.";
  return "Create a note, use a template, or save today's journal.";
}

function noteCompactMarkup(note) {
  return `<button class="note-compact" data-edit-note="${note.id}"><strong>${escapeHtml(note.title)}</strong><span>${escapeHtml(note.category)} / ${formatDateLabel(note.updatedAt)}</span></button>`;
}

function notesTimeline() {
  return workspaceData.notes.items
    .flatMap((note) => {
      const items = [
        { date: note.createdAt, title: note.type === "journal" ? "Daily Journal" : `Created ${note.category}`, detail: note.title },
      ];
      if (note.updatedAt && note.updatedAt !== note.createdAt) items.push({ date: note.updatedAt, title: "Edited Note", detail: note.title });
      if (note.connections?.length) items.push({ date: note.updatedAt, title: "Connected Note", detail: note.title });
      return items;
    })
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, 24);
}

function timelineMarkup(item) {
  return `<div class="timeline-item"><span>${escapeHtml(formatDateLabel(item.date))}</span><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.detail)}</p></div>`;
}

function connectedNotes(note) {
  return (note.connections || []).map((id) => workspaceData.notes.items.find((item) => item.id === id)).filter(Boolean);
}

function backlinks(note) {
  return workspaceData.notes.items.filter((item) => item.connections?.includes(note.id));
}

function noteDetections(note) {
  const text = `${note.title} ${note.content}`.toLowerCase();
  const detections = [];
  if (/\b(need to|todo|buy|call|email|finish|submit|prepare)\b/.test(text)) detections.push({ type: "task", label: "Convert to Task" });
  if (/\b(daily|every day|per day|drink|sleep|train|stretch|read)\b/.test(text)) detections.push({ type: "habit", label: "Convert to Habit" });
  if (/\b(improve|reach|build|become|complete|achieve|learn)\b/.test(text)) detections.push({ type: "goal", label: "Convert to Goal" });
  return detections;
}

function renderNoteContent(content) {
  const escaped = escapeHtml(content || "");
  return escaped
    .split("\n")
    .map((line) => {
      if (line.startsWith("# ")) return `<h1>${line.slice(2)}</h1>`;
      if (line.startsWith("## ")) return `<h2>${line.slice(3)}</h2>`;
      if (line.startsWith("### ")) return `<h3>${line.slice(4)}</h3>`;
      if (line.startsWith("> ")) return `<blockquote>${line.slice(2)}</blockquote>`;
      if (line.startsWith("- [ ] ")) return `<label class="render-check"><input type="checkbox" disabled /> ${line.slice(6)}</label>`;
      if (line.startsWith("- [x] ")) return `<label class="render-check"><input type="checkbox" checked disabled /> ${line.slice(6)}</label>`;
      if (line.startsWith("- ")) return `<li>${line.slice(2)}</li>`;
      if (/^\d+\.\s/.test(line)) return `<li class="numbered">${line.replace(/^\d+\.\s/, "")}</li>`;
      if (line === "---") return "<hr />";
      return `<p>${line || "&nbsp;"}</p>`;
    })
    .join("")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/__(.*?)__/g, "<u>$1</u>")
    .replace(/==(.*?)==/g, "<mark>$1</mark>");
}

function formatDateLabel(value) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? String(value || "") : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function renderSettings(config) {
  return `
    <section class="module-app">
      <div class="module-command">
        <div>
          <span class="stat-label">Settings</span>
          <h2>Generated structure</h2>
          <p>Settings is separated from work modules. Export is kept here so Home stays focused on action.</p>
        </div>
        ${DEV_MODE_ENABLED && developerMode.unlocked ? `<strong class="developer-badge settings-dev-badge">Developer Mode</strong>` : ""}
      </div>
      <div class="module-grid">
        <article class="workspace-panel large-panel">
          <div class="pill-list">${workspaceTabs(config).map((tab) => pillMarkup(tab.label)).join("")}</div>
          <pre class="json-panel settings-json">${escapeHtml(JSON.stringify(config, null, 2))}</pre>
        </article>
        <aside class="workspace-panel">
          <button class="button primary settings-export" data-action="download">Export configuration</button>
        </aside>
      </div>
      ${DEV_MODE_ENABLED ? renderDeveloperModePanel() : ""}
    </section>
  `;
}

function renderDeveloperModePanel() {
  if (developerMode.unlocked) return "";
  if (!developerMode.unlocked) {
    return `
      <article class="workspace-panel developer-panel">
        <div class="section-head">
          <span class="stat-label">Developer Tools</span>
          <h2>Developer Mode</h2>
        </div>
        <p>Temporary controls for local development and testing.</p>
        <button class="button" data-action="unlock-developer-mode">Developer Mode</button>
        ${developerMode.error ? `<div class="error developer-error">${escapeHtml(developerMode.error)}</div>` : ""}
      </article>
    `;
  }
}

function attachWorkspaceHandlers() {
  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTab = button.dataset.tab;
      renderWorkspace();
    });
  });
  bind("[data-action='download']", "click", downloadConfig);
  bind("[data-action='unlock-developer-mode']", "click", unlockDeveloperMode);
  bind("[data-action='load-demo-workspace']", "click", loadDemoWorkspace);
  bind("[data-action='disable-developer-mode']", "click", disableDeveloperMode);
  bind("[data-action='reset-onboarding']", "click", resetOnboarding);
  bind("[data-action='reset-all-data']", "click", resetAllData);
  bindForm("task", (form) => {
    const title = form.task.value.trim();
    if (!title) return;
    workspaceData.tasks.items.push({ id: createId(), title, tier: "should", completed: false });
    persistWorkspace();
  });
  bindForm("note", (form) => {
    saveNoteFromForm(form);
    persistWorkspace();
  });
  bindForm("journal", (form) => {
    const fields = form.elements;
    const today = todayIso();
    const existing = workspaceData.notes.items.find((note) => note.type === "journal" && note.journalDate === today);
    const content = `# Daily Journal\n\n## Mood\n${fields.mood.value.trim()}\n\n## Wins\n${fields.wins.value.trim()}\n\n## Challenges\n${fields.challenges.value.trim()}\n\n## Lessons\n${fields.lessons.value.trim()}\n\n## Tomorrow's Focus\n${fields.tomorrow.value.trim()}\n`;
    const note = {
      ...(existing || {}),
      id: existing?.id || createId(),
      title: `Daily Journal - ${formatDateLabel(today)}`,
      content,
      category: "Daily Journal",
      tags: ["journal"],
      type: "journal",
      mood: fields.mood.value.trim(),
      favorite: existing?.favorite || false,
      pinned: existing?.pinned || false,
      archived: existing?.archived || false,
      attachments: existing?.attachments || [],
      connections: existing?.connections || [],
      journalDate: today,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (existing) workspaceData.notes.items = workspaceData.notes.items.map((item) => (item.id === existing.id ? note : item));
    else workspaceData.notes.items.unshift(note);
    refreshNotesTaxonomy();
    persistWorkspace();
  });
  bindForm("finance-profile", (form) => {
    const fields = form.elements;
    workspaceData.finance.currentSavings = numberOrZero(fields.currentSavings.value);
    workspaceData.finance.monthlyIncome = numberOrZero(fields.monthlyIncome.value);
    workspaceData.finance.currency = fields.currency.value;
    persistWorkspace();
  });
  const financeProfileForm = document.querySelector("[data-form='finance-profile']");
  if (financeProfileForm) {
    financeProfileForm.querySelectorAll("input, select").forEach((field) => {
      field.addEventListener("change", () => {
        workspaceData.finance.currentSavings = numberOrZero(financeProfileForm.elements.currentSavings.value);
        workspaceData.finance.monthlyIncome = numberOrZero(financeProfileForm.elements.monthlyIncome.value);
        workspaceData.finance.currency = financeProfileForm.elements.currency.value;
        persistWorkspace();
      });
    });
  }
  bindForm("transaction", (form) => {
    const fields = form.elements;
    const amount = numberOrZero(fields.amount.value);
    const category = fields.category.value.trim();
    if (!amount || !category) return;
    const date = fields.date.value || todayIso();
    const monthKey = monthKeyFromDate(date);
    const month = financeMonth(monthKey);
    month.transactions.unshift({
      id: createId(),
      type: fields.type.value,
      amount,
      category,
      description: fields.description.value.trim() || category,
      date,
      month: monthKey,
    });
    workspaceData.finance = syncFinanceLegacyArrays(workspaceData.finance);
    persistWorkspace();
  });
  bindForm("budget", (form) => {
    const fields = form.elements;
    const category = fields.category.value.trim();
    const limit = numberOrZero(fields.limit.value);
    if (!category || !limit) return;
    const month = currentFinanceMonth();
    const existing = month.budgets.find((budget) => budget.category.toLowerCase() === category.toLowerCase());
    if (existing) {
      existing.limit = limit;
    } else {
      month.budgets.push({ id: createId(), category, limit, month: currentMonthKey() });
    }
    workspaceData.finance = syncFinanceLegacyArrays(workspaceData.finance);
    persistWorkspace();
  });
  bindForm("savings-goal", (form) => {
    const fields = form.elements;
    const name = fields.name.value.trim();
    const targetAmount = numberOrZero(fields.targetAmount.value);
    if (!name || !targetAmount) return;
    const month = currentFinanceMonth();
    month.savingsGoals.push({
      id: createId(),
      name,
      targetAmount,
      currentAmount: numberOrZero(fields.currentAmount.value),
      month: currentMonthKey(),
    });
    workspaceData.finance = syncFinanceLegacyArrays(workspaceData.finance);
    persistWorkspace();
  });
  bindForm("investment", (form) => {
    const fields = form.elements;
    const assetName = fields.assetName.value.trim();
    const amountInvested = numberOrZero(fields.amountInvested.value);
    const currentValue = numberOrZero(fields.currentValue.value);
    if (!assetName || !amountInvested) return;
    const investment = {
      id: fields.id.value || createId(),
      assetName,
      amountInvested,
      currentValue,
      category: fields.category.value.trim() || "Uncategorized",
      notes: fields.notes.value.trim(),
    };
    const index = workspaceData.finance.investments.findIndex((item) => item.id === investment.id);
    if (index >= 0) workspaceData.finance.investments[index] = investment;
    else workspaceData.finance.investments.push(investment);
    persistWorkspace();
  });
  bindForm("recurring-payment", (form) => {
    const fields = form.elements;
    const name = fields.name.value.trim();
    const amount = numberOrZero(fields.amount.value);
    if (!name || !amount) return;
    const payment = {
      id: fields.id.value || createId(),
      name,
      category: fields.category.value,
      amount,
      dueDate: fields.dueDate.value || todayIso(),
      importance: fields.importance.value,
      active: fields.active.value === "true",
    };
    const index = workspaceData.finance.recurringPayments.findIndex((item) => item.id === payment.id);
    if (index >= 0) workspaceData.finance.recurringPayments[index] = payment;
    else workspaceData.finance.recurringPayments.push(payment);
    persistWorkspace();
  });
  bindForm("debt", (form) => {
    const fields = form.elements;
    const name = fields.name.value.trim();
    const remainingBalance = numberOrZero(fields.remainingBalance.value);
    if (!name || !remainingBalance) return;
    const debt = {
      id: fields.id.value || createId(),
      name,
      type: fields.type.value,
      originalBalance: numberOrZero(fields.originalBalance.value) || remainingBalance,
      remainingBalance,
      monthlyPayment: numberOrZero(fields.monthlyPayment.value),
      interestRate: numberOrZero(fields.interestRate.value),
      dueDate: fields.dueDate.value || todayIso(),
      active: true,
    };
    const index = workspaceData.finance.debts.findIndex((item) => item.id === debt.id);
    if (index >= 0) workspaceData.finance.debts[index] = debt;
    else workspaceData.finance.debts.push(debt);
    persistWorkspace();
  });
  document.querySelectorAll("[data-task-toggle]").forEach((input) => {
    input.addEventListener("change", () => {
      const task = workspaceData.tasks.items.find((item) => item.id === input.dataset.taskToggle);
      if (task) task.completed = input.checked;
      persistWorkspace();
    });
  });
  document.querySelectorAll("[data-habit-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const habit = workspaceData.habits.items.find((item) => item.id === button.dataset.habitToggle);
      if (!habit) return;
      habit.completedToday = !habit.completedToday;
      habit.streak = Math.max(0, habit.streak + (habit.completedToday ? 1 : -1));
      persistWorkspace();
    });
  });
  attachGoalHandlers();
  document.querySelectorAll("[data-finance-field]").forEach((input) => {
    input.addEventListener("change", () => {
      workspaceData.finance[input.dataset.financeField] = numberOrZero(input.value);
      persistWorkspace();
    });
  });
  document.querySelectorAll("[data-delete-transaction]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!confirm("Delete this transaction?")) return;
      Object.values(workspaceData.finance.months || {}).forEach((month) => {
        month.transactions = (month.transactions || []).filter((item) => item.id !== button.dataset.deleteTransaction);
      });
      workspaceData.finance = syncFinanceLegacyArrays(workspaceData.finance);
      persistWorkspace();
    });
  });
  document.querySelectorAll("[data-delete-budget]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!confirm("Delete this category budget?")) return;
      const month = currentFinanceMonth();
      month.budgets = month.budgets.filter((item) => item.id !== button.dataset.deleteBudget);
      workspaceData.finance = syncFinanceLegacyArrays(workspaceData.finance);
      persistWorkspace();
    });
  });
  document.querySelectorAll("[data-delete-savings-goal]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!confirm("Delete this savings goal?")) return;
      const month = currentFinanceMonth();
      month.savingsGoals = month.savingsGoals.filter((item) => item.id !== button.dataset.deleteSavingsGoal);
      workspaceData.finance = syncFinanceLegacyArrays(workspaceData.finance);
      persistWorkspace();
    });
  });
  document.querySelectorAll("[data-delete-investment]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!confirm("Delete this investment?")) return;
      workspaceData.finance.investments = workspaceData.finance.investments.filter((item) => item.id !== button.dataset.deleteInvestment);
      persistWorkspace();
    });
  });
  document.querySelectorAll("[data-edit-investment]").forEach((button) => {
    button.addEventListener("click", () => {
      const investment = workspaceData.finance.investments.find((item) => item.id === button.dataset.editInvestment);
      const form = document.querySelector("[data-form='investment']");
      if (!investment || !form) return;
      form.elements.id.value = investment.id;
      form.elements.assetName.value = investment.assetName;
      form.elements.amountInvested.value = investment.amountInvested;
      form.elements.currentValue.value = investment.currentValue;
      form.elements.category.value = investment.category || "";
      form.elements.notes.value = investment.notes || "";
      form.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
  document.querySelectorAll("[data-delete-recurring]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!confirm("Delete this recurring payment?")) return;
      workspaceData.finance.recurringPayments = workspaceData.finance.recurringPayments.filter((item) => item.id !== button.dataset.deleteRecurring);
      persistWorkspace();
    });
  });
  document.querySelectorAll("[data-edit-recurring]").forEach((button) => {
    button.addEventListener("click", () => {
      const payment = workspaceData.finance.recurringPayments.find((item) => item.id === button.dataset.editRecurring);
      const form = document.querySelector("[data-form='recurring-payment']");
      if (!payment || !form) return;
      form.elements.id.value = payment.id;
      form.elements.name.value = payment.name;
      form.elements.category.value = payment.category;
      form.elements.amount.value = payment.amount;
      form.elements.dueDate.value = payment.dueDate || todayIso();
      form.elements.importance.value = payment.importance;
      form.elements.active.value = String(payment.active !== false);
      form.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
  document.querySelectorAll("[data-delete-debt]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!confirm("Delete this debt?")) return;
      workspaceData.finance.debts = workspaceData.finance.debts.filter((item) => item.id !== button.dataset.deleteDebt);
      persistWorkspace();
    });
  });
  document.querySelectorAll("[data-edit-debt]").forEach((button) => {
    button.addEventListener("click", () => {
      const debt = workspaceData.finance.debts.find((item) => item.id === button.dataset.editDebt);
      const form = document.querySelector("[data-form='debt']");
      if (!debt || !form) return;
      form.elements.id.value = debt.id;
      form.elements.name.value = debt.name;
      form.elements.type.value = debt.type;
      form.elements.originalBalance.value = debt.originalBalance;
      form.elements.remainingBalance.value = debt.remainingBalance;
      form.elements.monthlyPayment.value = debt.monthlyPayment;
      form.elements.interestRate.value = debt.interestRate;
      form.elements.dueDate.value = debt.dueDate || todayIso();
      form.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
  bind("[data-action='load-finance-demo']", "click", loadFinanceDemoData);
  bind("[data-action='reset-finance-data']", "click", resetFinanceData);
  attachNotesHandlers();
}

function persistWorkspace() {
  saveWorkspaceData();
  renderWorkspace();
}

function saveNoteFromForm(form) {
  const fields = form.elements;
  const title = fields.title.value.trim() || "Untitled Note";
  const content = fields.content.value.trim();
  if (!content && !title) return;
  const existing = workspaceData.notes.items.find((note) => note.id === fields.id.value);
  const tags = fields.tags.value.split(",").map((tag) => tag.trim().replace(/^#/, "")).filter(Boolean);
  const category = fields.category.value.trim() || (fields.type.value === "vault" ? "Knowledge Vault" : "General");
  const attachments = existing?.attachments ? [...existing.attachments] : [];
  if (fields.attachmentLink.value.trim()) attachments.push({ id: createId(), type: "link", url: fields.attachmentLink.value.trim(), name: fields.attachmentLink.value.trim() });
  if (fields.attachmentImage.files?.[0]) attachments.push({ id: createId(), type: "image", name: fields.attachmentImage.files[0].name });
  if (fields.attachmentPdf.files?.[0]) attachments.push({ id: createId(), type: "pdf", name: fields.attachmentPdf.files[0].name });
  const connections = Array.from(fields.connections.selectedOptions || []).map((option) => option.value).filter((id) => id !== fields.id.value);
  const note = {
    ...(existing || {}),
    id: existing?.id || createId(),
    title,
    content,
    category,
    tags,
    type: fields.type.value,
    favorite: existing?.favorite || false,
    pinned: existing?.pinned || false,
    archived: existing?.archived || false,
    mood: existing?.mood || "",
    attachments,
    connections,
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  if (existing) workspaceData.notes.items = workspaceData.notes.items.map((item) => (item.id === existing.id ? note : item));
  else workspaceData.notes.items.unshift(note);
  refreshNotesTaxonomy();
}

function refreshNotesTaxonomy() {
  workspaceData.notes.categories = Array.from(new Set(["General", "Daily Journal", "Knowledge Vault", "Decisions", "Training", "Study", "Projects", ...workspaceData.notes.items.map((note) => note.category).filter(Boolean)]));
  workspaceData.notes.tags = Array.from(new Set(workspaceData.notes.items.flatMap((note) => note.tags || []))).sort();
}

function attachNotesHandlers() {
  bind("[data-action='clear-note-editor']", "click", () => {
    const form = document.querySelector("[data-form='note']");
    if (form) form.reset();
  });
  const search = document.querySelector("[data-notes-search]");
  if (search) {
    search.addEventListener("input", () => {
      workspaceData.notes.search = search.value;
      persistWorkspace();
    });
  }
  document.querySelectorAll("[data-notes-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      workspaceData.notes.activeFilter = button.dataset.notesFilter;
      persistWorkspace();
    });
  });
  document.querySelectorAll("[data-rich-format]").forEach((button) => {
    button.addEventListener("click", () => applyRichFormat(button.dataset.richFormat));
  });
  document.querySelectorAll("[data-note-template]").forEach((button) => {
    button.addEventListener("click", () => applyNoteTemplate(button.dataset.noteTemplate));
  });
  document.querySelectorAll("[data-edit-note]").forEach((button) => {
    button.addEventListener("click", () => fillNoteEditor(button.dataset.editNote));
  });
  document.querySelectorAll("[data-toggle-pin]").forEach((button) => {
    button.addEventListener("click", () => toggleNoteFlag(button.dataset.togglePin, "pinned"));
  });
  document.querySelectorAll("[data-toggle-favorite]").forEach((button) => {
    button.addEventListener("click", () => toggleNoteFlag(button.dataset.toggleFavorite, "favorite"));
  });
  document.querySelectorAll("[data-toggle-archive]").forEach((button) => {
    button.addEventListener("click", () => toggleNoteFlag(button.dataset.toggleArchive, "archived"));
  });
  document.querySelectorAll("[data-delete-note]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!confirm("Delete this note?")) return;
      workspaceData.notes.items = workspaceData.notes.items.filter((note) => note.id !== button.dataset.deleteNote);
      workspaceData.notes.items.forEach((note) => {
        note.connections = (note.connections || []).filter((id) => id !== button.dataset.deleteNote);
      });
      refreshNotesTaxonomy();
      persistWorkspace();
    });
  });
  document.querySelectorAll("[data-convert-note]").forEach((button) => {
    button.addEventListener("click", () => convertNote(button.dataset.convertNote, button.dataset.convertType));
  });
}

function attachGoalHandlers() {
  bindForm("goal", (form) => {
    const fields = form.elements;
    const title = fields.title.value.trim();
    if (!title) return;
    const existing = workspaceData.goals.items.find((goal) => goal.id === fields.id.value);
    const template = !existing ? workspaceData.goals.templates.find((item) => item.name === form.dataset.templateName) : null;
    const goal = normalizeGoal({
      ...(existing || {}),
      id: existing?.id || createId(),
      title,
      description: fields.description.value.trim(),
      category: fields.category.value.trim() || "Personal",
      startDate: fields.startDate.value || todayIso(),
      targetDate: fields.targetDate.value || todayIso(90),
      priority: fields.priority.value,
      status: fields.status.value,
      nextAction: fields.nextAction.value.trim(),
      milestones: existing?.milestones || template?.milestones || [],
      focus: existing?.focus || false,
      connections: {
        tasks: selectedValues(fields.taskConnections),
        habits: selectedValues(fields.habitConnections),
        notes: selectedValues(fields.noteConnections),
        finance: selectedValues(fields.financeConnections),
      },
      timeline: existing?.timeline || [],
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: fields.status.value === "Completed" ? existing?.completedAt || new Date().toISOString() : existing?.completedAt || null,
    });
    goal.timeline.push({ date: new Date().toISOString(), type: existing ? "Goal edited" : "Goal created", detail: existing ? "Goal details updated" : "Goal created" });
    if (existing) workspaceData.goals.items = workspaceData.goals.items.map((item) => (item.id === existing.id ? goal : item));
    else workspaceData.goals.items.unshift(goal);
    if (!existing && (!goal.milestones.length || !goal.nextAction?.trim())) workspaceData.goals.setupPrompt = goal.id;
    if (workspaceData.goals.setupPrompt === goal.id && goal.milestones.length && goal.nextAction?.trim()) workspaceData.goals.setupPrompt = null;
    delete form.dataset.templateName;
    persistWorkspace();
  });
  document.querySelectorAll("[data-form='milestone']").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const goal = workspaceData.goals.items.find((item) => item.id === form.dataset.goalId);
      if (!goal || !form.elements.title.value.trim()) return;
      goal.milestones.push({ id: createId(), title: form.elements.title.value.trim(), description: form.elements.description.value.trim(), completed: false, dueDate: form.elements.dueDate.value || todayIso(14), completedAt: null });
      goal.updatedAt = new Date().toISOString();
      goal.timeline.push({ date: goal.updatedAt, type: "Milestone added", detail: form.elements.title.value.trim() });
      if (workspaceData.goals.setupPrompt === goal.id && goal.nextAction?.trim()) workspaceData.goals.setupPrompt = null;
      persistWorkspace();
    });
  });
  document.querySelectorAll("[data-form='goal-review']").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const goal = workspaceData.goals.items.find((item) => item.id === form.dataset.goalId);
      if (!goal) return;
      const review = { id: createId(), date: new Date().toISOString(), type: form.elements.type.value, progress: form.elements.progress.value.trim(), obstacles: form.elements.obstacles.value.trim(), nextActions: form.elements.nextActions.value.trim(), health: goalHealthStatus(goal), forecast: goalForecast(goal) };
      goal.reviews.push(review);
      workspaceData.goals.reviews.push({ goalId: goal.id, goalTitle: goal.title, ...review });
      goal.updatedAt = review.date;
      goal.timeline.push({ date: review.date, type: `${review.type} review`, detail: review.nextActions || review.progress || "Review saved" });
      persistWorkspace();
    });
  });
  document.querySelectorAll("[data-toggle-milestone]").forEach((input) => {
    input.addEventListener("change", () => {
      const goal = workspaceData.goals.items.find((item) => item.id === input.dataset.toggleMilestone);
      const milestone = goal?.milestones.find((item) => item.id === input.dataset.milestoneId);
      if (!goal || !milestone) return;
      milestone.completed = input.checked;
      milestone.completedAt = input.checked ? new Date().toISOString() : null;
      goal.updatedAt = new Date().toISOString();
      goal.timeline.push({ date: goal.updatedAt, type: input.checked ? "Milestone completed" : "Milestone reopened", detail: milestone.title });
      if (goalProgress(goal) === 100 && goal.status !== "Completed") {
        goal.status = "Completed";
        goal.completedAt = new Date().toISOString();
        goal.timeline.push({ date: goal.completedAt, type: "Goal completed", detail: "All milestones completed" });
      }
      persistWorkspace();
    });
  });
  document.querySelectorAll("[data-edit-goal]").forEach((button) => {
    button.addEventListener("click", () => fillGoalForm(button.dataset.editGoal));
  });
  document.querySelectorAll("[data-focus-goal]").forEach((button) => {
    button.addEventListener("click", () => {
      workspaceData.goals.items.forEach((goal) => {
        goal.focus = goal.id === button.dataset.focusGoal;
      });
      persistWorkspace();
    });
  });
  document.querySelectorAll("[data-toggle-goal-status]").forEach((button) => {
    button.addEventListener("click", () => {
      const goal = workspaceData.goals.items.find((item) => item.id === button.dataset.toggleGoalStatus);
      if (!goal) return;
      goal.status = button.dataset.status;
      goal.updatedAt = new Date().toISOString();
      if (goal.status === "Completed") goal.completedAt = goal.completedAt || goal.updatedAt;
      goal.timeline.push({ date: goal.updatedAt, type: `Goal ${goal.status}`, detail: `Status changed to ${goal.status}` });
      persistWorkspace();
    });
  });
  document.querySelectorAll("[data-delete-milestone]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!confirm("Delete this milestone?")) return;
      const goal = workspaceData.goals.items.find((item) => item.id === button.dataset.deleteMilestone);
      if (!goal) return;
      goal.milestones = goal.milestones.filter((milestone) => milestone.id !== button.dataset.milestoneId);
      goal.updatedAt = new Date().toISOString();
      persistWorkspace();
    });
  });
  document.querySelectorAll("[data-delete-goal]").forEach((button) => {
    button.addEventListener("click", () => deleteGoal(button.dataset.deleteGoal));
  });
  document.querySelectorAll("[data-edit-milestone]").forEach((button) => {
    button.addEventListener("click", () => {
      const goal = workspaceData.goals.items.find((item) => item.id === button.dataset.editMilestone);
      const milestone = goal?.milestones.find((item) => item.id === button.dataset.milestoneId);
      if (!goal || !milestone) return;
      const title = prompt("Milestone title", milestone.title);
      if (!title) return;
      milestone.title = title;
      milestone.description = prompt("Milestone description", milestone.description) || "";
      milestone.dueDate = prompt("Milestone due date (YYYY-MM-DD)", milestone.dueDate) || milestone.dueDate;
      goal.updatedAt = new Date().toISOString();
      persistWorkspace();
    });
  });
  document.querySelectorAll("[data-goal-template]").forEach((button) => {
    button.addEventListener("click", () => applyGoalTemplate(button.dataset.goalTemplate));
  });
}

function deleteGoal(goalId) {
  const goal = workspaceData.goals.items.find((item) => item.id === goalId);
  if (!goal) return;
  if (!confirm(`Delete "${goal.title}"? This removes its milestones, reviews, timeline, and connections.`)) return;
  workspaceData.goals.items = workspaceData.goals.items.filter((item) => item.id !== goalId);
  workspaceData.goals.reviews = workspaceData.goals.reviews.filter((review) => review.goalId !== goalId);
  workspaceData.goals.timeline = workspaceData.goals.timeline.filter((entry) => entry.goalId !== goalId);
  if (workspaceData.goals.setupPrompt === goalId) workspaceData.goals.setupPrompt = null;
  persistWorkspace();
}

function fillGoalForm(goalId) {
  const goal = workspaceData.goals.items.find((item) => item.id === goalId);
  const form = document.querySelector("[data-form='goal']");
  if (!goal || !form) return;
  form.elements.id.value = goal.id;
  form.elements.title.value = goal.title;
  form.elements.description.value = goal.description;
  form.elements.category.value = goal.category;
  form.elements.startDate.value = goal.startDate;
  form.elements.targetDate.value = goal.targetDate;
  form.elements.priority.value = goal.priority;
  form.elements.status.value = goal.status;
  form.elements.nextAction.value = goal.nextAction;
  delete form.dataset.templateName;
  setSelectedValues(form.elements.taskConnections, goal.connections.tasks);
  setSelectedValues(form.elements.habitConnections, goal.connections.habits);
  setSelectedValues(form.elements.noteConnections, goal.connections.notes);
  setSelectedValues(form.elements.financeConnections, goal.connections.finance);
  form.scrollIntoView({ behavior: "smooth", block: "center" });
}

function applyGoalTemplate(name) {
  const template = workspaceData.goals.templates.find((item) => item.name === name);
  const form = document.querySelector("[data-form='goal']");
  if (!template || !form) return;
  form.dataset.templateName = template.name;
  form.elements.id.value = "";
  form.elements.title.value = template.title;
  form.elements.description.value = template.description;
  form.elements.category.value = template.category;
  form.elements.startDate.value = todayIso();
  form.elements.targetDate.value = todayIso(90);
  form.elements.priority.value = "High";
  form.elements.status.value = "Active";
  form.elements.nextAction.value = template.milestones[0] || "Start first milestone";
  setSelectedValues(form.elements.taskConnections, []);
  setSelectedValues(form.elements.habitConnections, []);
  setSelectedValues(form.elements.noteConnections, []);
  setSelectedValues(form.elements.financeConnections, []);
}

function selectedValues(select) {
  return Array.from(select?.selectedOptions || []).map((option) => option.value);
}

function setSelectedValues(select, values = []) {
  Array.from(select?.options || []).forEach((option) => {
    option.selected = values.includes(option.value);
  });
}

function applyRichFormat(format) {
  const textarea = document.querySelector("[data-form='note'] textarea[name='content']");
  if (!textarea) return;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.slice(start, end) || "text";
  const wrappers = {
    bold: [`**${selected}**`, 2],
    italic: [`*${selected}*`, 1],
    underline: [`__${selected}__`, 2],
    h1: [`# ${selected}`, 2],
    h2: [`## ${selected}`, 3],
    h3: [`### ${selected}`, 4],
    bullet: [`- ${selected}`, 2],
    numbered: [`1. ${selected}`, 3],
    check: [`- [ ] ${selected}`, 6],
    quote: [`> ${selected}`, 2],
    divider: [`\n---\n`, 0],
    highlight: [`==${selected}==`, 2],
  };
  const [replacement, offset] = wrappers[format] || [selected, 0];
  textarea.value = textarea.value.slice(0, start) + replacement + textarea.value.slice(end);
  textarea.focus();
  textarea.setSelectionRange(start + offset, start + replacement.length - offset);
}

function applyNoteTemplate(name) {
  const template = workspaceData.notes.templates.find((item) => item.name === name);
  const form = document.querySelector("[data-form='note']");
  if (!template || !form) return;
  form.elements.id.value = "";
  form.elements.title.value = template.name;
  form.elements.content.value = template.content;
  form.elements.category.value = template.category || "General";
  form.elements.type.value = template.category === "Knowledge Vault" ? "vault" : "note";
}

function fillNoteEditor(noteId) {
  const note = workspaceData.notes.items.find((item) => item.id === noteId);
  const form = document.querySelector("[data-form='note']");
  if (!note || !form) return;
  form.elements.id.value = note.id;
  form.elements.title.value = note.title;
  form.elements.content.value = note.content;
  form.elements.category.value = note.category;
  form.elements.tags.value = (note.tags || []).join(", ");
  form.elements.type.value = note.type === "vault" ? "vault" : "note";
  Array.from(form.elements.connections.options).forEach((option) => {
    option.selected = note.connections?.includes(option.value);
  });
  form.scrollIntoView({ behavior: "smooth", block: "center" });
}

function toggleNoteFlag(noteId, field) {
  const note = workspaceData.notes.items.find((item) => item.id === noteId);
  if (!note) return;
  note[field] = !note[field];
  note.updatedAt = new Date().toISOString();
  persistWorkspace();
}

function convertNote(noteId, type) {
  const note = workspaceData.notes.items.find((item) => item.id === noteId);
  if (!note || !confirm(`Convert "${note.title}" to ${type}?`)) return;
  if (type === "task") workspaceData.tasks.items.push({ id: createId(), title: note.title, tier: "should", completed: false });
  if (type === "habit") workspaceData.habits.items.push({ id: createId(), name: note.title, streak: 0, completedToday: false });
  if (type === "goal") workspaceData.goals.items.push(normalizeGoal({ id: createId(), title: note.title, description: note.content.slice(0, 180), category: "Notes", status: "Active", nextAction: "Define first action from note", milestones: ["Clarify", "Act", "Review"], connections: { notes: [note.id] } }));
  note.updatedAt = new Date().toISOString();
  persistWorkspace();
}

function unlockDeveloperMode() {
  if (!DEV_MODE_ENABLED) return;
  const password = prompt("Developer Mode password");
  if (password !== "12345") {
    developerMode.error = "Incorrect password.";
    renderWorkspace();
    return;
  }
  developerMode = { unlocked: true, error: "" };
  saveDeveloperMode();
  renderWorkspace();
}

function disableDeveloperMode() {
  developerMode = { unlocked: false, error: "" };
  saveDeveloperMode();
  if (state.workspaceConfig?.developerMode) {
    state.workspaceConfig = null;
    removeLocal(CONFIG_KEY);
  }
  render();
}

function enableAllModules() {
  if (!DEV_MODE_ENABLED || !developerMode.unlocked) return;
  const baseConfig = state.workspaceConfig || readJson(CONFIG_KEY, null) || generateWorkspaceConfig();
  const config = generateDeveloperWorkspaceConfig(baseConfig);
  state.view = "workspace";
  state.activeTab = "home";
  saveState();
  ensureWorkspaceData(config);
  renderWorkspace();
}

function loadDemoWorkspace() {
  if (!DEV_MODE_ENABLED || !developerMode.unlocked) return;
  const baseConfig = state.workspaceConfig || readJson(CONFIG_KEY, null) || generateWorkspaceConfig();
  const config = generateDeveloperWorkspaceConfig(baseConfig);
  state.view = "workspace";
  state.activeTab = "home";
  saveState();
  seedWorkspaceData(config);
  loadFinanceDemoData();
}

function resetOnboarding() {
  if (!confirm("Reset onboarding and return to the first flow? Module data will stay in local storage.")) return;
  removeLocal(STORAGE_KEY);
  removeLocal(CONFIG_KEY);
  state = defaultState();
  state.view = "onboarding";
  state.step = 1;
  developerMode.error = "";
  saveDeveloperMode();
  render();
}

function resetAllData() {
  if (!confirm("Reset all Forma data? This deletes onboarding, modules, settings, and Developer Mode state.")) return;
  removeLocal(STORAGE_KEY);
  removeLocal(CONFIG_KEY);
  removeLocal(DATA_KEY);
  removeLocal(DEV_MODE_KEY);
  developerMode = { unlocked: false, error: "" };
  state = defaultState();
  workspaceData = defaultWorkspaceData();
  render();
}

function priorityMarkup(item) {
  return `<button class="priority-item" data-tab="${item.tab}"><span>${escapeHtml(item.module)}</span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.detail)}</small></button>`;
}

function statusMarkup(status) {
  return `<div class="status-item"><strong>${escapeHtml(status.label)}</strong><span>${escapeHtml(status.state)}</span><small>${escapeHtml(status.detail)}</small></div>`;
}

function signalMarkup(signal) {
  return `<div class="signal-item"><span>${escapeHtml(signal.label)}</span><strong>${escapeHtml(signal.value)}</strong></div>`;
}

function taskMarkup(task) {
  return `<label class="check-row ${task.completed ? "done" : ""}"><input type="checkbox" data-task-toggle="${task.id}" ${task.completed ? "checked" : ""} /><span>${escapeHtml(task.title)}</span></label>`;
}

function habitMarkup(habit) {
  return `<button class="habit-row ${habit.completedToday ? "complete" : ""}" data-habit-toggle="${habit.id}"><span>${escapeHtml(habit.name)}</span><strong>${habit.streak} day streak</strong></button>`;
}

function noteMarkup(note) {
  const connected = connectedNotes(note);
  const back = backlinks(note);
  const detections = noteDetections(note);
  return `
    <article class="note-card ${note.pinned ? "pinned" : ""} ${note.archived ? "archived" : ""}">
      <div class="note-card-head">
        <div>
          <span class="stat-label">${escapeHtml(note.type === "journal" ? "Daily Journal" : note.type === "vault" ? "Knowledge Vault" : note.category)}</span>
          <h2>${escapeHtml(note.title)}</h2>
          <small>Created ${escapeHtml(formatDateLabel(note.createdAt))} / Edited ${escapeHtml(formatDateLabel(note.updatedAt))}</small>
        </div>
        <div class="note-actions">
          <button data-edit-note="${note.id}">Edit</button>
          <button data-toggle-pin="${note.id}">${note.pinned ? "Unpin" : "Pin"}</button>
          <button data-toggle-favorite="${note.id}">${note.favorite ? "Unfavorite" : "Favorite"}</button>
          <button data-toggle-archive="${note.id}">${note.archived ? "Restore" : "Archive"}</button>
          <button data-delete-note="${note.id}">Delete</button>
        </div>
      </div>
      <div class="note-rendered">${renderNoteContent(note.content)}</div>
      <div class="note-meta-row">
        ${(note.tags || []).map((tag) => `<button data-notes-filter="tag:${escapeHtml(tag)}">#${escapeHtml(tag)}</button>`).join("")}
        <button data-notes-filter="category:${escapeHtml(note.category)}">${escapeHtml(note.category)}</button>
        ${note.favorite ? "<span>Favorite</span>" : ""}
      </div>
      ${note.attachments?.length ? `<div class="note-attachments">${note.attachments.map((attachment) => `<span>${escapeHtml(attachment.type)}: ${escapeHtml(attachment.name || attachment.url)}</span>`).join("")}</div>` : ""}
      ${connected.length || back.length ? `<div class="note-connections"><strong>Connected notes</strong>${[...connected, ...back].map((item) => `<button data-edit-note="${item.id}">${escapeHtml(item.title)}</button>`).join("")}</div>` : ""}
      ${detections.length ? `<div class="note-conversions"><strong>Forma detected possible actions</strong>${detections.map((item) => `<button data-convert-note="${note.id}" data-convert-type="${item.type}">${item.label}</button>`).join("")}</div>` : ""}
    </article>
  `;
}

function emptyState(title, body) {
  return `<div class="empty-state"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(body)}</span></div>`;
}

function pillMarkup(label) {
  return `<span class="pill">${escapeHtml(label)}</span>`;
}

function hasModule(config, moduleId) {
  return config.modules.some((module) => module.id === moduleId);
}

function averageGoalProgress() {
  if (!workspaceData.goals.items.length) return 0;
  return Math.round(workspaceData.goals.items.reduce((sum, goal) => sum + goalProgress(goal), 0) / workspaceData.goals.items.length);
}

function moduleDescription(moduleId) {
  return {
    tasks: "A guided queue for deciding what to do next.",
    habits: "A consistency system with recovery recommendations.",
    goals: "Outcome tracking connected to next actions and milestones.",
    notes: "Context capture with templates for useful thinking.",
    finance: "Savings direction, status, warnings, and recovery actions.",
  }[moduleId];
}

function labelFor(id, options) {
  return options.find((option) => option.id === id)?.label || id;
}

function personaSummary(personas) {
  const labels = personas.map((persona) => labelFor(persona, personaOptions));
  if (labels.length === 0) return "Personal OS";
  if (labels.length <= 2) return labels.join(" + ");
  return `${labels.slice(0, 2).join(" + ")} +${labels.length - 2}`;
}

function bindForm(name, handler) {
  const form = document.querySelector(`[data-form="${name}"]`);
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    handler(form);
  });
}

function downloadConfig() {
  const blob = new Blob([JSON.stringify(state.workspaceConfig, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "forma-workspace-config.json";
  link.click();
  URL.revokeObjectURL(url);
}

function numberOrZero(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value) || 0));
}

function formatMoney(value) {
  const currency = currencyOptions.some((option) => option.code === workspaceData.finance?.currency) ? workspaceData.finance.currency : "USD";
  const locales = { EUR: "de-DE", USD: "en-US", GBP: "en-GB", CAD: "en-CA", AUD: "en-AU" };
  return new Intl.NumberFormat(locales[currency], { style: "currency", currency, maximumFractionDigits: 0 }).format(numberOrZero(value));
}

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function bind(selector, event, handler) {
  const element = document.querySelector(selector);
  if (element) element.addEventListener(event, handler);
}

render();
