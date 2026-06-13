# Forma Product Design Document

## Scope

This document has been superseded by `PRODUCT_REDESIGN.md` for the current product direction.

The current implementation should follow the redesign principle: the user describes their life and goals, and Forma infers modules automatically rather than asking the user to manually select modules.

---

This document defines the earlier onboarding architecture for Forma Version 1 and the adaptive personal operating system generated from it.

Version 1 should create a personalized Forma workspace with a Home tab and module tabs. It should not include AI features, analytics, cloud sync, or advanced recommendations.

## Product Principle

Forma should ask the fewest possible questions needed to generate a useful personal operating system. Every onboarding question must affect either:

- Which module tabs appear
- How module tabs are ordered
- What default settings each module receives
- What summary information appears on the Home tab

If a question does not affect the generated Forma workspace, it should not be included in Version 1 onboarding.

## Minimum Onboarding Questions

### 1. What is your name?

Why it is asked:
The name personalizes the onboarding and future dashboard without requiring sensitive information.

Dashboard impact:
Used in welcome copy, profile metadata, and the generated workspace configuration.

Stored as:
`profile.name`

### 2. What is your age?

Why it is asked:
Age gives light context for the user's life stage without forcing a persona. It can help future defaults remain appropriate while staying simple in Version 1.

Workspace impact:
Stored in profile metadata. It should not determine modules by itself in Version 1.

Stored as:
`profile.age`

### 3. What areas do you want to improve or manage?

Options:

- Productivity
- Fitness
- Finance
- Study
- Personal Growth

Why it is asked:
This is the primary personalization question. It identifies the user's intent before asking about specific tools.

Workspace impact:
Determines suggested module tabs, module priority, and which configuration sections appear.

Stored as:
`goals[]`

Goal-to-module mapping:

| Goal | Suggested dashboard impact |
| --- | --- |
| Productivity | Prioritize Tasks and Goals |
| Fitness | Prioritize Habits and Goals |
| Finance | Prioritize Finance, Goals, and Notes |
| Study | Prioritize Tasks, Notes, and Goals |
| Personal Growth | Prioritize Habits, Goals, and Notes |

### 4. Which modules do you want in your dashboard?

Options:

- Tasks
- Habits
- Goals
- Notes
- Finance

Why it is asked:
Goals describe intent, but modules define the actual navigation structure. The user should remain in control of what appears.

Workspace impact:
Determines the final module tab list, module order, and which module configuration questions appear.

Stored as:
`modules[]`

### 5. What starting settings should each selected module use?

Why it is asked:
Module settings make the generated dashboard feel useful immediately instead of empty.

Workspace impact:
Creates default module configuration values for the generated module tabs.

Stored as:
`moduleSettings`

### 6. Does this setup look right?

Why it is asked:
The user needs a confirmation step before Forma generates the final dashboard configuration.

Workspace impact:
Confirms the final input state used to generate the Forma workspace configuration.

Stored as:
No new data required. This step validates and confirms previous answers.

## Onboarding Flow Diagram

```text
Landing Page
  |
  v
Step 1: Basic Profile
  - Name
  - Age
  |
  v
Step 2: Goal Selection
  - Productivity
  - Fitness
  - Finance
  - Study
  - Personal Growth
  |
  v
System Suggests Modules
  - Based on selected goals
  - User can still change selection
  |
  v
Step 3: Module Selection
  - Tasks
  - Habits
  - Goals
  - Notes
  - Finance
  |
  v
Step 4: Module Configuration
  - Only asks questions for selected modules
  |
  v
Step 5: Summary
  - Profile
  - Goals
  - Modules
  - Settings
  |
  v
Step 6: Generate Forma Workspace
  - Save onboarding data locally
  - Save workspace configuration locally
  - Allow JSON download
```

## Personal OS Architecture

Forma should feel like a small personal operating system, not a page of unrelated cards.

Every generated Forma workspace contains:

- Home tab
- One tab per selected module

The Home tab is always present. Module tabs are generated from onboarding.

Example navigation structures:

| Selected modules | Generated navigation |
| --- | --- |
| Tasks, Goals, Notes | Home, Tasks, Goals, Notes |
| Finance, Goals | Home, Finance, Goals |
| Habits, Goals, Notes | Home, Habits, Goals, Notes |

### Home Tab

The Home tab provides:

- Overview of the generated Forma workspace
- Progress and key metrics from selected modules
- Quick actions that jump into module tabs
- Short snapshots of each selected module
- Today's priorities generated from selected modules
- Recommendations generated from onboarding goals

### Module Tabs

Each selected module should behave like a mini-application. A module tab should include:

- A focused module header
- Primary module actions
- Editable data
- Professional empty states
- Local persistence

Module tabs should not require separate routes or backend services in Version 1.

## Personalization System

