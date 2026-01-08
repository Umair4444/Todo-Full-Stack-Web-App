# Tasks: Todo Full-Stack Web Application (Frontend)

**Input**: Design documents from `/specs/1-todo-frontend-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Included as requested in feature specification (TR-012: Testing MUST be implemented using Jest and React Testing Library)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app frontend**: `todo-app/src/` for source code, `todo-app/__tests__/` for tests
- **Public assets**: `todo-app/public/`
- **Styles**: `todo-app/src/styles/`
- **Components**: `todo-app/src/components/`
- **Pages**: `todo-app/src/pages/`
- **Hooks**: `todo-app/src/hooks/`
- **Services**: `todo-app/src/services/`
- **Lib**: `todo-app/src/lib/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create Next.js project structure in todo-app/ with TypeScript
- [X] T002 Initialize package.json with required dependencies (Next.js, TypeScript, shadcn/ui, Framer Motion, Sonner, Zustand, Jest, React Testing Library)
- [X] T003 [P] Configure Tailwind CSS and set up theme for modern vibrant design
- [X] T004 [P] Set up ESLint and Prettier with appropriate configurations
- [X] T005 [P] Configure TypeScript with strict settings
- [X] T006 [P] Set up PostCSS configuration
- [X] T007 [P] Install and initialize shadcn/ui components
- [X] T008 [P] Add necessary icons from Lucide React
- [X] T009 [P] Set up internationalization (i18n) with next-i18next for English and Urdu

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T010 Create global styles and theme configuration in todo-app/src/styles/globals.css
- [X] T011 [P] Set up Zustand store for application state management in todo-app/src/lib/store.ts
- [X] T012 [P] Define TypeScript types for entities in todo-app/src/lib/types.ts
- [X] T013 [P] Create utility functions in todo-app/src/lib/utils.ts
- [X] T014 [P] Set up constants in todo-app/src/lib/constants.ts
- [X] T015 [P] Create localStorage service in todo-app/src/services/storage.ts
- [X] T016 [P] Create API service stub for future backend connection in todo-app/src/services/api.ts
- [X] T017 [P] Create custom hook for localStorage in todo-app/src/hooks/useLocalStorage.ts
- [X] T018 [P] Create custom hook for scroll direction detection in todo-app/src/hooks/useScrollDirection.ts
- [X] T019 [P] Set up theme provider component in todo-app/src/components/theme/ThemeProvider.tsx
- [X] T020 [P] Create reusable layout component in todo-app/src/components/layout/MainLayout.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Access and Navigate Todo App (Priority: P1) 🎯 MVP

**Goal**: Implement responsive navigation with floating navbar that hides/shows based on scroll direction and consistent footer

**Independent Test**: User can successfully navigate to the home page, access all main sections (home, todo-app, about, contact), and see a responsive, well-designed UI that works across devices.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T021 [P] [US1] Create navigation component tests in todo-app/__tests__/components/navigation.test.tsx
- [X] T022 [P] [US1] Create layout component tests in todo-app/__tests__/components/layout.test.tsx
- [X] T023 [P] [US1] Create scroll direction hook tests in todo-app/__tests__/hooks/useScrollDirection.test.tsx

### Implementation for User Story 1

- [X] T024 [P] [US1] Create floating navbar component with glass-bar effect in todo-app/src/components/navigation/FloatingNavbar.tsx
- [X] T025 [P] [US1] Create footer component in todo-app/src/components/navigation/Footer.tsx
- [X] T026 [US1] Implement scroll direction detection in FloatingNavbar using useScrollDirection hook
- [X] T027 [US1] Create navigation links with proper routing in todo-app/src/components/navigation/NavigationLinks.tsx
- [X] T028 [US1] Add responsive design to navbar and footer components
- [X] T029 [US1] Implement page transition animations using Framer Motion
- [X] T030 [US1] Create home page with app information in todo-app/src/pages/index.tsx
- [X] T031 [US1] Create 404 error page in todo-app/src/pages/404.tsx
- [X] T032 [US1] Add favicon and logo to public directory (todo-app/public/favicon.ico, todo-app/public/logo.svg)
- [X] T033 [US1] Add placeholder images to public directory (todo-app/public/images/)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Manage Tasks in Todo App (Priority: P1)

**Goal**: Implement core todo functionality allowing users to create, view, update, and delete tasks

