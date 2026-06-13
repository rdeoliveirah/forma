# Forma Finance Module

## Purpose

Finance is Forma's money operating area. It is designed to answer:

- Where is my money going?
- Am I staying within budget?
- Am I saving enough?
- Are my savings goals on track?
- Are my investments gaining or losing value?
- What is the next financial action I should take?

The module stays deterministic in Version 1. It does not use AI, external APIs, accounts, or backend services.

## Features

- Finance dashboard with total balance, monthly income, monthly expenses, savings rate, estimated net worth, and financial status.
- Transaction tracking for income and expenses with categories, descriptions, dates, totals, history, and deletion.
- Category budgeting with usage progress, remaining budget, and overspending warnings.
- Savings goals with target amount, saved amount, progress percentage, and status.
- Manual investments with amount invested, current value, profit/loss, return percentage, portfolio summary, and concentration warnings.
- Analytics using native HTML/CSS chart bars in vanilla JavaScript. No chart library was added.
- Insights Center with rule-based info alerts, recommendations, warnings, recovery prompts, and next actions.
- Demo data loader for realistic transactions, budgets, savings goals, and investments.
- Currency selector for EUR, USD, GBP, CAD, and AUD.
- Financial Profile settings for current balance, monthly income, currency, and full Finance reset.
- Monthly finance cycles with current month, current date, days left, current-month summaries, and historical month storage.
- Recurring monthly payments for fixed costs such as rent, subscriptions, utilities, insurance, transport, and memberships.
- Debt tracking for credit cards, loans, mortgages, personal debt, and other liabilities.
- Disposable income estimates after fixed recurring obligations, debt payments, and current-month variable expenses.
- Date-based due tracking for recurring payments and debts, including overdue, due within 3 days, and due within 7 days states.
- Investment editing with asset category, notes, updated current value, live profit/loss, return percentage, allocation, and concentration insight updates.

## Local Storage

Finance uses the existing Forma workspace persistence system.

- Workspace data key: `forma.workspaceData.v2`
- Finance path: `workspaceData.finance`

Finance data shape:

```json
{
  "currency": "USD",
  "monthlyIncome": 0,
  "savingsTarget": 0,
  "currentSavings": 0,
  "transactions": [],
  "budgets": [],
  "savingsGoals": [],
  "investments": [],
  "recurringPayments": [],
  "debts": [],
  "months": {
    "2026-06": {
      "transactions": [],
      "budgets": [],
      "savingsGoals": []
    }
  }
}
```

Refreshing the browser preserves Finance data through the same local storage flow as the rest of Forma. Monthly transactions, budgets, and savings goals are stored under `workspaceData.finance.months` by `YYYY-MM` key. The top-level arrays mirror the current month for compatibility with the existing app shell. Investments remain global because they contribute to net worth across cycles.

Current balance is manually managed by the user in Financial Profile. Transactions drive monthly cash flow, budgets, insights, and savings rate, but Forma does not assume it can infer the real bank balance from partial transaction history.

Recurring payments and debts are global Finance records because they carry across monthly cycles. Active recurring payments and active debt monthly payments are included in current-month expense totals and disposable-income calculations. Each obligation stores a `dueDate`, which drives due labels, days remaining, warning states, and insights.

Reset Finance Data restores the Finance object to its default state, including transactions, budgets, savings goals, investments, recurring payments, debts, month history, current balance, monthly income, and currency.

## Rule-Based Insight Logic

Finance recommendations are generated from current-month local state:

- No transactions: prompt the user to add transactions or load demo data.
- Expenses exceed income: show an overspending warning and recommend reviewing the largest spending area.
- Fixed costs above 50% of income: show a fixed-cost warning.
- Debt payments above 20% of income: show a debt-load warning.
- Payments due within the next seven days: show an upcoming payment alert.
- Payments due within three days: show an urgent warning.
- Overdue payments: show an overdue warning.
- Optional recurring costs exist: recommend reviewing optional subscriptions or memberships.
- Disposable income is low: show a low disposable income warning.
- Savings rate below 10%: show a low savings rate warning and recommend reviewing recurring expenses.
- Budget usage above 100%: show a category overspending warning.
- Savings goal below 25% progress: recommend scheduling the next contribution.
- One investment above 60% of portfolio value: show a concentration warning.
- Portfolio profit/loss below zero: show a portfolio review info alert.
- No active issues: recommend keeping the money map current weekly.

Home can read Finance state to show savings progress, warnings, and the next financial action when Finance is part of the generated Forma workspace.
