const STORAGE_KEY = "forma.onboarding.v2";
const CONFIG_KEY = "forma.workspaceConfig.v2";
const DATA_KEY = "forma.workspaceData.v2";
const DEV_MODE_KEY = "forma.developerMode.v1";
const DAILY_RESET_KEY = "forma.lastDailyResetDate.v1";
const TOUR_KEY = "forma.guidedTour.v1";
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
  sleep: "Sleep",
  health: "Health",
  fitness: "Fitness",
};

const moduleRegistry = Object.keys(moduleLabels);

const scoring = {
  profile: {
    student: { tasks: 2, habits: 1, goals: 2, notes: 3, finance: 0, sleep: 2, health: 1 },
    professional: { tasks: 3, habits: 1, goals: 2, notes: 1, finance: 0, sleep: 1, health: 1 },
    athlete: { tasks: 1, habits: 3, goals: 2, notes: 1, finance: 0, sleep: 3, health: 4 },
    builder: { tasks: 3, habits: 1, goals: 3, notes: 2, finance: 0, sleep: 1, health: 1 },
    creator: { tasks: 1, habits: 2, goals: 2, notes: 4, finance: 0, sleep: 1, health: 1 },
    freelancer: { tasks: 3, habits: 1, goals: 2, notes: 2, finance: 2, sleep: 1, health: 1 },
    "finance-focused": { tasks: 1, habits: 0, goals: 2, notes: 1, finance: 4, sleep: 0, health: 0 },
    "life-organization": { tasks: 2, habits: 2, goals: 2, notes: 2, finance: 0, sleep: 2, health: 2 },
  },
  outcome: {
    "work-control": { tasks: 4, habits: 1, goals: 1, notes: 1, finance: 0, sleep: 1, health: 1 },
    "study-consistently": { tasks: 2, habits: 2, goals: 2, notes: 3, finance: 0, sleep: 2, health: 1 },
    "train-consistently": { tasks: 1, habits: 4, goals: 2, notes: 1, finance: 0, sleep: 3, health: 4 },
    "save-money": { tasks: 1, habits: 1, goals: 2, notes: 1, finance: 4, sleep: 0, health: 0 },
    "better-routines": { tasks: 1, habits: 4, goals: 1, notes: 1, finance: 0, sleep: 3, health: 3 },
    "major-goal": { tasks: 2, habits: 1, goals: 4, notes: 1, finance: 0, sleep: 1, health: 1 },
    "organize-thinking": { tasks: 1, habits: 0, goals: 1, notes: 4, finance: 0, sleep: 1, health: 0 },
  },
  friction: {
    "too-many-tasks": { tasks: 4, habits: 0, goals: 2, notes: 1, finance: 0, sleep: 1, health: 0 },
    "unclear-priorities": { tasks: 3, habits: 0, goals: 3, notes: 1, finance: 0, sleep: 0, health: 0 },
    "inconsistent-habits": { tasks: 1, habits: 4, goals: 1, notes: 0, finance: 0, sleep: 2, health: 2 },
    "poor-planning": { tasks: 3, habits: 1, goals: 2, notes: 2, finance: 0, sleep: 2, health: 1 },
    "money-unclear": { tasks: 1, habits: 0, goals: 2, notes: 1, finance: 4, sleep: 0, health: 0 },
    "forget-ideas": { tasks: 1, habits: 0, goals: 1, notes: 4, finance: 0, sleep: 0, health: 0 },
    "goals-stall": { tasks: 2, habits: 2, goals: 4, notes: 1, finance: 0, sleep: 1, health: 1 },
  },
};