**Independent Test**: User can create a new task, see it in the list, mark it as complete, edit its details, and delete it when no longer needed.

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [X] T034 [P] [US2] Create todo store tests in todo-app/__tests__/lib/store.test.tsx
- [X] T035 [P] [US2] Create todo form component tests in todo-app/__tests__/components/todo/TodoForm.test.tsx
- [X] T036 [P] [US2] Create todo list component tests in todo-app/__tests__/components/todo/TodoList.test.tsx

### Implementation for User Story 2

- [X] T037 [P] [US2] Create TodoItem type definition in todo-app/src/lib/types.ts
- [X] T038 [P] [US2] Enhance Zustand store with todo operations in todo-app/src/lib/store.ts
- [X] T039 [US2] Create TodoForm component for adding/editing tasks in todo-app/src/components/todo/TodoForm.tsx
- [X] T040 [US2] Create TodoItem component for displaying individual tasks in todo-app/src/components/todo/TodoItem.tsx
- [X] T041 [US2] Create TodoList component with filtering in todo-app/src/components/todo/TodoList.tsx
- [X] T042 [US2] Implement pagination for task list (10 items per page) in todo-app/src/components/todo/TodoPagination.tsx
- [X] T043 [US2] Add skeleton loading UI for todo list in todo-app/src/components/todo/TodoSkeleton.tsx
- [X] T044 [US2] Create todo-app page in todo-app/src/pages/todo-app.tsx
- [X] T045 [US2] Connect todo components to Zustand store
- [X] T046 [US2] Implement localStorage persistence for todos using storage service

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Customize App Experience (Priority: P2)

**Goal**: Implement dark/light mode toggle and language selector with persistent settings

**Independent Test**: User can toggle between dark and light modes and switch between English and Urdu languages, with the changes persisting across sessions.

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [X] T047 [P] [US3] Create theme toggle tests in todo-app/__tests__/components/theme/ThemeToggle.test.tsx
- [X] T048 [P] [US3] Create language switcher tests in todo-app/__tests__/components/i18n/LanguageSwitcher.test.tsx

### Implementation for User Story 3

- [X] T049 [P] [US3] Create ThemeToggle component in todo-app/src/components/theme/ThemeToggle.tsx
- [X] T050 [P] [US3] Create LanguageSwitcher component in todo-app/src/components/i18n/LanguageSwitcher.tsx
- [X] T051 [US3] Update Zustand store with theme and language preferences in todo-app/src/lib/store.ts
- [X] T052 [US3] Implement theme switching logic in ThemeProvider
- [X] T053 [US3] Add Urdu translations to i18n configuration
- [X] T054 [US3] Ensure all UI elements are translatable using i18n
- [X] T055 [US3] Persist theme and language preferences in localStorage
- [X] T056 [US3] Apply consistent modern and vibrant theme across all components
- [X] T057 [US3] Add theme-aware styling to all components
- [X] T058 [US3] Create reusable theme-aware components

**Checkpoint**: At this point, User Stories 1, 2 AND 3 should all work independently

---

## Phase 6: User Story 4 - Get Help and Support (Priority: P2)

**Goal**: Implement floating chatbot with predefined responses available on all pages

**Independent Test**: User can open the floating chatbot on any page and receive assistance or information about using the application.

### Tests for User Story 4 (OPTIONAL - only if tests requested) ⚠️

- [X] T059 [P] [US4] Create chatbot widget tests in todo-app/__tests__/components/chatbot/ChatbotWidget.test.tsx
- [X] T060 [P] [US4] Create chat window tests in todo-app/__tests__/components/chatbot/ChatWindow.test.tsx

### Implementation for User Story 4

- [X] T061 [P] [US4] Create ChatbotSession type definition in todo-app/src/lib/types.ts
- [X] T062 [P] [US4] Enhance Zustand store with chatbot state in todo-app/src/lib/store.ts
- [X] T063 [US4] Create ChatbotWidget component in todo-app/src/components/chatbot/ChatbotWidget.tsx
- [X] T064 [US4] Create ChatWindow component in todo-app/src/components/chatbot/ChatWindow.tsx
- [X] T065 [US4] Create ChatMessage component in todo-app/src/components/chatbot/ChatMessage.tsx
- [X] T066 [US4] Implement simulated chatbot responses in todo-app/src/services/chatbot.ts
- [X] T067 [US4] Add chatbot to MainLayout so it appears on all pages
- [X] T068 [US4] Implement chat history persistence in localStorage
- [X] T069 [US4] Add animations to chatbot interactions using Framer Motion
- [X] T070 [US4] Ensure chatbot is accessible and responsive

**Checkpoint**: At this point, User Stories 1, 2, 3 AND 4 should all work independently

---

