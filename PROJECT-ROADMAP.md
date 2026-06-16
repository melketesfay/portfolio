# Personal Portfolio Roadmap

_Target: 1 month delivery of hire-me portfolio_

This roadmap defines the 3 core projects I will complete and present publicly.
These are the foundation of my portfolio, my “hire me” story, and my talking points in interviews.

The 3 main projects:

1. Portfolio Website (Frontend & Story)
2. Self-Hosted Infra + Deployment (DevOps / Production Simulation)
3. Mini E-Commerce App (Business/Feature Delivery)

Stretch projects (optional if time remains):

- Monitoring Dashboard (Ops visibility)
- Streaming Radio (fun/bonus)

Each main project is scoped to be small, demonstrable, and professional.

## High-Level Goals

### 1. Portfolio Website

**Goal:**
A fast, clean, dependency-free landing page (pure HTML/CSS/JS) that:

- Looks great on desktop and mobile.
- Loads fast in Firefox, Safari, and phones.
- Clearly tells my story and links to the other projects.
- Positions me as a Full Stack + Infra developer, not “random hobbyist.”

**“Done” means:**

- Lighthouse-style performance is good on mobile (no jank).
- Sections: About me, Skills, Projects, Contact.
- Screenshot previews / short blurbs of Infra Project and Shop Project.
- Responsive and accessible (keyboard nav OK, contrast OK).
- Clean code (no frameworks, no Tailwind, no React — demonstrates fundamentals).

### 2. Self-Hosted Infra & Deployment

**Goal:**
Show that I can run real infrastructure like a small company:

- Proxmox virtualization, pfSense firewall/VLAN segmentation.
- App stack deployed in Docker Compose with Nginx, PHP-FPM, MySQL, Redis.
- Separation between dev and prod workflows.
- Immutable “baked” PHP image with version tags and rollback.
- Restart policies, healthchecks, internal-only DB/Redis.
- Backup + basic ops procedure.

**“Done” means:**

- I have a short, clean written explanation (with diagrams/screenshots) of:

  - How code goes from commit → container image → production deploy.
  - How services communicate (Nginx → php-fpm → MySQL/Redis).
  - How pfSense protects the network.
  - How rollback works by changing the image tag.
  - How MySQL is persisted and backed up.

- This explanation is linked from the portfolio site as “Production-Style Deployment on My Own Infrastructure.”

### 3. Mini E-Commerce App

**Goal:**
A minimal but realistic shop that proves I can build features that matter for business.

**Scope:**

- Product list page (public)
- Product detail page
- Session-based cart
- Checkout with Stripe test mode
- Orders written to MySQL
- Admin dashboard (login required) to:

  - view orders (table)
  - change status (e.g. “paid” → “shipped”)

- Deployed in containers via the same infra/deploy story above.

**“Done” means:**

- I can demo:

  - Add item to cart
  - Checkout (Stripe test)
  - See order in dashboard
  - Mark order shipped

- App is running behind Nginx/PHP/MySQL/Redis on my infra.
- I have screenshots (admin dashboard, order list).
- This app appears on my portfolio site as “Example: I can build and ship a full product.”

### Stretch: Monitoring Dashboard (optional)

**Goal:**
A dashboard that shows live status of my infra:

- container health
- CPU/memory/load
- request count / 5xx rate
- Redis stats / DB up

**“Done” means:**

- A web UI (HTML/CSS/JS) that calls a small API (PHP) which returns system info.
- This can run inside my infra.
- Screenshot/demo only. Doesn’t need to be public-facing.

This is optional. If I run out of time, I skip it.

### Stretch: Streaming Radio Service (optional)

**Goal:**
Show I can run a 24/7 streaming service from my own infra.

**Done =**

- Document existing working pipeline (Liquidsoap + Icecast + scheduling).
- Add 1–2 screenshots and one paragraph on portfolio.
- (Rewriting the streaming core in raw PHP sockets + ffmpeg is NOT required for this month. That’s future / R&D.)

---

## Timeline / Milestones (4 Weeks)

### Week 1 — Portfolio Website

Focus: polish the public face.
This is the first impression in interviews, so it MUST be smooth.

**Tasks:**

- Audit current beta for performance problems:

  - too many DOM nodes?
  - heavy box-shadows / blur filters / backdrop-filters?
  - JS loops running on scroll/resize?
  - forced sync layout thrash?
  - animations using `top/left` instead of `transform`?

- Optimize for Firefox/Safari/mobile.
- Improve responsive layout (small screens first).
- Add content sections:

  - Intro / Who I am
  - What I build (Full Stack + Infra + Secure Deployments)
  - Projects (cards linking to Infra Case Study, Shop demo)
  - Contact / email / GitHub / LinkedIn

- Add screenshots placeholders for upcoming projects.
- Accessibility pass (tab through page, readable contrast).
- Finalize tone (confident, practical, not cringe).

**Deliverable by end of Week 1:**
A version of the portfolio site I’d be comfortable linking in a job application email.

### Week 2 — Infra & Deployment Case Study

Focus: prove I can ship and operate, not just code.

**Tasks:**

- Write final production README (done: `README-PRODUCTION.md`, already drafted).
- Add infra diagram:

  - Proxmox VMs
  - pfSense as firewall/router/VLAN segmentation
  - “public zone” (Nginx only)
  - “internal app network” (php-fpm + redis + mysql)
  - backup / rollback story

- Add screenshots:

  - pfSense firewall rules / NAT (sensitive data obscured)
  - GitLab CI/CD pipeline stages (build → tag → push image)
  - docker-compose.prod.yml (with restart policies and healthchecks)
  - Admin dashboard (from e-commerce app once ready)