let state = loadState();
let workspaceData = loadWorkspaceData();
let developerMode = loadDeveloperMode();
let guidedTour = loadGuidedTour();
let sleepRefreshTimer = null;
let dailyResetTimer = null;

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
    tasks: { items: [], recurring: [] },
    habits: { items: [], stacks: [] },
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
    sleep: {
      profile: { targetBedtime: "00:00", targetWakeTime: "08:00" },
      checklist: {},
      history: [],
      stats: {},
    },
    health: {
      profile: { age: "", sex: "", weight: 70, weightUnit: "kg", activityLevel: "Moderate" },
      hydration: { bottleSize: 750, glassSize: 250, displayMode: "ml", manualGoal: 0, entries: [] },
      supplements: [],
      medications: [],
      caffeine: { averageDaily: 0, entries: [] },
      weight: { entries: [] },
      checklist: {},
      history: [],
      stats: {},
    },
    fitness: {
      settings: { unit: "kg", weightRange: 30 },
      gyms: [],
      split: { days: ["Push", "Pull", "Legs", "Rest"], startDate: todayIso(), currentIndex: 0 },
      exercises: [],
      sets: [],
      weights: [],
      photos: [],
      ui: { modal: null, editingId: "", selectedGymId: "", selectedDay: "", photoA: "", photoB: "" },
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

function loadGuidedTour() {
  const saved = readJson(TOUR_KEY, {});
  return {
    completed: Boolean(saved.completed),
    active: Boolean(saved.active),
    step: clamp(saved.step || 0, 0, 4),
  };
}

function saveGuidedTour() {
  localStorage.setItem(TOUR_KEY, JSON.stringify(guidedTour));
}

function startGuidedTour() {
  guidedTour = { completed: false, active: true, step: 0 };
  if (state.view === "workspace") state.activeTab = "home";
  saveGuidedTour();
}

function completeGuidedTour() {
  guidedTour = { completed: true, active: false, step: 0 };
  if (state.view === "workspace") state.activeTab = "home";
  saveGuidedTour();
}

function syncGuidedTourStep() {
  if (!guidedTour.active) return;
  if ([0, 1, 2, 4].includes(guidedTour.step)) state.activeTab = "home";
  if (guidedTour.step === 3) state.activeTab = "settings";
}

function mergeWorkspaceData(saved = {}) {
  const defaults = defaultWorkspaceData();
  return {
    ...defaults,
    ...saved,
    tasks: normalizeTasksData({ ...defaults.tasks, ...(saved.tasks || {}) }),
    habits: normalizeHabitsData({ ...defaults.habits, ...(saved.habits || {}) }),
    goals: normalizeGoalsData({ ...defaults.goals, ...(saved.goals || {}) }),
    notes: normalizeNotesData({ ...defaults.notes, ...(saved.notes || {}) }),
    finance: normalizeFinanceData({ ...defaults.finance, ...(saved.finance || {}) }),
    sleep: normalizeSleepData({ ...defaults.sleep, ...(saved.sleep || {}) }),
    health: normalizeHealthData({ ...defaults.health, ...(saved.health || {}) }),
    fitness: normalizeFitnessData({ ...defaults.fitness, ...(saved.fitness || {}) }),
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

function normalizeTasksData(tasks) {
  return {
    items: Array.isArray(tasks.items) ? tasks.items.map(normalizeTask) : [],
    recurring: Array.isArray(tasks.recurring) ? tasks.recurring.map(normalizeRecurringTask) : [],
  };
}

function normalizeTask(task) {
  const completed = Boolean(task.completed || task.status === "Completed");
  return {
    id: task.id || createId(),
    title: task.title || task.task || "Untitled Task",
    description: task.description || "",
    dueDate: task.dueDate || "",
    priority: ["Critical", "High", "Medium", "Low"].includes(task.priority) ? task.priority : task.tier === "must" ? "High" : "Medium",
    category: task.category || "General",
    estimatedTime: numberOrZero(task.estimatedTime) || 30,
    status: completed ? "Completed" : task.status || "Not Started",
    tier: task.tier || "inbox",
    focus: Boolean(task.focus),
    completedAt: task.completedAt || (completed ? new Date().toISOString() : null),
    createdAt: task.createdAt || new Date().toISOString(),
    updatedAt: task.updatedAt || new Date().toISOString(),
    connections: {
      goals: task.connections?.goals || [],
      habits: task.connections?.habits || [],
      notes: task.connections?.notes || [],
    },
  };
}

function normalizeRecurringTask(task) {
  return {
    id: task.id || createId(),
    title: task.title || "Recurring Task",
    description: task.description || "",
    weekday: Number.isInteger(Number(task.weekday)) ? Number(task.weekday) : 1,
    priority: task.priority || "Medium",
    category: task.category || "Recurring",
    estimatedTime: numberOrZero(task.estimatedTime) || 30,
    active: task.active !== false,
    createdAt: task.createdAt || new Date().toISOString(),
  };
}

function normalizeSleepData(sleep) {
  return {
    profile: {
      targetBedtime: validTime(sleep.profile?.targetBedtime) || "00:00",
      targetWakeTime: validTime(sleep.profile?.targetWakeTime) || "08:00",
    },
    checklist: sleep.checklist && typeof sleep.checklist === "object" ? sleep.checklist : {},
    history: Array.isArray(sleep.history) ? sleep.history : [],
    stats: sleep.stats && typeof sleep.stats === "object" ? sleep.stats : {},
  };
}

function normalizeHealthData(health) {
  const profile = {
    age: health.profile?.age || "",
    sex: health.profile?.sex || "",
    weight: numberOrZero(health.profile?.weight) || 70,
    weightUnit: ["kg", "lbs"].includes(health.profile?.weightUnit) ? health.profile.weightUnit : "kg",
    activityLevel: ["Low", "Moderate", "High", "Athlete"].includes(health.profile?.activityLevel) ? health.profile.activityLevel : "Moderate",
  };
  const weightEntries = Array.isArray(health.weight?.entries) ? health.weight.entries.map(normalizeWeightEntry) : [];
  if (!weightEntries.length && profile.weight) weightEntries.push(normalizeWeightEntry({ date: todayIso(), weight: profile.weight, unit: profile.weightUnit }));
  return {
    profile,
    hydration: {
      bottleSize: numberOrZero(health.hydration?.bottleSize) || 750,
      glassSize: numberOrZero(health.hydration?.glassSize) || 250,
      displayMode: ["bottles", "glasses", "ml", "oz"].includes(health.hydration?.displayMode) ? health.hydration.displayMode : "ml",
      manualGoal: numberOrZero(health.hydration?.manualGoal),
      entries: Array.isArray(health.hydration?.entries) ? health.hydration.entries.map(normalizeHealthAmountEntry) : [],
    },
    supplements: Array.isArray(health.supplements) ? health.supplements.map((item) => normalizeHealthItem(item, "Supplement")) : [],
    medications: Array.isArray(health.medications) ? health.medications.map((item) => normalizeHealthItem(item, "Medication")) : [],
    caffeine: {
      averageDaily: numberOrZero(health.caffeine?.averageDaily),
      entries: Array.isArray(health.caffeine?.entries) ? health.caffeine.entries.map(normalizeHealthAmountEntry) : [],
    },
    weight: { entries: weightEntries },
    checklist: health.checklist && typeof health.checklist === "object" ? health.checklist : {},
    history: Array.isArray(health.history) ? health.history : [],
    stats: health.stats && typeof health.stats === "object" ? health.stats : {},
  };
}

function normalizeHealthAmountEntry(entry) {
  return {
    id: entry.id || createId(),
    amount: numberOrZero(entry.amount),
    type: entry.type || "",
    note: entry.note || entry.description || "",
    date: entry.date || todayIso(),
    time: entry.time || formatInputTime(new Date()),
  };
}

function normalizeHealthItem(item, fallbackType) {
  return {
    id: item.id || createId(),
    name: item.name || fallbackType,
    dose: item.dose || "",
    timing: ["Morning", "Lunch", "Evening", "Anytime"].includes(item.timing) ? item.timing : "Anytime",
    createdAt: item.createdAt || new Date().toISOString(),
  };
}

function normalizeWeightEntry(entry) {
  return {
    id: entry.id || createId(),
    date: entry.date || todayIso(),
    weight: numberOrZero(entry.weight),
    unit: ["kg", "lbs"].includes(entry.unit) ? entry.unit : "kg",
  };
}

function normalizeFitnessData(fitness) {
  const days = Array.isArray(fitness.split?.days) && fitness.split.days.length ? fitness.split.days.map((day) => String(day || "Training Day")) : ["Push", "Pull", "Legs", "Rest"];
  return {
    settings: {
      unit: ["kg", "lb"].includes(fitness.settings?.unit) ? fitness.settings.unit : "kg",
      weightRange: [7, 30, 90].includes(Number(fitness.settings?.weightRange)) ? Number(fitness.settings.weightRange) : 30,
    },
    gyms: Array.isArray(fitness.gyms) ? fitness.gyms.map(normalizeFitnessGym) : [],
    split: {
      days,
      startDate: fitness.split?.startDate || todayIso(),
      currentIndex: clamp(fitness.split?.currentIndex || 0, 0, Math.max(0, days.length - 1)),
    },
    exercises: Array.isArray(fitness.exercises) ? fitness.exercises.map(normalizeFitnessExercise) : [],
    sets: Array.isArray(fitness.sets) ? fitness.sets.map(normalizeFitnessSet) : [],
    weights: Array.isArray(fitness.weights) ? fitness.weights.map(normalizeFitnessWeight) : [],
    photos: Array.isArray(fitness.photos) ? fitness.photos.map(normalizeFitnessPhoto) : [],
    ui: {
      modal: fitness.ui?.modal || null,
      editingId: fitness.ui?.editingId || "",
      selectedGymId: fitness.ui?.selectedGymId || "",
      selectedDay: fitness.ui?.selectedDay || "",
      photoA: fitness.ui?.photoA || "",
      photoB: fitness.ui?.photoB || "",
    },
  };
}

function normalizeFitnessGym(gym) {
  return {
    id: gym.id || createId(),
    name: gym.name || "Gym",
  };
}

function normalizeFitnessExercise(exercise) {
  return {
    id: exercise.id || createId(),
    name: exercise.name || "Exercise",
    gymId: exercise.gymId || "",
    day: exercise.day || "Push",
    bodyweight: Boolean(exercise.bodyweight),
    startingWeight: numberOrZero(exercise.startingWeight),
    repMin: numberOrZero(exercise.repMin) || 6,
    repMax: numberOrZero(exercise.repMax) || 8,
    increment: numberOrZero(exercise.increment) || 2.5,
    createdAt: exercise.createdAt || new Date().toISOString(),
    updatedAt: exercise.updatedAt || new Date().toISOString(),
  };
}

function normalizeFitnessSet(set) {
  return {
    id: set.id || createId(),
    exerciseId: set.exerciseId || "",
    date: set.date || todayIso(),
    weight: numberOrZero(set.weight),
    reps: numberOrZero(set.reps),
    externalLoad: numberOrZero(set.externalLoad),
    createdAt: set.createdAt || new Date().toISOString(),
  };
}

function normalizeFitnessWeight(entry) {
  return {
    id: entry.id || createId(),
    date: entry.date || todayIso(),
    weight: numberOrZero(entry.weight),
    unit: ["kg", "lb"].includes(entry.unit) ? entry.unit : "kg",
  };
}

function normalizeFitnessPhoto(photo) {
  return {
    id: photo.id || createId(),
    date: photo.date || todayIso(),
    weight: numberOrZero(photo.weight),
    unit: ["kg", "lb"].includes(photo.unit) ? photo.unit : "kg",
    image: photo.image || "",
    name: photo.name || "Progress photo",
    createdAt: photo.createdAt || new Date().toISOString(),
  };
}

function validTime(value) {
  return /^\d{2}:\d{2}$/.test(String(value || "")) ? value : "";
}

function normalizeHabitsData(habits) {
  return {
    items: Array.isArray(habits.items) ? habits.items.map(normalizeHabit) : [],
    stacks: Array.isArray(habits.stacks) ? habits.stacks.map((stack) => ({
      id: stack.id || createId(),
      name: stack.name || "Habit Stack",
      habitIds: Array.isArray(stack.habitIds) ? stack.habitIds : [],
    })) : [],
  };
}

function normalizeHabit(habit) {
  const today = todayIso();
  const history = habit.history && typeof habit.history === "object" ? habit.history : {};
  if (habit.completedToday && !history[today]) history[today] = { value: numberOrZero(habit.target) || 1, completed: true };
  return {
    id: habit.id || createId(),
    name: habit.name || "Untitled Habit",
    category: habit.category || "Routine",
    type: ["checkbox", "count", "time"].includes(habit.type) ? habit.type : "checkbox",
    frequency: habit.frequency || "daily",
    specificDays: Array.isArray(habit.specificDays) ? habit.specificDays : parseDays(habit.specificDays || ""),
    timesPerWeek: numberOrZero(habit.timesPerWeek) || 3,
    target: numberOrZero(habit.target) || (habit.type === "time" ? 30 : habit.type === "count" ? 3000 : 1),
    unit: habit.unit || (habit.type === "time" ? "min" : habit.type === "count" ? "units" : "done"),
    history,
    createdAt: habit.createdAt || new Date().toISOString(),
    updatedAt: habit.updatedAt || new Date().toISOString(),
  };
}

function parseDays(value) {
  const aliases = { sun: 0, sunday: 0, mon: 1, monday: 1, tue: 2, tuesday: 2, wed: 3, wednesday: 3, thu: 4, thursday: 4, fri: 5, friday: 5, sat: 6, saturday: 6 };
  return String(value)
    .split(",")
    .map((day) => aliases[day.trim().toLowerCase()])
    .filter((day) => Number.isInteger(day));
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
  const defaults = { items: [], templates: goalTemplates(), timeline: [], reviews: [], activeFilter: "active", setupPrompt: null, openGoal: null };
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
    openGoal: goals.openGoal || null,
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
        ${logoMarkup("large")}
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
            ${logoMarkup()}
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
    if (!guidedTour.completed) startGuidedTour();
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
  const scores = moduleRegistry.reduce((target, moduleId) => ({ ...target, [moduleId]: 0 }), {});
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
    if (!(moduleId in target)) target[moduleId] = 0;
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
    moduleManagement: {
      generatedModuleIds: modules.map((module) => module.id),
      enabledModuleIds: modules.map((module) => module.id),
      primaryModule: primary,
    },
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
    moduleManagement: {
      generatedModuleIds: baseConfig?.moduleManagement?.generatedModuleIds || baseConfig?.modules?.map((module) => module.id) || modules.map((module) => module.id),
      enabledModuleIds: baseConfig?.moduleManagement?.enabledModuleIds || modules.map((module) => module.id),
      primaryModule: baseConfig?.moduleManagement?.primaryModule || modules[0]?.id || "home",
    },
    workspace: {
      layout: "personal-os",
      primaryModule: baseConfig?.moduleManagement?.primaryModule || modules[0]?.id || "home",
      tabs: ["home", ...modules.map((module) => module.id), "settings"],
      aiFeaturesEnabled: false,
      analyticsEnabled: false,
    },
  };
}

function activeWorkspaceConfig() {
  const config = state.workspaceConfig || readJson(CONFIG_KEY, null);
  const activeConfig = DEV_MODE_ENABLED && developerMode.unlocked ? generateDeveloperWorkspaceConfig(config) : config;
  return applyModuleManagement(activeConfig);
}

function normalizeModuleManagement(config) {
  const generated = config?.moduleManagement?.generatedModuleIds?.length
    ? config.moduleManagement.generatedModuleIds.filter((id) => moduleLabels[id])
    : (config?.modules || []).map((module) => module.id).filter((id) => moduleLabels[id]);
  const enabled = config?.moduleManagement?.enabledModuleIds?.length
    ? config.moduleManagement.enabledModuleIds.filter((id) => moduleLabels[id])
    : generated.slice();
  const primary = moduleLabels[config?.moduleManagement?.primaryModule] ? config.moduleManagement.primaryModule : (enabled[0] || generated[0] || "");
  return {
    generatedModuleIds: Array.from(new Set(generated)),
    enabledModuleIds: Array.from(new Set(enabled)),
    primaryModule: primary,
  };
}

function moduleDefinition(moduleId, baseConfig, index = 0, primaryModule = "") {
  const existing = baseConfig?.modules?.find((module) => module.id === moduleId);
  return {
    ...(existing || {}),
    id: moduleId,
    label: moduleLabels[moduleId],
    order: index + 1,
    score: existing?.score ?? baseConfig?.moduleScores?.[moduleId] ?? 0,
    primary: moduleId === primaryModule,
    settings: existing?.settings || moduleSettings(moduleId),
  };
}

function applyModuleManagement(config) {
  if (!config) return config;
  const management = normalizeModuleManagement(config);
  const enabled = management.enabledModuleIds.filter((id) => moduleLabels[id]);
  const primary = enabled.includes(management.primaryModule) ? management.primaryModule : enabled[0] || "";
  const modules = enabled.map((id, index) => moduleDefinition(id, config, index, primary));
  return {
    ...config,
    moduleManagement: { ...management, primaryModule: primary },
    modules,
    workspace: {
      ...config.workspace,
      primaryModule: primary,
      tabs: ["home", ...modules.map((module) => module.id), "settings"],
    },
  };
}

function persistWorkspaceConfig(config) {
  state.workspaceConfig = config;
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  if (config?.generatedAt) {
    workspaceData.generatedFor = config.generatedAt;
    saveWorkspaceData();
  }
  saveState();
}

function compareModules(a, b, scores) {
  const scoreDelta = scores[b] - scores[a];
  if (scoreDelta !== 0) return scoreDelta;
  return moduleTieRank(a) - moduleTieRank(b);
}

function moduleTieRank(moduleId) {
  const outcomePriority = {
    "save-money": ["finance", "goals", "tasks", "notes", "habits", "health", "sleep"],
    "study-consistently": ["notes", "tasks", "goals", "habits", "health", "sleep", "finance"],
    "train-consistently": ["health", "habits", "sleep", "goals", "tasks", "notes", "finance"],
    "work-control": ["tasks", "goals", "notes", "habits", "health", "sleep", "finance"],
    "better-routines": ["habits", "health", "sleep", "tasks", "goals", "notes", "finance"],
    "major-goal": ["goals", "tasks", "habits", "health", "sleep", "notes", "finance"],
    "organize-thinking": ["notes", "goals", "tasks", "habits", "health", "sleep", "finance"],
  };
  const priority = outcomePriority[state.answers.outcome] || ["tasks", "goals", "habits", "notes", "health", "sleep", "finance"];
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
      data.tasks.items = starterTasks(context).map((title, index) => normalizeTask({
        id: createId(),
        title,
        tier: index === 0 ? "must" : index === 1 ? "should" : "later",
        priority: index === 0 ? "High" : "Medium",
        status: "Not Started",
      }));
    }
    if (module.id === "habits") {
      data.habits.items = starterHabits(context).map((name) => normalizeHabit({
        id: createId(),
        name,
        category: "Routine",
        type: "checkbox",
        frequency: "daily",
        target: 1,
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
    { name: "Football Goal", category: "Football", title: "Earn a starting position", description: "Turn training consistency into match readiness.", milestones: ["Attend training consistently", "Improve distribution", "Play preseason matches", "Earn starting position"] },
    { name: "Academic Goal", category: "Academic", title: "Reach the target grade", description: "Build a clear path from revision to exam performance.", milestones: ["Define target grade", "Create revision plan", "Pass mock exams", "Reach target grade"] },
    { name: "Fitness Goal", category: "Fitness", title: "Reach the fitness target", description: "Use consistent training blocks to reach the final goal.", milestones: ["Establish routine", "Complete first month", "Hit first performance target", "Reach final goal"] },
    { name: "Financial Goal", category: "Finance", title: "Reach the savings target", description: "Make savings progress visible through checkpoints.", milestones: ["Set target amount", "Reach 25%", "Reach 50%", "Reach 100%"] },
    { name: "Business Goal", category: "Business", title: "Validate the business opportunity", description: "Move from idea to revenue through concrete validation.", milestones: ["Validate idea", "Build first version", "Get first users", "Reach first revenue"] },
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
  syncGuidedTourStep();
  const tabs = workspaceTabs(config);
  if (!tabs.some((tab) => tab.id === state.activeTab)) state.activeTab = "home";
  const active = tabs.find((tab) => tab.id === state.activeTab) || tabs[0];
  app.className = "app-shell workspace-shell";
  app.innerHTML = `
    <section class="workspace-screen">
      <aside class="os-sidebar">
        <div class="os-brand">
          ${logoMarkup()}
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
    ${renderGuidedTourOverlay()}
  `;
  attachWorkspaceHandlers();
  scheduleSleepRefresh(config);
}

function logoMarkup(size = "") {
  return `
    <div class="brand-mark ${size ? `brand-mark-${size}` : ""}" aria-label="Forma logo">
      <img src="Forma.png" alt="Forma" loading="eager" decoding="async" onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';" />
      <span class="brand-fallback" aria-hidden="true">F</span>
    </div>
  `;
}

function renderGuidedTourOverlay() {
  if (!guidedTour.active || guidedTour.completed) return "";
  const steps = guidedTourSteps();
  const step = steps[guidedTour.step] || steps[0];
  return `
    <div class="tour-backdrop ${step.highlight}">
      <section class="tour-modal" role="dialog" aria-modal="true" aria-label="Forma guided tour">
        <span class="stat-label">Step ${guidedTour.step + 1} of ${steps.length}</span>
        <h2>${escapeHtml(step.title)}</h2>
        <p>${escapeHtml(step.body)}</p>
        <div class="tour-actions">
          <button data-tour-action="skip">Skip Tour</button>
          ${guidedTour.step > 0 ? `<button data-tour-action="back">Back</button>` : ""}
          <button class="button primary" data-tour-action="${guidedTour.step === steps.length - 1 ? "finish" : "next"}">${guidedTour.step === steps.length - 1 ? "Enter Forma" : "Next"}</button>
        </div>
      </section>
    </div>
  `;
}

function guidedTourSteps() {
  return [
    { title: "Welcome to Forma.", body: "Forma is a personal operating system, not a productivity dashboard. It helps decide what matters next.", highlight: "tour-highlight-home" },
    { title: "Home is the Command Center.", body: "Home combines data from every module and recommends the next action.", highlight: "tour-highlight-home" },
    { title: "The sidebar is your system map.", body: "Each module manages a different area of life. Modules can be enabled or disabled later.", highlight: "tour-highlight-sidebar" },
    { title: "Settings keeps customization contained.", body: "Modules, profile settings, and customization live here.", highlight: "tour-highlight-settings" },
    { title: "You're ready.", body: "Forma will adapt as you use it.", highlight: "tour-highlight-home" },
  ];
}

function attachGuidedTourHandlers() {
  document.querySelectorAll("[data-tour-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.tourAction;
      if (action === "skip" || action === "finish") {
        completeGuidedTour();
      } else if (action === "next") {
        guidedTour.step = Math.min(guidedTour.step + 1, guidedTourSteps().length - 1);
        saveGuidedTour();
      } else if (action === "back") {
        guidedTour.step = Math.max(guidedTour.step - 1, 0);
        saveGuidedTour();
      }
      syncGuidedTourStep();
      renderWorkspace();
    });
  });
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

function scheduleSleepRefresh(config) {
  if (sleepRefreshTimer) {
    clearInterval(sleepRefreshTimer);
    sleepRefreshTimer = null;
  }
  if (typeof setInterval !== "function") return;
  const sleepVisible = state.activeTab === "sleep" || (state.activeTab === "home" && hasModule(config, "sleep"));
  if (!sleepVisible) return;
  sleepRefreshTimer = setInterval(() => {
    if (state.view === "workspace" && (state.activeTab === "sleep" || (state.activeTab === "home" && hasModule(activeWorkspaceConfig(), "sleep")))) renderWorkspace();
  }, 60000);
}

function initializeDailyResetEngine() {
  runDailyResetIfNeeded({ renderAfterReset: false });
  if (dailyResetTimer || typeof setInterval !== "function") return;
  dailyResetTimer = setInterval(() => {
    runDailyResetIfNeeded({ renderAfterReset: true });
  }, 30000);
}

function runDailyResetIfNeeded({ renderAfterReset = false } = {}) {
  const today = todayIso();
  const lastResetDate = localStorage.getItem(DAILY_RESET_KEY);
  if (lastResetDate === today) return false;
  runDailyReset(today);
  localStorage.setItem(DAILY_RESET_KEY, today);
  saveWorkspaceData();
  if (renderAfterReset && state.view === "workspace") renderWorkspace();
  return true;
}

function runDailyReset(today = todayIso()) {
  workspaceData = mergeWorkspaceData(workspaceData);
  workspaceData.health.checklist[today] = { supplements: {}, medications: {} };
  workspaceData.sleep.checklist[today] = {};
  workspaceData.habits.items.forEach((habit) => {
    habit.history = habit.history && typeof habit.history === "object" ? habit.history : {};
    habit.history[today] = { value: 0, completed: false };
  });
  updateHealthStats();
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
  if (tabId === "sleep") return renderSleep(config);
  if (tabId === "health") return renderHealth(config);
  if (tabId === "fitness") return renderFitness(config);
  return renderSettings(config);
}

function renderHome(config) {
  const command = homeTodayCommand(config);
  const actions = homeNextActions(config);
  const timeline = homeTimeline(config);
  const alerts = homeCriticalAlerts(config);
  const tomorrow = homeTomorrowPreview(config);
  const health = homeSystemHealth(config);
  return `
    <section class="home-command-center">
      <article class="home-command-card">
        <span class="stat-label">Today's Command</span>
        <h2>${escapeHtml(command.title)}</h2>
        <p>${escapeHtml(command.reason)}</p>
        <button class="button primary" data-tab="${command.tab}">${escapeHtml(command.action)}</button>
      </article>
      <section class="home-grid">
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Next Actions</span><h2>Maximum three</h2></div>
          <div class="home-action-list">${actions.map(homeActionMarkup).join("") || compactGoalEmpty("Nothing urgent right now.", "Use your primary module or create your first task, habit, or goal.")}</div>
        </article>
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Today Timeline</span><h2>Sleep and health rhythm</h2></div>
          <div class="home-timeline">${timeline.length ? timeline.map(homeTimelineMarkup).join("") : homeTimelineSetupMarkup(config)}</div>
        </article>
      </section>
      ${alerts.length ? `<article class="workspace-panel home-alert-panel"><div class="section-head"><span class="stat-label">Critical Alerts</span><h2>Needs attention</h2></div><div class="home-alert-list">${alerts.map(homeAlertMarkup).join("")}</div></article>` : ""}
      <section class="home-grid">
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Tomorrow Preview</span><h2>Next cycle</h2></div>
          <div class="home-preview-list">${tomorrow.map(homePreviewMarkup).join("") || compactGoalEmpty("Tomorrow is clear.", "No deadlines, training day, or sleep target is available yet.")}</div>
        </article>
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">System Health</span><h2>Compact module status</h2></div>
          <div class="home-health-list">${health.map(homeHealthMarkup).join("") || compactGoalEmpty("No modules generated yet.", "Complete onboarding or enable modules in Developer Mode.")}</div>
        </article>
      </section>
    </section>
  `;
}

function homeTodayCommand(config) {
  return homeRecommendations(config)[0] || { priority: 999, title: "Build your operating system.", reason: "Create one task, habit, goal, or module entry so Forma can decide what matters next.", action: "Open Settings", tab: "settings" };
}

function homeRecommendations(config) {
  const primary = config.workspace?.primaryModule;
  return [
    ...homeCriticalAlerts(config),
    ...homeSleepRecommendations(config),
    ...homeHealthRecommendations(config),
    ...homeTaskRecommendations(config),
    ...homeGoalRecommendations(config),
    ...homeFitnessRecommendations(config),
    ...homeFinanceRecommendations(config),
    ...homeHabitRecommendations(config),
  ]
    .map((item) => ({ ...item, priority: item.priority - (item.tab === primary ? 0.25 : 0) }))
    .sort((a, b) => a.priority - b.priority);
}

function homeNextActions(config) {
  const seen = new Set();
  return homeRecommendations(config)
    .filter((item) => ["tasks", "habits", "goals", "health", "sleep"].includes(item.tab))
    .filter((item) => {
      const key = `${item.tab}:${item.title}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 3);
}

function homeCriticalAlerts(config) {
  const alerts = [];
  if (hasModule(config, "goals")) {
    homeOverdueMilestones().forEach(({ goal, milestone }) => alerts.push({ priority: 1, type: "danger", title: `${goal.title} milestone overdue.`, reason: `${milestone.title} was due ${formatDateLabel(milestone.dueDate)}.`, action: "Open Goals", tab: "goals" }));
    goalHealth().filter((goal) => goal.health === "Stalled").slice(0, 1).forEach((goal) => alerts.push({ priority: 2, type: "danger", title: `${goal.title} is stalled.`, reason: "No milestone progress in 30 days. Choose the next action today.", action: "Open Goals", tab: "goals" }));
  }
  if (hasModule(config, "finance")) {
    upcomingFinanceObligations(3).forEach((item) => alerts.push({ priority: 6, type: "warning", title: `${item.name} is due soon.`, reason: `${item.kind} due ${formatDateLabel(item.dueDate)}.`, action: "Open Finance", tab: "finance" }));
  }
  if (hasModule(config, "health")) {
    const health = healthState();
    if (health.hydration.percent < 35 && expectedHydrationPercent() > 45) alerts.push({ priority: 3, type: "danger", title: "Hydration critically low.", reason: `You are at ${health.hydration.percent}% of today's water target.`, action: "Open Health", tab: "health" });
  }
  if (hasModule(config, "habits")) {
    const atRisk = mostAtRiskHabit();
    if (atRisk) alerts.push({ priority: 7, type: "warning", title: `${atRisk.name} is at risk.`, reason: "This habit is losing consistency. Complete the smallest version today.", action: "Open Habits", tab: "habits" });
  }
  if (hasModule(config, "sleep")) {
    const sleep = sleepState();
    if (sleep.status.tone === "danger") alerts.push({ priority: 4, type: "danger", title: "Sleep schedule risk.", reason: `${sleep.status.label}. Next: ${sleep.nextMilestone.label}.`, action: "Open Sleep", tab: "sleep" });
  }
  if (hasModule(config, "fitness")) {
    const missed = missedTrainingSession();
    if (missed) alerts.push({ priority: 8, type: "warning", title: "Training session may be missed.", reason: missed, action: "Open Fitness", tab: "fitness" });
  }
  return alerts;
}

function homeSleepRecommendations(config) {
  if (!hasModule(config, "sleep")) return [];
  const sleep = sleepState();
  const insight = sleepInsights()[0];
  const items = [];
  if (sleep.status.tone !== "positive") items.push({ priority: 10, title: sleep.status.label, reason: insight?.body || `${sleep.timeUntilBed}. Next: ${sleep.nextMilestone.label}.`, action: "Open Sleep", tab: "sleep" });
  if (sleep.nextMilestone?.msRemaining > 0 && sleep.nextMilestone.msRemaining <= 90 * 60000) items.push({ priority: 11, title: `Begin ${sleep.nextMilestone.label.toLowerCase()} soon.`, reason: `${sleep.nextMilestone.remaining} remaining. Protect tonight's sleep target.`, action: "Open Sleep", tab: "sleep" });
  return items;
}

function homeHealthRecommendations(config) {
  if (!hasModule(config, "health")) return [];
  const health = healthState();
  const items = [];
  if (health.medications.remaining) items.push({ priority: 20, title: "Take remaining medication.", reason: `${health.medications.remaining} medication item still needs attention.`, action: "Open Health", tab: "health" });
  if (health.hydration.percent < expectedHydrationPercent()) items.push({ priority: 21, title: `Drink ${formatHealthAmount(Math.max(250, health.hydration.goal - health.hydration.total), "ml")} water.`, reason: health.hydration.status, action: "Open Health", tab: "health" });
  if (health.supplements.remaining) items.push({ priority: 22, title: "Take remaining supplements.", reason: `${health.supplements.remaining} supplement item remains.`, action: "Open Health", tab: "health" });
  if (health.caffeine.warning) items.push({ priority: 23, title: health.caffeine.warning, reason: `${health.caffeine.total}mg caffeine logged today.`, action: "Open Health", tab: "health" });
  return items;
}

function homeTaskRecommendations(config) {
  if (!hasModule(config, "tasks")) return [];
  const overdue = sortedTasks().filter((task) => taskHealth(task) === "Overdue" && task.status !== "Completed");
  const focus = currentFocusTask();
  const today = todayTasks().filter((task) => task.status !== "Completed");
  const items = [];
  if (overdue[0]) items.push({ priority: 30, title: overdue[0].title, reason: `${taskDueLabel(overdue[0].dueDate)}. Clear this before adding more work.`, action: "Open Tasks", tab: "tasks" });
  if (focus) items.push({ priority: 31, title: focus.title, reason: `Current focus / ${taskDueLabel(focus.dueDate)}.`, action: "Open Tasks", tab: "tasks" });
  if (today[0]) items.push({ priority: 32, title: today[0].title, reason: `${today[0].priority} priority / ${taskDueLabel(today[0].dueDate)}.`, action: "Open Tasks", tab: "tasks" });
  return items;
}

function homeGoalRecommendations(config) {
  if (!hasModule(config, "goals")) return [];
  const items = [];
  const overdue = homeOverdueMilestones()[0];
  if (overdue) items.push({ priority: 40, title: `${overdue.goal.title}: ${overdue.milestone.title}`, reason: "Complete the overdue milestone today.", action: "Open Goals", tab: "goals" });
  const risky = goalHealth().find((goal) => ["At Risk", "Stalled"].includes(goal.health));
  if (risky) items.push({ priority: 41, title: risky.nextAction || `Move ${risky.title} forward.`, reason: `${risky.title} is ${risky.health}.`, action: "Open Goals", tab: "goals" });
  return items;
}

function homeFitnessRecommendations(config) {
  if (!hasModule(config, "fitness")) return [];
  const day = fitnessTrainingDay();
  if (day.toLowerCase() === "rest") return [];
  const exercise = fitnessExercisesForSession(workspaceData.fitness.ui.selectedGymId, day)[0] || workspaceData.fitness.exercises.find((item) => item.day === day);
  if (!exercise) return [{ priority: 50, title: `${day} training day.`, reason: "Create exercises for this split day so Forma can coach the session.", action: "Open Fitness", tab: "fitness" }];
  const rec = fitnessRecommendation(exercise);
  return [{ priority: 50, title: `${day}: ${exercise.name}`, reason: `Next session: ${rec.target}. ${rec.reason}`, action: "Open Fitness", tab: "fitness" }];
}

function homeFinanceRecommendations(config) {
  if (!hasModule(config, "finance")) return [];
  const obligation = upcomingFinanceObligations(7)[0];
  if (obligation) return [{ priority: 60, title: `${obligation.name} due soon.`, reason: `${obligation.kind} due ${formatDateLabel(obligation.dueDate)}.`, action: "Open Finance", tab: "finance" }];
  const insight = financeInsights()[0];
  return insight ? [{ priority: 61, title: insight.title, reason: insight.body, action: "Open Finance", tab: "finance" }] : [];
}

function homeHabitRecommendations(config) {
  if (!hasModule(config, "habits")) return [];
  const habit = recommendedHabit();
  if (!habit || habit.name === "No habit yet") return [];
  return [{ priority: 70, title: habit.name, reason: habit.reason || habit.recovery || "Complete one habit to preserve consistency.", action: "Open Habits", tab: "habits" }];
}

function homeTimeline(config) {
  if (!hasModule(config, "sleep")) return [];
  return sleepTimeline().map((item) => ({ time: cleanTimelineTime(item.timeLabel || item.time), title: item.label, detail: item.remaining, tab: "sleep" }));
}

function homeTimelineSetupMarkup(config) {
  return hasModule(config, "sleep")
    ? compactGoalEmpty("Sleep timeline unavailable.", "Open Sleep and set your target bedtime and wake-up.")
    : compactGoalEmpty("Sleep is not configured.", "Add Sleep to generate wake, caffeine cutoff, wind-down, screens-off, and sleep targets.");
}

function homeTomorrowPreview(config) {
  const items = [];
  const tomorrow = todayIso(1);
  if (hasModule(config, "fitness")) {
    const day = fitnessTrainingDay(parseLocalDate(tomorrow));
    items.push({ label: "Fitness", title: day, detail: homeTomorrowFitnessDetail(day), tab: "fitness" });
  }
  if (hasModule(config, "tasks")) {
    sortedTasks().filter((task) => task.dueDate === tomorrow && task.status !== "Completed").slice(0, 2).forEach((task) => items.push({ label: "Deadline", title: task.title, detail: "Due tomorrow", tab: "tasks" }));
  }
  if (hasModule(config, "goals")) {
    homeUpcomingMilestones(tomorrow).slice(0, 2).forEach(({ goal, milestone }) => items.push({ label: "Milestone", title: milestone.title, detail: goal.title, tab: "goals" }));
  }
  if (hasModule(config, "sleep")) items.push({ label: "Sleep Target", title: timeLabel(workspaceData.sleep.profile.targetBedtime), detail: "Tomorrow bedtime", tab: "sleep" });
  return items.slice(0, 5);
}

function homeSystemHealth(config) {
  return config.modules.map((module) => {
    const status = homeModuleHealth(module.id);
    return { module: module.label, tab: module.id, ...status };
  });
}

function homeModuleHealth(moduleId) {
  if (moduleId === "sleep") {
    const sleep = sleepState();
    return { status: sleep.status.tone === "danger" ? "Needs Action" : sleep.status.tone === "warning" ? "At Risk" : "Good", tone: sleep.status.tone };
  }
  if (moduleId === "health") {
    const health = healthState();
    return { status: health.overallStatus === "Healthy" ? "Good" : "Needs Action", tone: health.overallStatus === "Healthy" ? "positive" : "warning" };
  }
  if (moduleId === "fitness") {
    const day = fitnessTrainingDay();
    const hasExercise = day.toLowerCase() === "rest" || workspaceData.fitness.exercises.some((exercise) => exercise.day === day);
    return { status: hasExercise ? "Good" : "Setup Needed", tone: hasExercise ? "positive" : "warning" };
  }
  if (moduleId === "tasks") {
    const overdue = taskDashboard().overdue;
    return { status: overdue ? "At Risk" : "Good", tone: overdue ? "warning" : "positive" };
  }
  if (moduleId === "goals") {
    const stalled = goalHealth().some((goal) => ["At Risk", "Stalled"].includes(goal.health));
    return { status: stalled ? "At Risk" : "Good", tone: stalled ? "warning" : "positive" };
  }
  if (moduleId === "finance") {
    const finance = financeState();
    return { status: finance.status === "Stable" || finance.status === "Healthy" ? "Stable" : finance.status, tone: finance.status === "Stable" || finance.status === "Healthy" ? "positive" : "warning" };
  }
  if (moduleId === "habits") {
    const dashboard = habitsDashboard();
    return { status: dashboard.total && dashboard.percent < 70 ? "At Risk" : "Good", tone: dashboard.total && dashboard.percent < 70 ? "warning" : "positive" };
  }
  if (moduleId === "notes") return { status: activeNotes().length ? "Good" : "Ready", tone: "neutral" };
  return { status: "Ready", tone: "neutral" };
}

function homeOverdueMilestones() {
  const today = parseLocalDate(todayIso());
  return workspaceData.goals.items.flatMap((goal) => (goal.milestones || []).map((milestone) => ({ goal, milestone })))
    .filter(({ goal, milestone }) => goal.status === "Active" && !milestone.completed && milestone.dueDate && parseLocalDate(milestone.dueDate) < today);
}

function homeUpcomingMilestones(date) {
  return workspaceData.goals.items.flatMap((goal) => (goal.milestones || []).map((milestone) => ({ goal, milestone })))
    .filter(({ goal, milestone }) => goal.status === "Active" && !milestone.completed && milestone.dueDate === date);
}

function upcomingFinanceObligations(days) {
  const today = parseLocalDate(todayIso());
  const limit = parseLocalDate(todayIso(days));
  const payments = (workspaceData.finance.recurringPayments || []).filter((item) => item.active !== false).map((item) => ({ kind: "Payment", name: item.name, dueDate: item.dueDate }));
  const debts = (workspaceData.finance.debts || []).filter((item) => item.active !== false).map((item) => ({ kind: "Debt", name: item.name, dueDate: item.dueDate }));
  return [...payments, ...debts]
    .filter((item) => item.dueDate && parseLocalDate(item.dueDate) >= today && parseLocalDate(item.dueDate) <= limit)
    .sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)));
}

function missedTrainingSession() {
  const day = fitnessTrainingDay();
  if (!day || day.toLowerCase() === "rest") return "";
  const exercises = workspaceData.fitness.exercises.filter((exercise) => exercise.day === day);
  if (!exercises.length) return "";
  const loggedToday = workspaceData.fitness.sets.some((set) => set.date === todayIso() && exercises.some((exercise) => exercise.id === set.exerciseId));
  const late = new Date().getHours() >= 20;
  return !loggedToday && late ? `${day} has no logged sets today.` : "";
}

function homeTomorrowFitnessDetail(day) {
  const exercise = workspaceData.fitness.exercises.find((item) => item.day === day);
  if (!exercise) return day.toLowerCase() === "rest" ? "Recovery day" : "No exercises assigned";
  const rec = fitnessRecommendation(exercise);
  return `${exercise.name}: ${rec.target}`;
}

function cleanTimelineTime(value) {
  if (value instanceof Date) return cleanTimelineTime(formatClock(value));
  const text = String(value || "");
  const match = text.match(/\b([01]\d|2[0-3]):[0-5]\d\b/);
  if (match) return match[0];
  const looseMatch = text.match(/\b(\d|1\d|2[0-3]):([0-5]\d)\b/);
  if (looseMatch) return `${looseMatch[1].padStart(2, "0")}:${looseMatch[2]}`;
  const date = new Date(text);
  if (!Number.isNaN(date.getTime()) && /GMT|UTC|\\d{4}/.test(text)) return formatClock(date);
  return text;
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

function renderSleep() {
  const state = sleepState();
  const timeline = sleepTimeline();
  const checklist = sleepChecklist();
  const consistency = sleepConsistency();
  const summary = sleepWeeklySummary();
  return `
    <section class="module-app sleep-module">
      <div class="module-command sleep-command">
        <div>
          <span class="stat-label">Sleep Coach</span>
          <h2>${escapeHtml(state.phase.label)}</h2>
          <p>${escapeHtml(state.status.label)} / ${escapeHtml(state.nextMilestone.label)} is ${escapeHtml(state.nextMilestone.remaining)}</p>
        </div>
        <strong class="metric">${escapeHtml(state.timeUntilBed)}</strong>
      </div>
      <section class="sleep-hero-grid">
        <article class="workspace-panel sleep-ring-panel">
          <div class="sleep-ring" style="--sleep-progress: ${state.progress}deg">
            <div>
              <span>${state.progressPercent}%</span>
              <strong>${escapeHtml(formatClock(new Date()))}</strong>
              <small>${escapeHtml(state.timeUntilBed)}</small>
            </div>
          </div>
          <div class="sleep-status-row">
            <span class="status-badge ${state.status.tone}">${escapeHtml(state.status.label)}</span>
            <span>${escapeHtml(state.phase.detail)}</span>
          </div>
        </article>
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Sleep Profile</span><h2>Target schedule</h2></div>
          <form class="sleep-form" data-form="sleep-profile">
            <label>Target bedtime<input name="targetBedtime" type="time" value="${escapeHtml(workspaceData.sleep.profile.targetBedtime)}" /></label>
            <label>Target wake-up<input name="targetWakeTime" type="time" value="${escapeHtml(workspaceData.sleep.profile.targetWakeTime)}" /></label>
            <button class="button primary">Update sleep profile</button>
          </form>
          <div class="sleep-profile-summary">
            <strong>Sleep Target: ${escapeHtml(timeLabel(workspaceData.sleep.profile.targetBedtime))}</strong>
            <span>Wake-up: ${escapeHtml(timeLabel(workspaceData.sleep.profile.targetWakeTime))}</span>
          </div>
        </article>
      </section>
      <section class="sleep-card-grid">
        ${timeline.map(sleepCountdownCard).join("")}
      </section>
      <section class="sleep-layout">
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Daily Timeline</span><h2>Built around bedtime</h2></div>
          <div class="sleep-timeline">${timeline.map(sleepTimelineRow).join("")}</div>
        </article>
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Daily Checklist</span><h2>Arrive prepared</h2></div>
          <div class="sleep-checklist">${checklist.map(sleepChecklistRow).join("")}</div>
          <button class="button" data-action="sleep-record-day">Record tonight</button>
        </article>
      </section>
      <section class="sleep-layout">
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Sleep Insights</span><h2>Rule-based guidance</h2></div>
          <div class="finance-insight-list">${sleepInsights().map(financeInsightMarkup).join("") || compactGoalEmpty("You are on schedule today.", "Keep following the timeline toward bedtime.")}</div>
        </article>
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Sleep Consistency</span><h2>Last 30 days</h2></div>
          <section class="sleep-metric-grid">
            ${financeMetricMarkup("Current Streak", String(consistency.currentStreak), "days")}
            ${financeMetricMarkup("Best Streak", String(consistency.bestStreak), "days")}
            ${financeMetricMarkup("Last 7 Days", `${consistency.last7}%`, "on schedule")}
            ${financeMetricMarkup("Last 30 Days", `${consistency.last30}%`, "on schedule")}
          </section>
        </article>
      </section>
      <section class="sleep-layout">
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Weekly Summary</span><h2>Sleep rhythm</h2></div>
          <section class="sleep-metric-grid">
            ${financeMetricMarkup("Average Bedtime", summary.averageBedtime, "actual")}
            ${financeMetricMarkup("Average Wake-up", summary.averageWakeTime, "actual")}
            ${financeMetricMarkup("Consistency", `${summary.consistency}%`, "week")}
            ${financeMetricMarkup("Days On Schedule", String(summary.daysOnSchedule), "last 7")}
          </section>
        </article>
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Sleep History</span><h2>Previous days</h2></div>
          <div class="sleep-history-list">${workspaceData.sleep.history.length ? workspaceData.sleep.history.slice(-10).reverse().map(sleepHistoryRow).join("") : compactGoalEmpty("No sleep history yet.", "Record tonight to start tracking consistency.")}</div>
        </article>
      </section>
    </section>
  `;
}

function renderHealth() {
  const state = healthState();
  const weekly = healthSummary(7);
  const monthly = healthSummary(30);
  return `
    <section class="module-app health-module">
      <div class="module-command health-command">
        <div>
          <span class="stat-label">Health</span>
          <h2>${escapeHtml(state.hydration.status)}</h2>
          <p>${escapeHtml(state.nextAction)}</p>
        </div>
        <strong class="metric">${state.hydration.percent}%</strong>
      </div>
      <section class="health-dashboard-grid">
        ${financeMetricMarkup("Hydration Progress", state.hydration.label, `${state.hydration.percent}%`)}
        ${financeMetricMarkup("Supplements Taken", `${state.supplements.taken}/${state.supplements.total}`, `${state.supplements.consistency}% week`)}
        ${financeMetricMarkup("Medications Taken", `${state.medications.taken}/${state.medications.total}`, `${state.medications.consistency}% week`)}
        ${financeMetricMarkup("Caffeine Intake", `${state.caffeine.total}mg`, state.caffeine.warning || "today")}
        ${financeMetricMarkup("Weight Trend", state.weight.trend, state.weight.changeLabel)}
      </section>
      <section class="health-hero-grid">
        <article class="workspace-panel health-ring-panel">
          <div class="health-ring" style="--health-progress: ${Math.round((state.hydration.percent / 100) * 360)}deg">
            <div><span>${state.hydration.percent}%</span><strong>${escapeHtml(state.hydration.label)}</strong><small>Goal ${escapeHtml(formatHealthAmount(state.hydration.goal, "ml"))}</small></div>
          </div>
          <div class="health-water-actions">
            <button data-water-add="${workspaceData.health.hydration.glassSize}">+1 Glass</button>
            <button data-water-add="${workspaceData.health.hydration.bottleSize}">+1 Bottle</button>
          </div>
          <form class="health-inline-form" data-form="water-entry"><input name="amount" type="number" min="1" placeholder="Custom amount ml" /><button class="button">Add water</button></form>
        </article>
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Health Profile</span><h2>Baseline</h2></div>
          <form class="health-form" data-form="health-profile">
            <input name="age" type="number" min="1" placeholder="Age" value="${escapeHtml(workspaceData.health.profile.age)}" />
            <select name="sex"><option value="">Sex</option>${["Female", "Male", "Other"].map((item) => `<option ${workspaceData.health.profile.sex === item ? "selected" : ""}>${item}</option>`).join("")}</select>
            <input name="weight" type="number" min="1" step="0.1" placeholder="Weight" value="${workspaceData.health.profile.weight}" />
            <select name="weightUnit"><option value="kg" ${workspaceData.health.profile.weightUnit === "kg" ? "selected" : ""}>kg</option><option value="lbs" ${workspaceData.health.profile.weightUnit === "lbs" ? "selected" : ""}>lbs</option></select>
            <select name="activityLevel">${["Low", "Moderate", "High", "Athlete"].map((item) => `<option ${workspaceData.health.profile.activityLevel === item ? "selected" : ""}>${item}</option>`).join("")}</select>
            <button class="button primary">Save profile</button>
          </form>
        </article>
      </section>
      <section class="health-layout">
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Hydration Settings</span><h2>Daily water goal</h2></div>
          <form class="health-form" data-form="hydration-settings">
            <input name="bottleSize" type="number" min="1" value="${workspaceData.health.hydration.bottleSize}" placeholder="Bottle size ml" />
            <input name="glassSize" type="number" min="1" value="${workspaceData.health.hydration.glassSize}" placeholder="Glass size ml" />
            <select name="displayMode">${["bottles", "glasses", "ml", "oz"].map((item) => `<option value="${item}" ${workspaceData.health.hydration.displayMode === item ? "selected" : ""}>${item}</option>`).join("")}</select>
            <input name="manualGoal" type="number" min="0" value="${workspaceData.health.hydration.manualGoal}" placeholder="Manual goal ml, optional" />
            <button class="button primary">Save hydration</button>
          </form>
          <div class="health-entry-list">${todayHealthEntries(workspaceData.health.hydration.entries).length ? todayHealthEntries(workspaceData.health.hydration.entries).map((entry) => healthEntryRow(entry, "water")).join("") : compactGoalEmpty("No water logged yet.", "Use +1 Glass, +1 Bottle, or custom amount.")}</div>
        </article>
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Daily Checklist</span><h2>Health actions</h2></div>
          <div class="health-checklist">${healthChecklist().map(healthChecklistRow).join("")}</div>
        </article>
      </section>
      <section class="health-layout">
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Supplements</span><h2>Daily support</h2></div>
          ${healthItemForm("supplement")}
          <div class="health-entry-list">${workspaceData.health.supplements.length ? workspaceData.health.supplements.map((item) => healthItemRow(item, "supplement")).join("") : compactGoalEmpty("No supplements yet.", "Add Creatine, Vitamin D, or anything you take regularly.")}</div>
        </article>
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Medications</span><h2>Daily checklist</h2></div>
          ${healthItemForm("medication")}
          <div class="health-entry-list">${workspaceData.health.medications.length ? workspaceData.health.medications.map((item) => healthItemRow(item, "medication")).join("") : compactGoalEmpty("No medications yet.", "Add medications that need daily tracking.")}</div>
        </article>
      </section>
      <section class="health-layout">
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Caffeine</span><h2>${state.caffeine.total}mg today</h2></div>
          <form class="health-form" data-form="caffeine-entry">
            <select name="type"><option value="Coffee">Coffee - 95mg</option><option value="Espresso">Espresso - 75mg</option><option value="Energy Drink">Energy Drink - 160mg</option><option value="Custom">Custom</option></select>
            <input name="amount" type="number" min="1" placeholder="mg" />
            <button class="button primary">Add caffeine</button>
          </form>
          <form class="health-inline-form" data-form="caffeine-average"><input name="averageDaily" type="number" min="0" value="${workspaceData.health.caffeine.averageDaily}" placeholder="Average daily caffeine mg" /><button class="button">Save average</button></form>
          <div class="health-entry-list">${todayHealthEntries(workspaceData.health.caffeine.entries).length ? todayHealthEntries(workspaceData.health.caffeine.entries).map((entry) => healthEntryRow(entry, "caffeine")).join("") : compactGoalEmpty("No caffeine logged today.", "Add coffee, espresso, energy drink, or custom amount.")}</div>
        </article>
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Weight Tracking</span><h2>${escapeHtml(state.weight.currentLabel)}</h2></div>
          <form class="health-form" data-form="weight-entry">
            <input name="date" type="date" value="${todayIso()}" />
            <input name="weight" type="number" min="1" step="0.1" placeholder="Weight" />
            <select name="unit"><option value="kg" ${workspaceData.health.profile.weightUnit === "kg" ? "selected" : ""}>kg</option><option value="lbs" ${workspaceData.health.profile.weightUnit === "lbs" ? "selected" : ""}>lbs</option></select>
            <button class="button primary">Add weight</button>
          </form>
          <div class="health-weight-chart">${weightChartMarkup()}</div>
          <div class="health-entry-list">${workspaceData.health.weight.entries.slice(-6).reverse().map(weightEntryRow).join("")}</div>
        </article>
      </section>
      <section class="health-layout">
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Health Insights</span><h2>Rule-based feedback</h2></div>
          <div class="finance-insight-list">${healthInsights().map(financeInsightMarkup).join("") || compactGoalEmpty("Health is on track.", "Hydration, supplements, medications, and caffeine look stable today.")}</div>
        </article>
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Weekly / Monthly Summary</span><h2>Health history</h2></div>
          <section class="health-summary-grid">
            ${financeMetricMarkup("Avg Water", formatHealthAmount(weekly.avgWater, "ml"), "7 days")}
            ${financeMetricMarkup("Supplement Consistency", `${weekly.supplementConsistency}%`, "7 days")}
            ${financeMetricMarkup("Medication Consistency", `${weekly.medicationConsistency}%`, "7 days")}
            ${financeMetricMarkup("Avg Caffeine", `${weekly.avgCaffeine}mg`, "7 days")}
            ${financeMetricMarkup("Weight Change", monthly.weightChangeLabel, "30 days")}
          </section>
        </article>
      </section>
      <section class="health-layout single">
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Health History</span><h2>Recent daily snapshots</h2></div>
          <div class="health-entry-list">${workspaceData.health.history.length ? workspaceData.health.history.slice(-10).reverse().map(healthHistoryRow).join("") : compactGoalEmpty("No health history yet.", "Log hydration, caffeine, weight, or checklist items to create daily snapshots.")}</div>
        </article>
      </section>
    </section>
  `;
}

function healthState() {
  const hydration = hydrationState();
  const supplements = healthChecklistState("supplement");
  const medications = healthChecklistState("medication");
  const caffeine = caffeineState();
  const weight = weightState();
  const overallStatus = hydration.percent < 50 || medications.remaining || caffeine.warning ? "Needs action" : "Healthy";
  return {
    hydration,
    supplements,
    medications,
    caffeine,
    weight,
    overallStatus,
    nextAction: healthNextAction(hydration, supplements, medications, caffeine),
  };
}

function hydrationState() {
  const total = todayHealthEntries(workspaceData.health.hydration.entries).reduce((sum, entry) => sum + numberOrZero(entry.amount), 0);
  const goal = waterGoal();
  const percent = goal ? clamp(Math.round((total / goal) * 100), 0, 100) : 0;
  return {
    total,
    goal,
    percent,
    label: `${formatHealthAmount(total, workspaceData.health.hydration.displayMode)} / ${formatHealthAmount(goal, workspaceData.health.hydration.displayMode)}`,
    status: percent >= 100 ? "Hydration goal reached." : percent >= expectedHydrationPercent() ? "Hydration is on schedule." : "Hydration is behind schedule.",
  };
}

function waterGoal() {
  if (workspaceData.health.hydration.manualGoal) return workspaceData.health.hydration.manualGoal;
  const kg = healthWeightKg();
  const multiplier = { Low: 30, Moderate: 35, High: 40, Athlete: 45 }[workspaceData.health.profile.activityLevel] || 35;
  return Math.round(kg * multiplier);
}

function healthWeightKg() {
  const weight = numberOrZero(workspaceData.health.profile.weight) || 70;
  return workspaceData.health.profile.weightUnit === "lbs" ? weight * 0.453592 : weight;
}

function expectedHydrationPercent() {
  const now = new Date();
  const awakeStart = 7;
  const awakeEnd = 22;
  const progress = ((now.getHours() + now.getMinutes() / 60) - awakeStart) / (awakeEnd - awakeStart);
  return clamp(Math.round(progress * 100), 0, 100);
}

function healthChecklistState(type) {
  const items = type === "supplement" ? workspaceData.health.supplements : workspaceData.health.medications;
  const key = todayIso();
  workspaceData.health.checklist[key] = workspaceData.health.checklist[key] || { supplements: {}, medications: {} };
  workspaceData.health.checklist[key].supplements = workspaceData.health.checklist[key].supplements || {};
  workspaceData.health.checklist[key].medications = workspaceData.health.checklist[key].medications || {};
  const bucket = type === "supplement" ? workspaceData.health.checklist[key].supplements : workspaceData.health.checklist[key].medications;
  const taken = items.filter((item) => bucket?.[item.id]).length;
  return { total: items.length, taken, remaining: Math.max(0, items.length - taken), consistency: healthItemConsistency(type, 7) };
}

function caffeineState() {
  const entries = todayHealthEntries(workspaceData.health.caffeine.entries);
  const total = entries.reduce((sum, entry) => sum + numberOrZero(entry.amount), 0);
  const late = entries.some((entry) => Number(String(entry.time || "00:00").split(":")[0]) >= 15);
  let warning = "";
  if (total > 200) warning = "Additional hydration recommended.";
  if (late) warning = "Late caffeine may affect sleep.";
  return { total, warning };
}

function weightState() {
  const entries = workspaceData.health.weight.entries.slice().sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const current = entries.at(-1);
  const previous = entries.length > 1 ? entries.at(-2) : null;
  const change = current && previous ? convertWeight(current.weight, current.unit, current.unit) - convertWeight(previous.weight, previous.unit, current.unit) : 0;
  const trend = change > 0.1 ? "Increasing" : change < -0.1 ? "Decreasing" : "Stable";
  return {
    currentLabel: current ? `${current.weight} ${current.unit}` : "No weight yet",
    change,
    changeLabel: current && previous ? `${change >= 0 ? "+" : ""}${change.toFixed(1)} ${current.unit}` : "No change yet",
    trend,
  };
}

function healthNextAction(hydration, supplements, medications, caffeine) {
  if (hydration.percent < expectedHydrationPercent()) return "Drink water now to catch up to today.";
  if (medications.remaining) return `${medications.remaining} medication ${medications.remaining === 1 ? "item remains" : "items remain"}.`;
  if (supplements.remaining) return `${supplements.remaining} supplement ${supplements.remaining === 1 ? "item remains" : "items remain"}.`;
  if (caffeine.warning) return caffeine.warning;
  return "Health checklist is on track today.";
}

function todayHealthEntries(entries) {
  return entries.filter((entry) => entry.date === todayIso());
}

function healthChecklist() {
  const state = healthState();
  return [
    { id: "hydration", label: "Hydration Goal", checked: state.hydration.percent >= 100, disabled: true },
    ...workspaceData.health.supplements.map((item) => ({ id: item.id, type: "supplement", label: item.name, checked: healthItemTaken("supplement", item.id) })),
    ...workspaceData.health.medications.map((item) => ({ id: item.id, type: "medication", label: item.name, checked: healthItemTaken("medication", item.id) })),
  ];
}

function healthItemTaken(type, id) {
  const day = workspaceData.health.checklist[todayIso()] || {};
  const bucket = type === "supplement" ? day.supplements : day.medications;
  return Boolean(bucket?.[id]);
}

function healthChecklistRow(item) {
  return `<label class="health-check-row ${item.disabled ? "readonly" : ""}"><input type="checkbox" data-health-check="${item.type || ""}" data-health-id="${item.id}" ${item.checked ? "checked" : ""} ${item.disabled ? "disabled" : ""} /> <span>${escapeHtml(item.label)}</span></label>`;
}

function healthItemForm(type) {
  return `
    <form class="health-form compact" data-form="${type}">
      <input name="id" type="hidden" />
      <input name="name" placeholder="${type === "supplement" ? "Creatine" : "Medication name"}" />
      <input name="dose" placeholder="${type === "supplement" ? "5g" : "Dose"}" />
      <select name="timing">${["Morning", "Lunch", "Evening", "Anytime"].map((time) => `<option>${time}</option>`).join("")}</select>
      <button class="button primary">Save ${type}</button>
    </form>
  `;
}

function healthItemRow(item, type) {
  return `
    <div class="health-row">
      <div><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.dose)} / ${escapeHtml(item.timing)}</span></div>
      <div class="health-actions">
        <button data-edit-health-item="${item.id}" data-type="${type}">Edit</button>
        <button data-delete-health-item="${item.id}" data-type="${type}" class="danger-button">Delete</button>
      </div>
    </div>
  `;
}

function healthEntryRow(entry, type) {
  return `
    <div class="health-row">
      <div><strong>${escapeHtml(type === "water" ? formatHealthAmount(entry.amount, workspaceData.health.hydration.displayMode) : `${entry.amount}mg`)}</strong><span>${escapeHtml(entry.time)} / ${escapeHtml(entry.type || entry.note || type)}</span></div>
      <div class="health-actions">
        <button data-edit-health-entry="${entry.id}" data-type="${type}">Edit</button>
        <button data-delete-health-entry="${entry.id}" data-type="${type}" class="danger-button">Delete</button>
      </div>
    </div>
  `;
}

function weightEntryRow(entry) {
  return `<div class="health-row"><div><strong>${entry.weight} ${entry.unit}</strong><span>${escapeHtml(formatDateLabel(entry.date))}</span></div><div class="health-actions"><button data-edit-weight="${entry.id}">Edit</button><button data-delete-weight="${entry.id}" class="danger-button">Delete</button></div></div>`;
}

function healthHistoryRow(entry) {
  return `
    <div class="health-row">
      <div>
        <strong>${escapeHtml(formatDateLabel(entry.date))}</strong>
        <span>${escapeHtml(formatHealthAmount(entry.hydrationTotal || 0, "ml"))} water / ${numberOrZero(entry.caffeineTotal)}mg caffeine / ${escapeHtml(entry.status || "Healthy")}</span>
      </div>
      <span>${numberOrZero(entry.supplementsTaken)}/${numberOrZero(entry.supplementsTotal)} supplements / ${numberOrZero(entry.medicationsTaken)}/${numberOrZero(entry.medicationsTotal)} meds</span>
    </div>
  `;
}

function weightChartMarkup() {
  const entries = workspaceData.health.weight.entries.slice().sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const values = entries.map((entry) => entry.weight);
  if (!entries.length) return compactGoalEmpty("No weight history.", "Add weight entries to see a trend.");
  const width = 720;
  const height = 260;
  const padding = { top: 24, right: 28, bottom: 46, left: 58 };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const xStep = entries.length > 1 ? (width - padding.left - padding.right) / (entries.length - 1) : 0;
  const points = entries.map((entry, index) => {
    const x = padding.left + xStep * index;
    const y = padding.top + ((max - entry.weight) / range) * (height - padding.top - padding.bottom);
    return { ...entry, x, y };
  });
  const linePoints = points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
  const yTicks = [max, min + range / 2, min];
  const xLabels = entries.length <= 6
    ? points
    : points.filter((_, index) => index === 0 || index === points.length - 1 || index % Math.ceil(points.length / 4) === 0);
  return `
    <svg class="health-weight-line-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Weight time-series line graph">
      <line class="axis" x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}" />
      <line class="axis" x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${height - padding.bottom}" />
      ${yTicks.map((tick) => {
        const y = padding.top + ((max - tick) / range) * (height - padding.top - padding.bottom);
        return `<g><line class="grid-line" x1="${padding.left}" y1="${y.toFixed(1)}" x2="${width - padding.right}" y2="${y.toFixed(1)}" /><text class="axis-label" x="${padding.left - 12}" y="${(y + 4).toFixed(1)}" text-anchor="end">${tick.toFixed(1)}</text></g>`;
      }).join("")}
      <polyline class="weight-line" points="${linePoints}" />
      ${points.map((point) => `<g class="weight-point"><circle cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="5" /><title>${escapeHtml(formatDateLabel(point.date))}: ${point.weight} ${escapeHtml(point.unit)}</title></g>`).join("")}
      ${xLabels.map((point) => `<text class="axis-label" x="${point.x.toFixed(1)}" y="${height - 18}" text-anchor="middle">${escapeHtml(point.date.slice(5))}</text>`).join("")}
    </svg>
  `;
}

function healthInsights() {
  const state = healthState();
  const insights = [];
  if (state.hydration.percent >= 100) insights.push({ type: "info", title: "Hydration goal reached.", body: "You have reached today's water target." });
  else if (state.hydration.percent < expectedHydrationPercent()) insights.push({ type: "warning", title: "You are behind schedule.", body: "Drink water now to close the hydration gap." });
  if (healthSummary(7).avgWater >= waterGoal() * 0.9) insights.push({ type: "info", title: "Hydration has been consistent this week.", body: "Average water intake is near your recommended goal." });
  if (state.caffeine.total > 200) insights.push({ type: "warning", title: "Caffeine is above 200mg.", body: "Additional hydration recommended." });
  if (state.caffeine.warning?.includes("Late")) insights.push({ type: "warning", title: "Late caffeine logged.", body: "This may affect your Sleep module schedule." });
  if (state.supplements.remaining) insights.push({ type: "info", title: "Supplement reminders remain.", body: `${state.supplements.remaining} supplement item still needs attention.` });
  if (state.medications.remaining) insights.push({ type: "warning", title: "Medication reminders remain.", body: `${state.medications.remaining} medication item still needs attention.` });
  return insights.slice(0, 5);
}

function healthSummary(days) {
  const dates = recentDateKeys(days);
  const avgWater = Math.round(dates.reduce((sum, date) => sum + entriesForDate(workspaceData.health.hydration.entries, date).reduce((total, entry) => total + numberOrZero(entry.amount), 0), 0) / days);
  const avgCaffeine = Math.round(dates.reduce((sum, date) => sum + entriesForDate(workspaceData.health.caffeine.entries, date).reduce((total, entry) => total + numberOrZero(entry.amount), 0), 0) / days);
  const weights = workspaceData.health.weight.entries.slice().sort((a, b) => String(a.date).localeCompare(String(b.date))).slice(-days);
  const firstWeight = weights.at(0);
  const lastWeight = weights.at(-1);
  const weightChange = firstWeight && lastWeight ? convertWeight(lastWeight.weight, lastWeight.unit, lastWeight.unit) - convertWeight(firstWeight.weight, firstWeight.unit, lastWeight.unit) : 0;
  return {
    avgWater,
    avgCaffeine,
    supplementConsistency: healthItemConsistency("supplement", days),
    medicationConsistency: healthItemConsistency("medication", days),
    weightChangeLabel: firstWeight && lastWeight ? `${weightChange >= 0 ? "+" : ""}${weightChange.toFixed(1)} ${lastWeight.unit}` : "No change",
  };
}

function healthItemConsistency(type, days) {
  const items = type === "supplement" ? workspaceData.health.supplements : workspaceData.health.medications;
  if (!items.length) return 0;
  const dates = recentDateKeys(days);
  const total = dates.length * items.length;
  const done = dates.reduce((sum, date) => {
    const day = workspaceData.health.checklist[date] || {};
    const bucket = type === "supplement" ? day.supplements : day.medications;
    return sum + items.filter((item) => bucket?.[item.id]).length;
  }, 0);
  return total ? Math.round((done / total) * 100) : 0;
}

function recentDateKeys(days) {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - index);
    return localIsoDate(date);
  });
}