Forma should not only change navigation. It should also generate different starter content from onboarding answers.

Personalized defaults should include:

- Starter tasks
- Starter habits
- Starter goals
- Notes templates
- Home recommendations
- Today's priorities

Examples:

| Onboarding signal | Generated content |
| --- | --- |
| Finance goal | Savings review tasks, finance recommendations, money decision note templates |
| Study goal | Study block tasks, class recap templates, assignment-focused priorities |
| Fitness goal | Training habits, recovery recommendations, training log templates |
| Productivity goal | Focus-limit tasks, execution recommendations, daily planning defaults |
| Personal Growth goal | Reflection habits, personal commitment goals, reflection note templates |

The result should be that two users with different onboarding answers feel like they received different products, not only different tabs.

## User Personas

### Student

Profile:
A student needs to manage coursework, study sessions, deadlines, and long-term academic goals.

Likely selected goals:

- Study
- Productivity
- Personal Growth

Likely modules:

- Tasks
- Notes
- Goals
- Habits

Forma workspace result:

| Dashboard area | Purpose |
| --- | --- |
| Tasks | Assignments, deadlines, exam prep |
| Notes | Class notes, reading notes, project ideas |
| Goals | Semester targets and academic milestones |
| Habits | Study routines and daily review |

Excluded by default:
Finance, unless the user explicitly selects it.

### Athlete

Profile:
An athlete needs consistency, training structure, recovery routines, and progress goals.

Likely selected goals:

- Fitness
- Personal Growth

Likely modules:

- Habits
- Goals
- Notes

Forma workspace result:

| Dashboard area | Purpose |
| --- | --- |
| Habits | Training days, recovery, mobility, nutrition routines |
| Goals | Performance goals and milestones |
| Notes | Training reflections and coaching notes |

Excluded by default:
Finance and Tasks, unless explicitly selected.

### Finance-Focused User

Profile:
A finance-focused user wants visibility into income, savings, and financial priorities.

Likely selected goals:

- Finance
- Productivity

Likely modules:

- Finance
- Goals
- Notes
- Tasks

Forma workspace result:

| Dashboard area | Purpose |
| --- | --- |
| Finance | Monthly income, savings target, financial baseline |
| Goals | Savings goals, debt goals, investment goals |
| Notes | Financial decisions and planning notes |
| Tasks | Payment reminders and financial admin |

Excluded by default:
Habits, unless explicitly selected.

### General Productivity User

Profile:
A general productivity user wants a clean system for managing daily work, goals, and notes.

Likely selected goals:

- Productivity
- Personal Growth

Likely modules:

- Tasks
- Goals
- Notes
- Habits

Forma workspace result:

| Dashboard area | Purpose |
| --- | --- |
| Tasks | Daily execution and prioritization |
| Goals | Larger outcomes and progress direction |
| Notes | Context, decisions, and captured thoughts |
| Habits | Repeatable routines that support focus |

Excluded by default:
Finance, unless explicitly selected.

## Workspace Personalization Logic

The Forma workspace should be generated from three inputs:

1. Selected goals
2. Selected modules
3. Module configuration answers

Generation rules:

- The user-selected module list is the source of truth for generated tabs.
- Goals can suggest modules but should not force them.
- Modules selected by the user should appear as tabs.
- Modules not selected by the user should not appear in navigation.
- Module order should be influenced by selected goals.
- Configuration answers should become module settings.
- Empty optional settings should be omitted from the final JSON.

Suggested module priority by goal:

| Goal | Priority order |
| --- | --- |
| Productivity | Tasks, Goals, Notes, Habits |
| Fitness | Habits, Goals, Notes |
| Finance | Finance, Goals, Notes, Tasks |
| Study | Tasks, Notes, Goals, Habits |
| Personal Growth | Habits, Goals, Notes, Tasks |

If multiple goals are selected, Forma should combine priority lists and preserve the user's explicit module choices.

## Module System Specification

Each module should be represented as a configuration object. The workspace renderer uses this object to generate navigation and module mini-apps.

### Module Object Shape

```json
{
  "id": "tasks",
  "label": "Tasks",
  "enabled": true,
  "order": 1,
  "settings": {},
  "tab": {
    "enabled": true,
    "summaryMetric": null
  }
}
```

### Module Fields

| Field | Type | Purpose |
| --- | --- | --- |
| `id` | string | Stable module identifier |
| `label` | string | Human-readable module name |
| `enabled` | boolean | Whether the module appears |
| `order` | number | Dashboard display order |
| `settings` | object | Module-specific onboarding values |
| `tab` | object | Module tab rendering metadata |

### Module Rules

- Every module must have a stable `id`.
- Every selected module must have `enabled: true`.
- Unselected modules should be absent from the workspace config, not included as disabled.
- Module settings should only contain values asked during onboarding.
- Modules should own tabs, not separate page routes, in Version 1.
- Modules should not include analytics or AI fields in Version 1.

