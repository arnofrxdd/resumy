# Contributing to Resumy

First off, thank you for considering contributing to Resumy! It's people like you that make Resumy such a great tool.

## 🌈 How Can I Contribute?

Before you start, please review our deep-dive documentation:
- [System Architecture](./docs/ARCHITECTURE.md)
- [AI Integration Guide](./docs/AI_INTEGRATION.md)
- [PDF Generation Engine](./docs/PDF_ENGINE.md)
- [Design System & UI](./docs/DESIGN_SYSTEM.md)
- [AI Template Creation Guide](./frontend/app/resume-creator/templates/AI_TEMPLATE_CREATION_GUIDE.md)

### Reporting Bugs
If you find a bug, please open an issue and include:
- A clear, descriptive title.
- Steps to reproduce the bug.
- Actual vs. expected behavior.
- Screenshots if applicable.
- Your environment details (OS, Browser, Node version).

### Suggesting Enhancements
Have a great idea? Open an issue and describe:
- The problem your suggestion solves.
- Your proposed solution.
- Potential edge cases.

### 🎨 Adding Templates
The fastest way to contribute is by adding new resume templates! We have a streamlined, AI-powered workflow for this:
- **Fast Workflow**: Use our [AI Template Creation Guide](./frontend/app/resume-creator/templates/AI_TEMPLATE_CREATION_GUIDE.md) to build templates in minutes using Claude.
- **Auditing**: Always run our audit scripts (`render_audit.js` and `field_audit.js`) to ensure high-quality, bug-free renders.

### Pull Requests
Ready to dive in?
1. **Fork** the repository and create your branch from `main`.
2. **Setup** the project locally (see [README.md](./README.md)).
3. **Write code**: Ensure your changes are well-tested and follow our coding standards.
4. **Lint**: Run `npm run lint` in the relevant directory.
5. **Commit**: Use clear, descriptive commit messages (e.g., `feat: add PDF dark mode support`).
6. **Submit**: Open a Pull Request with a clear description of your changes.

---

## 💻 Technical Guidelines

### Coding Standards
- **TypeScript**: We use TypeScript for everything. Avoid `any` where possible.
- **Components**: Use React functional components with Tailwind CSS for styling.
- **Aesthetics**: Keep UI changes consistent with our minimalist, professional design language.
- **State Management**: Use React hooks and contexts for local/global state.

### Backend Development
- Ensure all new services are documented and handle errors gracefully.
- Minimize database calls by using efficient Supabase queries.
- When adding AI features, consider token usage and rate limits.

### Testing
- Frontend: Use Jest and React Testing Library for component tests.
- Backend: Use Jest and Supertest for API endpoint tests.

---

## ⚖️ Code of Conduct
By participating in this project, you agree to abide by our code of conduct. Please treat all contributors with respect and professionalism.

---

Thank you for contributing to the future of resume building! 🚀