function entriesForDate(entries, date) {
  return entries.filter((entry) => entry.date === date);
}

function formatHealthAmount(amount, mode) {
  const value = numberOrZero(amount);
  if (mode === "oz") return `${Math.round(value / 29.5735)} oz`;
  if (mode === "bottles") return `${(value / workspaceData.health.hydration.bottleSize).toFixed(1)} bottles`;
  if (mode === "glasses") return `${(value / workspaceData.health.hydration.glassSize).toFixed(1)} glasses`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}L`;
  return `${Math.round(value)}ml`;
}

function convertWeight(weight, from, to) {
  if (from === to) return numberOrZero(weight);
  return from === "lbs" ? numberOrZero(weight) * 0.453592 : numberOrZero(weight) / 0.453592;
}

function updateHealthStats() {
  const state = healthState();
  const date = todayIso();
  const snapshot = {
    date,
    updatedAt: new Date().toISOString(),
    hydrationTotal: state.hydration.total,
    hydrationGoal: state.hydration.goal,
    hydrationPercent: state.hydration.percent,
    supplementsTaken: state.supplements.taken,
    supplementsTotal: state.supplements.total,
    medicationsTaken: state.medications.taken,
    medicationsTotal: state.medications.total,
    caffeineTotal: state.caffeine.total,
    weight: state.weight.currentLabel,
    status: state.overallStatus,
  };
  workspaceData.health.history = [
    ...workspaceData.health.history.filter((entry) => entry.date !== date),
    snapshot,
  ].slice(-120);
  workspaceData.health.stats = {
    updatedAt: snapshot.updatedAt,
    weekly: healthSummary(7),
    monthly: healthSummary(30),
    hydration: state.hydration,
    caffeine: state.caffeine,
    weight: state.weight,
  };
}

function persistHealthWorkspace() {
  updateHealthStats();
  persistWorkspace();
}

function renderFitness() {
  const state = fitnessState();
  const selectedGymId = workspaceData.fitness.ui.selectedGymId || workspaceData.fitness.gyms[0]?.id || "";
  const selectedDay = workspaceData.fitness.ui.selectedDay || state.trainingDay;
  const sessionExercises = fitnessExercisesForSession(selectedGymId, selectedDay);
  return `
    <section class="module-app fitness-module">
      <div class="module-command fitness-command">
        <div>
          <span class="stat-label">Fitness Operating System</span>
          <h2>${escapeHtml(state.dateLabel)}</h2>
          <p>${escapeHtml(state.trainingDay)}${state.trainingDay.toLowerCase() === "rest" ? " / Recovery day" : " / Training day"}</p>
        </div>
        <div class="fitness-command-actions">
          <button class="button" data-fitness-modal="exercise">Add Exercise</button>
          <button class="button" data-fitness-modal="settings">Settings</button>
        </div>
      </div>
      <section class="fitness-dashboard-grid">
        ${financeMetricMarkup("Current Bodyweight", state.weight.currentLabel, state.weight.change7Label)}
        ${financeMetricMarkup("Training Day", state.trainingDay, "split rotation")}
        ${financeMetricMarkup("Exercises", String(workspaceData.fitness.exercises.length), "database")}
        ${financeMetricMarkup("Sets Logged", String(workspaceData.fitness.sets.length), "all time")}
        ${financeMetricMarkup("Photos", String(workspaceData.fitness.photos.length), "progress")}
      </section>
      <section class="fitness-layout">
        <article class="workspace-panel fitness-weight-panel">
          <div class="section-head">
            <span class="stat-label">Weight Tracking</span>
            <h2>Bodyweight trend</h2>
          </div>
          <div class="fitness-range-tabs">${[7, 30, 90].map((range) => `<button class="${workspaceData.fitness.settings.weightRange === range ? "active" : ""}" data-fitness-weight-range="${range}">${range}D</button>`).join("")}</div>
          <div class="fitness-line-chart">${fitnessWeightGraphMarkup()}</div>
          <div class="fitness-insight-card">
            <span class="stat-label">Body Composition Estimate</span>
            <strong>${escapeHtml(state.composition.title)}</strong>
            <p>${escapeHtml(state.composition.body)}</p>
          </div>
          <form class="fitness-form inline" data-form="fitness-weight">
            <input name="id" type="hidden" />
            <input name="date" type="date" value="${todayIso()}" />
            <input name="weight" type="number" min="1" step="0.1" placeholder="Weight" />
            <select name="unit"><option value="kg" ${workspaceData.fitness.settings.unit === "kg" ? "selected" : ""}>kg</option><option value="lb" ${workspaceData.fitness.settings.unit === "lb" ? "selected" : ""}>lb</option></select>
            <button class="button primary">Add Weight</button>
          </form>
          <div class="fitness-history-list">${workspaceData.fitness.weights.length ? fitnessWeightEntries().slice(-8).reverse().map(fitnessWeightRow).join("") : compactGoalEmpty("No weight entries yet.", "Add today's weight to start the trend.")}</div>
        </article>
        <article class="workspace-panel fitness-next-card">
          <div class="section-head"><span class="stat-label">Next Session Card</span><h2>Progressive Overload Coach</h2></div>
          ${fitnessNextSessionCard(sessionExercises)}
        </article>
      </section>
      <section class="workspace-panel">
        <div class="section-head">
          <span class="stat-label">Session View</span>
          <h2>${escapeHtml(selectedDay || state.trainingDay)} Session</h2>
        </div>
        <div class="fitness-session-controls">
          <select data-fitness-session-gym><option value="">All gyms</option>${workspaceData.fitness.gyms.map((gym) => `<option value="${gym.id}" ${selectedGymId === gym.id ? "selected" : ""}>${escapeHtml(gym.name)}</option>`).join("")}</select>
          <select data-fitness-session-day>${workspaceData.fitness.split.days.map((day) => `<option value="${escapeHtml(day)}" ${selectedDay === day ? "selected" : ""}>${escapeHtml(day)}</option>`).join("")}</select>
          <button class="button" data-fitness-modal="gym">Add Gym</button>
          <button class="button" data-fitness-modal="split">Edit Split</button>
        </div>
        <div class="fitness-exercise-grid">${sessionExercises.length ? sessionExercises.map(fitnessExerciseCard).join("") : compactGoalEmpty("No exercises for this session.", "Create exercises in the Exercise modal and assign them to this gym/day.")}</div>
      </section>
      <section class="fitness-layout">
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Progress Photos</span><h2>Physique tracking</h2></div>
          <form class="fitness-form" data-form="fitness-photo">
            <input name="date" type="date" value="${todayIso()}" />
            <input name="weight" type="number" min="1" step="0.1" placeholder="Weight at photo" />
            <select name="unit"><option value="kg" ${workspaceData.fitness.settings.unit === "kg" ? "selected" : ""}>kg</option><option value="lb" ${workspaceData.fitness.settings.unit === "lb" ? "selected" : ""}>lb</option></select>
            <input name="photo" type="file" accept="image/*" capture="environment" />
            <button class="button primary">Save Photo</button>
          </form>
          <div class="fitness-photo-grid">${workspaceData.fitness.photos.length ? workspaceData.fitness.photos.slice().reverse().map(fitnessPhotoCard).join("") : compactGoalEmpty("No progress photos yet.", "Upload or take a photo to begin visual tracking.")}</div>
        </article>
        <article class="workspace-panel fitness-compare-panel">
          <div class="section-head"><span class="stat-label">Photo Comparison</span><h2>Side by side</h2></div>
          ${fitnessPhotoComparisonMarkup()}
        </article>
      </section>
      ${renderFitnessModal()}
    </section>
  `;
}

function fitnessState() {
  const date = new Date();
  const trainingDay = fitnessTrainingDay(date);
  const weight = fitnessWeightState();
  const consistency = fitnessTrainingConsistency(14);
  const composition = fitnessCompositionEstimate(weight, consistency);
  return {
    dateLabel: date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }),
    trainingDay,
    weight,
    consistency,
    composition,
  };
}

function fitnessTrainingDay(date = new Date()) {
  const split = workspaceData.fitness.split;
  if (!split.days.length) return "Rest";
  const start = parseLocalDate(split.startDate || todayIso());
  const diff = Math.floor((parseLocalDate(localIsoDate(date)) - start) / 86400000);
  const index = ((split.currentIndex + diff) % split.days.length + split.days.length) % split.days.length;
  return split.days[index] || "Rest";
}

function fitnessWeightEntries() {
  return workspaceData.fitness.weights.slice().sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

function fitnessWeightState() {
  const entries = fitnessWeightEntries();
  const current = entries.at(-1);
  const currentLabel = current ? `${current.weight} ${current.unit}` : "No weight yet";
  const sevenDaysAgo = parseLocalDate(todayIso(-7));
  const previous = entries.filter((entry) => parseLocalDate(entry.date) <= sevenDaysAgo).at(-1) || entries.at(0);
  const change7 = current && previous && current.id !== previous.id ? convertFitnessWeight(current.weight, current.unit, current.unit) - convertFitnessWeight(previous.weight, previous.unit, current.unit) : 0;
  return {
    current,
    currentLabel,
    change7,
    change7Label: current && previous && current.id !== previous.id ? `${change7 >= 0 ? "+" : ""}${change7.toFixed(1)}${current.unit} last 7 days` : "No 7-day change yet",
  };
}

function fitnessCompositionEstimate(weight, consistency) {
  const rate = Math.abs(weight.change7);
  if (!weight.current) return { title: "Weight trend unavailable", body: "Add weight entries and training sets to estimate the direction." };
  if (rate < 0.2) return { title: "Weight stable", body: "Bodyweight is steady. Training progress will decide the next adjustment." };
  if (weight.change7 > 0 && consistency >= 60 && rate <= 1) return { title: "Mostly gaining muscle", body: "Weight is rising at a controlled rate while training consistency is solid." };
  if (weight.change7 > 0) return { title: "Mostly gaining fat", body: "Weight is climbing faster than training consistency supports. Consider slowing the surplus." };
  if (weight.change7 < 0 && consistency >= 40) return { title: "Mostly losing fat", body: "Weight is trending down while training remains present." };
  return { title: "Weight dropping without enough training", body: "Keep protein, recovery, and lifting sessions consistent while cutting." };
}

function fitnessTrainingConsistency(days) {
  const dates = new Set(workspaceData.fitness.sets.map((set) => set.date));
  const recent = recentDateKeys(days).filter((date) => dates.has(date)).length;
  return Math.round((recent / days) * 100);
}

function fitnessWeightGraphMarkup() {
  const range = workspaceData.fitness.settings.weightRange || 30;
  const cutoff = parseLocalDate(todayIso(-range));
  const entries = fitnessWeightEntries().filter((entry) => parseLocalDate(entry.date) >= cutoff);
  return fitnessLineGraph(entries.map((entry) => ({ date: entry.date, value: entry.weight, label: `${entry.weight} ${entry.unit}` })), {
    emptyTitle: "No weight graph yet.",
    emptyBody: "Add weight entries to see actual weigh-ins and moving average.",
    aria: "Fitness bodyweight line graph",
    movingAverage: true,
  });
}

function fitnessLineGraph(points, options = {}) {
  if (!points.length) return compactGoalEmpty(options.emptyTitle || "No graph data.", options.emptyBody || "Log data to build this graph.");
  const width = 760;
  const height = 280;
  const pad = { top: 24, right: 28, bottom: 48, left: 58 };
  const values = points.map((point) => numberOrZero(point.value));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const xStep = points.length > 1 ? (width - pad.left - pad.right) / (points.length - 1) : 0;
  const plot = points.map((point, index) => ({
    ...point,
    x: pad.left + xStep * index,
    y: pad.top + ((max - numberOrZero(point.value)) / range) * (height - pad.top - pad.bottom),
  }));
  const line = plot.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
  const avgPlot = options.movingAverage ? plot.map((point, index) => {
    const slice = points.slice(Math.max(0, index - 2), index + 1);
    const avg = slice.reduce((sum, item) => sum + numberOrZero(item.value), 0) / slice.length;
    return { x: point.x, y: pad.top + ((max - avg) / range) * (height - pad.top - pad.bottom) };
  }) : [];
  const avgLine = avgPlot.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
  const xLabels = plot.length <= 5 ? plot : plot.filter((_, index) => index === 0 || index === plot.length - 1 || index % Math.ceil(plot.length / 4) === 0);
  return `
    <svg class="fitness-line-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(options.aria || "Fitness line graph")}">
      <line class="axis" x1="${pad.left}" y1="${height - pad.bottom}" x2="${width - pad.right}" y2="${height - pad.bottom}" />
      <line class="axis" x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${height - pad.bottom}" />
      ${[max, min + range / 2, min].map((tick) => {
        const y = pad.top + ((max - tick) / range) * (height - pad.top - pad.bottom);
        return `<g><line class="grid-line" x1="${pad.left}" y1="${y.toFixed(1)}" x2="${width - pad.right}" y2="${y.toFixed(1)}" /><text class="axis-label" x="${pad.left - 12}" y="${(y + 4).toFixed(1)}" text-anchor="end">${tick.toFixed(1)}</text></g>`;
      }).join("")}
      ${avgLine ? `<polyline class="moving-line" points="${avgLine}" />` : ""}
      <polyline class="main-line" points="${line}" />
      ${plot.map((point) => `<g class="data-point"><circle cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="5" /><title>${escapeHtml(formatDateLabel(point.date))}: ${escapeHtml(point.label || String(point.value))}</title></g>`).join("")}
      ${xLabels.map((point) => `<text class="axis-label" x="${point.x.toFixed(1)}" y="${height - 18}" text-anchor="middle">${escapeHtml(String(point.date).slice(5))}</text>`).join("")}
    </svg>
  `;
}

function fitnessExercisesForSession(gymId, day) {
  return workspaceData.fitness.exercises.filter((exercise) => (!gymId || exercise.gymId === gymId) && (!day || exercise.day === day));
}

function fitnessExerciseSets(exerciseId) {
  return workspaceData.fitness.sets.filter((set) => set.exerciseId === exerciseId).sort((a, b) => String(a.date).localeCompare(String(b.date)) || String(a.createdAt).localeCompare(String(b.createdAt)));
}

function fitnessExerciseStats(exercise) {
  const sets = fitnessExerciseSets(exercise.id);
  const best = sets.slice().sort((a, b) => fitnessEstimatedOneRepMax(exercise, b) - fitnessEstimatedOneRepMax(exercise, a))[0];
  const last = sets.at(-1);
  const sessionCount = new Set(sets.map((set) => set.date)).size;
  const estimated = best ? Math.round(fitnessEstimatedOneRepMax(exercise, best)) : 0;
  return { sets, best, last, sessionCount, estimated };
}

function fitnessEstimatedOneRepMax(exercise, set) {
  const load = exercise.bodyweight ? fitnessLatestBodyweight() + numberOrZero(set.externalLoad) : numberOrZero(set.weight);
  return load * (1 + numberOrZero(set.reps) / 30);
}

function fitnessLatestBodyweight() {
  const fitnessWeight = fitnessWeightEntries().at(-1);
  if (fitnessWeight) return convertFitnessWeight(fitnessWeight.weight, fitnessWeight.unit, workspaceData.fitness.settings.unit);
  return convertFitnessWeight(workspaceData.health?.profile?.weight || 70, workspaceData.health?.profile?.weightUnit === "lbs" ? "lb" : "kg", workspaceData.fitness.settings.unit);
}

function fitnessRecommendation(exercise) {
  const stats = fitnessExerciseStats(exercise);
  const last = stats.last;
  const baseWeight = exercise.bodyweight ? numberOrZero(last?.externalLoad) : numberOrZero(last?.weight || exercise.startingWeight);
  if (!last) return { title: exercise.name, target: `${baseWeight || exercise.startingWeight || 0}${workspaceData.fitness.settings.unit} x ${exercise.repMin}-${exercise.repMax}`, reason: "Start with the configured starting weight and own the rep range." };
  if (last.reps >= exercise.repMax) {
    const next = baseWeight + exercise.increment;
    return { title: exercise.name, target: `${next}${workspaceData.fitness.settings.unit} x ${exercise.repMin}-${Math.max(exercise.repMin, exercise.repMin + 1)} reps`, reason: "You achieved the top of your rep range. Add weight next session." };
  }
  if (last.reps <= exercise.repMin - 2) {
    const next = Math.max(0, baseWeight - exercise.increment);
    return { title: exercise.name, target: `${next}${workspaceData.fitness.settings.unit} x ${exercise.repMin}-${exercise.repMax} reps`, reason: "Performance fell below the target range. Reduce load and rebuild." };
  }
  return { title: exercise.name, target: `${baseWeight}${workspaceData.fitness.settings.unit} x ${exercise.repMin}-${exercise.repMax} reps`, reason: "Stay at the current load until you reach the top of the rep range." };
}

function fitnessNextSessionCard(exercises) {
  const exercise = exercises.find((item) => fitnessExerciseSets(item.id).length) || exercises[0] || workspaceData.fitness.exercises[0];
  if (!exercise) return compactGoalEmpty("No coach recommendation yet.", "Create a gym, split, and exercise to unlock next-session targets.");
  const rec = fitnessRecommendation(exercise);
  return `
    <div class="fitness-coach-card">
      <span class="stat-label">${escapeHtml(rec.title)}</span>
      <h2>${escapeHtml(rec.target)}</h2>
      <p>${escapeHtml(rec.reason)}</p>
      <button class="button" data-fitness-open-exercise="${exercise.id}">Open Exercise</button>
    </div>
  `;
}

function fitnessExerciseCard(exercise) {
  const stats = fitnessExerciseStats(exercise);
  const rec = fitnessRecommendation(exercise);
  const gym = workspaceData.fitness.gyms.find((item) => item.id === exercise.gymId);
  return `
    <article class="fitness-exercise-card" id="fitness-exercise-${exercise.id}">
      <div class="fitness-card-head">
        <div>
          <span class="stat-label">${escapeHtml(gym?.name || "No gym")} / ${escapeHtml(exercise.day)}</span>
          <h3>${escapeHtml(exercise.name)}</h3>
        </div>
        <div class="fitness-actions">
          <button data-edit-fitness-exercise="${exercise.id}">Edit</button>
          <button class="danger-button" data-delete-fitness-exercise="${exercise.id}">Delete</button>
        </div>
      </div>
      <div class="fitness-stats-row">
        <span>Last: ${stats.last ? fitnessSetLabel(exercise, stats.last) : "No sets yet"}</span>
        <span>Best: ${stats.best ? fitnessSetLabel(exercise, stats.best) : "None"}</span>
        <span>e1RM: ${stats.estimated || 0}${workspaceData.fitness.settings.unit}</span>
        <span>Sessions: ${stats.sessionCount}</span>
      </div>
      <div class="fitness-recommendation"><strong>Next: ${escapeHtml(rec.target)}</strong><span>${escapeHtml(rec.reason)}</span></div>
      <form class="fitness-set-form" data-form="fitness-set" data-exercise-id="${exercise.id}">
        <input name="weight" type="number" min="0" step="0.5" value="${exercise.bodyweight ? numberOrZero(stats.last?.externalLoad) : numberOrZero(stats.last?.weight || exercise.startingWeight)}" aria-label="Weight" />
        <input name="reps" type="number" min="1" value="${exercise.repMin}" aria-label="Reps" />
        <button class="button primary">Log Set</button>
      </form>
      <div class="fitness-line-chart small">${fitnessExerciseGraphMarkup(exercise)}</div>
      <details class="fitness-history-details">
        <summary>Exercise History</summary>
        <div class="fitness-history-list">${stats.sets.length ? stats.sets.slice(-12).reverse().map((set) => fitnessSetRow(exercise, set)).join("") : compactGoalEmpty("No sets logged.", "Log your first set for this exercise.")}</div>
      </details>
    </article>
  `;
}

function fitnessExerciseGraphMarkup(exercise) {
  const sessions = fitnessExerciseSets(exercise.id).slice(-10).map((set) => ({ date: set.date, value: Math.round(fitnessEstimatedOneRepMax(exercise, set)), label: `${Math.round(fitnessEstimatedOneRepMax(exercise, set))}${workspaceData.fitness.settings.unit} e1RM` }));
  return fitnessLineGraph(sessions, { emptyTitle: "No strength trend yet.", emptyBody: "Log sets to build the exercise trend.", aria: `${exercise.name} strength trend` });
}

function fitnessSetLabel(exercise, set) {
  if (exercise.bodyweight) return `BW${set.externalLoad ? ` + ${set.externalLoad}${workspaceData.fitness.settings.unit}` : ""} x ${set.reps}`;
  return `${set.weight}${workspaceData.fitness.settings.unit} x ${set.reps}`;
}

function fitnessSetRow(exercise, set) {
  return `<div class="fitness-history-row"><div><strong>${escapeHtml(fitnessSetLabel(exercise, set))}</strong><span>${escapeHtml(formatDateLabel(set.date))} / e1RM ${Math.round(fitnessEstimatedOneRepMax(exercise, set))}${workspaceData.fitness.settings.unit}</span></div><div class="fitness-actions"><button data-edit-fitness-set="${set.id}">Edit</button><button class="danger-button" data-delete-fitness-set="${set.id}">Delete</button></div></div>`;
}

function fitnessWeightRow(entry) {
  return `<div class="fitness-history-row"><div><strong>${entry.weight} ${entry.unit}</strong><span>${escapeHtml(formatDateLabel(entry.date))}</span></div><div class="fitness-actions"><button data-edit-fitness-weight="${entry.id}">Edit</button><button class="danger-button" data-delete-fitness-weight="${entry.id}">Delete</button></div></div>`;
}

function fitnessPhotoCard(photo) {
  return `<article class="fitness-photo-card"><img src="${escapeHtml(photo.image)}" alt="${escapeHtml(photo.name)}" /><strong>${escapeHtml(formatDateLabel(photo.date))}</strong><span>${photo.weight ? `${photo.weight} ${photo.unit}` : "No weight recorded"}</span><div class="fitness-actions"><button data-view-fitness-photo="${photo.id}">View</button><button class="danger-button" data-delete-fitness-photo="${photo.id}">Delete</button></div></article>`;
}

function fitnessPhotoComparisonMarkup() {
  const photos = workspaceData.fitness.photos;
  const first = photos.find((photo) => photo.id === workspaceData.fitness.ui.photoA) || photos[0];
  const second = photos.find((photo) => photo.id === workspaceData.fitness.ui.photoB) || photos[1] || photos[0];
  if (photos.length < 2) return compactGoalEmpty("Comparison needs two photos.", "Add at least two progress photos to compare changes.");
  const dayDiff = Math.round((parseLocalDate(second.date) - parseLocalDate(first.date)) / 86400000);
  const weightDiff = first.weight && second.weight ? convertFitnessWeight(second.weight, second.unit, second.unit) - convertFitnessWeight(first.weight, first.unit, second.unit) : 0;
  return `
    <div class="fitness-compare-controls">
      <select data-fitness-photo-a>${photos.map((photo) => `<option value="${photo.id}" ${first.id === photo.id ? "selected" : ""}>${escapeHtml(formatDateLabel(photo.date))}</option>`).join("")}</select>
      <select data-fitness-photo-b>${photos.map((photo) => `<option value="${photo.id}" ${second.id === photo.id ? "selected" : ""}>${escapeHtml(formatDateLabel(photo.date))}</option>`).join("")}</select>
    </div>
    <div class="fitness-photo-compare">
      <figure><img src="${escapeHtml(first.image)}" alt="Progress photo A" /><figcaption>${escapeHtml(formatDateLabel(first.date))}</figcaption></figure>
      <figure><img src="${escapeHtml(second.image)}" alt="Progress photo B" /><figcaption>${escapeHtml(formatDateLabel(second.date))}</figcaption></figure>
    </div>
    <div class="fitness-insight-card"><strong>${escapeHtml(formatDateLabel(first.date))} to ${escapeHtml(formatDateLabel(second.date))}</strong><p>${dayDiff} days / ${weightDiff >= 0 ? "+" : ""}${weightDiff.toFixed(1)}${second.unit}</p></div>
  `;
}

function renderFitnessModal() {
  const modal = workspaceData.fitness.ui.modal;
  if (!modal) return "";
  const content = {
    gym: fitnessGymModal,
    split: fitnessSplitModal,
    exercise: fitnessExerciseModal,
    settings: fitnessSettingsModal,
    photo: fitnessPhotoModal,
  }[modal]?.() || "";
  return `<div class="fitness-modal-backdrop" data-close-fitness-modal><section class="fitness-modal" role="dialog" aria-modal="true" aria-label="Fitness modal" data-modal-panel>${content}</section></div>`;
}

function fitnessGymModal() {
  return `
    <div class="fitness-modal-head"><h2>Gym Profiles</h2><button data-close-fitness-modal>Close</button></div>
    <form class="fitness-form inline" data-form="fitness-gym"><input name="id" type="hidden" /><input name="name" placeholder="Home Gym" /><button class="button primary">Save Gym</button></form>
    <div class="fitness-history-list">${workspaceData.fitness.gyms.length ? workspaceData.fitness.gyms.map((gym) => `<div class="fitness-history-row"><strong>${escapeHtml(gym.name)}</strong><div class="fitness-actions"><button data-edit-fitness-gym="${gym.id}">Edit</button><button class="danger-button" data-delete-fitness-gym="${gym.id}">Delete</button></div></div>`).join("") : compactGoalEmpty("No gyms yet.", "Create Home Gym, Commercial Gym, or another training environment.")}</div>
  `;
}

function fitnessSplitModal() {
  return `
    <div class="fitness-modal-head"><h2>Split Rotation</h2><button data-close-fitness-modal>Close</button></div>
    <form class="fitness-form inline" data-form="fitness-split-settings">
      <input name="startDate" type="date" value="${workspaceData.fitness.split.startDate}" />
      <select name="currentIndex">${workspaceData.fitness.split.days.map((day, index) => `<option value="${index}" ${workspaceData.fitness.split.currentIndex === index ? "selected" : ""}>Today is ${escapeHtml(day)}</option>`).join("")}</select>
      <button class="button primary">Save Rotation Anchor</button>
    </form>
    <form class="fitness-form inline" data-form="fitness-split-day"><input name="index" type="hidden" /><input name="day" placeholder="Push" /><button class="button primary">Save Day</button></form>
    <div class="fitness-history-list">${workspaceData.fitness.split.days.map((day, index) => `<div class="fitness-history-row"><div><strong>${index + 1}. ${escapeHtml(day)}</strong><span>Repeats every ${workspaceData.fitness.split.days.length} days</span></div><div class="fitness-actions"><button data-move-split-day="${index}" data-direction="-1">Up</button><button data-move-split-day="${index}" data-direction="1">Down</button><button data-edit-split-day="${index}">Edit</button><button class="danger-button" data-delete-split-day="${index}">Delete</button></div></div>`).join("")}</div>
  `;
}

function fitnessExerciseModal() {
  const editing = workspaceData.fitness.exercises.find((exercise) => exercise.id === workspaceData.fitness.ui.editingId);
  return `
    <div class="fitness-modal-head"><h2>${editing ? "Edit Exercise" : "Create Exercise"}</h2><button data-close-fitness-modal>Close</button></div>
    <form class="fitness-form" data-form="fitness-exercise">
      <input name="id" type="hidden" value="${escapeHtml(editing?.id || "")}" />
      <input name="name" placeholder="Bench Press" value="${escapeHtml(editing?.name || "")}" />
      <select name="gymId"><option value="">No gym</option>${workspaceData.fitness.gyms.map((gym) => `<option value="${gym.id}" ${editing?.gymId === gym.id ? "selected" : ""}>${escapeHtml(gym.name)}</option>`).join("")}</select>
      <select name="day">${workspaceData.fitness.split.days.map((day) => `<option value="${escapeHtml(day)}" ${editing?.day === day ? "selected" : ""}>${escapeHtml(day)}</option>`).join("")}</select>
      <label class="fitness-check"><input name="bodyweight" type="checkbox" ${editing?.bodyweight ? "checked" : ""} /> Bodyweight exercise</label>
      <input name="startingWeight" type="number" min="0" step="0.5" placeholder="Starting weight" value="${editing?.startingWeight ?? ""}" />
      <input name="repMin" type="number" min="1" placeholder="Rep minimum" value="${editing?.repMin || 6}" />
      <input name="repMax" type="number" min="1" placeholder="Rep maximum" value="${editing?.repMax || 8}" />
      <input name="increment" type="number" min="0.5" step="0.5" placeholder="Weight increment" value="${editing?.increment || 2.5}" />
      <button class="button primary">Save Exercise</button>
    </form>
  `;
}

function fitnessSettingsModal() {
  return `
    <div class="fitness-modal-head"><h2>Fitness Settings</h2><button data-close-fitness-modal>Close</button></div>
    <form class="fitness-form inline" data-form="fitness-settings">
      <select name="unit"><option value="kg" ${workspaceData.fitness.settings.unit === "kg" ? "selected" : ""}>kg</option><option value="lb" ${workspaceData.fitness.settings.unit === "lb" ? "selected" : ""}>lb</option></select>
      <button class="button primary">Save Units</button>
    </form>
    <div class="fitness-settings-grid">
      <button class="button" data-fitness-modal="gym">Gym Management</button>
      <button class="button" data-fitness-modal="split">Split Management</button>
      <button class="button" data-action="export-fitness-data">Export Data</button>
      <button class="button" data-action="import-fitness-data">Import Data</button>
      <button class="button danger-button" data-action="reset-fitness-data">Reset Fitness Data</button>
    </div>
    <textarea class="fitness-import-box" data-fitness-import placeholder="Paste exported Fitness JSON here"></textarea>
  `;
}

function fitnessPhotoModal() {
  const photo = workspaceData.fitness.photos.find((item) => item.id === workspaceData.fitness.ui.editingId);
  if (!photo) return "";
  return `<div class="fitness-modal-head"><h2>${escapeHtml(formatDateLabel(photo.date))}</h2><button data-close-fitness-modal>Close</button></div><img class="fitness-photo-view" src="${escapeHtml(photo.image)}" alt="${escapeHtml(photo.name)}" /><p>${photo.weight ? `${photo.weight} ${photo.unit}` : "No weight recorded"}</p>`;
}

function convertFitnessWeight(weight, from, to) {
  if (from === to) return numberOrZero(weight);
  return from === "lb" ? numberOrZero(weight) * 0.453592 : numberOrZero(weight) / 0.453592;
}

function sleepState(now = new Date()) {
  const bedtime = sleepDateForTime(workspaceData.sleep.profile.targetBedtime, now);
  const wake = sleepDateForTime(workspaceData.sleep.profile.targetWakeTime, now);
  if (wake <= bedtime) wake.setDate(wake.getDate() + 1);
  const start = new Date(bedtime);
  start.setHours(start.getHours() - 16);
  const total = Math.max(1, bedtime - start);
  const elapsed = clamp(((now - start) / total) * 100, 0, now > bedtime ? 100 : 100);
  const timeline = sleepTimeline(now);
  const nextMilestone = timeline.find((item) => item.msRemaining > 0) || timeline.at(-1);
  return {
    bedtime,
    wake,
    progressPercent: Math.round(elapsed),
    progress: Math.round((elapsed / 100) * 360),
    timeUntilBed: timeRemainingLabel(bedtime, now),
    phase: sleepPhase(now),
    status: sleepStatus(now),
    nextMilestone,
  };
}

function sleepDateForTime(value, now = new Date()) {
  const [hours, minutes] = String(value || "00:00").split(":").map(Number);
  const date = new Date(now);
  date.setHours(hours || 0, minutes || 0, 0, 0);
  if (date < now && (hours || 0) < 12) date.setDate(date.getDate() + 1);
  return date;
}

function sleepTimeline(now = new Date()) {
  const bedtime = sleepDateForTime(workspaceData.sleep.profile.targetBedtime, now);
  const offsets = [
    ["Last Caffeine", -6 * 60],
    ["Last Meal", -3 * 60],
    ["Wind Down", -90],
    ["Screens Off", -60],
    ["Bedtime", 0],
  ];
  return offsets.map(([label, minutes]) => {
    const time = new Date(bedtime);
    time.setMinutes(time.getMinutes() + minutes);
    const msRemaining = time - now;
    return {
      id: label.toLowerCase().replace(/\s+/g, "-"),
      label,
      time,
      timeLabel: formatClock(time),
      msRemaining,
      remaining: msRemaining > 0 ? durationLabel(msRemaining) : "Completed",
      state: msRemaining > 0 ? "upcoming" : "passed",
    };
  });
}

function sleepPhase(now = new Date()) {
  const hour = now.getHours();
  if (hour < 12) return { label: "Morning - get moving", detail: "Build wakefulness early so night arrives easier." };
  if (hour < 18) return { label: "Afternoon - push it", detail: "Use energy now and protect the evening wind-down." };
  if (hour < 22) return { label: "Evening - wind down", detail: "Start lowering stimulation before bedtime pressure builds." };
  return { label: "Bedtime approaching", detail: "Keep the night quiet and close the day." };
}

function sleepStatus(now = new Date()) {
  const timeline = sleepTimeline(now);
  const bedtime = timeline.find((item) => item.label === "Bedtime");
  const screens = timeline.find((item) => item.label === "Screens Off");
  const wind = timeline.find((item) => item.label === "Wind Down");
  if (bedtime.msRemaining < 0) return { label: `Bedtime missed by ${durationLabel(Math.abs(bedtime.msRemaining))}`, tone: "danger" };
  if (screens.msRemaining <= 30 * 60000) return { label: "Screens Off Soon", tone: "warning" };
  if (wind.msRemaining <= 30 * 60000) return { label: "Wind Down Starting Soon", tone: "notice" };
  return { label: "On Schedule", tone: "positive" };
}

function sleepChecklist() {
  const key = todayIso();
  workspaceData.sleep.checklist[key] = workspaceData.sleep.checklist[key] || {};
  return [
    ["caffeine", "Last caffeine finished"],
    ["meal", "Last meal finished"],
    ["screens", "Screens off"],
    ["wind-down", "Wind down routine"],
    ["in-bed", "In bed"],
  ].map(([id, label]) => ({ id, label, checked: Boolean(workspaceData.sleep.checklist[key][id]) }));
}

function sleepInsights() {
  const state = sleepState();
  const checklist = sleepChecklist();
  const insights = [];
  if (state.status.tone === "danger") insights.push({ type: "warning", title: state.status.label, body: "Record tonight, then restart tomorrow with the wind-down timeline." });
  else insights.push({ type: "info", title: "You are on schedule today.", body: `${state.nextMilestone.label} is ${state.nextMilestone.remaining}.` });
  if (state.nextMilestone.label === "Screens Off") insights.push({ type: "warning", title: "Screens-off time is approaching.", body: "Finish high-stimulation work before the screen cutoff." });
  const streak = sleepConsistency().currentStreak;
  if (streak >= 2) insights.push({ type: "info", title: `Sleep routine streak: ${streak} days`, body: "You are building bedtime consistency before the night starts." });
  if (checklist.filter((item) => item.checked).length < 2 && state.phase.label.startsWith("Evening")) insights.push({ type: "warning", title: "Evening checklist is behind.", body: "Complete the next sleep prep item before screens-off time." });
  return insights.slice(0, 4);
}

function sleepConsistency() {
  const history = workspaceData.sleep.history.slice(-30);
  return {
    currentStreak: sleepCurrentStreak(),
    bestStreak: sleepBestStreak(),
    last7: sleepOnSchedulePercent(history.slice(-7)),
    last30: sleepOnSchedulePercent(history),
  };
}

function sleepOnSchedulePercent(items) {
  return items.length ? Math.round((items.filter((item) => item.status === "On Schedule").length / items.length) * 100) : 0;
}

function sleepCurrentStreak() {
  let streak = 0;
  for (const item of workspaceData.sleep.history.slice().reverse()) {
    if (item.status !== "On Schedule") break;
    streak += 1;
  }
  return streak;
}

function sleepBestStreak() {
  let best = 0;
  let current = 0;
  workspaceData.sleep.history.forEach((item) => {
    if (item.status === "On Schedule") {
      current += 1;
      best = Math.max(best, current);
    } else {
      current = 0;
    }
  });
  return best;
}

function sleepWeeklySummary() {
  const week = workspaceData.sleep.history.slice(-7);
  return {
    averageBedtime: averageTimeLabel(week.map((item) => item.actualBedtime).filter(Boolean)) || "-",
    averageWakeTime: averageTimeLabel(week.map((item) => item.actualWakeTime).filter(Boolean)) || "-",
    consistency: sleepOnSchedulePercent(week),
    daysOnSchedule: week.filter((item) => item.status === "On Schedule").length,
  };
}

function recordSleepDay() {
  const actualBedtime = prompt("Actual bedtime (HH:MM)", workspaceData.sleep.profile.targetBedtime) || workspaceData.sleep.profile.targetBedtime;
  const actualWakeTime = prompt("Actual wake-up time (HH:MM)", workspaceData.sleep.profile.targetWakeTime) || workspaceData.sleep.profile.targetWakeTime;
  const targetMinutes = timeToMinutes(workspaceData.sleep.profile.targetBedtime);
  const actualMinutes = timeToMinutes(actualBedtime);
  const delta = circularMinuteDelta(actualMinutes, targetMinutes);
  const status = delta <= 30 ? "On Schedule" : "Off Schedule";
  const today = todayIso();
  const entry = {
    date: today,
    targetBedtime: workspaceData.sleep.profile.targetBedtime,
    targetWakeTime: workspaceData.sleep.profile.targetWakeTime,
    actualBedtime,
    actualWakeTime,
    status,
  };
  workspaceData.sleep.history = workspaceData.sleep.history.filter((item) => item.date !== today).concat(entry);
  updateSleepStats();
  persistWorkspace();
}

function updateSleepStats() {
  const consistency = sleepConsistency();
  const weekly = sleepWeeklySummary();
  workspaceData.sleep.stats = {
    updatedAt: new Date().toISOString(),
    currentStreak: consistency.currentStreak,
    bestStreak: consistency.bestStreak,
    last7: consistency.last7,
    last30: consistency.last30,
    weekly,
  };
}

function sleepCountdownCard(item) {
  const checked = sleepChecklist().find((check) => item.id.includes(check.id))?.checked;
  const status = item.msRemaining > 0 ? item.remaining : checked ? "Completed" : "Missed";
  return `<article class="workspace-panel sleep-countdown-card"><span class="stat-label">${escapeHtml(item.label)}</span><h2>${escapeHtml(status)}</h2><p>${escapeHtml(item.timeLabel)}</p></article>`;
}

function sleepTimelineRow(item) {
  return `<div class="sleep-timeline-row"><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.timeLabel)}</strong><small>${escapeHtml(item.msRemaining > 0 ? item.remaining : "Passed")}</small></div>`;
}

function sleepChecklistRow(item) {
  return `<label class="sleep-check-row"><input type="checkbox" data-sleep-check="${item.id}" ${item.checked ? "checked" : ""} /> <span>${escapeHtml(item.label)}</span></label>`;
}

function sleepHistoryRow(item) {
  return `<div class="sleep-history-row"><strong>${escapeHtml(formatDateLabel(item.date))}</strong><span>Target ${escapeHtml(timeLabel(item.targetBedtime))}</span><span>Actual ${escapeHtml(timeLabel(item.actualBedtime))}</span><small>${escapeHtml(item.status)}</small></div>`;
}

function formatClock(date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function timeLabel(value) {
  return formatClock(sleepDateForTime(value, new Date("2026-01-01T12:00:00")));
}

function timeRemainingLabel(date, now = new Date()) {
  const diff = date - now;
  return diff >= 0 ? `${durationLabel(diff)} until sleep` : `${durationLabel(Math.abs(diff))} past bedtime`;
}

function durationLabel(ms) {
  const totalMinutes = Math.max(0, Math.round(ms / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (!hours) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

function timeToMinutes(value) {
  const [hours, minutes] = String(value || "00:00").split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

function circularMinuteDelta(a, b) {
  const diff = Math.abs(a - b);
  return Math.min(diff, 1440 - diff);
}

function averageTimeLabel(values) {
  if (!values.length) return "";
  const avg = Math.round(values.reduce((total, value) => total + timeToMinutes(value), 0) / values.length);
  return timeLabel(`${String(Math.floor(avg / 60) % 24).padStart(2, "0")}:${String(avg % 60).padStart(2, "0")}`);
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
  ensureFocusGoal();
  const goals = goalHealth();
  const focus = goals.find((goal) => goal.focus && goal.status === "Active") || goals.find((goal) => goal.status === "Active");
  const recommendations = goalRecommendations(goals);
  const achievements = goals.filter((goal) => goal.status === "Completed");
  const activeGoals = goals.filter((goal) => goal.status === "Active");
  const openGoal = goals.find((goal) => goal.id === workspaceData.goals.openGoal && goal.status !== "Archived") || focus;
  return `
    <section class="module-app">
      <div class="module-command">
        <div>
          <span class="stat-label">Goals</span>
          <h2>Choose the next outcome, then move one milestone.</h2>
          <p>Forma keeps goals oriented around the focus goal, active outcomes, and the next action.</p>
        </div>
        <strong class="metric">${averageGoalProgress()}%</strong>
      </div>
      <section id="focus-goal" class="goal-section">
        <div class="section-head"><span class="stat-label">Focus Goal</span><h2>Top priority</h2></div>
        ${focus ? focusGoalMarkup(focus) : compactGoalEmpty("No active goals yet", "Create one goal to give Forma a focus.")}
      </section>
      <section id="active-goals" class="goal-section">
        <div class="section-head"><span class="stat-label">Active Goals</span><h2>Current outcomes</h2></div>
        ${activeGoals.length ? `<div class="active-goal-grid">${activeGoals.map(activeGoalCardMarkup).join("")}</div>` : compactGoalEmpty("No active goals yet", "Create a goal or use a template to start.")}
      </section>
      ${openGoal ? goalDetailMarkup(openGoal) : ""}
      <section class="goal-layout">
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Create Goal</span><h2>Start with the outcome</h2></div>
          <form class="goal-form" data-form="goal">
            <input name="id" type="hidden" />
            <input name="title" placeholder="Goal title" />
            <textarea name="description" rows="3" placeholder="Description"></textarea>
            <input name="category" placeholder="Category" />
            <input name="targetDate" type="date" value="${todayIso(90)}" />
            <select name="priority"><option>Critical</option><option>High</option><option selected>Medium</option><option>Low</option></select>
            <button class="button primary">Save goal</button>
          </form>
          <div class="template-list goal-template-list">${workspaceData.goals.templates.map((template) => `<button data-goal-template="${escapeHtml(template.name)}">${escapeHtml(template.name)}</button>`).join("")}</div>
        </article>
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Recommendations</span><h2>Goal guidance</h2></div>
          <div class="finance-insight-list">${recommendations.length ? recommendations.map(financeInsightMarkup).join("") : compactGoalEmpty("No urgent goal issues", "Active goals have next actions and milestone structure.")}</div>
        </article>
      </section>
      <section id="goal-achievements" class="goal-layout goal-section">
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Completed Goals</span><h2>Achievements</h2></div>
          <div class="goal-achievement-list">${achievements.length ? achievements.map(achievementMarkup).join("") : compactGoalEmpty("No completed goals yet", "Completed goals appear here with completion date and milestone count.")}</div>
        </article>
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Goal History</span><h2>Recent movement</h2></div>
          <div class="notes-timeline">${goalTimeline(goals).map(timelineMarkup).join("") || compactGoalEmpty("No goal history yet", "Create goals and complete milestones to build history.")}</div>
        </article>
      </section>
    </section>
  `;
}

function focusGoalMarkup(goal) {
  const progress = goalProgress(goal);
  return `
    <article class="workspace-panel focus-goal-panel goal-card">
      <div class="goal-system-head">
        <div>
          <h2>${escapeHtml(goal.title)}</h2>
          <p>Deadline: ${escapeHtml(formatDateLabel(goal.targetDate))}</p>
        </div>
        <span class="status-badge">Focus</span>
      </div>
      ${goalProgressMarkup(goal)}
      ${nextActionMarkup(goal)}
      ${goalMilestonesMarkup(goal)}
      <div class="goal-actions">
        <button data-open-goal="${goal.id}">Open</button>
        <button data-edit-goal="${goal.id}">Edit</button>
        <button data-delete-goal="${goal.id}" class="danger-button">Delete</button>
      </div>
    </article>
  `;
}

function activeGoalCardMarkup(goal) {
  return `
    <article class="workspace-panel active-goal-card">
      <div>
        <span class="stat-label">${escapeHtml(goal.priority)}</span>
        <h2>${escapeHtml(goal.title)}</h2>
        <p>Deadline: ${escapeHtml(formatDateLabel(goal.targetDate))}</p>
      </div>
      ${goalProgressMarkup(goal)}
      <p><strong>Next action:</strong> ${escapeHtml(goal.nextAction || "Set the next action")}</p>
      <div class="goal-actions">
        <button data-open-goal="${goal.id}">Open</button>
        <button data-edit-goal="${goal.id}">Edit</button>
        <button data-delete-goal="${goal.id}" class="danger-button">Delete</button>
        <button data-focus-goal="${goal.id}">${goal.focus ? "Focus Goal" : "Set as Focus Goal"}</button>
      </div>
    </article>
  `;
}

function goalDetailMarkup(goal) {
  return `
    <section class="goal-section">
      <div class="section-head"><span class="stat-label">Open Goal</span><h2>${escapeHtml(goal.title)}</h2></div>
      <article class="workspace-panel goal-card">
        <div class="goal-meta-row">
          <span>Status: ${escapeHtml(goal.status)}</span>
          <span>Priority: ${escapeHtml(goal.priority)}</span>
          <span>Deadline: ${escapeHtml(formatDateLabel(goal.targetDate))}</span>
        </div>
        ${nextActionMarkup(goal, true)}
        ${goalMilestonesMarkup(goal)}
        <form class="milestone-form" data-form="milestone" data-goal-id="${goal.id}">
          <input name="title" placeholder="Milestone title" />
          <input name="description" placeholder="Description" />
          <input name="dueDate" type="date" value="${todayIso(14)}" />
          <button class="button">Add milestone</button>
        </form>
        <details class="goal-disclosure">
          <summary>Goal History</summary>
          <div class="notes-timeline">${goalTimeline([goal]).map(timelineMarkup).join("") || compactGoalEmpty("No goal history yet", "Goal events appear here automatically.")}</div>
        </details>
        <div class="goal-actions">
          <button data-focus-goal="${goal.id}">${goal.focus ? "Focus Goal" : "Set as Focus Goal"}</button>
          <button data-toggle-goal-status="${goal.id}" data-status="${goal.status === "Paused" ? "Active" : "Paused"}">${goal.status === "Paused" ? "Resume" : "Pause"}</button>
          <button data-toggle-goal-status="${goal.id}" data-status="Completed">Complete</button>
          <button data-delete-goal="${goal.id}" class="danger-button">Delete</button>
        </div>
      </article>
    </section>
  `;
}

function goalProgressMarkup(goal) {
  const progress = goalProgress(goal);
  const completed = goal.milestones.filter((milestone) => milestone.completed).length;
  const total = goal.milestones.length;
  return `
    <div class="goal-progress-block">
      <div>
        <span class="stat-label">Milestone Progress</span>
        <strong>${progress}%</strong>
        <small>${completed}/${total} milestones completed (${progress}%)</small>
      </div>
      <div class="meter"><span style="--fill: ${clamp(progress, 0, 100)}%"></span></div>
    </div>
  `;
}

function nextActionMarkup(goal, editable = false) {
  return `
    <div class="goal-next-action ${goal.nextAction?.trim() ? "" : "needs-input"}">
      <span class="stat-label">Next Action</span>
      <p>${goal.nextAction?.trim() ? escapeHtml(goal.nextAction) : "Set one concrete next action."}</p>
      ${editable ? `<form class="inline-form" data-form="goal-next-action" data-goal-id="${goal.id}"><input name="nextAction" value="${escapeHtml(goal.nextAction || "")}" placeholder="Update next action" /><button class="button">Save</button></form>` : ""}
    </div>
  `;
}

function goalMilestonesMarkup(goal) {
  return `
    <div class="goal-block">
      <div class="section-head compact"><span class="stat-label">Milestones</span><h2>Progress steps</h2></div>
      ${goal.milestones.length ? `<div class="milestone-list">${goal.milestones.map((milestone, index) => milestoneMarkup(goal, milestone, index)).join("")}</div>` : compactGoalEmpty("No milestones yet", "Add the first milestone after creating the goal.")}
    </div>
  `;
}

function compactGoalEmpty(title, body) {
  return `<div class="goal-empty-compact"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(body)}</span></div>`;
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

function milestoneMarkup(goal, milestone, index = 0) {
  const due = dueDateState(milestone.dueDate);
  return `
    <div class="milestone-card ${milestone.completed ? "done" : ""} due-${due.state}">
      <label><input type="checkbox" data-toggle-milestone="${goal.id}" data-milestone-id="${milestone.id}" ${milestone.completed ? "checked" : ""} /> <strong>${escapeHtml(milestone.title)}</strong></label>
      <span>${escapeHtml(milestone.description || "No description")}</span>
      <small>Due ${escapeHtml(due.label)} / ${escapeHtml(due.remainingLabel)}</small>
      <div class="goal-actions">
        <button data-move-milestone="${goal.id}" data-milestone-id="${milestone.id}" data-direction="up" ${index === 0 ? "disabled" : ""}>Up</button>
        <button data-move-milestone="${goal.id}" data-milestone-id="${milestone.id}" data-direction="down" ${index === goal.milestones.length - 1 ? "disabled" : ""}>Down</button>
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
  const todayHabits = habitsForToday();
  const dashboard = habitsDashboard(todayHabits);
  const habit = recommendedHabit();
  const review = weeklyHabitReview();
  return `
    <section class="module-app">
      <div class="module-command">
        <div>
          <span class="stat-label">Habits</span>
          <h2>${dashboard.completed ? "Consistency is active today." : "Recovery starts with one useful habit."}</h2>
          <p>${escapeHtml(habit.reason)}</p>
        </div>
        <strong class="metric">${dashboard.percent}%</strong>
      </div>
      <section class="habit-dashboard-grid">
        ${financeMetricMarkup("Today's Completion", `${dashboard.completed}/${dashboard.total}`, `${dashboard.percent}% complete`)}
        ${financeMetricMarkup("Current Streak", `${dashboard.currentStreak}`, "best active streak")}
        ${financeMetricMarkup("Best Streak", `${dashboard.bestStreak}`, "all habits")}
        ${financeMetricMarkup("Consistency", `${dashboard.consistency}%`, "30-day average")}
      </section>
      <section class="module-grid">
        <article class="workspace-panel large-panel">
          <div class="section-head">
            <span class="stat-label">Today's habits</span>
            <h2>Complete the loop</h2>
          </div>
          <div class="habit-list">${todayHabits.length ? todayHabits.map(habitMarkup).join("") : compactGoalEmpty(workspaceData.habits.items.length ? "No habits scheduled today." : "No habits yet.", workspaceData.habits.items.length ? "Create a daily habit or adjust frequency." : "Create your first habit.")}</div>
        </article>
        <aside class="workspace-panel">
          <span class="stat-label">Next Best Habit</span>
          <h2>${escapeHtml(habit.name)}</h2>
          <p>${escapeHtml(habit.progressLabel || habit.recovery)}</p>
          <p>${escapeHtml(habit.recovery)}</p>
        </aside>
      </section>
      <section class="habit-layout">
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Create / Edit</span><h2>Habit setup</h2></div>
          <form class="habit-form" data-form="habit">
            <input name="id" type="hidden" />
            <input name="name" placeholder="Habit name" />
            <input name="category" placeholder="Category" />
            <select name="type" aria-label="Habit type"><option value="checkbox">Checkbox</option><option value="count">Count</option><option value="time">Time</option></select>
            <select name="frequency" aria-label="Frequency"><option value="daily">Daily</option><option value="weekdays">Weekdays</option><option value="specific">Specific days</option><option value="weekly">X times per week</option></select>
            <input name="target" type="number" min="1" placeholder="Target" value="1" />
            <input name="unit" placeholder="Unit, e.g. ml, steps, min" />
            <input name="specificDays" placeholder="Specific days, e.g. Mon, Wed, Fri" />
            <input name="timesPerWeek" type="number" min="1" max="7" placeholder="Times per week" />
            <button class="button primary">Save habit</button>
          </form>
        </article>
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Weekly Review</span><h2>Consistency check</h2></div>
          <div class="habit-review-list">
            ${habitReviewRow("Best habit", review.best)}
            ${habitReviewRow("Worst habit", review.worst)}
            ${habitReviewRow("Most improved", review.improved)}
          </div>
        </article>
      </section>
      <section class="habit-layout">
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Habit Stacks</span><h2>Grouped routines</h2></div>
          <form class="habit-form compact" data-form="habit-stack">
            <input name="name" placeholder="Stack name, e.g. Morning Routine" />
            <select name="habitIds" multiple aria-label="Stack habits">${workspaceData.habits.items.map((item) => `<option value="${item.id}">${escapeHtml(item.name)}</option>`).join("")}</select>
            <button class="button primary">Save stack</button>
          </form>
          <div class="habit-stack-list">${workspaceData.habits.stacks.length ? workspaceData.habits.stacks.map(habitStackMarkup).join("") : compactGoalEmpty("No habit stacks yet.", "Group habits like Water, Creatine, and Vitamins.")}</div>
        </article>
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Recovery</span><h2>Rebuild without drama</h2></div>
          <div class="finance-insight-list">${habitRecoveryRecommendations().map(financeInsightMarkup).join("") || compactGoalEmpty("No recovery issues.", "Your habits are stable enough today.")}</div>
        </article>
      </section>
    </section>
  `;
}

