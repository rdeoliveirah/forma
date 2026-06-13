# Forma Product Redesign

## Purpose

Forma is not a dashboard builder.

Forma is a personal operating system that should make structural decisions for the user. The user should not assemble tabs, select modules, or design their own workspace. The user should describe who they are, what they are trying to improve, and what constraints they live with. Forma should turn that into an operating system.

The product promise is:

> Your life, structured around you.

That means Forma must create structure on the user's behalf.

## Why The Current Implementation Fails The Vision

### 1. It Still Makes The User Build The Product

The current onboarding asks the user to select modules. That sounds flexible, but it breaks the core philosophy.

Most users do not think in terms of modules. They think in terms of outcomes:

- I need to get my studies under control.
- I want to save money.
- I want to train consistently.
- I want to stop feeling scattered.
- I want to make progress on something important.

When Forma asks users to choose `Tasks`, `Habits`, `Goals`, `Notes`, or `Finance`, it shifts the design burden back onto them. That is the same mistake generic productivity apps make.

Forma should infer modules from user intent.

### 2. The Navigation Changes, But The Product Does Not

The current implementation can generate different tabs, but the content inside those tabs is still mostly the same pattern:

- Add item
- Display list
- Mark or edit item

This creates the appearance of personalization without delivering a meaningfully different experience.

A finance-focused user and a student may receive different tabs, but each tab still behaves like generic storage. That does not feel like a personal operating system. It feels like a collection of empty containers.

### 3. Modules Are Too Passive

Tasks, Goals, Habits, and Finance currently store data, but they do not help the user make decisions.

A useful operating system should answer:

- What should I do today?
- What matters most right now?
- What am I neglecting?
- What is the next practical action?
- What should be visible and what should be hidden?

The current modules wait for the user to know what to do. Forma should reduce that burden.

### 4. Home Is Not Yet A Command Center

Home should not be a summary page. It should be the control surface for today.

A command center should:

- Decide what deserves attention today
- Surface the highest-value next actions
- Explain why those actions matter
- Pull signals from selected modules
- Hide low-priority noise

If the user has to visit each tab to figure out what matters, Home has failed.

### 5. The Sidebar Feels Like Navigation, Not An Operating System

The sidebar should feel anchored, stable, and intentional. It should communicate that Forma has created a system for this user.

Current sidebar issues:

- It does not feel firmly attached to the left edge.
- Spacing does not create a strong product frame.
- Navigation items feel like ordinary page links instead of generated system areas.
- Settings is mixed into the same conceptual space as work modules.

The sidebar should be a generated map of the user's operating system.

## Redesign Principle

Forma should ask about life, then generate structure.

The user should not select modules directly.

Forma should determine:

- Which modules exist
- Which module is primary
- Module priority and order
- Navigation structure
- Default content
- Today's recommended actions
- Which signals appear on Home
- Which modules stay hidden

The user can review and adjust later, but adjustment should be secondary. The first experience should feel like Forma made a confident product decision.

## Redesigned Onboarding

### Onboarding Goal

The onboarding should identify the user's operating context, not ask them to build an interface.

The minimum useful onboarding inputs are:

1. Identity
2. Current identities or life contexts
3. Primary outcome
4. Current friction
5. Time horizon
6. Weekly rhythm
7. Optional financial baseline, if relevant

### Question 1: What should Forma call you?

Purpose:
Personalizes the product and creates a human welcome.

Product decision affected:

- Home greeting
- Workspace naming
- Local profile metadata

### Question 2: Which identities fit you right now?

Example answers:

- Student
- Working professional
- Athlete
- Builder
- Creator
- Freelancer
- Finance-focused
- General life organization

Purpose:
Identifies the user's overlapping operating contexts. This should be multi-select because real users can be student-athletes, creator-builders, finance-focused freelancers, and other blended identities.

Product decision affected:

- Combined persona scores
- Primary module candidates
- Recommended default content
- Home language
- Navigation priority

### Question 3: What are you trying to improve first?

Example answers:

- Stay on top of work
- Study consistently
- Train consistently
- Save more money
- Build better routines
- Make progress on a major goal
- Organize thoughts and decisions

Purpose:
Identifies the user's main desired outcome.

Product decision affected:

- Primary module
- Home command center emphasis
- Starter actions
- Recommended daily priority

### Question 4: What usually gets in the way?

Example answers:

- Too many tasks
- No clear priorities
- Inconsistent habits
- Poor planning
- Money feels unclear
- I forget ideas and decisions
- I start goals but do not finish

Purpose:
Identifies the user's core friction.

Product decision affected:

- Secondary modules
- Recommendation logic
- Empty state language
- Default priority rules

### Question 5: What time horizon matters most right now?

Example answers:

- Today
- This week
- This month
- This semester
- This training cycle
- This savings period

Purpose:
Determines how Forma should frame progress.

Product decision affected:

- Home priority window
- Goal defaults
- Habit cadence
- Finance period
- Task grouping

### Question 6: How much structure do you want?

