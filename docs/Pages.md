# Page-by-Page Functionality

This document outlines the functional purpose, access rules, primary components, and key data flows for each page in the app. Paths are relative to `src/app`.

## Public

- Home — `/(public)/(home)/page.tsx`
  - Purpose: Landing page with hero and call-to-action.
  - Components: `Banner`, `CtaAction`, `BannerButtons`.
  - Access: Public.
  - Notes: No protected content; surfaces quick entry points.

- Create Incident — `/(public)/create-incident/page.tsx`
  - Purpose: Public flow to initiate an incident request and optionally authenticate.
  - Components: `CreateIncidentPageWrapper`, `IncidentForm`, `GetNotificationSection`, context/hooks under `create-incident`.
  - Access: Public. Can authenticate via query or embedded token.
  - Data: Collects location hierarchy (campus, building, floor, area, room), topic/question, optional inspection template, photos, and notes.
  - Behavior:
    - If `?accountId`/`?campusId` present or embedded sign-in is enabled, continues in public context;
    - Otherwise may redirect to `/(auth)/login` depending on configured flow.

- How Fix-It-Fast Works — `/(public)/how-fixit-fast-works/page.tsx`
  - Purpose: Explains how to use the system.
  - Components: `AlternativeOptionCard`, `Carousel`, `IllustrationCard`, `LanguageBadges`, `QRCodeStepsCard`, `ScanningTipsCard`, `TroubleshootingCard`.
  - Access: Public.

- Embedded Iframe — `/(public)/iframe/page.tsx`
  - Purpose: Iframe entrypoint to sign in and route based on role.
  - Components: `OnboardingAnimation`.
  - Access: Public entry; performs sign-in using a special provider.
  - Behavior: Reads an embedded JWT, sets auth cookies, determines roles, redirects to role dashboard.

- Role Select — `/(public)/role-select/page.tsx`
  - Purpose: Choose an active role when users have multiple.
  - Components: Role list UI, cookie-setting logic.
  - Access: Public entry; redirect depends on session roles.
  - Behavior: Stores `fifRoleId` and `fifRoleName` cookies; navigates to `/admin`, `/evaluator`, `/operator`, or `/initiator`.

## Auth

- Login — `/(auth)/login/page.tsx`
  - Purpose: Authenticate users via configured providers.
  - Components: `LoginForm` (under Suspense), provider buttons, error handling.
  - Access: Public.
  - Behavior: After success, role-based redirect via middleware.

- Logout — `/(auth)/logout/page.tsx`
  - Purpose: Sign out user and clear role cookies.
  - Components: Client-only page with loader and message.
  - Behavior: Clears `fifRoleId` and `fifRoleName`, calls `next-auth/react` `signOut()`, then redirects to `/` after a short delay.

## Admin

- Admin Root — `/admin/page.tsx`
  - Purpose: Entry to admin section.
  - Behavior: Redirects to `/admin/dashboard`.

- Admin Layout — `/admin/layout.tsx`
  - Purpose: Section layout with side and top navigation.
  - Components: `EvaluatorLayout` wraps children.
  - Access: Protected by middleware role checks.

- Dashboard — `/admin/dashboard/page.tsx`
  - Purpose: Overview of metrics, heatmaps, and live incident feed.
  - Components: `DashboardPageWrapper` with cards like real-time feed, location heatmap, KPI widgets.
  - Data: Uses dashboard hooks and server actions to aggregate stats.
  - Access: Admin only.

- Incident Management — `/admin/incident-management/page.tsx`
  - Purpose: Filter, browse, and update incident follow-ups.
  - Components: `IncidentManagementContent` with filter sidebar, table/list, bulk actions, status update modal.
  - Data: Hooks such as `useGetFollowUpListByFilters`, `useGetFollowUpStatuses`.
  - Access: Admin only.

- Follow-Up Details — `/admin/incident-management/[followupId]/page.tsx`
  - Purpose: Detailed view of a single follow-up.
  - Components: `FollowUpDetailsCard`.
  - Access: Admin only.

- Analytics — `/admin/analytics/page.tsx`
  - Purpose: Analytical dashboards and charts.
  - Components: `AnalyticsContent`, `AnalyticalStatistics`.
  - Data: Aggregated analytics API/hooks.
  - Access: Admin only.