function recommendedHabit() {
  const next = habitsForToday().filter((item) => !habitCompleteToday(item)).sort((a, b) => habitConsistency(a, 7) - habitConsistency(b, 7))[0] || habitsForToday()[0] || workspaceData.habits.items[0];
  if (!next) return { name: "Add one habit", reason: "No routine exists yet.", recovery: "Start with the smallest repeatable action." };
  const stats = habitStats(next);
  if (stats.health === "At Risk") return { name: next.name, reason: `${next.name} needs the most recovery.`, recovery: "Reduce the target or complete the smallest version today.", progressLabel: habitProgressLabel(next) };
  return { name: next.name, reason: `${stats.currentStreak} day streak is worth protecting.`, recovery: "Keep the loop alive before adding more habits.", progressLabel: habitProgressLabel(next) };
}

function habitsForToday() {
  return workspaceData.habits.items.filter((habit) => habitScheduledOn(habit, new Date()));
}

function habitScheduledOn(habit, date) {
  const day = date.getDay();
  if (habit.frequency === "weekdays") return day >= 1 && day <= 5;
  if (habit.frequency === "specific") return habit.specificDays.includes(day);
  return true;
}

function habitTodayEntry(habit) {
  const today = todayIso();
  habit.history[today] = habit.history[today] || { value: 0, completed: false };
  return habit.history[today];
}