Example answers:

- Light
- Balanced
- Strict

Purpose:
Determines how assertive Forma should be.

Product decision affected:

- Number of recommended actions
- Number of starter tasks/habits/goals
- Whether Home shows one clear action or several
- Whether modules use minimal or detailed defaults

### Conditional Question: What is your monthly income and savings target?

Asked only when finance is strongly indicated by role, outcome, or friction.

Purpose:
Gives Finance enough baseline data to create value immediately.

Product decision affected:

- Finance module creation
- Savings progress
- Home financial recommendation
- Default finance tasks

## Automatic Module Generation

Forma should use deterministic rules in Version 1. No AI is required.

The generation system should score each module based on onboarding answers. Modules are included when their score passes a threshold.

### Available Modules

- Tasks
- Habits
- Goals
- Notes
- Finance

### Module Scoring Model

Each onboarding answer adds weight to one or more modules. Persona answers are multi-select, so Forma adds the scores from every selected persona before applying outcome, friction, horizon, and structure modifiers.

Example:

| Signal | Tasks | Habits | Goals | Notes | Finance |
| --- | ---: | ---: | ---: | ---: | ---: |
| Student | +2 | +1 | +2 | +3 | 0 |
| Athlete | +1 | +3 | +2 | +1 | 0 |
| Builder | +3 | +1 | +3 | +2 | 0 |
| Creator | +1 | +2 | +2 | +4 | 0 |
| Finance-focused | +1 | 0 | +2 | +1 | +4 |
| Stay on top of work | +4 | +1 | +1 | +1 | 0 |
| Save more money | +1 | +1 | +2 | +1 | +4 |
| No clear priorities | +3 | 0 | +3 | +1 | 0 |
| Inconsistent habits | +1 | +4 | +1 | 0 | 0 |
| Forget ideas and decisions | +1 | 0 | +1 | +4 | 0 |

### Inclusion Rules

- Include Home always.
- Include modules with score `>= 3`.
- The highest-scoring module becomes the primary module.
- Ties are resolved deterministically by the primary outcome.
- Finance requires either a strong finance signal or explicit financial baseline.
- Notes should be included when context, study, decisions, or reflection are important.
- Goals should be included when the user has a medium or long time horizon.

### Priority Rules

Navigation order should be:

1. Home
2. Primary module
3. Secondary modules by score
4. Settings

Example outputs:

| User description | Generated navigation |
| --- | --- |
| Student, study consistently, forgets ideas, semester horizon | Home, Notes, Tasks, Goals, Habits, Settings |
| Athlete, train consistently, inconsistent habits, training cycle | Home, Habits, Goals, Notes, Settings |
| Finance-focused, save money, money unclear, monthly horizon | Home, Finance, Goals, Tasks, Notes, Settings |
| Professional, stay on top of work, too many tasks, today horizon | Home, Tasks, Goals, Notes, Settings |

## How Modules Should Provide Actual Value

Modules should not be generic CRUD pages. Each module should have a job to do.

### Tasks Module

Current failure:
Tasks are just a list.

Product role:
Help the user decide what to do next.

Should provide:

- Today's priority queue
- Suggested task limit based on structure preference
- Separation between must-do, should-do, and later
- A clear next action
- Overflow warning when the day is overloaded

Starter content examples:

- Student: "Review next deadline", "Complete one study block", "Prepare tomorrow's class materials"
- Finance-focused: "Check upcoming bills", "Update savings progress", "Review one recurring expense"
- Productivity user: "Choose top priority", "Block focus session", "Close one loose end"

### Habits Module

Current failure:
Habits are just toggles.

Product role:
Help the user maintain consistency.

Should provide:

- A small number of relevant habits
- Today's habit status
- Streaks
- Missed habit recovery language
- A recommendation for the next habit to complete

Starter content examples:

- Athlete: "Training session", "Mobility", "Hydration"
- Student: "Study block", "Daily review", "No-phone focus"
- Personal growth: "Reflection", "Reading", "Evening reset"

### Goals Module

Current failure:
Goals are progress bars without guidance.

Product role:
Connect daily action to meaningful outcomes.

Should provide:

- Primary outcome
- Milestone suggestions
- Next action attached to each goal
- Progress state
- Goal health status based on recent activity

Starter content examples:

- Student: "Finish semester strong", "Improve weakest subject"
- Athlete: "Complete training cycle", "Improve recovery consistency"
- Finance-focused: "Build savings buffer", "Reduce recurring expenses"
- Productivity: "Finish important project milestone"

### Notes Module

Current failure:
Notes are a blank text area.

Product role:
Capture useful thinking in the right format.

Should provide:

- Context-specific templates
- Recent notes
- Suggested note type based on persona
- Decision capture
- Reflection capture

Starter templates:

- Student: "Concept / Example / Question"
- Finance: "Decision / Tradeoff / Next action"
- Athlete: "Session / Energy / Recovery"
- Productivity: "Decision / Context / Follow-up"
- Personal growth: "What happened / What I noticed / What I choose next"