- Location Management — `/admin/location-management/page.tsx`
  - Purpose: Manage locations and generate QR codes across the hierarchy.
  - Components: `LocationManagementContent` with QR generation, assignment management, hierarchy drill-down.
  - Data: Actions like `location-management/actions/location.ts`, hooks for assignments and templates.
  - Access: Admin only.

- Location Template — `/admin/location-template/page.tsx`
  - Purpose: Manage QR code templates.
  - Components: `LocationTemplateContent`.
  - Access: Admin only.

## Evaluator

- Evaluator Root — `/evaluator/page.tsx`
  - Purpose: Entry to evaluator section.
  - Behavior: Redirects to `/evaluator/dashboard`.

- Evaluator Layout — `/evaluator/layout.tsx`
  - Purpose: Section layout with side and top navigation.
  - Components: `EvaluatorLayout` wraps children.
  - Access: Protected by middleware role checks.

- Dashboard — `/evaluator/dashboard/page.tsx`
  - Purpose: Overview, same wrapper as admin dashboard.
  - Components: `DashboardPageWrapper` (shared).
  - Access: Evaluator only.

- Incident Management — `/evaluator/incident-management/page.tsx`
  - Purpose: Filter and browse follow-ups.
  - Components: `IncidentManagementContent` (shared).
  - Access: Evaluator only.

- Follow-Up Details — `/evaluator/incident-management/[followupId]/page.tsx`
  - Purpose: Detailed view of a single follow-up.
  - Components: `FollowUpDetailsCard`.
  - Access: Evaluator only.

## Operator

- Operator Root — `/operator/page.tsx`
  - Purpose: Entry to operator section.
  - Behavior: Redirects to `/operator/dashboard`.

- Operator Layout — `/operator/layout.tsx`
  - Purpose: Section layout with side and top navigation.
  - Components: `EvaluatorLayout` wraps children.
  - Access: Protected by middleware role checks.

- Dashboard — `/operator/dashboard/page.tsx`
  - Purpose: Overview, same wrapper as admin dashboard.
  - Components: `DashboardPageWrapper` (shared).
  - Access: Operator only.

- Incident Management — `/operator/incident-management/page.tsx`
  - Purpose: List and manage operator incidents.
  - Components: `IncidentContent`, `IncidentCard`.
  - Access: Operator only.

- Incident Details — `/operator/incident-management/[incidentId]/page.tsx`
  - Purpose: Detailed view of a single operator incident.
  - Components: `FollowUpDetailsCard` (if shared) or operator-specific details.
  - Access: Operator only.

## Initiator

- Initiator Root — `/initiator/page.tsx`
  - Purpose: Entry to initiator section.
  - Behavior: Redirects to `/initiator/initiate-history`.

- Initiator Layout — `/initiator/layout.tsx`
  - Purpose: Section layout with side and top navigation.
  - Components: `EvaluatorLayout` wraps children.
  - Access: Protected by middleware role checks.

- Initiate History — `/initiator/initiate-history/page.tsx`
  - Purpose: History of initiated incidents/scans.
  - Components: `IncidentContent`, list and filter controls; underlying `ScanHistory` and related cards.
  - Access: Initiator only.

- Initiate Details — `/initiator/initiate-history/[initiateId]/page.tsx`
  - Purpose: Detailed view of a single initiation record.
  - Components: `FollowUpDetailsCard`.
  - Access: Initiator only.

## Shared Root

- App Root Layout — `/layout.tsx`
  - Purpose: Global providers and CSS.
  - Components: `AuthProvider`, `QueryProvider`, global styles.

## API & Middleware (context for pages)

- API: `api/logout/route.ts`, `api/token/route.ts`, `api/auth/[...nextauth]/route.ts`
  - Purpose: Auth and token orchestration.

- Middleware — `src/middleware.ts`
  - Behavior: Protects `/admin`, `/evaluator`, `/operator`, `/initiator` via `fifRoleId`, `fifRoleName` and token roles; allows public routes.

## Notes & Conventions

- Role-based redirects: Section roots (`/admin`, `/evaluator`, `/operator`, `/initiator`) immediately route to their dashboards/history.
- Shared layouts: `EvaluatorLayout` is reused across protected sections; `PublicLayout` for public.
- Data fetching: Most pages use hooks under their section’s `hooks/` directory and server actions where applicable.
- i18n: UI labels and messages are managed under `messages/` files referenced by components.