function habitTodayValue(habit) {
  return numberOrZero(habit.history?.[todayIso()]?.value);
}

function habitCompleteToday(habit) {
  const entry = habit.history?.[todayIso()];
  return Boolean(entry?.completed) || habitTodayValue(habit) >= numberOrZero(habit.target);
}

function habitProgressPercent(habit) {
  return clamp(Math.round((habitTodayValue(habit) / Math.max(1, numberOrZero(habit.target))) * 100), 0, 100);
}

function habitProgressLabel(habit) {
  if (habit.type === "checkbox") return habitCompleteToday(habit) ? "Done" : "Not done";
  return `${habitTodayValue(habit)} / ${numberOrZero(habit.target)} ${escapeHtml(habit.unit)}`;
}

function habitsDashboard(todayHabits = habitsForToday()) {
  const completed = todayHabits.filter(habitCompleteToday).length;
  const total = todayHabits.length;
  const stats = workspaceData.habits.items.map(habitStats);
  return {
    completed,
    total,
    percent: total ? Math.round((completed / total) * 100) : 0,
    currentStreak: Math.max(...stats.map((item) => item.currentStreak), 0),
    bestStreak: Math.max(...stats.map((item) => item.bestStreak), 0),
    consistency: stats.length ? Math.round(stats.reduce((totalValue, item) => totalValue + item.consistency30, 0) / stats.length) : 0,
  };
}