## Phase 7: User Story 5 - View Additional Information (Priority: P3)

**Goal**: Create About and Contact pages with relevant information

**Independent Test**: User can navigate to the About and Contact pages and find relevant information about the application and how to reach the team.

### Tests for User Story 5 (OPTIONAL - only if tests requested) ⚠️

- [X] T071 [P] [US5] Create About page tests in todo-app/__tests__/pages/about.test.tsx
- [X] T072 [P] [US5] Create Contact page tests in todo-app/__tests__/pages/contact.test.tsx

### Implementation for User Story 5

- [X] T073 [US5] Create About page in todo-app/src/pages/about.tsx
- [X] T074 [US5] Create Contact page in todo-app/src/pages/contact.tsx
- [X] T075 [US5] Add contact form component in todo-app/src/components/contact/ContactForm.tsx
- [X] T076 [US5] Add team information to About page
- [X] T077 [US5] Add company/app information to About page
- [X] T078 [US5] Add social media links to Contact page
- [X] T079 [US5] Ensure pages follow consistent theme and design
- [X] T080 [US5] Add translations for About and Contact pages
- [X] T081 [US5] Add animations to page transitions using Framer Motion
- [X] T082 [US5] Optimize pages for SEO

**Checkpoint**: At this point, User Stories 1, 2, 3, 4 AND 5 should all work independently

---

## Phase 8: User Story 6 - Handle Errors Gracefully (Priority: P2)

**Goal**: Implement proper error handling and helpful 404 page

**Independent Test**: User sees appropriate error messages when something goes wrong and sees a helpful 404 page when navigating to non-existent URLs.

### Tests for User Story 6 (OPTIONAL - only if tests requested) ⚠️

- [X] T083 [P] [US6] Create error boundary tests in todo-app/__tests__/components/error/ErrorBoundary.test.tsx
- [X] T084 [P] [US6] Create notification component tests in todo-app/__tests__/components/ui/Notification.test.tsx

### Implementation for User Story 6

- [X] T085 [P] [US6] Create ErrorBoundary component in todo-app/src/components/error/ErrorBoundary.tsx
- [X] T086 [P] [US6] Create Notification component using Sonner in todo-app/src/components/ui/Notification.tsx
- [X] T087 [US6] Implement error handling in API service stub
- [X] T088 [US6] Add error handling to todo operations in Zustand store
- [X] T089 [US6] Add validation to todo form with proper error messages
- [X] T090 [US6] Improve 404 page with helpful navigation options
- [X] T091 [US6] Add error states to all components
- [X] T092 [US6] Implement form validation with proper error display
- [X] T093 [US6] Add network error handling for future API connections
- [X] T094 [US6] Add loading and error states to all async operations

**Checkpoint**: All user stories should now be independently functional

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T095 [P] Add comprehensive documentation in README.md
- [X] T096 [P] Add inline documentation to components and services
- [X] T097 Code cleanup and refactoring across all components
- [ ] T098 [P] Add additional unit tests to achieve 80% coverage requirement
- [X] T099 Performance optimization across all pages
- [X] T100 Accessibility improvements (WCAG 2.1 AA compliance)
- [X] T101 Security hardening (sanitize inputs, secure storage)
- [X] T102 Run quickstart validation to ensure setup works as documented
- [X] T103 Add loading states to all async operations
- [X] T104 Finalize responsive design for all screen sizes
- [X] T105 Add keyboard navigation support
- [X] T106 Finalize internationalization with all UI elements translatable

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 6 (P2)**: Can start after Foundational (Phase 2) - May integrate with all other stories but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Create navigation component tests in todo-app/__tests__/components/navigation.test.tsx"
Task: "Create layout component tests in todo-app/__tests__/components/layout.test.tsx"
Task: "Create scroll direction hook tests in todo-app/__tests__/hooks/useScrollDirection.test.tsx"

# Launch all components for User Story 1 together:
Task: "Create floating navbar component with glass-bar effect in todo-app/src/components/navigation/FloatingNavbar.tsx"
Task: "Create footer component in todo-app/src/components/navigation/Footer.tsx"
Task: "Create navigation links with proper routing in todo-app/src/components/navigation/NavigationLinks.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Navigation)
4. Complete Phase 4: User Story 2 (Core Todo Functionality)
5. **STOP and VALIDATE**: Test User Stories 1 & 2 independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo
3. Add User Story 2 → Test independently → Deploy/Demo (MVP!)
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Add User Story 6 → Test independently → Deploy/Demo
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
   - Developer D: User Story 4
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence