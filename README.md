# AI Productivity Suite

Build a modern, responsive SaaS web application called AI Workplace Productivity Assistant.

The app helps professionals complete everyday workplace tasks using AI through three core tools:

1. Smart Email Generator

Users enter:

Email purpose/context

Recipient

Tone: Formal, Friendly, Persuasive

Length: Short, Medium, Detailed

The AI must generate a unique, context-specific professional email based on the user's actual input.

Display:

Subject

Email body

Edit

Copy

Regenerate

Save

Do NOT use generic or pre-written responses.

2. AI Task Planner

Users enter their tasks, deadlines, priorities and estimated time.

Allow planning for:

Today

Tomorrow

This Week

The AI must analyse the user's actual tasks and generate a personalised schedule based on urgency, priority, deadlines and workload.

Allow users to:

Edit tasks

Reorder tasks

Mark tasks complete

Regenerate

Save

Do NOT use fixed sample schedules as the generated result.

3. AI Research Assistant

Users can either:

Enter a research topic, or

Paste an article/text.

The AI must analyse the actual user-provided content and generate:

Executive Summary

Key Points

Key Insights

Recommendations

Questions for Further Research

Outputs must be genuinely AI-generated and specific to the user's input. Do NOT return generic placeholder answers.

Dashboard

Create a clean professional dashboard with:

AI Workplace Productivity Assistant

Welcome message:
"Work smarter, not harder."

Three feature cards:

Smart Email Generator

AI Task Planner

AI Research Assistant

Include a simple recent activity section.

Navigation

Use a clean maroon sidebar with:

Dashboard

Smart Email Generator

AI Task Planner

AI Research Assistant

Saved Outputs

Settings

Help & Support

Use maroon as the primary brand colour, with white/light-grey backgrounds and dark text.

IMPORTANT: No Authentication

Do NOT create a registration page, login page, sign-in page, authentication system, or user account system.

When a user opens the application, they should immediately access the dashboard and use all features without registering or signing in.

IMPORTANT: No Backend

This is a frontend-only application.

Do NOT create:

Database

User authentication

Backend server

User accounts

Server-side storage

Use browser/local storage only where necessary for features such as saved outputs.

IMPORTANT: Real AI Generation

The three tools must use real AI generation, not generic predefined responses.

AI outputs must be based on the user's actual inputs.

Use structured prompts behind each tool so that the AI understands the user's:

Context

Requirements

Preferences

Tone

Priority

Desired output

If an AI API/key is required, structure the application so the AI integration can be connected easily. Do not replace AI generation with hardcoded responses.

Editable Outputs

Every AI result must be editable.

Provide:

Edit

Copy

Regenerate

Save

The user must remain in control of the final content.

Responsible AI

Include a small professional disclaimer:

"AI-generated content may contain errors or omissions. Always review and verify important information before relying on it. You remain responsible for the final content and decisions you make."

Design

Make the application:

Modern

Clean

Professional

Minimal

Responsive

Mobile-friendly

Easy to navigate

SaaS-style

Avoid unnecessary features, excessive animations and complicated UI.

Priority: Focus development on making the three AI tools work properly with genuine, personalised AI-generated responses. Do not spend development effort on authentication, backend infrastructure or unnecessary features.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/eb9a2f20-e427-4310-bec9-cdd5e8091238).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