### Finance Module

Current failure:
Finance stores income and savings target.

Product role:
Help the user understand financial direction.

Should provide:

- Monthly baseline
- Savings target
- Current savings progress
- Remaining amount
- Suggested next financial action
- Simple spending review prompt

Starter actions:

- "Update current savings"
- "Review one recurring expense"
- "Choose one expense to reduce"
- "Confirm upcoming payment"

## Recommendation System Without AI

Forma can feel intelligent without AI by using deterministic decision rules.

Recommendations should be generated from:

- User context
- Primary outcome
- Friction
- Time horizon
- Module scores
- Existing module data
- Completion state

### Recommendation Types

#### Next Action

The one thing the user should do next.

Examples:

- "Complete your first study block before adding more tasks."
- "Update savings progress before reviewing expenses."
- "Mark today's training habit after your session."

#### Warning

Shows when the user's system is drifting.

Examples:

- "You have more open tasks than your daily structure allows."
- "Your savings progress is behind your target."
- "No habit has been completed today."

#### Recovery

Helps the user resume after missing something.

Examples:

- "Restart with one habit today. Do not rebuild the whole routine."
- "Pick one overdue task and move the rest to later."

#### Planning Prompt

Guides the user when there is not enough data yet.

Examples:

- "Add one goal so Home can prioritize your week."
- "Capture one note from today before it is lost."

### Recommendation Priority

Home should show recommendations in this order:

1. Urgent blockers
2. Primary module next action
3. Time-sensitive task
4. Habit due today
5. Goal with lowest progress
6. Finance update
7. Note/reflection prompt

### Recommendation Rules

Examples:

- If Tasks exists and open tasks exceed the daily limit, recommend reducing the list.
- If Finance exists and current savings is empty, recommend updating savings.
- If Habits exists and no habit is complete today, recommend the easiest habit.
- If Goals exists and all goals are at `0%`, recommend defining the first milestone.
- If Notes exists and no note has been created, recommend a template based on persona.

## Automatic Onboarding-To-Workspace Flow

```text
Landing
  |
  v
Describe yourself
  |
  v
Choose primary outcome
  |
  v
Identify friction
  |
  v
Choose time horizon and structure level
  |
  v
Conditional baseline questions
  |
  v
Forma scores modules
  |
  v
Forma generates:
  - Navigation
  - Primary module
  - Secondary modules
  - Starter content
  - Home recommendations
  - Today priorities
  |
  v
Review generated Forma
  |
  v
Enter personal OS
```

## Home As An Actionable Command Center

Home should be the most important screen in Forma.

It should not ask:

> What do you want to open?

It should answer:

> What should you pay attention to now?

### Home Sections

#### 1. Today's Focus

One primary action selected from module state and onboarding context.

Example:

- Student: "Complete your first study block."
- Finance-focused: "Update current savings."
- Athlete: "Complete today's training habit."

#### 2. Priority Queue

A short list of 3 to 5 actions. These are not generic tasks; they are generated from the user's system.

#### 3. System Status

Shows whether the user's operating system is healthy.

Example signals:

- Tasks within daily limit
- Habit completed today
- Goal has next action
- Finance progress updated
- Note captured recently

#### 4. Module Signals

Short summaries from selected modules.

Examples:

- "2 tasks open"
- "0 habits completed today"
- "$400 remaining to savings target"
- "Goal progress: 35%"

#### 5. Recommended Adjustment

One small suggestion to improve the system.

Examples:

- "Your task list is too large for today. Move two items to later."
- "Your goals have progress, but no next actions. Add one next step."

## Sidebar Product Direction

The sidebar should feel like the user's generated operating system map.

Rules:

- It should be anchored flush to the left edge.
- It should span the full viewport height on desktop.
- Home should be visually distinct as the command center.
- The primary module should be visually emphasized.
- Settings should be separated from work modules.
- Spacing should feel deliberate and stable.

Desktop structure:

```text
Forma
Personal OS

Home

Primary Module
Secondary Module
Secondary Module
Secondary Module

Settings
```

Mobile structure:

- Top horizontal module switcher
- Home first
- Settings last
- Primary module near Home

## Version 1 Redesign Boundaries

Version 1 should include:

- Non-AI onboarding inference
- Automatic module generation
- Automatic navigation generation
- Personalized starter content
- Deterministic recommendations
- Home command center
- Module tabs with practical workflows
- Local storage
- Settings export

Version 1 should not include:

- AI
- Analytics
- Accounts
- Cloud sync
- Custom module marketplace
- Manual module marketplace
- Complex charts
- Social features

## Success Criteria

Forma succeeds when two users with different onboarding answers receive different products.

Not just:

- Different tabs
- Different labels
- Different empty states

But:

- Different default actions
- Different Home priorities
- Different module order
- Different recommendation logic
- Different workflows
- Different sense of what the product wants them to do next

The user should feel:

> Forma understood my situation and gave me a system.

Not:

> Forma gave me blank tools to configure.