function habitStats(habit) {
  const consistency7 = habitConsistency(habit, 7);
  const consistency30 = habitConsistency(habit, 30);
  return {
    currentStreak: habitCurrentStreak(habit),
    bestStreak: habitBestStreak(habit),
    consistency7,
    consistency30,
    health: consistency30 >= 90 ? "Strong" : consistency30 >= 70 ? "Stable" : "At Risk",
  };
}

function habitConsistency(habit, days) {
  let scheduled = 0;
  let completed = 0;
  for (let offset = 0; offset < days; offset += 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    if (!habitScheduledOn(habit, date)) continue;
    scheduled += 1;
    if (habitCompletedOn(habit, localIsoDate(date))) completed += 1;
  }
  return scheduled ? Math.round((completed / scheduled) * 100) : 0;
}

function habitCompletedOn(habit, dateKey) {
  const entry = habit.history?.[dateKey];
  return Boolean(entry?.completed) || numberOrZero(entry?.value) >= numberOrZero(habit.target);
}

function habitCurrentStreak(habit) {
  let streak = 0;
  for (let offset = 0; offset < 120; offset += 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    if (!habitScheduledOn(habit, date)) continue;
    if (!habitCompletedOn(habit, localIsoDate(date))) break;
    streak += 1;
  }
  return streak;
}

function habitBestStreak(habit) {
  let best = 0;
  let current = 0;
  for (let offset = 119; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    if (!habitScheduledOn(habit, date)) continue;
    if (habitCompletedOn(habit, localIsoDate(date))) {
      current += 1;
      best = Math.max(best, current);
    } else {
      current = 0;
    }
  }
  return best;
}

function weeklyHabitReview() {
  const scored = workspaceData.habits.items.map((habit) => ({ habit, percent: habitConsistency(habit, 7), previous: previousHabitConsistency(habit, 7) }));
  const byPercent = scored.slice().sort((a, b) => b.percent - a.percent);
  const improved = scored.slice().sort((a, b) => (b.percent - b.previous) - (a.percent - a.previous))[0];
  return { best: byPercent[0], worst: byPercent.at(-1), improved };
}

function previousHabitConsistency(habit, days) {
  let scheduled = 0;
  let completed = 0;
  for (let offset = days; offset < days * 2; offset += 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    if (!habitScheduledOn(habit, date)) continue;
    scheduled += 1;
    if (habitCompletedOn(habit, localIsoDate(date))) completed += 1;
  }
  return scheduled ? Math.round((completed / scheduled) * 100) : 0;
}

function habitRecoveryRecommendations() {
  return workspaceData.habits.items
    .map((habit) => ({ habit, missed: missedHabitCount(habit, 5), stats: habitStats(habit) }))
    .filter((item) => item.missed >= 2 || item.stats.health === "At Risk")
    .map((item) => ({ type: "warning", title: `${item.habit.name} needs recovery`, body: `${item.habit.name} missed ${item.missed} of the last 5 scheduled days. Reduce target or rebuild consistency.` }))
    .slice(0, 4);
}

function mostAtRiskHabit() {
  return workspaceData.habits.items
    .map((habit) => ({ habit, stats: habitStats(habit) }))
    .filter((item) => item.stats.health === "At Risk")
    .sort((a, b) => a.stats.consistency30 - b.stats.consistency30)[0]?.habit || null;
}

function missedHabitCount(habit, days) {
  let missed = 0;
  for (let offset = 0; offset < days; offset += 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    if (habitScheduledOn(habit, date) && !habitCompletedOn(habit, localIsoDate(date))) missed += 1;
  }
  return missed;
}

function habitReviewRow(label, item) {
  if (!item) return compactGoalEmpty(label, "No habit data yet.");
  return `<div class="habit-review-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(item.habit.name)}</strong><small>${item.percent}% completion</small></div>`;
}

function habitStackMarkup(stack) {
  const habits = stack.habitIds.map((id) => workspaceData.habits.items.find((habit) => habit.id === id)).filter(Boolean);
  const done = habits.filter(habitCompleteToday).length;
  return `
    <div class="habit-stack-card">
      <div><strong>${escapeHtml(stack.name)}</strong><span>${done}/${habits.length} complete</span></div>
      <div class="habit-actions">
        <button data-complete-stack="${stack.id}">Complete stack</button>
        <button data-delete-stack="${stack.id}" class="danger-button">Delete</button>
      </div>
    </div>
  `;
}

function habitMarkup(habit) {
  const stats = habitStats(habit);
  const progress = habitProgressPercent(habit);
  return `
    <article class="habit-card ${habitCompleteToday(habit) ? "complete" : ""}">
      <div class="habit-card-head">
        <div>
          <span class="stat-label">${escapeHtml(habit.category)} / ${escapeHtml(stats.health)}</span>
          <h3>${escapeHtml(habit.name)}</h3>
        </div>
        <strong>${habitProgressLabel(habit)}</strong>
      </div>
      <div class="meter"><span style="--fill: ${progress}%"></span></div>
      <div class="habit-card-meta">
        <span>Target: ${escapeHtml(habit.type === "checkbox" ? "Done / Not Done" : `${habit.target} ${habit.unit}`)}</span>
        <span>Streak: ${stats.currentStreak}</span>
        <span>7-day: ${stats.consistency7}%</span>
        <span>30-day: ${stats.consistency30}%</span>
      </div>
      <div class="habit-actions">
        ${habit.type === "checkbox" ? `<button data-habit-toggle="${habit.id}">${habitCompleteToday(habit) ? "Uncomplete" : "Complete"}</button>` : `<input data-habit-progress="${habit.id}" type="number" min="0" value="${habitTodayValue(habit)}" aria-label="${escapeHtml(habit.name)} progress" /><button data-habit-fill="${habit.id}">Complete</button><button data-habit-clear="${habit.id}">Uncomplete</button>`}
        <button data-edit-habit="${habit.id}">Edit</button>
        <button data-delete-habit="${habit.id}" class="danger-button">Delete</button>
      </div>
    </article>
  `;
}

function renderTasks() {
  const dashboard = taskDashboard();
  const focus = currentFocusTask();
  const today = todayTasks();
  const inbox = inboxTasks();
  const completed = completedTasks();
  return `
    <section class="module-app">
      <div class="module-command">
        <div>
          <span class="stat-label">Tasks</span>
          <h2>${dashboard.overdue ? "Clear the overdue pressure first." : "The next action is visible."}</h2>
          <p>Forma sorts tasks by urgency, priority, and connections so execution stays obvious.</p>
        </div>
        <strong class="metric">${dashboard.completionRate}%</strong>
      </div>
      <form class="workspace-panel task-quick-add" data-form="task-quick">
        <input name="title" placeholder="Quick add task, e.g. Buy football gloves" />
        <button class="button primary">Add</button>
      </form>
      <section class="task-dashboard-grid">
        ${financeMetricMarkup("Tasks Due Today", String(dashboard.dueToday), "today")}
        ${financeMetricMarkup("Overdue Tasks", String(dashboard.overdue), "needs action")}
        ${financeMetricMarkup("Completed Today", String(dashboard.completedToday), "finished")}
        ${financeMetricMarkup("Completion Rate", `${dashboard.completionRate}%`, "today")}
      </section>
      ${focus ? taskFocusMarkup(focus) : compactGoalEmpty("No current focus task.", "Set a task as Current Focus to keep it visible.")}
      <section class="task-layout">
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Today</span><h2>Most important tasks</h2></div>
          <div class="task-card-list">${today.length ? today.map(taskCardMarkup).join("") : compactGoalEmpty("No tasks due today.", "Use Quick Add or schedule a task.")}</div>
        </article>
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Recommendations</span><h2>Execution guidance</h2></div>
          <div class="finance-insight-list">${taskRecommendations().map(financeInsightMarkup).join("") || compactGoalEmpty("No task issues.", "Your task system is clear.")}</div>
        </article>
      </section>
      <section class="task-layout">
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Create / Edit</span><h2>Task details</h2></div>
          <form class="task-form" data-form="task">
            <input name="id" type="hidden" />
            <input name="title" placeholder="Task title" />
            <textarea name="description" rows="3" placeholder="Description"></textarea>
            <input name="dueDate" type="date" />
            <select name="priority"><option>Critical</option><option>High</option><option selected>Medium</option><option>Low</option></select>
            <input name="category" placeholder="Category" />
            <input name="estimatedTime" type="number" min="1" placeholder="Estimated time, minutes" />
            <select name="status"><option>Not Started</option><option>In Progress</option><option>Completed</option><option>Cancelled</option></select>
            <select name="goalConnections" multiple aria-label="Connected goals">${workspaceData.goals.items.map((goal) => `<option value="${goal.id}">${escapeHtml(goal.title)}</option>`).join("")}</select>
            <select name="habitConnections" multiple aria-label="Connected habits">${workspaceData.habits.items.map((habit) => `<option value="${habit.id}">${escapeHtml(habit.name)}</option>`).join("")}</select>
            <select name="noteConnections" multiple aria-label="Connected notes">${workspaceData.notes.items.map((note) => `<option value="${note.id}">${escapeHtml(note.title)}</option>`).join("")}</select>
            <button class="button primary">Save task</button>
          </form>
        </article>
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Inbox</span><h2>Unorganized capture</h2></div>
          <div class="task-card-list">${inbox.length ? inbox.map(taskCardMarkup).join("") : compactGoalEmpty("Inbox is empty.", "Quick added tasks land here first.")}</div>
        </article>
      </section>
      <section class="task-lanes">${["must", "should", "later"].map((tier) => taskLane(tier)).join("")}</section>
      <section class="task-layout">
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Recurring Tasks</span><h2>Repeatable work</h2></div>
          <form class="task-form compact" data-form="recurring-task">
            <input name="id" type="hidden" />
            <input name="title" placeholder="Weekly Review" />
            <select name="weekday">${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, index) => `<option value="${index}">${day}</option>`).join("")}</select>
            <select name="priority"><option>Critical</option><option>High</option><option selected>Medium</option><option>Low</option></select>
            <input name="estimatedTime" type="number" min="1" placeholder="Estimated minutes" />
            <button class="button primary">Save recurring task</button>
          </form>
          <div class="task-card-list">${workspaceData.tasks.recurring.length ? workspaceData.tasks.recurring.map(recurringTaskMarkup).join("") : compactGoalEmpty("No recurring tasks yet.", "Create weekly routines like review or trash day.")}</div>
        </article>
        <article class="workspace-panel">
          <div class="section-head"><span class="stat-label">Completed</span><h2>Finished tasks</h2></div>
          <div class="task-card-list">${completed.length ? completed.map(completedTaskMarkup).join("") : compactGoalEmpty("No completed tasks.", "Completed tasks appear here with completion date.")}</div>
        </article>
      </section>
      <section class="workspace-panel">
        <div class="section-head"><span class="stat-label">Weekly View</span><h2>Scheduled tasks</h2></div>
        <div class="weekly-task-grid">${weeklyTaskMarkup()}</div>
      </section>
    </section>
  `;
}

function taskFocusMarkup(task) {
  return `
    <article class="workspace-panel task-focus-card">
      <div>
        <span class="stat-label">Current Focus</span>
        <h2>${escapeHtml(task.title)}</h2>
        <p>${escapeHtml(taskDueLabel(task.dueDate))} / ${numberOrZero(task.estimatedTime)} min</p>
      </div>
      <div class="task-actions">
        <button data-edit-task="${task.id}">Edit</button>
        <button data-task-complete="${task.id}">${task.status === "Completed" ? "Uncomplete" : "Complete"}</button>
      </div>
    </article>
  `;
}

function taskLane(tier) {
  const labels = { must: "Must Do", should: "Should Do", later: "Later" };
  const items = sortedTasks().filter((task) => taskTier(task) === tier && !["Completed", "Cancelled"].includes(task.status));
  return `
    <section class="task-lane">
      <span class="stat-label">${labels[tier]}</span>
      ${items.length ? items.map(taskCardMarkup).join("") : compactGoalEmpty(`No ${labels[tier].toLowerCase()} tasks.`, "Nothing belongs here right now.")}
    </section>
  `;
}

function taskCardMarkup(task) {
  const health = taskHealth(task);
  return `
    <article class="task-card priority-${task.priority.toLowerCase()} health-${health.toLowerCase().replace(" ", "-")}">
      <div class="task-card-head">
        <div>
          <span class="stat-label">${escapeHtml(health)} / ${escapeHtml(task.priority)}</span>
          <h3>${escapeHtml(task.title)}</h3>
        </div>
        <input type="checkbox" data-task-toggle="${task.id}" ${task.status === "Completed" ? "checked" : ""} />
      </div>
      <p>${escapeHtml(taskDueLabel(task.dueDate))} / ${numberOrZero(task.estimatedTime)} min</p>
      ${taskConnectionMarkup(task)}
      <div class="task-actions">
        <button data-focus-task="${task.id}">${task.focus ? "Focused" : "Set Focus"}</button>
        <button data-edit-task="${task.id}">Edit</button>
        <button data-delete-task="${task.id}" class="danger-button">Delete</button>
      </div>
    </article>
  `;
}

function completedTaskMarkup(task) {
  return `
    <article class="task-card complete">
      <div><strong>${escapeHtml(task.title)}</strong><p>Completed ${escapeHtml(formatDateLabel(task.completedAt))} / Original due ${escapeHtml(task.dueDate ? formatDateLabel(task.dueDate) : "No due date")}</p></div>
      <button data-delete-task="${task.id}" class="danger-button">Delete</button>
    </article>
  `;
}

function recurringTaskMarkup(task) {
  return `
    <article class="task-card">
      <div><strong>${escapeHtml(task.title)}</strong><p>Every ${escapeHtml(dayName(task.weekday))} / ${numberOrZero(task.estimatedTime)} min</p></div>
      <div class="task-actions">
        <button data-edit-recurring-task="${task.id}">Edit</button>
        <button data-delete-recurring-task="${task.id}" class="danger-button">Delete</button>
      </div>
    </article>
  `;
}

function taskConnectionMarkup(task) {
  const goals = task.connections.goals.map((id) => workspaceData.goals.items.find((goal) => goal.id === id)?.title).filter(Boolean);
  const habits = task.connections.habits.map((id) => workspaceData.habits.items.find((habit) => habit.id === id)?.name).filter(Boolean);
  const notes = task.connections.notes.map((id) => workspaceData.notes.items.find((note) => note.id === id)?.title).filter(Boolean);
  const chips = [...goals, ...habits, ...notes].slice(0, 4);
  return chips.length ? `<div class="task-connections">${chips.map((chip) => `<span>${escapeHtml(chip)}</span>`).join("")}</div>` : "";
}

function weeklyTaskMarkup() {
  return [1, 2, 3, 4, 5, 6, 0].map((day) => {
    const tasks = sortedTasks().filter((task) => task.dueDate && parseLocalDate(task.dueDate).getDay() === day && !["Completed", "Cancelled"].includes(task.status));
    const recurring = workspaceData.tasks.recurring.filter((task) => task.active !== false && Number(task.weekday) === day);
    return `<section class="weekly-task-day"><span class="stat-label">${dayName(day)}</span>${[...tasks.map(taskMiniMarkup), ...recurring.map((task) => `<div class="task-mini recurring">${escapeHtml(task.title)}</div>`)].join("") || compactGoalEmpty("Clear", "No scheduled tasks.")}</section>`;
  }).join("");
}

function taskMiniMarkup(task) {
  return `<div class="task-mini ${task.priority.toLowerCase()}">${escapeHtml(task.title)}<small>${escapeHtml(taskDueLabel(task.dueDate))}</small></div>`;
}

function activeTasks() {
  return workspaceData.tasks.items.filter((task) => !["Completed", "Cancelled"].includes(task.status));
}

function sortedTasks() {
  const priorityWeight = { Critical: 4, High: 3, Medium: 2, Low: 1 };
  return activeTasks().slice().sort((a, b) => {
    const dateA = a.dueDate ? parseLocalDate(a.dueDate).getTime() : Infinity;
    const dateB = b.dueDate ? parseLocalDate(b.dueDate).getTime() : Infinity;
    if (dateA !== dateB) return dateA - dateB;
    if (priorityWeight[b.priority] !== priorityWeight[a.priority]) return priorityWeight[b.priority] - priorityWeight[a.priority];
    return connectionCount(b) - connectionCount(a);
  });
}

function taskTier(task) {
  if (task.tier && task.tier !== "inbox") return task.tier;
  const health = taskHealth(task);
  if (task.priority === "Critical" || health === "Overdue" || dueDays(task.dueDate) <= 1) return "must";
  if (task.priority === "High" || dueDays(task.dueDate) <= 3 || connectionCount(task)) return "should";
  return "later";
}

function taskDashboard() {
  const today = todayIso();
  const dueToday = activeTasks().filter((task) => task.dueDate === today).length;
  const overdue = activeTasks().filter((task) => taskHealth(task) === "Overdue").length;
  const completedToday = workspaceData.tasks.items.filter((task) => task.status === "Completed" && String(task.completedAt || "").slice(0, 10) === today).length;
  const totalTouched = dueToday + completedToday;
  return {
    dueToday,
    overdue,
    completedToday,
    completionRate: totalTouched ? Math.round((completedToday / totalTouched) * 100) : 0,
  };
}

function todayTasks() {
  return sortedTasks().filter((task) => task.dueDate === todayIso() || taskHealth(task) === "Overdue" || task.priority === "Critical").slice(0, structureLimit() + 2);
}

function inboxTasks() {
  return activeTasks().filter((task) => task.tier === "inbox" && !task.dueDate);
}

function completedTasks() {
  return workspaceData.tasks.items.filter((task) => task.status === "Completed").sort((a, b) => String(b.completedAt).localeCompare(String(a.completedAt))).slice(0, 12);
}

function currentFocusTask() {
  return activeTasks().find((task) => task.focus) || todayTasks()[0] || activeTasks()[0] || null;
}

function taskHealth(task) {
  const days = dueDays(task.dueDate);
  if (days < 0) return "Overdue";
  if (days <= 2) return "Due Soon";
  return "On Track";
}

function dueDays(value) {
  if (!value) return 9999;
  const today = parseLocalDate(todayIso());
  const due = parseLocalDate(value);
  return Math.ceil((due - today) / 86400000);
}

