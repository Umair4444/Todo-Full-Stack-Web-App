<!--
Sync Impact Report:
Version change: N/A (initial version) → 1.0.0
Modified principles: N/A
Added sections: Technology Stack Requirements, Package Management, Documentation Requirements
Removed sections: N/A
Templates requiring updates: ✅ .specify/templates/plan-template.md, ✅ .specify/templates/spec-template.md, ✅ .specify/templates/tasks-template.md
Follow-up TODOs: None
-->
# Todo-Full-Stack-Web-App Constitution

## Core Principles

### I. Technology Stack Standardization
All frontend development must use TypeScript with Next.js framework (version 16.0.1). All backend development must use Python. This ensures consistency, maintainability, and leverages the strengths of each language for their respective domains.

### II. Package Management Protocol
Frontend dependencies must be managed using npm. Python dependencies must be managed using uv. This provides standardized tooling for dependency management across the project.

### III. Virtual Environment Requirement
A Python virtual environment must always be activated before adding, installing, updating, or removing any Python packages, dependencies, frameworks, or libraries. This ensures isolated and reproducible development environments.

### IV. Test-Driven Development (NON-NEGOTIABLE)
All code must be developed with test-driven approach: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced. This ensures code quality and reliability from the start.

### V. Documentation Requirement
A README.md file must be created for every functionality with how-to instructions. If any changes are made, updates must be made in the README files. This ensures maintainability and knowledge transfer.

### VI. Context7 Documentation Standard
All documentation for downloading, installing, updating, deleting, or adding any package, dependency, framework, or library must be sourced from Context7. This ensures using the most accurate and up-to-date information.

## Technology Stack Requirements

The project must adhere to the following technology stack:
- Frontend: TypeScript with Next.js version 16.0.1
- Backend: Python
- Frontend Package Manager: npm
- Python Package Manager: uv
- All tools and libraries must follow best practices as defined by their respective communities

## Development Workflow

1. Always activate Python virtual environment before Python package operations
2. Write tests before implementing functionality
3. Maintain updated README files for all features
4. Consult Context7 for all package/library documentation
5. Follow best practices for code quality and architecture

## Governance

This constitution supersedes all other development practices. All amendments must be documented, approved, and include a migration plan. All PRs and reviews must verify compliance with these principles. Complexity must be justified with clear benefits to the project.

**Version**: 1.0.0 | **Ratified**: 2026-01-08 | **Last Amended**: 2026-01-08
