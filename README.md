<div align="center">

# 🌸 FEM-CARE-AI

### AI-Powered Women's Reproductive Health & Wellness Platform

Empowering women with intelligent health insights, personalized wellness support, and evidence-based reproductive healthcare through Artificial Intelligence.

![GitHub stars](https://img.shields.io/github/stars/ndagirenairah/FEM-CARE-AI?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/ndagirenairah/FEM-CARE-AI?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/ndagirenairah/FEM-CARE-AI?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

</div>

---

# 📖 Overview

**FEM-CARE-AI** is an AI-powered digital health platform designed to improve women's reproductive health through intelligent symptom tracking, menstrual health management, preventive healthcare education, personalized wellness recommendations, and AI-assisted health support.

The platform supports women throughout every stage of life—from puberty and reproductive years to pregnancy and menopause—by combining Artificial Intelligence, Machine Learning, data analytics, and modern web technologies.

Our mission is to improve health awareness, encourage preventive care, and empower women to make informed health decisions.

> **Medical Disclaimer**
>
> FEM-CARE-AI is intended for educational and wellness support purposes only. The platform does **not** diagnose, treat, or replace licensed healthcare professionals. Users should always consult qualified medical practitioners for diagnosis and treatment.

## Hackathon Submission Write-up

FemCare AI is a full-stack women's health platform that combines cycle tracking, symptom pattern awareness, wellness logging, health education, appointments, records, and an educational chat experience in one accessible web app. It addresses the real-world problem of fragmented reproductive-health support by helping users organize personal health information, recognize potentially concerning patterns, and prepare for informed conversations with qualified clinicians. Its deterministic assessment and symptom-checking logic includes emergency red-flag guidance while clearly avoiding diagnosis or treatment claims. The project uses Next.js, React, TypeScript, Tailwind CSS, Drizzle ORM, PostgreSQL support, secure password hashing, signed sessions, and a local demo mode. AI-assisted development was used responsibly, with implementation, testing, licensing, and safety responsibility retained by the project author.

**Repository:** https://github.com/ndagirenairah/FEM-CARE-AI

**Demo video:** Not provided yet. If added, share a Google Drive link with access set to “Anyone with the link”.

**Live demo:** Not deployed yet. The project can be run locally with `npm install` followed by `npm run dev`.

---

# 🎯 Vision

To become Africa's leading AI-powered women's digital health platform that promotes preventive healthcare, health education, and early awareness of reproductive health conditions.

---

# 🎯 Objectives

- Improve reproductive health awareness
- Encourage preventive healthcare
- Support healthy lifestyle habits
- Increase access to reliable health education
- Promote early recognition of concerning symptoms
- Deliver personalized AI-powered wellness guidance
- Help users monitor long-term health trends

---

# 🌍 Target Users

- Teen Girls
- University Students
- Women of Reproductive Age
- Pregnant Women
- Mothers
- Women with PCOS
- Women experiencing Hormonal Imbalances
- Women with Chronic Reproductive Health Conditions
- Women approaching Menopause
- Healthcare Professionals

---

# ✨ Key Features

## 👤 User Management

- User Registration
- Secure Authentication
- Profile Management
- Health Profile
- Password Recovery
- Email Verification
- Role-Based Access Control

---

## ❤️ Women's Health Dashboard

- Personalized Dashboard
- Daily Health Summary
- AI Recommendations
- Upcoming Health Reminders
- Wellness Progress
- Health Score
- Personalized Insights

---

## 🌸 Menstrual Health

- Period Tracking
- Ovulation Prediction
- Fertility Window Tracking
- PMS Monitoring
- Flow Tracking
- Menstrual Pain Tracking
- Cycle Analytics
- Menstrual Calendar

---

## 🧬 Hormonal Health

Monitor symptoms including:

- Facial Hair Growth
- Acne
- Hair Loss
- Weight Changes
- Mood Swings
- Fatigue
- Breast Tenderness
- Sleep Quality
- Skin Changes

---

## 🤖 Artificial Intelligence

### AI Health Assistant

Provides educational guidance on:

- Reproductive Health
- Hormonal Health
- Nutrition
- Pregnancy
- Menopause
- Women's Wellness

---

### AI Symptom Assessment

Analyzes user-reported symptoms to provide:

- Educational information
- Personalized wellness guidance
- Health trend monitoring
- Recommendations on when to seek professional care

---

### AI Health Coach

Supports healthy habits by providing personalized recommendations based on:

- Lifestyle
- Nutrition
- Sleep
- Exercise
- Hydration
- Mental Wellbeing

---

### AI Health Reports

Automatically generates:

- Monthly Health Reports
- Symptom Trends
- Lifestyle Analytics
- Wellness Progress Reports

---

# 🏥 Health Modules

- Menstrual Health
- Hormonal Health
- Pregnancy Support
- Fertility Support
- Menopause Care
- Breast Health Education
- Cervical Health Awareness
- Mental Wellness
- Nutrition
- Physical Activity
- Medication Management
- Hydration Tracking
- Sleep Monitoring

---

# 📚 Health Education Center

Access evidence-based educational content covering:

- Puberty
- Menstrual Health
- Hormonal Disorders
- PCOS
- Endometriosis
- Urinary Tract Infections
- Pregnancy
- Breast Health
- Cervical Health
- Menopause
- Healthy Lifestyle Practices

---

# 📊 Analytics & Monitoring

Track:

- Menstrual Cycles
- Symptoms
- Weight
- Mood
- Water Intake
- Sleep
- Physical Activity
- Medication Adherence
- Wellness Progress

Interactive charts help users visualize long-term health trends.

---

# 👩‍⚕️ Healthcare Services

- Appointment Scheduling
- Medical History
- Health Reports
- Digital Health Records
- Hospital Locator *(Future)*
- Doctor Portal *(Future)*

---

# 👥 Community

- Anonymous Community Discussions
- Women's Health Forums
- Educational Articles
- Wellness Challenges
- Success Stories

---

# Technology Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

## Backend

- Next.js Route Handlers
- Drizzle ORM
- Node.js `crypto` for password hashing and signed sessions

## Database

- PostgreSQL via `pg` and Drizzle ORM when `DATABASE_URL` is configured
- Local JSON auth fallback for demos and development without a database

## Artificial Intelligence

- Deterministic, explainable rule-based assessment and symptom checker
- AI-ready module boundary in `src/lib/ai.ts`
- No external AI API or model is required to run the current demo

## Authentication

- Signed HTTP-only session cookie
- Scrypt password hashing
- Local development authentication fallback

## Deployment

- Any Node.js host that supports Next.js

---

# Database Design

Core database entities include:

- Users
- User Profiles
- Menstrual Cycles
- Symptoms
- Mood Logs
- Health Assessments
- Medications
- Appointments
- Health Records
- AI Recommendations
- Educational Articles
- Community Posts
- Notifications
- Chat Messages
- Wellness Points

---

# Security & Privacy

The current implementation prioritizes privacy through:

- Secure Authentication
- Password Encryption
- Signed session authorization
- Protected API endpoints
- Data Validation
- Secure Database Storage
- Privacy-Focused Design

---

# Project Structure

```
src/app/          Next.js pages and API route handlers
src/components/   Shared client UI
src/db/           Drizzle schema and database connection
src/lib/          Auth, health logic, content, and AI assessment code
```

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/ndagirenairah/FEM-CARE-AI.git
```

Navigate into the project

```bash
cd FEM-CARE-AI
```

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

The current demo uses local authentication when `DATABASE_URL` is not configured. Configure `DATABASE_URL` and `SESSION_SECRET` for a deployed database-backed environment.

## Hackathon Compliance

This project addresses the theme **AI & Emerging Technology for Real-World Impact** by using automated health education, cycle tracking, symptom pattern awareness, and wellness guidance to support earlier awareness and informed conversations with clinicians.

- **AI use:** AI-assisted development is disclosed; the current assessment engine is deterministic and does not claim to diagnose or treat.
- **Safety:** The symptom checker identifies emergency red flags and directs users to emergency care. Every health workflow carries an educational-use disclaimer.
- **Privacy:** Do not enter real sensitive health information into an untrusted deployment. Production deployments must use a managed database, a strong `SESSION_SECRET`, HTTPS, access controls, retention rules, and a reviewed privacy policy.
- **Intellectual property:** The submitter is responsible for confirming rights, licenses, and attribution for all code, content, datasets, models, and services used in the submission. Significant pre-existing project components must be disclosed.
- **Fair competition:** The project does not manipulate votes, judging, submissions, or other participants' infrastructure. Organizers may request a demonstration or source review.
- **Rules acceptance:** New accounts must accept the complete [hackathon rules](/rules) before registration. Demo accounts use the same acceptance path.

The rules page is an implementation of the supplied hackathon rules. Organizers' official terms and any event-specific deadline or participation requirements take precedence.

---

# 📅 Roadmap

- AI Health Assistant
- AI Symptom Assessment
- AI Hormonal Health Coach
- AI Nutrition Planner
- AI Pregnancy Companion
- AI Menopause Support
- Doctor Portal
- Telemedicine Integration
- Wearable Device Integration
- Mobile Application
- Predictive Health Analytics
- Offline Support

---

# 🤝 Contributing

Contributions are welcome.

To contribute:

1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Push to your branch
5. Submit a Pull Request

---

# 👩‍💻 Author

**Nairah Ndagire**

Software Developer | Artificial Intelligence Enthusiast | Health Technology Innovator

GitHub:
https://github.com/ndagirenairah

---

# 📜 License

This project is licensed under the **MIT License**.

---

# ⭐ Support the Project

If you find this project valuable, consider giving it a **⭐ Star** on GitHub.

Your support helps promote innovation in women's digital health.

---

<div align="center">

### 🌸 Empowering Women Through Artificial Intelligence & Preventive Healthcare 🌸

Made with ❤️ by **Nairah Ndagire**

</div>