## Module Onboarding Requirements

### Tasks Module

Purpose:
Helps users capture, prioritize, and execute daily work.

Required onboarding information:

| Question | Why it is asked | Dashboard impact |
| --- | --- | --- |
| What is your daily task limit? | Prevents the dashboard from encouraging unrealistic daily scope | Sets `tasks.settings.dailyTaskLimit` |

Optional future information:

- Preferred planning style
- Work days
- Default task categories

Version 1 settings:

```json
{
  "dailyTaskLimit": 6
}
```

### Habits Module

Purpose:
Helps users track repeatable behaviors and routines.

Required onboarding information:

| Question | Why it is asked | Dashboard impact |
| --- | --- | --- |
| What starter habits do you want to track? | Creates immediate value instead of an empty habits module | Sets `habits.settings.starterHabits` |

Optional future information:

- Habit frequency
- Reminder preference
- Habit categories

Version 1 settings:

```json
{
  "starterHabits": ["Reading", "Walking", "Planning"]
}
```

### Goals Module

Purpose:
Helps users define and track meaningful outcomes.

Required onboarding information:

| Question | Why it is asked | Dashboard impact |
| --- | --- | --- |
| What is your primary goal? | Gives the dashboard a clear north star | Sets `goals.settings.primaryGoal` |

Optional future information:

- Goal deadline
- Goal category
- Milestones

Version 1 settings:

```json
{
  "primaryGoal": "Launch my next project"
}
```

### Notes Module

Purpose:
Helps users store context, ideas, decisions, and reflections.

Required onboarding information:

| Question | Why it is asked | Dashboard impact |
| --- | --- | --- |
| What will you mainly use notes for? | Shapes the default notes prompt and dashboard empty state | Sets `notes.settings.notesFocus` |

Optional future information:

- Note categories
- Favorite note format
- Review cadence

Version 1 settings:

```json
{
  "notesFocus": "Ideas, meetings, reflections"
}
```

### Finance Module

Purpose:
Helps users understand monthly income and savings direction.

Required onboarding information:

| Question | Why it is asked | Dashboard impact |
| --- | --- | --- |
| What is your monthly income? | Establishes the baseline for finance planning | Sets `finance.settings.monthlyIncome` |
| What is your monthly savings target? | Creates a clear financial target | Sets `finance.settings.savingsTarget` |

Optional future information:

- Monthly expenses
- Debt payments
- Currency
- Pay schedule

Version 1 settings:

```json
{
  "monthlyIncome": 3200,
  "savingsTarget": 750
}
```

## Workspace Configuration Shape

The generated workspace configuration should use this structure:

```json
{
  "app": "Forma",
  "version": 1,
  "generatedAt": "2026-06-13T00:00:00.000Z",
  "profile": {
    "name": "Alex",
    "age": 28
  },
  "goals": [
    {
      "id": "productivity",
      "label": "Productivity"
    }
  ],
  "modules": [
    {
      "id": "tasks",
      "label": "Tasks",
      "enabled": true,
      "order": 1,
      "settings": {
        "dailyTaskLimit": 6
      }
    }
  ],
  "dashboard": {
    "layout": "personal-os",
    "theme": "dark",
    "tabs": ["home", "tasks"],
    "primaryModules": ["tasks"],
    "moduleTabsEnabled": true,
    "aiFeaturesEnabled": false,
    "analyticsEnabled": false
  }
}
```

## Local Storage Strategy

Forma Version 1 should store two local records:

| Key | Purpose |
| --- | --- |
| `forma.onboarding.v1` | In-progress onboarding answers |
| `forma.dashboardConfig.v1` | Final generated workspace configuration |
| `forma.dashboardData.v1` | Local module data, starter content, notes templates, and recommendations |

Storage rules:

- Data should remain fully local to the browser.
- No server is required.
- No account is required.
- Refreshing the page should preserve progress.
- Regenerating Forma should overwrite the previous workspace configuration.

## Implementation Boundaries

Version 1 should include:

- Landing page
- Onboarding flow
- Local storage
- Workspace configuration JSON generation
- Home tab
- Module tabs generated from onboarding
- Personalized starter content
- Settings tab for configuration export
- JSON preview
- JSON download

Version 1 should not include:

- AI features
- Analytics
- Accounts
- Cloud sync
- Backend services
- Advanced charts
- Custom module marketplace

## Open Product Decisions

These decisions can wait until after the onboarding architecture is stable:

- Whether module order should be fully user-controlled or mostly inferred
- Whether age should remain in Version 1
- Whether Fitness and Study should become full modules later
- Whether the generated dashboard config should support import
- Whether onboarding should support resetting or editing after generation