- Write 1–2 paragraphs for non-technical people:

  - “Why this matters: This is how you deploy apps safely in real life, not just on localhost.”

**Deliverable by end of Week 2:**
A page/section I can show in an interview as:
“This is how I deploy, secure, and operate software end to end.”
This also becomes a Project card on the portfolio site.

### Week 3 — E-Commerce App (Core Functionality)

Focus: minimum viable product that proves I can build business features.

**Backend tasks:**

- MySQL schema:

  - products
  - orders
  - order_items
  - users (for admin login)

- Session-based cart using Redis-backed PHP sessions
- Add to cart / view cart
- Create Stripe Checkout Session in test mode
- On success, write order to DB

**Admin dashboard tasks:**

- Admin login
- Table of orders
- Mark order `paid` → `shipped`

**Infra tasks:**

- Run the app using the same stack:

  - Nginx → php-fpm → MySQL/Redis
  - docker-compose.dev.yml locally
  - docker-compose.prod.yml on infra

- Capture screenshots of:

  - storefront
  - checkout flow (test mode)
  - admin order table

**Deliverable by end of Week 3:**
A working “tiny shop” that:

- Runs in containers
- Takes test payments
- Stores orders
- Has a basic admin view

This becomes the second major Project card on the portfolio site:
“E-Commerce Mini Platform: payments, orders, admin dashboard, end-to-end deployable.”

This is the “I build things that make money” story.

### Week 4 — Polish & Presentation

Focus: package, not expand.

**Tasks:**

- Update portfolio with:

  - Final screenshots from Infra project
  - Final screenshots from Shop project
  - Short blurbs for each

- Add “Tech I use” section (PHP, Nginx, MySQL, Redis, Docker, pfSense, Proxmox, GitLab CI/CD, Stripe)
- Write short, confident project summaries with concrete language:

  - “Containerized deployment with rollback by image tag.”
  - “Session-sharing via Redis to support horizontal scaling.”
  - “Firewall isolation so that only reverse proxy is publicly reachable.”
  - “Stripe Checkout integration in test mode with persistent order storage.”

**Optional tasks if time remains:**

- Basic Monitoring Dashboard MVP:

  - small PHP API endpoint that returns CPU/mem/load/container health
  - a simple dashboard UI to display it
  - screenshot it and put it on portfolio as “Ops visibility / live health”

**Deliverable by end of Week 4:**

- Portfolio site final
- Infra/Deployment case study final
- E-commerce MVP final
- (Optional) monitoring dashboard screenshot + teaser

---

## Risk & Scope Control (Do Not Violate These 😈)

These rules exist to save me from myself:

1. **Radio streaming rewrite stays parked.**

   - I will present the radio as “I built a 24/7 streaming service using Liquidsoap + Icecast and automated scheduling.”
   - I will NOT rebuild the entire streaming core in raw PHP sockets + ffmpeg this month.
   - If someone asks about it, I explain what I _would_ do next. That’s enough.

2. **Shop scope stays brutally small.**

   - No user registration flows for customers.
   - No refunds logic.
   - No inventory forecasting.
   - No email templates unless I have extra time.
   - The admin side only needs: login → view orders → update status.

3. **Infra doc is not a book.**

   - This is not a “homelab flex.”
   - This is a “here is how I ship production-style software securely.”
   - I keep language business-relevant.

4. **Portfolio performance is not optional.**

   - If my landing page janks on mobile Safari, the recruiter already closed the tab.
   - If the first impression sucks, they won’t keep scrolling to find out I built a whole infra.
   - Week 1 is not allowed to slide.

5. **Week 4 is polish, not heroics.**

   - Week 4 is not “start a new idea.”
   - Week 4 is “finish, screenshot, document, publish.”
   - My output at the end of Week 4 must look consistent and presentable, not half-built.

---

## Final Deliverables (Portfolio-Ready)

By the end of this roadmap, I will have:

### (A) Public Portfolio Website

- Fast, responsive, accessible
- Clear positioning of me as:
  “Full-Stack Web Dev + Secure Deployment + Self-Hosted Infrastructure”
- Links to Infra Project + Shop Project
- My contact info

### (B) Infrastructure / Deployment Case Study

- Written explanation + diagrams/screenshots:

  - Proxmox + pfSense network segmentation
  - Nginx / PHP-FPM / MySQL / Redis stack
  - Dev vs Prod Docker Compose
  - Immutable Docker image build (`Dockerfile.prod`)
  - Versioned tags + rollback
  - Restart policies, healthchecks, backups

- Framed as: “I can ship and operate software safely, not just code it.”

### (C) E-Commerce Mini App

- Simple storefront
- Add to cart
- Stripe checkout in test mode
- Orders persisted in MySQL
- Admin dashboard (login → view orders → update status)
- Running on my infra, behind pfSense
- Screenshots in portfolio proving it exists

### (D) (Optional) Monitoring Dashboard

- Screenshot of a basic “infra status” dashboard
- Framed as: “Operational visibility / live health metrics”
- Even partial is enough to show awareness of observability

---

## Story I will tell in interviews

“I’m not just building toy apps.
I built:

1. A production-style containerized stack on my own infrastructure (Nginx, PHP-FPM, MySQL, Redis) running behind a firewall (pfSense) on virtualized hosts (Proxmox).
2. An e-commerce mini-platform with Stripe test checkout, order persistence, Redis-backed sessions, and an admin dashboard to manage orders.
3. A high-performance, dependency-free portfolio site where I explain my work clearly and show screenshots, deployment diagrams, and rollback strategy.

This shows that I can:

- build features,
- secure them,
- deploy them,
- keep them online,
- and communicate them.”

That’s the mission of this roadmap.
