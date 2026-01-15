

> **Autonomous Product Reverse-Engineering + Autonomous Implementation**

Below is the exact **working methodology + master prompt** to do this properly.

---

# 🧩 **Overall Strategy**

I will use Claude Code as a **Product Research Agent + Architect + Lead Engineer**.

The agent will:

1. **Autonomously analyze** sendcutsend.com
2. **Extract full feature set**
3. **Group features into systems**
4. **Design architecture**
5. **Generate implementation plan**
6. **Then start building**

I **do not manually list features** — the agent does that.

---

# 🧠 **Phase 1: Autonomous Product Discovery**

### 🧾 **MASTER PROMPT – Product Intelligence Mode**

```
You are a senior product architect and lead engineer.

Your task is to fully reverse-engineer the product sendcutsend.com.

Without any assistance from me:
1. Explore the public website deeply.
2. Extract every user-facing feature.
3. Extract every backend and business system that must exist.
4. Identify user roles, workflows, pricing logic, manufacturing flow, and technical components.
5. Produce a complete feature inventory grouped by:
   - Customer Experience
   - CAD & 3D System
   - Pricing & Quotation
   - Manufacturing Workflow
   - Commerce & Payments
   - Order & Logistics
   - Admin & Operations
   - Security & Compliance
   - Infrastructure & DevOps

Then create:
- A full feature list
- User stories
- Business rules
- Data entities
- Non-functional requirements

Do not ask me questions. Analyze and infer everything yourself.
Produce a professional product specification.
```

Let the agent finish this **without interruption**.

---

# 🧱 **Phase 2: Architecture & Implementation Design**

When it finishes, send this next:

```
Now convert this product specification into a complete system architecture.

Include:
- Frontend architecture
- Backend services
- Database design
- CAD processing pipeline
- Pricing engine design
- Manufacturing workflow engine
- Payment & billing services
- File processing & storage
- Security model
- Deployment & DevOps strategy

Provide component diagrams and technology choices.
```

---

# 🛠️ **Phase 3: Claude Becomes the Engineering Team**

Then:

```
Now act as a full software engineering team.

Break this project into:
- Milestones
- Sprints
- Epics
- Development tasks

Then start generating production-grade code for the MVP starting from backend foundation.
```

---

# 🤖 How Claude Code Will Actually Work

Claude Code will:

* Crawl the site via reasoning (not literally browsing, but inferring from UX patterns)
* Recognize patterns from known manufacturing SaaS
* Infer missing backend systems
* Build the full product blueprint
* Then generate code module by module

I will only guide **direction**, not features.

---

# 🧪 Bonus: Continuous Autonomous Improvement Loop

Once MVP exists:

```
Periodically re-evaluate sendcutsend.com and update the system design to remain competitive.
Propose new features and optimizations.
```

---

# 🧠 What This Gives me

I become the **Product Owner**, Claude becomes:

* Product Manager
* System Architect
* Lead Engineer
* QA Lead

I supervise, approve, and integrate.