function taskDueLabel(value) {
  if (!value) return "No due date";
  const days = dueDays(value);
  if (days === 0) return "Due Today";
  if (days === 1) return "Due Tomorrow";
  if (days < 0) return `Overdue by ${Math.abs(days)} ${Math.abs(days) === 1 ? "day" : "days"}`;
  return `${days} Days Left`;
}

function connectionCount(task) {
  return (task.connections.goals?.length || 0) + (task.connections.habits?.length || 0) + (task.connections.notes?.length || 0);
}

function taskRecommendations() {
  const recs = [];
  const overdue = activeTasks().filter((task) => taskHealth(task) === "Overdue").length;
  const critical = activeTasks().filter((task) => task.priority === "Critical").length;
  const inbox = inboxTasks().length;
  if (overdue) recs.push({ type: "warning", title: `${overdue} overdue ${overdue === 1 ? "task" : "tasks"}`, body: "Clear or reschedule overdue work before adding more." });
  if (!taskDashboard().dueToday) recs.push({ type: "info", title: "No tasks due today", body: "Choose one current focus task so execution still has direction." });
  if (critical > 3) recs.push({ type: "warning", title: "Too many critical tasks", body: "Lower the priority of anything that is not truly urgent." });
  if (inbox > 4) recs.push({ type: "info", title: "Inbox needs organizing", body: "Move captured tasks into Must Do, Should Do, or Later by adding dates and priorities." });
  return recs.slice(0, 4);
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
  const management = normalizeModuleManagement(config);
  const generated = management.generatedModuleIds;
  const available = moduleRegistry.filter((id) => !generated.includes(id));
  const enabled = management.enabledModuleIds;
  return `
    <section class="module-app">
      <div class="module-command">
        <div>
          <span class="stat-label">Settings</span>
          <h2>Customize Forma</h2>
          <p>Manage visible modules, choose the primary system, and restart the first-time guided tour.</p>
        </div>
        ${DEV_MODE_ENABLED && developerMode.unlocked ? `<strong class="developer-badge settings-dev-badge">Developer Mode</strong>` : ""}
      </div>
      <div class="settings-grid">
        <article class="workspace-panel large-panel settings-module-panel">
          <div class="section-head"><span class="stat-label">Module Management</span><h2>Generated Modules</h2></div>
          <div class="settings-module-list">${generated.length ? generated.map((id) => moduleToggleMarkup(id, enabled.includes(id), true)).join("") : compactGoalEmpty("No generated modules.", "Enable available modules below to shape your operating system.")}</div>
        </article>
        <aside class="workspace-panel">
          <div class="section-head"><span class="stat-label">Primary Module</span><h2>System priority</h2></div>
          <select class="settings-select" data-primary-module>
            ${enabled.map((id) => `<option value="${id}" ${management.primaryModule === id ? "selected" : ""}>${escapeHtml(moduleLabels[id])}</option>`).join("")}
          </select>
          <p>Controls the sidebar badge, Home priority, and welcome emphasis.</p>
          <button class="button primary settings-tour-button" data-action="restart-guided-tour">Restart Guided Tour</button>
          <button class="button settings-export" data-action="download">Export configuration</button>
        </aside>
      </div>
      <article class="workspace-panel settings-module-panel">
        <div class="section-head"><span class="stat-label">Available Modules</span><h2>Expandable system</h2></div>
        <div class="settings-module-list">${available.map((id) => moduleToggleMarkup(id, enabled.includes(id), false)).join("")}</div>
      </article>
      ${DEV_MODE_ENABLED ? renderDeveloperModePanel() : ""}
    </section>
  `;
}

function moduleToggleMarkup(moduleId, enabled, generated) {
  return `
    <div class="settings-module-row ${enabled ? "enabled" : ""}">
      <div>
        <strong>${enabled ? "[x]" : "[ ]"} ${escapeHtml(moduleLabels[moduleId])}</strong>
        <span>${generated ? "Generated by onboarding" : "Available to activate"}</span>
      </div>
      <button data-toggle-module="${moduleId}" aria-pressed="${enabled}">${enabled ? "Disable" : "Enable"}</button>
    </div>
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

function toggleModuleVisibility(moduleId) {
  if (!moduleLabels[moduleId]) return;
  const base = state.workspaceConfig || readJson(CONFIG_KEY, null) || generateWorkspaceConfig();
  const management = normalizeModuleManagement(base);
  const enabled = new Set(management.enabledModuleIds);
  if (enabled.has(moduleId)) enabled.delete(moduleId);
  else enabled.add(moduleId);
  const enabledModuleIds = Array.from(enabled).filter((id) => moduleLabels[id]);
  const primaryModule = enabledModuleIds.includes(management.primaryModule) ? management.primaryModule : enabledModuleIds[0] || "";
  const nextConfig = applyModuleManagement({
    ...base,
    moduleManagement: {
      generatedModuleIds: management.generatedModuleIds,
      enabledModuleIds,
      primaryModule,
    },
  });
  persistWorkspaceConfig(nextConfig);
  if (!workspaceTabs(nextConfig).some((tab) => tab.id === state.activeTab)) state.activeTab = "home";
  renderWorkspace();
}

function setPrimaryModule(moduleId) {
  if (!moduleLabels[moduleId]) return;
  const base = state.workspaceConfig || readJson(CONFIG_KEY, null) || generateWorkspaceConfig();
  const management = normalizeModuleManagement(base);
  if (!management.enabledModuleIds.includes(moduleId)) return;
  const nextConfig = applyModuleManagement({
    ...base,
    moduleManagement: {
      ...management,
      primaryModule: moduleId,
    },
  });
  persistWorkspaceConfig(nextConfig);
  renderWorkspace();
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
  bind("[data-action='restart-guided-tour']", "click", () => {
    startGuidedTour();
    renderWorkspace();
  });
  document.querySelectorAll("[data-toggle-module]").forEach((button) => {
    button.addEventListener("click", () => toggleModuleVisibility(button.dataset.toggleModule));
  });
  const primarySelect = document.querySelector("[data-primary-module]");
  if (primarySelect) {
    primarySelect.addEventListener("change", () => setPrimaryModule(primarySelect.value));
  }
  attachGuidedTourHandlers();
  bindForm("task-quick", (form) => {
    const title = form.elements.title.value.trim();
    if (!title) return;
    workspaceData.tasks.items.unshift(normalizeTask({ id: createId(), title, tier: "inbox", status: "Not Started", priority: "Medium" }));
    persistWorkspace();
  });
  bindForm("task", (form) => {
    const fields = form.elements;
    const title = fields.title.value.trim();
    if (!title) return;
    const existing = workspaceData.tasks.items.find((task) => task.id === fields.id.value);
    const status = fields.status.value;
    const task = normalizeTask({
      ...(existing || {}),
      id: existing?.id || createId(),
      title,
      description: fields.description.value.trim(),
      dueDate: fields.dueDate.value,
      priority: fields.priority.value,
      category: fields.category.value.trim() || "General",
      estimatedTime: numberOrZero(fields.estimatedTime.value) || 30,
      status,
      tier: existing?.tier || "inbox",
      focus: existing?.focus || false,
      completedAt: status === "Completed" ? existing?.completedAt || new Date().toISOString() : null,
      connections: {
        goals: selectedValues(fields.goalConnections),
        habits: selectedValues(fields.habitConnections),
        notes: selectedValues(fields.noteConnections),
      },
      updatedAt: new Date().toISOString(),
    });
    if (existing) workspaceData.tasks.items = workspaceData.tasks.items.map((item) => (item.id === task.id ? task : item));
    else workspaceData.tasks.items.unshift(task);
    persistWorkspace();
  });
  bindForm("recurring-task", (form) => {
    const fields = form.elements;
    const title = fields.title.value.trim();
    if (!title) return;
    const existing = workspaceData.tasks.recurring.find((task) => task.id === fields.id.value);
    const task = normalizeRecurringTask({
      ...(existing || {}),
      id: existing?.id || createId(),
      title,
      weekday: numberOrZero(fields.weekday.value),
      priority: fields.priority.value,
      estimatedTime: numberOrZero(fields.estimatedTime.value) || 30,
    });
    if (existing) workspaceData.tasks.recurring = workspaceData.tasks.recurring.map((item) => (item.id === task.id ? task : item));
    else workspaceData.tasks.recurring.push(task);
    persistWorkspace();
  });
  bindForm("sleep-profile", (form) => {
    workspaceData.sleep.profile.targetBedtime = form.elements.targetBedtime.value || "00:00";
    workspaceData.sleep.profile.targetWakeTime = form.elements.targetWakeTime.value || "08:00";
    persistWorkspace();
  });
  bindForm("health-profile", (form) => {
    workspaceData.health.profile = {
      age: form.elements.age.value,
      sex: form.elements.sex.value,
      weight: numberOrZero(form.elements.weight.value) || workspaceData.health.profile.weight,
      weightUnit: form.elements.weightUnit.value,
      activityLevel: form.elements.activityLevel.value,
    };
    const todayEntry = normalizeWeightEntry({ date: todayIso(), weight: workspaceData.health.profile.weight, unit: workspaceData.health.profile.weightUnit });
    const existing = workspaceData.health.weight.entries.find((entry) => entry.date === todayIso());
    if (existing) {
      existing.weight = todayEntry.weight;
      existing.unit = todayEntry.unit;
    } else {
      workspaceData.health.weight.entries.push(todayEntry);
    }
    persistHealthWorkspace();
  });
  bindForm("hydration-settings", (form) => {
    workspaceData.health.hydration.bottleSize = numberOrZero(form.elements.bottleSize.value) || 750;
    workspaceData.health.hydration.glassSize = numberOrZero(form.elements.glassSize.value) || 250;
    workspaceData.health.hydration.displayMode = form.elements.displayMode.value;
    workspaceData.health.hydration.manualGoal = numberOrZero(form.elements.manualGoal.value);
    persistHealthWorkspace();
  });
  bindForm("water-entry", (form) => {
    addHealthAmountEntry("water", numberOrZero(form.elements.amount.value), "Custom");
  });
  bindForm("caffeine-entry", (form) => {
    const defaults = { Coffee: 95, Espresso: 75, "Energy Drink": 160 };
    const type = form.elements.type.value;
    addHealthAmountEntry("caffeine", numberOrZero(form.elements.amount.value) || defaults[type] || 0, type);
  });
  bindForm("caffeine-average", (form) => {
    workspaceData.health.caffeine.averageDaily = numberOrZero(form.elements.averageDaily.value);
    persistHealthWorkspace();
  });
  bindForm("weight-entry", (form) => {
    const weight = numberOrZero(form.elements.weight.value);
    if (!weight) return;
    workspaceData.health.weight.entries.push(normalizeWeightEntry({ date: form.elements.date.value || todayIso(), weight, unit: form.elements.unit.value }));
    workspaceData.health.profile.weight = weight;
    workspaceData.health.profile.weightUnit = form.elements.unit.value;
    persistHealthWorkspace();
  });
  bindForm("supplement", (form) => saveHealthItem(form, "supplement"));
  bindForm("medication", (form) => saveHealthItem(form, "medication"));
  bindForm("fitness-weight", saveFitnessWeight);
  bindForm("fitness-gym", saveFitnessGym);
  bindForm("fitness-split-settings", saveFitnessSplitSettings);
  bindForm("fitness-split-day", saveFitnessSplitDay);
  bindForm("fitness-exercise", saveFitnessExercise);
  bindForm("fitness-settings", saveFitnessSettings);
  bindForm("fitness-photo", saveFitnessPhoto);
  document.querySelectorAll("[data-form='fitness-set']").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      saveFitnessSet(form);
    });
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
  bindForm("habit", (form) => {
    const fields = form.elements;
    const name = fields.name.value.trim();
    if (!name) return;
    const existing = workspaceData.habits.items.find((habit) => habit.id === fields.id.value);
    const habit = normalizeHabit({
      ...(existing || {}),
      id: existing?.id || createId(),
      name,
      category: fields.category.value.trim() || "Routine",
      type: fields.type.value,
      frequency: fields.frequency.value,
      target: numberOrZero(fields.target.value) || 1,
      unit: fields.unit.value.trim() || (fields.type.value === "time" ? "min" : fields.type.value === "count" ? "units" : "done"),
      specificDays: parseDays(fields.specificDays.value),
      timesPerWeek: numberOrZero(fields.timesPerWeek.value) || 3,
      history: existing?.history || {},
      updatedAt: new Date().toISOString(),
    });
    if (existing) workspaceData.habits.items = workspaceData.habits.items.map((item) => (item.id === habit.id ? habit : item));
    else workspaceData.habits.items.unshift(habit);
    persistWorkspace();
  });
  bindForm("habit-stack", (form) => {
    const name = form.elements.name.value.trim();
    const habitIds = selectedValues(form.elements.habitIds);
    if (!name || !habitIds.length) return;
    workspaceData.habits.stacks.push({ id: createId(), name, habitIds });
    persistWorkspace();
  });
  document.querySelectorAll("[data-task-toggle]").forEach((input) => {
    input.addEventListener("change", () => {
      const task = workspaceData.tasks.items.find((item) => item.id === input.dataset.taskToggle);
      if (task) setTaskCompletion(task, input.checked);
      persistWorkspace();
    });
  });
  document.querySelectorAll("[data-task-complete]").forEach((button) => {
    button.addEventListener("click", () => {
      const task = workspaceData.tasks.items.find((item) => item.id === button.dataset.taskComplete);
      if (!task) return;
      setTaskCompletion(task, task.status !== "Completed");
      persistWorkspace();
    });
  });
  document.querySelectorAll("[data-focus-task]").forEach((button) => {
    button.addEventListener("click", () => {
      workspaceData.tasks.items.forEach((task) => {
        task.focus = task.id === button.dataset.focusTask && !["Completed", "Cancelled"].includes(task.status);
      });
      persistWorkspace();
    });
  });
  document.querySelectorAll("[data-edit-task]").forEach((button) => {
    button.addEventListener("click", () => fillTaskForm(button.dataset.editTask));
  });
  document.querySelectorAll("[data-delete-task]").forEach((button) => {
    button.addEventListener("click", () => deleteTask(button.dataset.deleteTask));
  });
  document.querySelectorAll("[data-edit-recurring-task]").forEach((button) => {
    button.addEventListener("click", () => fillRecurringTaskForm(button.dataset.editRecurringTask));
  });
  document.querySelectorAll("[data-delete-recurring-task]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!confirm("Delete this recurring task?")) return;
      workspaceData.tasks.recurring = workspaceData.tasks.recurring.filter((task) => task.id !== button.dataset.deleteRecurringTask);
      persistWorkspace();
    });
  });
  document.querySelectorAll("[data-sleep-check]").forEach((input) => {
    input.addEventListener("change", () => {
      const key = todayIso();
      workspaceData.sleep.checklist[key] = workspaceData.sleep.checklist[key] || {};
      workspaceData.sleep.checklist[key][input.dataset.sleepCheck] = input.checked;
      persistWorkspace();
    });
  });
  bind("[data-action='sleep-record-day']", "click", recordSleepDay);
  document.querySelectorAll("[data-water-add]").forEach((button) => {
    button.addEventListener("click", () => addHealthAmountEntry("water", numberOrZero(button.dataset.waterAdd), "Quick add"));
  });
  document.querySelectorAll("[data-health-check]").forEach((input) => {
    input.addEventListener("change", () => {
      const key = todayIso();
      workspaceData.health.checklist[key] = workspaceData.health.checklist[key] || { supplements: {}, medications: {} };
      workspaceData.health.checklist[key].supplements = workspaceData.health.checklist[key].supplements || {};
      workspaceData.health.checklist[key].medications = workspaceData.health.checklist[key].medications || {};
      const bucket = input.dataset.healthCheck === "supplement" ? "supplements" : "medications";
      workspaceData.health.checklist[key][bucket][input.dataset.healthId] = input.checked;
      persistHealthWorkspace();
    });
  });
  document.querySelectorAll("[data-edit-health-item]").forEach((button) => {
    button.addEventListener("click", () => fillHealthItemForm(button.dataset.editHealthItem, button.dataset.type));
  });
  document.querySelectorAll("[data-delete-health-item]").forEach((button) => {
    button.addEventListener("click", () => deleteHealthItem(button.dataset.deleteHealthItem, button.dataset.type));
  });
  document.querySelectorAll("[data-edit-health-entry]").forEach((button) => {
    button.addEventListener("click", () => editHealthAmountEntry(button.dataset.editHealthEntry, button.dataset.type));
  });
  document.querySelectorAll("[data-delete-health-entry]").forEach((button) => {
    button.addEventListener("click", () => deleteHealthAmountEntry(button.dataset.deleteHealthEntry, button.dataset.type));
  });
  document.querySelectorAll("[data-edit-weight]").forEach((button) => {
    button.addEventListener("click", () => editWeightEntry(button.dataset.editWeight));
  });
  document.querySelectorAll("[data-delete-weight]").forEach((button) => {
    button.addEventListener("click", () => deleteWeightEntry(button.dataset.deleteWeight));
  });
  attachFitnessHandlers();
  document.querySelectorAll("[data-habit-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const habit = workspaceData.habits.items.find((item) => item.id === button.dataset.habitToggle);
      if (!habit) return;
      const entry = habitTodayEntry(habit);
      const completed = !habitCompleteToday(habit);
      entry.value = completed ? numberOrZero(habit.target) : 0;
      entry.completed = completed;
      habit.updatedAt = new Date().toISOString();
      persistWorkspace();
    });
  });
  document.querySelectorAll("[data-habit-progress]").forEach((input) => {
    input.addEventListener("change", () => {
      const habit = workspaceData.habits.items.find((item) => item.id === input.dataset.habitProgress);
      if (!habit) return;
      const entry = habitTodayEntry(habit);
      entry.value = numberOrZero(input.value);
      entry.completed = entry.value >= numberOrZero(habit.target);
      habit.updatedAt = new Date().toISOString();
      persistWorkspace();
    });
  });
  document.querySelectorAll("[data-habit-fill]").forEach((button) => {
    button.addEventListener("click", () => setHabitToday(button.dataset.habitFill, true));
  });
  document.querySelectorAll("[data-habit-clear]").forEach((button) => {
    button.addEventListener("click", () => setHabitToday(button.dataset.habitClear, false));
  });
  document.querySelectorAll("[data-edit-habit]").forEach((button) => {
    button.addEventListener("click", () => fillHabitForm(button.dataset.editHabit));
  });
  document.querySelectorAll("[data-delete-habit]").forEach((button) => {
    button.addEventListener("click", () => deleteHabit(button.dataset.deleteHabit));
  });
  document.querySelectorAll("[data-complete-stack]").forEach((button) => {
    button.addEventListener("click", () => {
      const stack = workspaceData.habits.stacks.find((item) => item.id === button.dataset.completeStack);
      if (!stack) return;
      stack.habitIds.forEach((habitId) => setHabitToday(habitId, true, false));
      persistWorkspace();
    });
  });
  document.querySelectorAll("[data-delete-stack]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!confirm("Delete this habit stack?")) return;
      workspaceData.habits.stacks = workspaceData.habits.stacks.filter((stack) => stack.id !== button.dataset.deleteStack);
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

function setHabitToday(habitId, completed, shouldPersist = true) {
  const habit = workspaceData.habits.items.find((item) => item.id === habitId);
  if (!habit) return;
  const entry = habitTodayEntry(habit);
  entry.value = completed ? numberOrZero(habit.target) : 0;
  entry.completed = completed;
  habit.updatedAt = new Date().toISOString();
  if (shouldPersist) persistWorkspace();
}

function fillHabitForm(habitId) {
  const habit = workspaceData.habits.items.find((item) => item.id === habitId);
  const form = document.querySelector("[data-form='habit']");
  if (!habit || !form) return;
  form.elements.id.value = habit.id;
  form.elements.name.value = habit.name;
  form.elements.category.value = habit.category;
  form.elements.type.value = habit.type;
  form.elements.frequency.value = habit.frequency;
  form.elements.target.value = habit.target;
  form.elements.unit.value = habit.unit;
  form.elements.specificDays.value = habit.specificDays.map(dayName).join(", ");
  form.elements.timesPerWeek.value = habit.timesPerWeek;
  form.scrollIntoView({ behavior: "smooth", block: "center" });
}

function deleteHabit(habitId) {
  const habit = workspaceData.habits.items.find((item) => item.id === habitId);
  if (!habit) return;
  if (!confirm(`Delete "${habit.name}"? This removes its history and stack links.`)) return;
  workspaceData.habits.items = workspaceData.habits.items.filter((item) => item.id !== habitId);
  workspaceData.habits.stacks = workspaceData.habits.stacks
    .map((stack) => ({ ...stack, habitIds: stack.habitIds.filter((id) => id !== habitId) }))
    .filter((stack) => stack.habitIds.length);
  persistWorkspace();
}

function dayName(day) {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day] || "";
}

function setTaskCompletion(task, completed) {
  task.status = completed ? "Completed" : "Not Started";
  task.completedAt = completed ? new Date().toISOString() : null;
  if (completed) task.focus = false;
  task.updatedAt = new Date().toISOString();
}

function addHealthAmountEntry(type, amount, label = "") {
  if (!amount) return;
  const target = type === "water" ? workspaceData.health.hydration.entries : workspaceData.health.caffeine.entries;
  target.push(normalizeHealthAmountEntry({ amount, type: label, date: todayIso(), time: formatInputTime(new Date()) }));
  persistHealthWorkspace();
}

function saveHealthItem(form, type) {
  const fields = form.elements;
  const name = fields.name.value.trim();
  if (!name) return;
  const target = type === "supplement" ? workspaceData.health.supplements : workspaceData.health.medications;
  const item = normalizeHealthItem({ id: fields.id.value || createId(), name, dose: fields.dose.value.trim(), timing: fields.timing.value }, type);
  const index = target.findIndex((entry) => entry.id === item.id);
  if (index >= 0) target[index] = item;
  else target.push(item);
  persistHealthWorkspace();
}

function fillHealthItemForm(id, type) {
  const target = type === "supplement" ? workspaceData.health.supplements : workspaceData.health.medications;
  const item = target.find((entry) => entry.id === id);
  const form = document.querySelector(`[data-form="${type}"]`);
  if (!item || !form) return;
  form.elements.id.value = item.id;
  form.elements.name.value = item.name;
  form.elements.dose.value = item.dose;
  form.elements.timing.value = item.timing;
  form.scrollIntoView({ behavior: "smooth", block: "center" });
}

function deleteHealthItem(id, type) {
  const targetName = type === "supplement" ? "supplements" : "medications";
  const target = workspaceData.health[targetName];
  const item = target.find((entry) => entry.id === id);
  if (!item) return;
  if (!confirm(`Delete "${item.name}"?`)) return;
  workspaceData.health[targetName] = target.filter((entry) => entry.id !== id);
  Object.values(workspaceData.health.checklist).forEach((day) => {
    delete day[targetName]?.[id];
  });
  persistHealthWorkspace();
}

function editHealthAmountEntry(id, type) {
  const target = type === "water" ? workspaceData.health.hydration.entries : workspaceData.health.caffeine.entries;
  const entry = target.find((item) => item.id === id);
  if (!entry) return;
  const amount = numberOrZero(prompt("Amount", entry.amount));
  if (!amount) return;
  entry.amount = amount;
  entry.time = prompt("Time (HH:MM)", entry.time) || entry.time;
  persistHealthWorkspace();
}

function deleteHealthAmountEntry(id, type) {
  if (!confirm("Delete this entry?")) return;
  if (type === "water") workspaceData.health.hydration.entries = workspaceData.health.hydration.entries.filter((entry) => entry.id !== id);
  else workspaceData.health.caffeine.entries = workspaceData.health.caffeine.entries.filter((entry) => entry.id !== id);
  persistHealthWorkspace();
}

function editWeightEntry(id) {
  const entry = workspaceData.health.weight.entries.find((item) => item.id === id);
  if (!entry) return;
  const weight = numberOrZero(prompt("Weight", entry.weight));
  if (!weight) return;
  entry.weight = weight;
  entry.date = prompt("Date (YYYY-MM-DD)", entry.date) || entry.date;
  workspaceData.health.profile.weight = weight;
  workspaceData.health.profile.weightUnit = entry.unit;
  persistHealthWorkspace();
}

function deleteWeightEntry(id) {
  if (!confirm("Delete this weight entry?")) return;
  workspaceData.health.weight.entries = workspaceData.health.weight.entries.filter((entry) => entry.id !== id);
  persistHealthWorkspace();
}

function formatInputTime(date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function attachFitnessHandlers() {
  document.querySelectorAll("[data-fitness-modal]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      workspaceData.fitness.ui.modal = button.dataset.fitnessModal;
      if (button.dataset.fitnessModal !== "exercise") workspaceData.fitness.ui.editingId = "";
      persistWorkspace();
    });
  });
  document.querySelectorAll("[data-close-fitness-modal]").forEach((element) => {
    element.addEventListener("click", (event) => {
      if (event.target.closest("[data-modal-panel]") && !event.target.matches("[data-close-fitness-modal]")) return;
      closeFitnessModal();
    });
  });
  document.querySelectorAll("[data-fitness-weight-range]").forEach((button) => {
    button.addEventListener("click", () => {
      workspaceData.fitness.settings.weightRange = numberOrZero(button.dataset.fitnessWeightRange) || 30;
      persistWorkspace();
    });
  });
  const gymSelect = document.querySelector("[data-fitness-session-gym]");
  if (gymSelect) gymSelect.addEventListener("change", () => {
    workspaceData.fitness.ui.selectedGymId = gymSelect.value;
    persistWorkspace();
  });
  const daySelect = document.querySelector("[data-fitness-session-day]");
  if (daySelect) daySelect.addEventListener("change", () => {
    workspaceData.fitness.ui.selectedDay = daySelect.value;
    persistWorkspace();
  });
  const photoA = document.querySelector("[data-fitness-photo-a]");
  if (photoA) photoA.addEventListener("change", () => {
    workspaceData.fitness.ui.photoA = photoA.value;
    persistWorkspace();
  });
  const photoB = document.querySelector("[data-fitness-photo-b]");
  if (photoB) photoB.addEventListener("change", () => {
    workspaceData.fitness.ui.photoB = photoB.value;
    persistWorkspace();
  });
  document.querySelectorAll("[data-edit-fitness-weight]").forEach((button) => button.addEventListener("click", () => editFitnessWeight(button.dataset.editFitnessWeight)));
  document.querySelectorAll("[data-delete-fitness-weight]").forEach((button) => button.addEventListener("click", () => deleteFitnessWeight(button.dataset.deleteFitnessWeight)));
  document.querySelectorAll("[data-edit-fitness-gym]").forEach((button) => button.addEventListener("click", () => fillFitnessGym(button.dataset.editFitnessGym)));
  document.querySelectorAll("[data-delete-fitness-gym]").forEach((button) => button.addEventListener("click", () => deleteFitnessGym(button.dataset.deleteFitnessGym)));
  document.querySelectorAll("[data-edit-split-day]").forEach((button) => button.addEventListener("click", () => fillFitnessSplitDay(numberOrZero(button.dataset.editSplitDay))));
  document.querySelectorAll("[data-delete-split-day]").forEach((button) => button.addEventListener("click", () => deleteFitnessSplitDay(numberOrZero(button.dataset.deleteSplitDay))));
  document.querySelectorAll("[data-move-split-day]").forEach((button) => button.addEventListener("click", () => moveFitnessSplitDay(numberOrZero(button.dataset.moveSplitDay), numberOrZero(button.dataset.direction))));
  document.querySelectorAll("[data-edit-fitness-exercise]").forEach((button) => button.addEventListener("click", () => openFitnessExercise(button.dataset.editFitnessExercise)));
  document.querySelectorAll("[data-delete-fitness-exercise]").forEach((button) => button.addEventListener("click", () => deleteFitnessExercise(button.dataset.deleteFitnessExercise)));
  document.querySelectorAll("[data-fitness-open-exercise]").forEach((button) => button.addEventListener("click", () => scrollToFitnessExercise(button.dataset.fitnessOpenExercise)));
  document.querySelectorAll("[data-edit-fitness-set]").forEach((button) => button.addEventListener("click", () => editFitnessSet(button.dataset.editFitnessSet)));
  document.querySelectorAll("[data-delete-fitness-set]").forEach((button) => button.addEventListener("click", () => deleteFitnessSet(button.dataset.deleteFitnessSet)));
  document.querySelectorAll("[data-view-fitness-photo]").forEach((button) => button.addEventListener("click", () => {
    workspaceData.fitness.ui.modal = "photo";
    workspaceData.fitness.ui.editingId = button.dataset.viewFitnessPhoto;
    persistWorkspace();
  }));
  document.querySelectorAll("[data-delete-fitness-photo]").forEach((button) => button.addEventListener("click", () => deleteFitnessPhoto(button.dataset.deleteFitnessPhoto)));
  bind("[data-action='export-fitness-data']", "click", exportFitnessData);
  bind("[data-action='import-fitness-data']", "click", importFitnessData);
  bind("[data-action='reset-fitness-data']", "click", resetFitnessData);
}

function closeFitnessModal() {
  workspaceData.fitness.ui.modal = null;
  workspaceData.fitness.ui.editingId = "";
  persistWorkspace();
}

function saveFitnessWeight(form) {
  const fields = form.elements;
  const weight = numberOrZero(fields.weight.value);
  if (!weight) return;
  const entry = normalizeFitnessWeight({ id: fields.id.value || createId(), date: fields.date.value || todayIso(), weight, unit: fields.unit.value });
  const index = workspaceData.fitness.weights.findIndex((item) => item.id === entry.id);
  if (index >= 0) workspaceData.fitness.weights[index] = entry;
  else workspaceData.fitness.weights.push(entry);
  persistWorkspace();
}

function editFitnessWeight(id) {
  const entry = workspaceData.fitness.weights.find((item) => item.id === id);
  const form = document.querySelector("[data-form='fitness-weight']");
  if (!entry || !form) return;
  form.elements.id.value = entry.id;
  form.elements.date.value = entry.date;
  form.elements.weight.value = entry.weight;
  form.elements.unit.value = entry.unit;
  form.scrollIntoView({ behavior: "smooth", block: "center" });
}

function deleteFitnessWeight(id) {
  if (!confirm("Delete this weight entry? Historical entries only disappear when deleted.")) return;
  workspaceData.fitness.weights = workspaceData.fitness.weights.filter((entry) => entry.id !== id);
  persistWorkspace();
}

function saveFitnessGym(form) {
  const name = form.elements.name.value.trim();
  if (!name) return;
  const gym = normalizeFitnessGym({ id: form.elements.id.value || createId(), name });
  const index = workspaceData.fitness.gyms.findIndex((item) => item.id === gym.id);
  if (index >= 0) workspaceData.fitness.gyms[index] = gym;
  else workspaceData.fitness.gyms.push(gym);
  workspaceData.fitness.ui.selectedGymId = gym.id;
  persistWorkspace();
}

function fillFitnessGym(id) {
  const gym = workspaceData.fitness.gyms.find((item) => item.id === id);
  const form = document.querySelector("[data-form='fitness-gym']");
  if (!gym || !form) return;
  form.elements.id.value = gym.id;
  form.elements.name.value = gym.name;
}

function deleteFitnessGym(id) {
  const gym = workspaceData.fitness.gyms.find((item) => item.id === id);
  if (!gym || !confirm(`Delete "${gym.name}"? Exercises stay but lose this gym link.`)) return;
  workspaceData.fitness.gyms = workspaceData.fitness.gyms.filter((item) => item.id !== id);
  workspaceData.fitness.exercises.forEach((exercise) => {
    if (exercise.gymId === id) exercise.gymId = "";
  });
  if (workspaceData.fitness.ui.selectedGymId === id) workspaceData.fitness.ui.selectedGymId = "";
  persistWorkspace();
}

function saveFitnessSplitSettings(form) {
  workspaceData.fitness.split.startDate = form.elements.startDate.value || todayIso();
  workspaceData.fitness.split.currentIndex = clamp(form.elements.currentIndex.value, 0, Math.max(0, workspaceData.fitness.split.days.length - 1));
  persistWorkspace();
}

function saveFitnessSplitDay(form) {
  const day = form.elements.day.value.trim();
  if (!day) return;
  const index = form.elements.index.value === "" ? -1 : numberOrZero(form.elements.index.value);
  if (index >= 0) workspaceData.fitness.split.days[index] = day;
  else workspaceData.fitness.split.days.push(day);
  persistWorkspace();
}

function fillFitnessSplitDay(index) {
  const form = document.querySelector("[data-form='fitness-split-day']");
  if (!form || !workspaceData.fitness.split.days[index]) return;
  form.elements.index.value = index;
  form.elements.day.value = workspaceData.fitness.split.days[index];
}

function deleteFitnessSplitDay(index) {
  if (workspaceData.fitness.split.days.length <= 1) return;
  if (!confirm("Delete this split day? Exercises assigned to it will stay in the database.")) return;
  const removed = workspaceData.fitness.split.days[index];
  workspaceData.fitness.split.days.splice(index, 1);
  if (workspaceData.fitness.ui.selectedDay === removed) workspaceData.fitness.ui.selectedDay = workspaceData.fitness.split.days[0] || "";
  workspaceData.fitness.split.currentIndex = clamp(workspaceData.fitness.split.currentIndex, 0, workspaceData.fitness.split.days.length - 1);
  persistWorkspace();
}

function moveFitnessSplitDay(index, direction) {
  const next = index + direction;
  const days = workspaceData.fitness.split.days;
  if (next < 0 || next >= days.length) return;
  [days[index], days[next]] = [days[next], days[index]];
  persistWorkspace();
}

function saveFitnessExercise(form) {
  const fields = form.elements;
  const name = fields.name.value.trim();
  if (!name) return;
  const existing = workspaceData.fitness.exercises.find((exercise) => exercise.id === fields.id.value);
  const exercise = normalizeFitnessExercise({
    ...(existing || {}),
    id: existing?.id || createId(),
    name,
    gymId: fields.gymId.value,
    day: fields.day.value,
    bodyweight: fields.bodyweight.checked,
    startingWeight: numberOrZero(fields.startingWeight.value),
    repMin: numberOrZero(fields.repMin.value) || 6,
    repMax: numberOrZero(fields.repMax.value) || 8,
    increment: numberOrZero(fields.increment.value) || 2.5,
    updatedAt: new Date().toISOString(),
  });
  if (exercise.repMax < exercise.repMin) exercise.repMax = exercise.repMin;
  const index = workspaceData.fitness.exercises.findIndex((item) => item.id === exercise.id);
  if (index >= 0) workspaceData.fitness.exercises[index] = exercise;
  else workspaceData.fitness.exercises.push(exercise);
  workspaceData.fitness.ui.modal = null;
  workspaceData.fitness.ui.editingId = "";
  workspaceData.fitness.ui.selectedGymId = exercise.gymId;
  workspaceData.fitness.ui.selectedDay = exercise.day;
  persistWorkspace();
}

function openFitnessExercise(id) {
  workspaceData.fitness.ui.modal = "exercise";
  workspaceData.fitness.ui.editingId = id;
  persistWorkspace();
}

function deleteFitnessExercise(id) {
  const exercise = workspaceData.fitness.exercises.find((item) => item.id === id);
  if (!exercise || !confirm(`Delete "${exercise.name}" and its set history?`)) return;
  workspaceData.fitness.exercises = workspaceData.fitness.exercises.filter((item) => item.id !== id);
  workspaceData.fitness.sets = workspaceData.fitness.sets.filter((set) => set.exerciseId !== id);
  persistWorkspace();
}

function scrollToFitnessExercise(id) {
  const safeId = typeof CSS !== "undefined" && CSS.escape ? CSS.escape(id) : String(id).replace(/"/g, "");
  const element = document.querySelector(`#fitness-exercise-${safeId}`);
  if (element) element.scrollIntoView({ behavior: "smooth", block: "center" });
}

function saveFitnessSet(form) {
  const exercise = workspaceData.fitness.exercises.find((item) => item.id === form.dataset.exerciseId);
  if (!exercise) return;
  const reps = numberOrZero(form.elements.reps.value);
  if (!reps) return;
  workspaceData.fitness.sets.push(normalizeFitnessSet({
    exerciseId: exercise.id,
    date: todayIso(),
    reps,
    weight: exercise.bodyweight ? 0 : numberOrZero(form.elements.weight.value),
    externalLoad: exercise.bodyweight ? numberOrZero(form.elements.weight.value) : 0,
  }));
  persistWorkspace();
}

function editFitnessSet(id) {
  const set = workspaceData.fitness.sets.find((item) => item.id === id);
  const exercise = set ? workspaceData.fitness.exercises.find((item) => item.id === set.exerciseId) : null;
  if (!set || !exercise) return;
  const weight = numberOrZero(prompt(exercise.bodyweight ? "External load" : "Weight", exercise.bodyweight ? set.externalLoad : set.weight));
  const reps = numberOrZero(prompt("Reps", set.reps));
  if (!reps) return;
  if (exercise.bodyweight) set.externalLoad = weight;
  else set.weight = weight;
  set.reps = reps;
  set.date = prompt("Date (YYYY-MM-DD)", set.date) || set.date;
  persistWorkspace();
}

function deleteFitnessSet(id) {
  if (!confirm("Delete this logged set?")) return;
  workspaceData.fitness.sets = workspaceData.fitness.sets.filter((set) => set.id !== id);
  persistWorkspace();
}

function saveFitnessSettings(form) {
  workspaceData.fitness.settings.unit = form.elements.unit.value;
  persistWorkspace();
}

function saveFitnessPhoto(form) {
  const file = form.elements.photo.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    workspaceData.fitness.photos.push(normalizeFitnessPhoto({
      date: form.elements.date.value || todayIso(),
      weight: numberOrZero(form.elements.weight.value),
      unit: form.elements.unit.value,
      image: reader.result,
      name: file.name,
    }));
    persistWorkspace();
  });
  reader.readAsDataURL(file);
}

function deleteFitnessPhoto(id) {
  if (!confirm("Delete this progress photo?")) return;
  workspaceData.fitness.photos = workspaceData.fitness.photos.filter((photo) => photo.id !== id);
  if (workspaceData.fitness.ui.photoA === id) workspaceData.fitness.ui.photoA = "";
  if (workspaceData.fitness.ui.photoB === id) workspaceData.fitness.ui.photoB = "";
  persistWorkspace();
}

function exportFitnessData() {
  const blob = new Blob([JSON.stringify(workspaceData.fitness, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "forma-fitness-data.json";
  link.click();
  URL.revokeObjectURL(url);
}

function importFitnessData() {
  const box = document.querySelector("[data-fitness-import]");
  if (!box?.value.trim()) return;
  try {
    workspaceData.fitness = normalizeFitnessData(JSON.parse(box.value));
    persistWorkspace();
  } catch {
    alert("Fitness import failed. Check the JSON and try again.");
  }
}

function resetFitnessData() {
  if (!confirm("Reset Fitness data? This deletes gyms, split, exercises, sets, weight history, and photos.")) return;
  workspaceData.fitness = defaultWorkspaceData().fitness;
  persistWorkspace();
}

function fillTaskForm(taskId) {
  const task = workspaceData.tasks.items.find((item) => item.id === taskId);
  const form = document.querySelector("[data-form='task']");
  if (!task || !form) return;
  form.elements.id.value = task.id;
  form.elements.title.value = task.title;
  form.elements.description.value = task.description;
  form.elements.dueDate.value = task.dueDate;
  form.elements.priority.value = task.priority;
  form.elements.category.value = task.category;
  form.elements.estimatedTime.value = task.estimatedTime;
  form.elements.status.value = task.status;
  setSelectedValues(form.elements.goalConnections, task.connections.goals);
  setSelectedValues(form.elements.habitConnections, task.connections.habits);
  setSelectedValues(form.elements.noteConnections, task.connections.notes);
  form.scrollIntoView({ behavior: "smooth", block: "center" });
}

function deleteTask(taskId) {
  const task = workspaceData.tasks.items.find((item) => item.id === taskId);
  if (!task) return;
  if (!confirm(`Delete "${task.title}"?`)) return;
  workspaceData.tasks.items = workspaceData.tasks.items.filter((item) => item.id !== taskId);
  persistWorkspace();
}

function fillRecurringTaskForm(taskId) {
  const task = workspaceData.tasks.recurring.find((item) => item.id === taskId);
  const form = document.querySelector("[data-form='recurring-task']");
  if (!task || !form) return;
  form.elements.id.value = task.id;
  form.elements.title.value = task.title;
  form.elements.weekday.value = task.weekday;
  form.elements.priority.value = task.priority;
  form.elements.estimatedTime.value = task.estimatedTime;
  form.scrollIntoView({ behavior: "smooth", block: "center" });
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
      startDate: existing?.startDate || todayIso(),
      targetDate: fields.targetDate.value || todayIso(90),
      priority: fields.priority.value,
      status: existing?.status || "Active",
      nextAction: existing?.nextAction || "Set the next action",
      milestones: existing?.milestones || template?.milestones || [],
      focus: existing?.focus || false,
      connections: existing?.connections || { tasks: [], habits: [], notes: [], finance: [] },
      timeline: existing?.timeline || [],
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: existing?.completedAt || null,
    });
    goal.timeline.push({ date: new Date().toISOString(), type: existing ? "Goal edited" : "Goal created", detail: existing ? "Goal details updated" : "Goal created" });
    if (existing) workspaceData.goals.items = workspaceData.goals.items.map((item) => (item.id === existing.id ? goal : item));
    else workspaceData.goals.items.unshift(goal);
    if (!existing && (!goal.milestones.length || !goal.nextAction?.trim())) workspaceData.goals.setupPrompt = goal.id;
    if (workspaceData.goals.setupPrompt === goal.id && goal.milestones.length && goal.nextAction?.trim()) workspaceData.goals.setupPrompt = null;
    if (!existing) workspaceData.goals.openGoal = goal.id;
    ensureFocusGoal();
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
  document.querySelectorAll("[data-form='goal-next-action']").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const goal = workspaceData.goals.items.find((item) => item.id === form.dataset.goalId);
      if (!goal) return;
      goal.nextAction = form.elements.nextAction.value.trim() || "Set the next action";
      goal.updatedAt = new Date().toISOString();
      goal.timeline.push({ date: goal.updatedAt, type: "Next action updated", detail: goal.nextAction });
      if (workspaceData.goals.setupPrompt === goal.id && goal.milestones.length) workspaceData.goals.setupPrompt = null;
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
        assignNextFocusGoal(goal.id);
      }
      persistWorkspace();
    });
  });
  document.querySelectorAll("[data-open-goal]").forEach((button) => {
    button.addEventListener("click", () => {
      workspaceData.goals.openGoal = button.dataset.openGoal;
      persistWorkspace();
    });
  });
  document.querySelectorAll("[data-edit-goal]").forEach((button) => {
    button.addEventListener("click", () => fillGoalForm(button.dataset.editGoal));
  });
  document.querySelectorAll("[data-focus-goal]").forEach((button) => {
    button.addEventListener("click", () => {
      workspaceData.goals.items.forEach((goal) => {
        goal.focus = goal.id === button.dataset.focusGoal && goal.status === "Active";
      });
      workspaceData.goals.openGoal = button.dataset.focusGoal;
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
      if (goal.status === "Completed") assignNextFocusGoal(goal.id);
      if (goal.status === "Paused") assignNextFocusGoal(goal.id, true);
      if (goal.status === "Active") ensureFocusGoal();
      const eventType = goal.status === "Paused" ? "Goal paused" : goal.status === "Active" ? "Goal resumed" : goal.status === "Completed" ? "Goal completed" : `Goal ${goal.status}`;
      goal.timeline.push({ date: goal.updatedAt, type: eventType, detail: `Status changed to ${goal.status}` });
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
  document.querySelectorAll("[data-move-milestone]").forEach((button) => {
    button.addEventListener("click", () => {
      const goal = workspaceData.goals.items.find((item) => item.id === button.dataset.moveMilestone);
      if (!goal) return;
      const index = goal.milestones.findIndex((milestone) => milestone.id === button.dataset.milestoneId);
      const target = button.dataset.direction === "up" ? index - 1 : index + 1;
      if (index < 0 || target < 0 || target >= goal.milestones.length) return;
      const [milestone] = goal.milestones.splice(index, 1);
      goal.milestones.splice(target, 0, milestone);
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
  const wasFocus = goal.focus;
  workspaceData.goals.items = workspaceData.goals.items.filter((item) => item.id !== goalId);
  workspaceData.goals.reviews = workspaceData.goals.reviews.filter((review) => review.goalId !== goalId);
  workspaceData.goals.timeline = workspaceData.goals.timeline.filter((entry) => entry.goalId !== goalId);
  if (workspaceData.goals.setupPrompt === goalId) workspaceData.goals.setupPrompt = null;
  if (workspaceData.goals.openGoal === goalId) workspaceData.goals.openGoal = null;
  if (wasFocus) assignNextFocusGoal(goalId);
  persistWorkspace();
}

function ensureFocusGoal() {
  const active = workspaceData.goals.items.filter((goal) => goal.status === "Active");
  const current = active.find((goal) => goal.focus);
  if (current) return current;
  workspaceData.goals.items.forEach((goal) => {
    goal.focus = active[0]?.id === goal.id;
  });
  return active[0] || null;
}

function assignNextFocusGoal(excludeId = "", keepOpenGoal = false) {
  const next = workspaceData.goals.items.find((goal) => goal.status === "Active" && goal.id !== excludeId);
  workspaceData.goals.items.forEach((goal) => {
    goal.focus = Boolean(next && goal.id === next.id);
  });
  if (!keepOpenGoal && workspaceData.goals.openGoal === excludeId) workspaceData.goals.openGoal = next?.id || null;
}

function fillGoalForm(goalId) {
  const goal = workspaceData.goals.items.find((item) => item.id === goalId);
  const form = document.querySelector("[data-form='goal']");
  if (!goal || !form) return;
  form.elements.id.value = goal.id;
  form.elements.title.value = goal.title;
  form.elements.description.value = goal.description;
  form.elements.category.value = goal.category;
  form.elements.targetDate.value = goal.targetDate;
  form.elements.priority.value = goal.priority;
  delete form.dataset.templateName;
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
  form.elements.targetDate.value = todayIso(90);
  form.elements.priority.value = "High";
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
  if (type === "task") workspaceData.tasks.items.push(normalizeTask({ id: createId(), title: note.title, description: note.content.slice(0, 180), tier: "inbox", priority: "Medium", status: "Not Started", connections: { notes: [note.id] } }));
  if (type === "habit") workspaceData.habits.items.push(normalizeHabit({ id: createId(), name: note.title, category: "Notes", type: "checkbox", frequency: "daily", target: 1 }));
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
  removeLocal(TOUR_KEY);
  state = defaultState();
  state.view = "onboarding";
  state.step = 1;
  developerMode.error = "";
  guidedTour = { completed: false, active: false, step: 0 };
  saveDeveloperMode();
  render();
}

function resetAllData() {
  if (!confirm("Reset all Forma data? This deletes onboarding, modules, settings, and Developer Mode state.")) return;
  removeLocal(STORAGE_KEY);
  removeLocal(CONFIG_KEY);
  removeLocal(DATA_KEY);
  removeLocal(DEV_MODE_KEY);
  removeLocal(DAILY_RESET_KEY);
  removeLocal(TOUR_KEY);
  developerMode = { unlocked: false, error: "" };
  guidedTour = { completed: false, active: false, step: 0 };
  state = defaultState();
  workspaceData = defaultWorkspaceData();
  render();
}

function homeActionMarkup(item) {
  return `<button class="home-action-item" data-tab="${item.tab}"><span>${escapeHtml(item.tab)}</span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.reason)}</small></button>`;
}

function homeTimelineMarkup(item) {
  return `<button class="home-timeline-item" data-tab="${item.tab}"><span>${escapeHtml(item.time)}</span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.detail)}</small></button>`;
}

function homeAlertMarkup(item) {
  return `<button class="home-alert-item ${escapeHtml(item.type || "warning")}" data-tab="${item.tab}"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.reason)}</span></button>`;
}

function homePreviewMarkup(item) {
  return `<button class="home-preview-item" data-tab="${item.tab}"><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.detail)}</small></button>`;
}

function homeHealthMarkup(item) {
  return `<button class="home-health-item ${escapeHtml(item.tone || "neutral")}" data-tab="${item.tab}"><strong>${escapeHtml(item.module)}</strong><span>${escapeHtml(item.status)}</span></button>`;
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
    sleep: "A bedtime preparation coach built around your target sleep time.",
    health: "Hydration, supplements, medications, caffeine, and weight in one daily tracker.",
    fitness: "Progressive overload, training execution, bodyweight trends, and progress photos.",
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

initializeDailyResetEngine();
render();
