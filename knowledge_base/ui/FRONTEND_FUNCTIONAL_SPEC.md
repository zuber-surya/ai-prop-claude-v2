# Frontend Functional Specification

This document details the functional behavior, data flow, and UI interactions for each screen in the Property Vista CRM MVP frontend. It consolidates information from individual screen specifications to provide a comprehensive reference for development, testing, and maintenance.

---

## 1. Property Vista CRM Homepage (`/`)

**Purpose**: Main landing page showcasing AI‑first value proposition, enabling property search, learning about the service, and expressing interest without navigation away.

| Aspect | Details |
|--------|---------|
| **Route** | `/` (root) |
| **User Roles** | Visitor (unauthenticated), Customer, Agent, Admin (all authenticated) |
| **Components** | • Company branding & navigation (top)<br>• Prominent AI‑powered search bar (natural language input)<br>• Featured properties section (3‑6 cards: image, price, beds/baths, location)<br>• “How it works” section (search → match → connect process with icons)<br>• Customer testimonials (quotes with photos)<br>• Chat widget (bottom‑right corner)<br>• Contact form (name, phone, email, message/callback)<br>• Footer (legal, resources, company links) |
| **Inputs** | • Search bar: free‑text natural language query<br>• Contact form fields: Name (text), Phone (tel), Email (email), Message/Callback request (textarea) |
| **Outputs** | • Displayed featured property cards<br>• Search suggestions (via `/search/suggest`)<br>• Chatbot greeting & responses (SSE stream)<br>• Success/error toast messages after form submission<br>• Navigation to search results, property detail, login, or chat |
| **State Management** | • UI state for search input, suggestions, and loading spinners<br>• Form validation state (field‑level errors)<br>• Visibility toggles for chat widget, modals, and empty‑state placeholders |
| **API Integration** | • `GET /cms/homepage` – dynamic homepage content (banners, sections)<br>• `GET /properties/featured` – featured property cards<br>• `GET /search/suggest` – auto‑suggestions as user types<br>• `POST /leads` – create lead from contact form (requires Idempotency‑Key, source tracking)<br>• `POST /chat/messages` – send chat message (if widget used)<br>• `GET /chat/messages?stream=true` – receive streaming chatbot responses |
| **Validation** | • All contact‑form fields required<br>• Email must match RFC‑5322 pattern<br>• Phone accepts digits, spaces, +, -, (, ) – basic format check<br>• Client‑side validation runs on submit; server‑side validates via schema (e.g., Zod) and returns field‑level errors |
| **Error Handling** | • Field‑level validation errors shown inline (e.g., “Invalid phone number”)<br>• Submission failure toast: “Something went wrong. Please try again later.”<br>• Chatbot fallback message per FR13.1: “I’m having trouble right now — try the search filters above.” |
| **Success Handling** | • Toast: “Thank you! We’ve received your inquiry and will get back to you shortly.”<br>• Chatbot welcome message (from FR1.1)<br>• Form reset after successful submission |
| **Responsive Behavior** | • Layout adapts to mobile/viewport sizes<br>• Search bar remains prominent; may stack vertically on narrow screens<br>• Featured properties shift from horizontal carousel to vertical list<br>• Chat widget stays fixed bottom‑right, respecting safe areas<br>• Footer links collapse into a hamburger menu on mobile |
| **Component Hierarchy** | `App`<br>└─ `Header` (brand, nav links)<br>├─ `HeroSection` (search bar, AI description)<br>├─ `FeaturedProperties` (carousel/list of `PropertyCard` components)<br>├─ `HowItWorks` (icon + text blocks)<br>├─ `Testimonials` (carousel of `TestimonialCard`)<br>├─ `ChatWidget` (toggle + message list)<br>├─ `ContactForm` (fields + submit button)<br>└─ `Footer` (links, legal) |
| **Accessibility** | • All interactive elements have ARIA labels (search bar, chat toggle, form fields, submit button)<br>• WCAG 2.1 AA color contrast for text & icons<br>• Fully keyboard navigable (tab order: header nav → search → form → footer)<br>• Focus management for modals/dialogs<br>• `aria-label` on image carousel slides<br>• Live region for dynamic toast announcements |

---

## 2. Property Detail – Premium View (`/properties/:id`)

**Purpose**: Comprehensive property detail view enabling informed inquiry decisions through rich media and structured information.

| Aspect | Details |
|--------|---------|
| **Route** | `/properties/:id` |
| **User Roles** | Visitor, Customer, Agent, Admin |
| **Components** | • Property gallery (carousel/slider of images)<br>• Property header with title, price, beds/baths/area badges, favorite button<br>• Primary CTA button: “Inquire about this property”<br>• Secondary CTA: “Contact agent” **or** “Schedule tour”<br>• Tabs/sections: Overview, Details, Floorplan, Map, Amenities, Price breakdown, Similar properties<br>• Agent contact card (photo, name, phone, email)<br>• Property badges for beds, baths, area<br>• Loading states for gallery & tabs<br>• Error states for media loading<br>• Back to results link/button |
| **Inputs** | • Route parameter `:id` (property ID)<br>• Favorite button toggle (authenticated users)<br>• Inquiry form fields (Name, Phone, Email, Message) when CTA clicked |
| **Outputs** | • Rendered property gallery, header, tabs, and agent card<br>• Related/similar property carousel<br>• Success/error toast after inquiry submission<br>• Navigation to search results, login, or agent contact actions |
| **State Management** | • UI state for active tab, gallery slide index, favorite toggle state<br>• Loading flags for gallery, tabs, map, and similar‑properties data<br>• Form validation state for inquiry modal/inline form |
| **API Integration** | • `GET /properties/:id` – fetch property details (gallery, price, specs, amenities, location, agent info)<br>• `POST /leads` – create inquiry lead (requires propertyId in body/context, Idempotency‑Key)<br>• `POST /favorites` or `POST /saved-properties` – save property to user list (authenticated)<br>• `GET /properties?similarTo=:id` – get similar/recommended properties (optional)<br>• `GET /agents/:agentId` – fetch agent details for contact card (if separate endpoint) |
| **Validation** | • Inquiry form: all fields required; email must be valid format; phone accepts digits, spaces, +, -, (, ); message cannot be empty<br>• Favorite toggle requires authentication (server‑side guard) |
| **Error Handling** | • “Failed to load property details. Please try again.” (generic fetch error)<br>• Per‑image: “Image failed to load” placeholder<br>• Map unavailable fallback<br>• Inquiry failure: “Inquiry failed to send. Please check your information and try again.” |
| **Success Handling** | • Inquiry success: “Inquiry sent successfully! An agent will contact you shortly.”<br>• Favorite toggle success: “Property saved to your favorites” / “Property unstarred from favorites” |
| **Responsive Behavior** | • On mobile: tabs convert to vertical accordion or collapsible sections<br>• Property gallery remains swipeable with visible navigation arrows<br>• Columns stack: image gallery full width, then information sections below<br>• Map may take full width/height or be collapsible<br>• Agent contact card may become a full‑width CTA bar at bottom<br>• Text scales appropriately, maintaining readability<br>• Touch targets ≥ 48×48 px for buttons & interactive elements |
| **Component Hierarchy** | `PropertyDetailPage`<br>├─ `PropertyGallery` (carousel of `ImageSlide` + prev/next arrows)<br>├─ `PropertyHeader` (title, price, badges, favorite button)<br>├─ `CTABar` (primary & secondary buttons)<br>├─ `TabbedContent` (tabs: Overview, Details, … each loading sub‑components)<br>│   ├─ `OverviewTab`<br>│   ├─ `DetailsTab`<br>│   ├─ `FloorplanTab`<br>│   ├─ `MapTab` (Leaflet/OpenStreetMap)<br>│   ├─ `AmenitiesTab`<br>│   ├─ `PriceBreakdownTab`<br>│   └─ `SimilarProperties` (carousel of `PropertyCard`) <br>├─ `AgentContactCard` (photo, name, phone, email, call/email actions)<br>└─ `BackToResults` link |
| **Accessibility** | • All interactive elements have ARIA labels (gallery navigation, tabs, buttons, form fields)<br>• Keyboard navigable: tab through sections, arrow keys in gallery, Enter to activate buttons<br>• Gallery images have descriptive `alt` text or `aria-label` (e.g., “Living room view, image 1 of 5”)<br>• Tab panel follows ARIA tabs pattern (`role="tablist"`, `role="tab"`, `role="tabpanel"` )<br>• Form fields associated with labels via `html/for` or `aria-label`<br>• Error messages use `role="alert"` or `aria-live="polite"`<br>• Color contrast meets WCAG 2.1 AA<br>• Screen reader announces status updates (e.g., “Image 2 of 5 loaded”)<br>• Focus moves to success message after inquiry submit<br>• Skip navigation link for screen‑reader users to bypass repetitive header |

---

## 3. Lead Pipeline Kanban View (Route: *TBD* – typically `/leads/pipeline`)

**Purpose**: Kanban board visualization of lead stages: New → Contacted → Site Visit → Negotiation → Closed Won/Lost, with WIP limits, filtering, and bulk actions.

| Aspect | Details |
|--------|---------|
| **Route** | Typically `/leads/pipeline` (exact path defined in routing) |
| **User Roles** | Agent (primary), Admin |
| **Components** | • Kanban columns for each stage (with WIP limit badges)<br>• Lead cards within columns (showing summary: name, property, date, tags)<br>• Filter bar (date range, stage, assignee, source)<br>• Search box (free‑text)<br>• Bulk action toolbar (select multiple leads → change stage, assign, delete, export)<br>• Drag‑and‑drop handles on cards for stage transitions |
| **Inputs** | • Drag‑and‑drop gesture to move a card between columns (triggers stage update)<br>• Filter selections (dropdowns, date picker, text search)<br>• Bulk selection checkboxes<br>• Bulk action dropdown (e.g., “Move to Contacted”, “Assign to Me”) |
| **Outputs** | • Updated board after drag‑drop or bulk action (optimistic UI update)<br>• Toast messages for success/errors of API calls<br>• Navigation to lead detail view when a card is clicked |
| **State Management** | • Board state: array of columns, each containing list of lead cards (optimistic updates on drag)<br>• Filter state (selected values)<br>• Selection state for bulk actions (array of selected lead IDs)<br>• Loading spinners per column while data fetches |
| **API Integration** | • `GET /leads` – fetch list with query params for filters, pagination, sorting<br>• `PATCH (or GET /leads?stageespecificdata (if needed)<br>• `PATCH /leads/:id` – update fields (stage, assignee, notes, etc.)<br>• `DELETE /leads/:id` – delete single lead<br>• `POST /leads/bulk` – batch update (stage change, assignment, deletion) |
| **Validation** | • Stage transitions validated server‑side (only allowed moves per workflow)<br>• Bulk actions require at least one selected item<br>• Required fields (e.g., assignee) validated before save |
| **Error Handling** | • Inline error on card if update fails (revert drag, show toast)<br>• Bulk operation failures show summary toast with counts of succeeded/failed<br>• Network errors display generic “Unable to update board. Please try again.” |
| **Success Handling** | • Toast: “Lead moved to Contacted” (or relevant stage)<br>• Bulk success: “X leads updated successfully” |
| **Responsive Behavior** | • Columns scroll horizontally on narrow screens; each column remains full height<br>• Card width adapts to column width (maintains readable content)<br>• Filter bar may collapse into a dropdown menu on mobile<br>• Drag‑and‑drop fallback: tap‑to‑select then choose target column via menu |
| **Component Hierarchy** | `LeadPipelineBoard`<br>├─ `FilterBar` (date, stage, assignee, source inputs + search)<br>├─ `KanbanColumns` (array of `KanbanColumn`)<br>│   ├─ `KanbanColumnHeader` (stage name, WIP limit, add‑new button)<br>│   └─ `CardList` (drag‑drop list of `LeadCard`)<br>│       └─ `LeadCard` (avatar, name, property, date, tags, menu)<br>├─ `BulkActionToolbar` (select all, bulk actions dropdown, apply button)<br>└─ `EmptyState` (shown when no lanes match filters) |
| **Accessibility** | • Drag‑and‑drop also operable via keyboard: Enter to pick up, Arrow keys to move target column, Enter to drop<br>• All controls have accessible names (aria-label, visible text)<br>• Color contrast for card backgrounds & text<br>• Focus order follows visual order<br>• ARIA live region announces when a card is moved (e.g., “Lead moved to Contacted column”)<br>• Cancel animation respects `prefers-reduced-motion` |

---

## 4. Lead Detail View (e.g., `/leads/:id` – example: *lead_detail_sarah_jenkins.md*)

**Purpose**: Detailed view of a single lead, showing contact information, communication history, tasks, and actions such as scheduling a visit or adding notes.

| Aspect | Details |
|--------|---------|
| **Route** | `/leads/:id` (parameterized by lead ID) |
| **User Roles** | Agent, Admin (primary); Customer may view own lead if linked |
| **Components** | • Header: lead name, source tag, status badge<br>• Sidebar / section: Contact information (phone, email, address)<br>• Activity timeline: interleaved notes, tasks, scheduled visits, status changes<br>• Input area for new note or task<br>• Action buttons: “Schedule visit”, “Add note”, “Add task”, “Change stage”, “Assign to me”, “Delete lead”<br>• Related property summary (if linked)<br>• Loading & error states |
| **Inputs** | • Route param `:id`<br>• Form inputs for new note (textarea) and task (title, due date, assignee)<br>• Date‑time picker for scheduling visit<br>• Dropdown for stage change, assignee change |
| **Outputs** | • Updated timeline in real time (optimistic UI)<br>• Toast messages for create/update/delete successes/failures<br>• Navigation back to pipeline or to related property detail |
| **State Management** | • Form state for new note/task (value, validation)<br>• Loading flags for timeline sections (notes, tasks, visits)<br>• Visibility of action menus (dropdowns, date picker) |
| **API Integration** | • `GET /leads/:id` – fetch lead detail (incl. embedded property, activity timeline)<br>• `POST /leads/:id/notes` – add a communication note<br>• `POST /leads/:id/tasks` – create follow‑up task<br>• `PATCH /leads/:id` – update fields (stage, assignee, etc.)<br>• `DELETE /leads/:id` – remove lead (if permitted)<br>• `POST /leads/:id/visit` – schedule a visit (date/time, notes, assignee) |
| **Validation** | • Note: required, min length (e.g., 1 character)<br>• Task: title required, due date must be future<br>• Visit: date/time must be in future<br>• Stage transition: only allowed per workflow (enforced server‑side)<br>• All inputs sanitized to prevent XSS |
| **Error Handling** | • Inline field errors (e.g., “Due date must be in the future”)<br>• Save failures: toast “Failed to add note. Please try again.”<br>• Delete confirmation: modal with cancel/continue; on failure show error |
| **Success Handling** | • Toast: “Note added”, “Task created”, “Visit scheduled”, “Stage updated”, etc.<br>• After successful creation, clear input fields and focus returns to input for rapid entry |
| **Responsive Behavior** | • On narrow screens: sidebar collapses into a tab or accordion; timeline takes full width<br>• Action buttons stack vertically or move to a bottom sheet<br>• Date/time pickers adapt to modal or fullscreen dialog on mobile<br>• Tablet layout splits sidebar (30%) and main content (70%) |
| **Component Hierarchy** | `LeadDetailPage`<br>├─ `LeadHeader` (name, source, status)<br>├─ `LeadSidebar` (contact info, property summary)<br>│   └─ `PropertySummary` (thumbnail, address, price)<br>├─ `ActivityTimeline` (list of `TimelineItem`)<br>│   ├─ `TimelineItemNote`<br>│   ├─ `TimelineItemTask`<br>│   ├─ `TimelineItemVisit`<br>│   └─ `TimelineItemStatusChange`<br>├─ `ActionButtons` (schedule visit, add note, add task, change stage, assign, delete)<br>├─ `NewNoteForm` (textarea + submit)<br>├─ `NewTaskForm` (title, due date, assignee, submit)<br>└─ `ScheduleVisitForm` (date/time picker, notes, assignee, submit) |
| **Accessibility** | • All form fields linked to labels via `html/for` or `aria-label`<br>• Buttons have clear, visible text; icons accompanied by aria-label (e.g., “Add note”)<br>• Keyboard navigable: tab through fields, Ctrl+Enter to submit (or explicit submit button)<br>• Error messages use `role="alert"`<br>• Live region announces when new timeline item is added (e.g., “New note added to timeline”)<br>• Sufficient contrast for text vs. background<br>• Respects reduced motion preferences for animations |

---

## 5. Customer Account Dashboard (Route: *TBD* – e.g., `/dashboard`)

**Purpose**: Personalized dashboard for logged‑in customers showing saved properties, requirement profile, inquiry history, notifications, and quick actions.

| Aspect | Details |
|--------|---------|
| **Route** | Typically `/dashboard` or `/account/dashboard` |
| **User Roles** | Customer (authenticated) |
| **Components** | • Sidebar navigation (Dashboard, Saved Properties, Requirements, Inquiries, Notifications, Settings)<br>• Main panels: <br> - **Saved Properties** grid (cards with thumbnail, price, heart button)<br> - **Requirement Profile** form (budget, property type, bedrooms, baths, location preferences)<br> - **Inquiry History** list (each entry: property thumbnail, date, status, view details)<br> - **Notifications** feed (badge‑styled, mark as read, delete)<br> - **Quick Actions** buttons (New Search, Edit Profile, Message Agent) |
| **Inputs** | • Form fields in requirement profile (number inputs, selects, date pickers)<br>• Toggle switches for favourite/unsave on property cards<br>• Button clicks for navigation / actions |
| **Outputs** | • Updated lists after add/remove/filter operations<br>• Toast messages for save/update/delete successes/failures<br>• Navigation to property detail, edit profile, or new search |
| **State Management** | • Form state for requirement profile (validated on blur/submit)<br>• Selected filter state for each list (e.g., show only “Active” inquiries)<br>• Pagination / infinite scroll state for inquiry history<br>• Notification unread count badge |
| **API Integration** | • `GET /customers/me` – retrieve profile & preference data<br>• `GET /customers/me/saved-properties` – paginated list of saved property IDs (with expand to full data via `GET /properties/:id` as needed)<br>• `POST /customers/me/saved-properties` – add a property (body: `{propertyId}`)<br>• `DELETE /customers/me/saved-properties/:propertyId` – remove saved property<br>• `GET /customers/me/requirements` – retrieve current requirement profile<br>• `PUT /customers/me/requirements` – update preferences<br>• `GET /customers/me/inquiries` – list of past inquiries (with optional filters: date, status, property)<br>• `GET /notifications` – user‑specific notifications (unread count, list)<br>• `PUT /notifications/:id/read` – mark as read<br>• `DELETE /notifications/:id` – delete notification |
| **Validation** | • Requirement fields: budget (numeric, >0), bedrooms/baths (integers ≥0), location (non‑empty string), property type (enum)<br>• Saved‑property actions require authentication; duplicate add prevented via unique constraint or idempotency check |
| **Error Handling** | • Inline form errors (e.g., “Budget must be greater than zero”)<br>• Failure toasts: “Could not save property. Please try again.”<br>• Failed to load sections show retry button and error message |
| **Success Handling** | • Toast: “Property saved to your favorites”, “Requirements updated”, “Notification marked as read”<br>• After successful save, heart icon fills; on remove, it outlines |
| **Responsive Behavior** | • Sidebar collapses into a hamburger menu on ≤ 768 px width; slides out as drawer<br>• Main panels stack vertically on mobile (each card or list full width)<br>• Saved‑property grid shifts from multi‑column (≥3 cols) to single column on small screens<br>• Inquiry list remains a vertical list; date formatting adapts (relative vs absolute) |
| **Component Hierarchy** | `CustomerDashboard`<br>├─ `SidebarNav` (links to sections)<br>├─ `SavedPropertiesSection` (header + `PropertyGrid` of `SavedPropertyCard`)<br>├─ `RequirementSection` (header + `RequirementForm` with inputs & submit)<br>├─ `InquiryHistorySection` (header + `InquiryList` of `InquiryItem` → navigate to `/properties/:id` or `/leads/:id`)<br>├─ `NotificationsSection` (header + `NotificationList` of `NotificationItem` with mark‑as‑read/delete icons)<br>└─ `QuickActions` row of icon buttons |
| **Accessibility** | • All form fields have associated labels; error messages appear inline and are announced via `aria-live="assertive"`<br>• Buttons have clear text or aria‑label icons (heart, bell, trash)<br>• Keyboard navigable: tab through sidebar, then main panel controls; trap focus in modals/drawers<br>• Sufficient contrast for text/informative icons<br>• Live region announces when new notification arrives (e.g., “You have 1 new notification”)<br>• Respects user‑preferred reduced motion for animations |

---

## 6. Agent Command Center (Admin Dashboard) (`/admin` or `/dashboard/admin`)

**Purpose**: Primary administrative dashboard showing KPIs, trends, activity feed for monitoring business health.

| Aspect | Details |
|--------|---------|
| **Route** | Typically `/admin` or `/dashboard/admin` |
| **User Roles** | Admin (authenticated) |
| **Components** | • Top bar: global search, user avatar, notifications<br>• Sidebar navigation: Dashboard, Properties, Leads, Users, AI Settings, System Settings, Reports<br>• Main widgets: <br> - **KPI Cards** (total leads today, conversion rate, active listings, revenue)<br> - **Activity Feed** (recent log entries: lead created, property published, user role changed)<br> - **Charts** (lead sources pie, timeline of new leads, property views)<br> - **Quick Links** (Create Property, Import Leads, Configure AI) |
| **Inputs** | • Date range picker for charts/filtering<br>• Dropdowns for filtering KPIs (by agent, source, timeframe)<br>• Click actions on cards (drill‑down to detailed view) |
| **Outputs** | • Updated charts/KPIs when filters change<br>• Toast messages for actions performed via quick links (e.g., “Property creation form opened”)<br>• Navigation to respective management pages (properties, leads, users, etc.) |
| **State Management** | • Filter state (dates, selected segments)<br>• Loading states for each widget (skeleton placeholders)<br>• UI state for modal/drawer opened via quick links |
| **API Integration** | • `GET /admin/dashboard/summary` – KPI metrics<br>• `GET /admin/logs/recent` – activity feed items<br>• `GET /charts/lead-sources` – data for pie chart<br>• `GET /charts/leads-over-time` – time‑series data<br>• `GET /charts/property-views` – property popularity data<br>• `GET /admin/users` – list of users with roles (paginated)<br>• `GET /admin/properties` – list of all properties (incl. draft/unpublished)<br>• `GET /admin/leads` – list of all leads (including filtered/protected data)<br>• `GET /settings/ai` – current AI configuration (model, temperature, usage quota)<br>• `POST /settings/ai` – update AI configuration |
| **Validation** | • Date range: end ≥ start<br>• Numeric inputs (if any) non‑negative<br>• Form validation for AI settings: model (enum), temperature (0–2), max tokens (positive integer) |
| **Error Handling** | • If a widget fails to load, display error placeholder with retry button (“Failed to load chart”)<br>• Form submission errors shown inline (e.g., “Temperature must be between 0 and 2”)<br>• Global error toast for unexpected failures |
| **Success Handling** | • Toast: “AI settings saved successfully”<br>• After successful KPI refresh, subtle animation or checkmark icon on card |
| **Responsive Behavior** | • Sidebar converts to collapsible menu (icon) on widths < 1024 px; slides out as drawer<br>• KPI cards resize to single column grid on mobile, then 2‑column on tablet, 4‑column on desktop<br>• Charts maintain aspect ratio; may switch from detailed to sparkline view on very narrow screens<br>• Action buttons stack vertically in footer on small screens |
| **Component Hierarchy** | `AdminDashboard`<br>├─ `AppBar` (global search, notifications, avatar dropdown)<br>├─ `SideNav` (collapsible list of sections)<br>├─ `KPIRow` (responsive grid of `KPICard`: value, label, trend icon)<br>├─ `ActivityFeed` (list of `ActivityItem`: timestamp, icon, description)<br>├─ `ChartsSection` (tabs: Lead Sources, Leads Over Time, Property Views, each rendering a chart via `<Recharts>` or similar)<br>└─ `QuickActions` (buttons: “New Property”, “Bulk Upload Leads”, “Configure AI”) |
| **Accessibility** | • All interactive controls (buttons, links, filter inputs) have accessible names<br>• Charts are accompanied by aria‑describedby text summaries or accessible data tables as fallback<br>• Keyboard navigable: tab through sidebar, then main controls; arrow keys to switch chart tabs<br>• Error messages use `role="alert"`<br>• Live region announces when auto‑refresh updates data (e.g., “KPIs updated”)<br>• Sufficient contrast for text/graph elements<br>• Respects reduced‑motion preference for chart animations |

---

## 7. AI Chatbot Configuration Screen (Admin) (`/admin/ai-settings` or `/settings/ai`)

**Purpose**: Administrative interface for configuring chatbot behavior (model, temperature, prompt, usage limits) without code deployment.

| Aspect | Details |
|--------|---------|
| **Route** | Typically `/settings/ai` or `/admin/ai-configuration` |
| **User Roles** | Admin |
| **Components** | • Form fields: <br> - Model selector (dropdown: e.g., `claude-3‑opus`, `claude-3‑sonnet`)<br> - Temperature slider (0.0‑2.0) with value display<br> - Max tokens input (number)<br> - System prompt textarea (editable)<br> - Usage quota limits (daily requests, token limit)<br>• Buttons: “Save Settings”, “Reset to Default”, “Test Connection” |
| **Inputs** | • Selections, slider movement, numeric input, text area edits<br>• Button clicks |
| **Outputs** | • Success/error toast after save<br>• Test connection result (modal with response sample or error)<br>• Navigable back to admin dashboard or settings index |
| **State Management** | • Form state (mirroring server values)<br>• Loading flag while saving or testing<br>• Validation error state per field |
| **API Integration** | • `GET /settings/ai` – fetch current configuration<br>• `PUT /settings/ai` – update configuration (partial or full)<br>• `POST /settings/ai/test` – send a sample prompt to the AI endpoint and return response (for validation) |
| **Validation** | • Model: must be one of allowed enum values<br>• Temperature: number between 0 and 2 inclusive (step 0.1)<br>• Max tokens: integer ≥ 1<br>• System prompt: required, max length (e.g., 2000 characters)<br>• Quota fields: non‑negative integers |
| **Error Handling** | • Inline validation messages under each field (e.g., “Select a valid model”)<br>• Save failure toast: “Could not save settings. Please try again.”<br>• Test connection failure: modal showing error details (e.g., “Invalid API key” or “Upstream error: 500”) |
| **Success Handling** | • Toast: “AI settings saved successfully” on successful PUT<br>• Test success: modal shows sample AI response and “Connection successful” banner |
| **Responsive Behavior** | • On mobile, form fields stack full‑width; slider retains width; textarea expands vertically<br>• Buttons align left‑to‑right on larger screens, stack vertically on small screens |
| **Component Hierarchy** | `AIConfigPage`<br>├─ `Form` (with `<FormGroup>` for each field)<br>│   ├─ `ModelSelect`<br>│   ├─ `TemperatureSlider` (shows current value)<br>│   ├─ `MaxTokensInput`<br>│   ├─ `SystemPromptTextArea`<br>│   ├─ `UsageQuotaGroup` (dailyRequests, monthlyTokens)<br>│   └─ `ActionButtons` (Save, Reset, Test)<br>└─ `FeedbackArea` (for test results) |
| **Accessibility** | • Each form field has an associated `<label>`; custom components (slider) use `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and `role="slider"`<br>• Slider is keyboard operable (Arrow keys adjust value)<br>• Error messages linked via `aria-describedby` and appear as `role="alert"`<br>• Buttons have clear visible text; icons accompanied by aria‑label if needed<br>• Sufficient contrast for text and interactive elements<br>• Focus order follows visual order; after submit, focus returns to first invalid field or submit button |

---

## 8. Property Inventory – Admin View (`/admin/properties` or `/properties/admin`)

**Purpose**: Admin‑only interface for viewing, filtering, editing, publishing, and deleting properties in the system.

| Aspect | Details |
|--------|---------|
| **Route** | Typically `/admin/properties` or `/properties/manage` |
| **User Roles** | Admin (primary); Agent with appropriate permissions may view but not edit |
| **Components** | • Toolbar: Search box, filter dropdowns (status: Draft/Published/Archived, property type, date added), “New Property” button, Bulk actions dropdown (Publish/Unpublish/Delete/Export)<br>• Table or card grid of properties (each row/card shows thumbnail, title, price, beds/baths/area, status badge, actions column)<br>• Pagination controls (page selector, rows per page)<br>• Inline edit controls (when a row is clicked or edit icon pressed) – modal or side drawer with full property form |
| **Inputs** | • Search text (free‑text)<br>• Filter selections (multiple) drops‑by dropdowns (status, type, date range)<br>• Sort column clicks (toggle ASC/DESC)<br>• Pagination controls (next/prev, page jump)<br>• Bulk selection checkboxes + bulk action dropdown<br>• Form fields in edit/create modal (title, description, price, beds, baths, area, location, images, amenities, etc.) |
| **Outputs** | • Updated list after filter/sort/pagination change<br>• Toast messages for create/update/delete/publish actions<br>• Navigation to individual property detail (preview) or back to list |
| **State Management** | • Filter state object (search, sorts, selected columns)<br>• Pagination state (current page, page size)<br>• Selection state (array of selected property IDs for bulk actions)<br>• Form state for add/edit modal (validated on submit)<br>• Loading spinners for list data and modal submit |
| **API Integration** | • `GET /admin/properties` – paginated list with filter, sort, range params<br>• `POST /admin/properties` – create new property (multipart/form‑data for images)<br>• `PATCH /admin/properties/:id` – update property (partial)<br>• `DELETE /admin/properties/:id` – soft delete or hard delete (depending on policy)<br>• `PATCH /admin/properties/:id/publish` – toggle published flag (separate endpoint for clarity)<br>• `POST /admin/properties/bulk` – bulk update (publish/unpublish/delete) based on selected IDs |
| **Validation** | • Required fields: title, price (>0), at least one image, location<br>• Numeric fields: beds, baths, area (≥0, integer/decimal as appropriate)<br>• Image upload: mime type (jpeg/png), size limit (e.g., 5 MB)<br>• Publication status transition validated server‑side (cannot publish if missing required data)<br>• Duplicate slug/title checks if applicable |
| **Error Handling** | • Inline form errors (e.g., “Price must be greater than zero”)<br>• Table row error banner if save fails (show message, retain edited values)<br>• Bulk operation partial failure: toast summarizing succeeded vs failed counts with ability to retry failed items |
| **Success Handling** | • Toast: “Property created”, “Property updated”, “Property published”, “Property deleted”<br>• After successful create/edit, close modal and refresh list (optimistic update)<br>• Successful batch action: toast with counts (e.g., “3 published, 1 failed”) |
| **Responsive Behavior** | • On desktop: table with fixed header and horizontal scroll if needed<br>• On tablet/mobile: switches to card‑based layout (each property as a card with stacked fields)<br>• Toolbar condenses: search and filters move to a dropdown‑toggle “Filters” button; primary actions (“New”, “Bulk”) stay visible<br>• Pagination controls become a simple “Load more” or infinite scroll on mobile |
| **Component Hierarchy** | `PropertyAdminPage`<br>├─ `Toolbar` (search input, filter dropdown/toggle, sort indicators, new‑button, bulk‑actions)<br>├─ `PropertyTable` (or `PropertyGrid` for mobile)<br>│   ├─ `TableHeader` (sortable columns)<br>│   └─ `TableBody` (rows: `PropertyRow`)<br>│       └─ Each row shows: thumbnail, title, price, beds/baths/area, status badge, action menu (eye, edit, delete)<br>├─ `PaginationControls` (page selector, dropdown for rows per page)<br>├─ `AddEditModal` (full property form with sections: Basic Info, Media, Location, Amenities, SEO)<br>└─ `EmptyState` (shown when no filters yield results) |
| **Accessibility** | • Table headers use `<th scope="col">`; each cell associates via `scope="row"` for the first column (if using simple table)<br>• Alternative: use `aria-label` on each cell for screen readers when using custom div‑based grid<br>• All interactive elements (buttons, menu items, sort arrows) have accessible names<br>• Form fields properly labeled; error messages linked via `aria-describedby` and appear inline<br>• Keyboard navigable: tab through toolbar, then into table (if using native `<table>`) or through grid cells via arrow keys (if using ARIA grid)<br>• Focus management: when opening edit modal, focus moves to first field; on close, returns to triggering button<br>• Bulk action checkboxes have visible labels and are keyboard operable (Space to toggle)<br>• Sufficient contrast for status badges and text<br>• Respects reduced‑motion preference for row‑highlight animations |

---

## 9. Listing Editor – Basic Info (e.g., `/properties/:id/edit/basic` or similar)

**Purpose**: Step‑wise or modal editor for updating the core details of a property (title, description, price, bedrooms, baths, area, location, etc.)—part of the property editing flow.

| Aspect | Details |
|--------|---------|
| **Route** | Typically nested under property edit: `/properties/:id/edit` with tab/step for “Basic Info” (other steps: Media, Location, Amenities, etc.) |
| **User Roles** | Admin, possibly Agent with edit rights |
| **Components** | • Form fields: <br> - Property title (text)<br> - Short description / tagline (textarea)<br> - Detailed description (rich‑text editor or textarea)<br> - Price (number input with currency selector)<br> - Bedrooms (integer input)<br> - Bathrooms (integer input, may support .5 increments)<br> - Living area (number input with unit selector: sq ft, sq m)<br> - Property type (dropdown: Single Family, Condo, Townhouse, etc.)<br> - Year built (number input)<br> - Lot size (number + unit)<br> - Address fields (street, city, state, zip, country) – could be a single line or separate<br> - Google Maps place‑autocomplete for address lookup<br>• Buttons: “Save & Continue”, “Cancel”, “Previous Step”, “Next Step” |
| **Inputs** | • Text, number, selections, date, rich‑text content<br>• Button clicks for navigation and submit |
| **Outputs** | • Updated property draft (saved to backend via PATCH)<br>• Validation messages inline<br>• Navigation to next step or back to property list |
| **State Management** | • Form values for each field (local component state)<br>• Validation state per field<br>• Current step index in wizard (if wizard UI)<br>• Loading flag on submission |
| **API Integration** | • `PATCH /properties/:id` – send only the subset of fields being edited (PATCH supports partial updates)<br>• `GET /properties/:id/edit` – optionally fetch current values to pre‑populate (if edit flow uses GET first) |
| **Validation** | • Title: required, max length (e.g., 200)<br>• Description: required, min length (maybe 20 chars)<br>• Price: required, > 0, two decimal places<br>• Bedrooms/Bathrooms: integer ≥ 0; baths may allow 0.5 increments<br>• Area: > 0, units allowed<br>• Year built: between 1800 and current year<br>• Address: required fields (street, city, postal code) – validated via regex or third‑party verification (optional)<br>• If using place‑autocomplete, retrieve latitude/longitude for map pin |
| **Error Handling** | • Inline field errors shown under each input (e.g., “Please enter a valid price”)<br>• Submit failure toast: “Failed to save changes. Please check the form and retry.”<br>• If any required field missing, block submission and focus first invalid field |
| **Success Handling** | • Toast: “Basic information saved successfully”<br>• On success of a step, auto‑advance to next step (if wizard) or enable “Next” button<br>• After final step, show “All changes saved” and optionally redirect to property list or detail view |
| **Responsive Behavior** | • On mobile, form fields stack full‑width; labels above inputs<br>• Button bar may become full‑width row with stacked actions (Previous, Next, Save) or a bottom sticky bar<br>• Use of modal or full‑screen slide‑up panel on narrow viewports instead of side drawer |
| **Component Hierarchy** | `PropertyEditBasicStep`<br>├─ `Form` (with `<FormGroup>` for each field)<br>│   ├─ `TextInput` (title, short description)<br>│   ├─ `TextArea` (long description – could use a rich‑text editor like Slate or TinyMCE)<br>│   ├─ `NumberInput` (price, bedrooms, bathrooms, area, year built, lot size)<br>│   ├─ `Select` (property type)<br>│   ├─ `AddressInput` (combined text with optional geolocate button)<br>│   └─ `ButtonGroup` (Previous, Next / Save, Cancel)<br>└─ `FeedbackArea` (for async validation like address lookup) |
| **Accessibility** | • Every `<input>`, `<select>`, `<textarea>` has an associated `<label>` (using `htmlfor` or `aria-label`)<br>• Error messages linked via `aria-describedby` and are `role="alert"`<br>• Buttons have discernible text; icons accompanied by visible label or aria‑label (e.g., “Save and continue”)<>• Keyboard navigable: Tab through inputs, Arrow keys inside selects, Enter to submit (or explicit button)<br>• If using a rich‑text editor, ensure it provides accessible toolbar (aria‑labels on buttons) and the editing region is focusable<br>• Contrast meets WCAG 2.1 AA for text vs background<br>• Form validates on blur and on submit; screen readers announce invalid fields when form submitted<br>• Respects `prefers-reduced-motion` for any slide‑in/out animations between steps |

---

## 10. Bulk Upload Validation Results (`/uploads/validation-result` or similar)

**Purpose**: After uploading a CSV/Excel file for bulk lead or property import, this screen shows validation outcomes: rows passed, rows with errors, and options to download error report, fix and re‑upload, or import valid rows.

| Aspect | Details |
|--------|---------|
| **Route** | Typically `/upload/leads/validate` or `/upload/properties/validate` |
| **User Roles** | Admin (primary), possibly Agent with import rights |
| **Components** | • Summary banner: totals (total rows, valid rows, rows with errors)<br>• Tabs or sections: <br> - **Valid Records** (preview table of first N rows that passed validation)<br> - **Errors** (list or table of problematic rows with column‑wise error messages)<br>• Buttons: <br> - “Download Error Report” (CSV)<br> - “Fix & Re‑upload” (opens file picker again or allows inline edit)<br> - “Import Valid Rows” (proceed to commit valid data to system) |
| **Inputs** | • File upload (initial step; this screen appears after successful file parsing)<br>• Button clicks for actions (download, fix/re‑upload, import) |
| **Outputs** | • File download (error report)<br>• Navigation back to upload screen if “Fix & Re‑upload” chosen<br>• Confirmation modal and then background import process if “Import Valid Rows” selected (shows progress bar, success/failure toast) |
| **State Management** | • Uploaded file metadata (name, size)<br>• Validation results object: `{total: number, valid: Array<Row>, errors: Array<{rowIndex, errors:[{column,message}]}>}`<br>• UI state: active tab (valid / errors), download in progress, import in progress |
| **API Integration** | • `POST /upload/leads` (or `/upload/properties`) – multipart file; returns validation result (asynchronous job ID or immediate sync response)<br>• `GET /upload/leads/:id/result` – poll for results if async<br>• `POST /upload/leads/:id/import` – initiate import of validated rows (may return job ID for tracking)<br>• `GET /import/jobs/:id/status` – check progress |
| **Validation** | • File type: must be `.csv`, `.xlsx`, `.xls`<br>• Maximum file size (e.g., 10 MB)<br>• Required columns present (per schema: for leads: `name`, `phone`, `email`, `propertyId`, `source`; for properties: `title`, `price`, `beds`, `baths`, `area`, etc.)<br>• Cell‑level validation: data types, ranges, foreign‑key existence (e.g., `propertyId` must refer to an existing property)<br>• Duplicate detection within file (based on unique key like email+phone) |
| **Error Handling** | • If upload fails (wrong type, too large): toast with clear message (“Please upload a CSV or Excel file under 10 MB”)<br>• Validation errors displayed per row: highlight column, show message (e.g., “Invalid email format”, “Property ID 12345 not found”)<br>• Import failures: show modal with errors from backend (e.g., “Database constraint violation”) and allow cancel/retry |
| **Success Handling** | • After successful upload & validation: show summary banner<br>• When “Download Error Report” clicked: generate and trigger download of CSV with added `_error` column<br>• When “Import Valid Rows” clicked: show progress bar; on completion, toast “X records imported successfully” and redirect to list view (leads or properties) |
| **Responsive Behavior** | • On desktop: two‑panel layout (summary on top, tabbed views below)<br>• On mobile: stacks vertically; tabs change to accordion sections; buttons become full‑width<br>• Table of valid rows becomes scroll‑horizontally if many columns; on mobile may switch to card‑view per row |
| **Component Hierarchy** | `UploadValidationPage`<br>├─ `SummaryBanner` (totals, progress bar if applicable)<br>├─ `TabContainer` (tabs: “Valid Records”, “Errors”)<br>│   ├─ `ValidRecordsTable` (columns: dynamic based on file headers; shows first 50‑100 rows)<br>│   └─ `ErrorsTable` (columns: Row #, Column, Message; each error expandable to show full row)<br>├─ `ActionButtons` (Download Error Report, Fix & Re‑upload, Import Valid Rows)<br>└─ `ModalContainer` (for confirmations, import progress, error details) |
| **Accessibility** | • Table uses `<thead>` and `<tbody>` with `scope="col"` on headers; each data cell associates via scope or `headers` attribute<br>• Buttons have clear text; icons accompanied by aria‑label if needed<br>• File input is labeled (“Choose CSV or Excel file”) and accessible via keyboard<br>• Error messages are associated with the specific table cell via `aria-describedby` (or use `<td>` with `title` tooltip)<br>• Live region announces when validation completes (e.g., “Validation complete: 142 rows valid, 23 rows with errors”)<br>• Focus follows logical order: after upload, focus moves to first tab or summary; after action button, focus moves to resulting dialog or message<br>• Sufficient contrast for text and background in tables<br>• Respects reduced‑motion preference for any loading spinners or animations |

---

## 11. Search Results – Standard View (`/search` or `/results` with AI active)

**Purpose**: Display of property search results when AI‐powered query understanding succeeds, showing ranked listings with match scores and explainability icons (✓/✗).

| Aspect | Details |
|--------|---------|
| **Route** | Typically `/search?q=...&source=ai` or `/results?mode=ai&query=...` |
| **User Roles** | Visitor, Customer, Agent, Admin |
| **Components** | • Search bar (persistent at top, retains query)<br>• Results header: “Showing X results for ‘<query>’” + toggle between AI and filter view (if offered)<br>• Result list: cards or table rows; each card shows:<br> - Property thumbnail<br> - Title, price, beds/baths/area<br> - Match score (percentage)<br> - Explainability icons per criteria (e.g., ✓ Location, ✗ Price, ✓ Bedrooms) – typically 3‑5 criteria<br> - Favorite button (authenticated)<br> - CTA: “View Details”, “Contact Agent”<br>• Pagination or infinite scroll loader<br>• Sidebar filters (optional) for users to tweak and re‑run search |
| **Outputs** | • Updated list when query changes or filters applied<br>• Navigation to property detail on card click<br>• Toast messages for errors (e.g., search service unavailable triggers fallback) |
| **State Management** | • Search query string (controlled component)<br>• Current view mode: AI or filter (toggle state)<br>• Pagination / offset, limit for results<br>• Selected filter values (if facet filters shown)<br>• Loading flags for results request |
| **API Integration** | • `GET /api/properties` – with query parameters: `q` (natural language), `source=ai`, optional `limit`, `offset`, plus filters if user refined (price range, beds, etc.)<br>• Alternative: dedicated search endpoint `POST /api/search` with body `{query, mode:"ai", filters: {...}}` returns `{results: [ {property, score, explanations} ], total}`<br>• `GET /search/suggest` – autosuggestions as user types in search bar<br>• `GET /properties/:id` – for drilling into detail |
| **Validation** | • Query string: trimmed, max length (e.g., 200 chars)<br>• Faceted filters: numeric ranges validated (min ≤ max), enumerated values (property type) against allowed list<br>• Pagination parameters: positive integers, limit bounded (e.g., max 100) |
| **Error Handling** | • If AI service times out or returns error: automatically fall back to filter‑based search and show banner “AI temporarily unavailable – showing filter‑based results”<br>• Network error: show retry button and message “Unable to load results. Please check your connection.”<br>• No results found: show empty state with suggestions to broaden search |
| **Success Handling** | • Results rendered with smooth fade‑in or slide‑up (respecting reduced‑motion preference)<br>• Each result card includes accessible label for screen readers (e.g., “Result 3: 3‑bedroom house, $350k, 85% match”)<br>• On successful refinement via filters, URL updated (pushState) for shareability |
| **Responsive Behavior** | • On desktop: grid of cards (3‑4 columns) with sidebar collapsed by default (toggle to show filters)<br>• On tablet: 2‑column grid; sidebar may be permanently visible or toggleable<br>• On mobile: single‑column list; search bar remains fixed top; filters accessible via bottom sheet or drawer; cards expand to full width with vertical stacking of meta |
| **Component Hierarchy** | `SearchResultsPage`<br>├─ `PersistentSearchBar` (input + clear button, retains query)<br>├─ `ResultsHeader` (total count, query text, View mode toggle: AI ▲/▼)<br>├─ `ResultList` (wrapper for infinite scroll or pagination)<br>│   └─ `SearchResultCard` (for each item):<br>│       ├─ `Thumbnail`<br>│       ├─ `Content` (title, price, beds/baths/area)<br>│       ├─ `MatchBadge` (score % + tooltip)<br>│       ├─ `ExplanationList` (items: `<IconCheck/>`/`<IconClose/>` label)<br>│       ├─ `FavoriteButton`<br>│       └─ `ActionButtons` (View Details, Contact Agent)<br>├─ `SidebarFilters` (collapsible: Price, Beds, Baths, Property Type, Date Listed, etc.)<br>├─ `PaginationControls` (or `InfiniteScrollLoader`)<br>└─ `EmptyState` (message + suggestions) |
| **Accessibility** | • Search bar has `label` (visible or `aria-label`) and is keyboard operable<br>• Result list uses `role="list"` and each item `role="listitem"`; alternatively semantic `<article>` or `<li>`<br>• Each card is focusable (tabindex=0) and has accessible name composed from its content (title, price, etc.)<br>• Match badge and explanation icons have `aria-label` describing the meaning (e.g., “Location match: yes”)<br>• Pagination controls are labeled (“Go to page 2”) and keyboard operable<br>• Empty state message is announced via `aria-live="polite"` when it appears<br>• Contrast meets WCAG 2.1 AA for text and icons<br>• Respects reduced‑motion preference for entrance animations |

---

## 12. Search Results – Filter‑Based Fallback View (`/search?fallback=true` or similar)

**Purpose**: Display of search results when AI service is unavailable, using traditional keyword/filters matching. Essentially same layout as the AI view but without match scores or explainability icons.

| Aspect | Details |
|--------|---------|
| **Route** | Same base path as standard results but with a flag indicating fallback (e.g., `?mode=filter`) |
| **User Roles** | Visitor, Customer, Agent, Admin |
| **Components** | • Search bar (same as AI view)<br>• Results header: “Showing X results for ‘<query>’ (filter‑based)” + AI status banner indicating fallback<br>• Result list: property cards similar to AI view but showing only basic info (thumbnail, title, price, beds/baths/area, favorite button, CTA)<br>• Pagination / infinite scroll |
| **Inputs** | • Search query text<br>• Optional filter controls (same as AI view) |
| **Outputs** | • Updated list on query/filter change<br>• Navigation to property detail<br>• Transient banner indicating fallback mode |
| **State Management** | • Query string, filters, pagination, loading flag (same as AI view) |
| **API Integration** | • `GET /api/properties` – with standard query parameters: `q` (full‑text or fuzzy), plus any selected filters (priceMin, priceMax, bedrooms, etc.) <br>• No `source=ai` param; system knows to use fallback based on error from primary path<br>• `GET /search/suggest` for autocomplete |
| **Validation** | Same as for AI view (query length, filter values) |
| **Error Handling** | • If fallback also fails (e.g., DB error): show generic error UI with retry<br>• Malformed query handled by sanitizing before sending to backend |
| **Success Handling** | • Results rendered; optional toast only for transient network retries; no success toast needed for normal operation |
| **Responsive Behavior** | Identical to AI view (grid/list adaptation) |
| **Component Hierarchy** | Same as `SearchResultsPage` but the `SearchResultCard` omits `MatchBadge` and `ExplanationList` components; may instead show a small “Filter‑based” badge in the corner.<br>• Additional banner component (`AIStatusBanner`) displayed above results when in fallback mode. |
| **Accessibility** | Same considerations as AI view; the aria‑label of each result card omits mention of score/explanation (e.g., “Result 3: 3‑bedroom house, $350k”) |

---

## 13. Search Results – Empty State (`/search?query=...&results=0`) 

**Purpose**: Shown when a search yields no matching properties, providing guidance to refine the query.

| Aspect | Details |
|--------|---------|
| **Route** | Same as search results pages, with zero results flag |
| **User Roles** | Visitor, Customer, Agent, Admin |
| **Components** | • Illustrative graphic or empty‑state icon<br>• Primary message: “No properties match your search.”<br>• Secondary suggestions: <br> - Try broadening location or price range<br> - Check spelling<br> - Remove some filters<br> - Use the AI‑powered search for broader matching<br>• Button: “Clear Filters & Search Again” or “Go to Homepage” |
| **Inputs** | • Button clicks |
| **Outputs** | • Navigation back to search with cleared filters or to home page |
| **State Management** | None beyond UI state for showing the message |
| **API Integration** | None (purely client‑side after receiving empty array from search endpoint) |
| **Validation** | N/A |
| **Error Handling** | N/A (this is a valid empty‑result state) |
| **Success Handling** | N/A |
| **Responsive Behavior** | • Centered content on large screens; on mobile, full‑width with larger tap targets for buttons<br>• Illustration may scale or swap to a simpler icon on very narrow screens |
| **Component Hierarchy** | `SearchEmptyState`<br>├─ `Illustration` (optional image or SVG)<br>├─ `Message` (primary + secondary lines)<br>└─ `ActionButtons` (primary: “Try again with broader filters”, secondary: “Return to home”) |
| **Accessibility** | • Image has `alt` text describing the scene (e.g., “Illustration of a magnifying glass over a map with no pins”)<br>• Text uses sufficient contrast<br>• Buttons have visible labels and are keyboard operable<br>• Focus moves to first button when empty state appears<br>• ARIA live region not needed as it’s static content shown on page load/message update |

---

## 14. Property Inquiry Form (Modal/Inline) – *Reused across multiple contexts*

**Purpose**: Captures visitor/customer inquiry about a specific property (name, phone, email, message) and creates a lead.

*Note: This component appears on the Property Detail page (CTA), Homepage contact form, and potentially search result cards.*

| Aspect | Details |
|--------|---------|
| **Trigger** | Clicking “Inquire about this property”, “Contact agent” (when it opens the form), or homepage “Contact us” button |
| **Modal/Inline** | Usually a modal (centered) or inline form below the CTA |
| **Fields** | • Name (text, required)<br>• Phone (tel, required)<br>• Email (email, required)<br>• Message / Comments (textarea, required, min length ~10)<br>• Hidden field: `propertyId` (set from context) |
| **Outputs** | • On submit: leads to `POST /leads` with payload `{name, phone, email, message, propertyId, source:"property_inquiry"}` plus idempotency key header<br>• Success toast: “Inquiry sent successfully! An agent will contact you shortly.”<br>• Error toast: “Failed to send inquiry. Please check your information and try again.”<br>• Form reset on success or retained values on error (with inline validation messages) |
| **State Management** | • Field values (controlled)<br>• Validation state per field (error messages)<br>• Loading spinner on submit button |
| **API Integration** | • `POST /leads` – create lead (requires Idempotency‑Key header, source tracking)<br>• Optional: `GET /properties/:id` to verify property exists before submission (could be done optimistically) |
| **Validation** | • All fields required<br>• Email must match email pattern<br>• Phone: digits, spaces, +, -, (, ) – at least 7‑15 chars after stripping non‑digits<br>• Message: min length (e.g., 10 characters) to avoid spam<br>• Length limits: name ≤ 100, phone ≤ 20, email ≤ 255, message ≤ 2000 |
| **Error Handling** | • Inline field errors: “Please enter a valid name”, “Invalid email format”, “Message too short”<br>• Submit failure: network or validation error from API → show toast and keep form values |
| **Success Handling** | • Toast as above<br>• Optionally show a mini‑confirmation inside the modal (“Thank you! We’ll be in touch soon.”) before closing<br>• After close, focus returns to triggering element (e.g., the CTA button) |
| **Responsive Behavior** | • On modal: width ~90% of viewport up to max 500 px; centered<br>• On full‑width inline (e.g., on homepage): fields stack vertically; labels on top<br>• Input fields and textarea expand to container width<br>• Button bar: primary action full width, secondary (reset/cancel) underneath or side‑by‑side on wider screens |
| **Component Hierarchy** | `InquiryForm`<br>├─ `Form`<br>│   ├─ `TextInput` (label: Name, required)<br>│   ├─ `TelInput` (label: Phone, required)<br>│   ├─ `EmailInput` (label: Email, required)<br>│   ├─ `TextArea` (label: Message, required, minLength)<br>│   └─ `ButtonGroup` (Submit, Reset/Cancel)<br>└─ `FeedbackArea` (for async validation like duplicate detection) |
| **Accessibility** | • Every input has associated `<label>` (using `htmlfor` or `aria-label`)<br>• Error messages linked via `aria-describedby` and are `role="alert"` <br>• Submit button has visible text; is disabled while invalid or loading<br>• Modal focus trap: when open, focus moves to first field; on close, returns to trigger<br>• Esc key closes modal<br>• Contrast meets WCAG 2.1 AA<br>• Screen reader announces validation errors when they appear (live region) and success message on submit |

---

## 15. Login / Registration Pages (Auth Routes)

**Purpose**: Standard authentication flows – login, registration, password reset, email verification.

| Aspect | Details |
|--------|---------|
| **Routes** | `/login`, `/register`, `/forgot-password`, `/reset-password/:token`, `/verify-email/:token` |
| **User Roles** | Visitor (unauthenticated) → upon success becomes Customer/Agent/Admin based on role selected or existing account |
| **Components** | • **Login Form**: Email/Username, Password, Remember me checkbox, Forgot password link, Submit button<br>• **Registration Form**: Full name, Email, Password, Confirm password, Role selector (Customer/Agent), Submit button, Login link<br>• **Forgot Password**: Email input, Submit button, Back to login link<br>• **Reset Password**: Token (from URL), New password, Confirm password, Submit button<br>• **Email Verification**: Informational page “Check your inbox”, Resend verification link button, Back to login |
| **Inputs** | • Form fields as listed<br>• Button clicks |
| **Outputs** | • On successful login: redirect to role‑based dashboard (e.g., `/dashboard` for Customer, `/leads/pipeline` for Agent, `/admin` for Admin)<br>• On successful registration: show message “Please check your email to verify your account” and optionally auto‑login after verification<br>• On password reset: show success message and redirect to login<br>• On email verification: show success message and redirect to login |
| **State Management** | • Form values (email, password, etc.)<br>• Loading state on submit button<br>• Optional: remember me persisted via cookie/local storage (secure, httpOnly) |
| **API Integration** | • `POST /auth/login` – returns access token (JWT) and refresh token<br>• `POST /auth/register` – returns user info and sends verification email<br>• `POST /auth/forgot-password` – accepts email, sends reset link<br>• `POST /auth/reset-password` – accepts token + new password<br>• `POST /auth/verify-email` – accepts token, marks email verified<br>• `POST /auth/refresh` – exchanges refresh token for new access token (silent)<br>• `POST /auth/logout` – invalidates tokens on server; client clears storage |
| **Validation** | • Email: required, valid format<br>• Password: required, min length (e.g., 8), may require mix of chars for register<br>• Confirm password: matches password<br>• Name: required, reasonable length<br>• Role (on register): must be one of allowed enum (Customer, Agent) – Admin registration typically disabled or admin‑only<br>• Remember me: boolean |
| **Error Handling** | • Inline field errors: “Invalid email”, “Password too short”, “Passwords do not match”<br>• Auth failure: “Invalid email or password” (generic to avoid user enumeration)<br>• Rate‑limiting: after too many attempts, show “Too many attempts. Try again later.”<br>• Email already exists on register: “An account with this email already exists.”<br>• Invalid/expired token on reset/verify: “Invalid or expired link. Please request a new one.” |
| **Success Handling** | • Successful login: store tokens (httpOnly cookie preferred, or short‑lived access token in memory + refresh token in httpOnly cookie); redirect to appropriate dashboard<br>• Successful registration: show message, optionally auto‑login after email verification<br>• Successful password reset: show message and go to login<br>• Successful email verification: show message and go to login |
| **Responsive Behavior** | • Centered modal or full‑width card on desktop; on mobile, full‑screen width with top padding<br>• Input fields stack vertically; button full width<br>• Links (e.g., “Forgot password?”) inline under button |
| **Component Hierarchy** | `AuthPage` (layout wrapper)<br>├─ `Form`<br>│   ├─ `TextInput` ( label: Email / Username )<br>│   ├─ `PasswordInput` ( label: Password, toggle visibility )<br>│   ├─ `Checkbox` ( Remember me )<br>│   ├─ `Link` ( Forgot password → `/forgot-password` )<br>│   └─ `Button` ( Submit )<br>└─ `AlternateLinks` ( Don’t have an account? → `/register` )<br>For register, add name, confirm password, role selector, etc. |
| **Accessibility** | • Every form field has associated `<label>`<br>• Password toggle button has `aria-label`: “Show password” / “Hide password”<br>• Error messages linked via `aria-describedby` and are `role="alert"`<br>• Submit button disabled until form valid; live region announces when error appears<br>• Focus management: after submit success, focus moves to first element on destination page (or notification if staying on same page)<br>• Contrast meets WCAG 2.1 AA for text and background<br>• Respects reduced‑motion preference for any transition animations |

---

## 16. Notification Center (e.g., `/notifications` or dropdown from header)

**Purpose**: Displays system‑generated notifications (new lead assigned, property inquiry received, system alerts, etc.) with ability to mark as read, delete, or view details.

| Aspect | Details |
|--------|---------|
| **Route** | Typically `/notifications` (full page) or accessible via bell icon in header (dropdown/popup) |
| **User Roles** | All authenticated roles (Visitor sees none) |
| **Components** | • Header: “Notifications” + badge showing unread count<br>• List of notification items (each with icon, timestamp, short message, unread indicator)<br>• Actions per item: Mark as read/unread, Delete, View (navigates to related entity)<br>• Bulk actions: Mark all as read, Delete all<br>• Empty state: “No notifications” |
| **Inputs** | • Click on notification item (to navigate)<br>• Click on icons: mark as read, delete<br>• Bulk action buttons<br>• Refresh / pull‑to‑refresh (if applicable) |
| **Outputs** | • Updated list (optimistic removal/mark‑as‑read)<br>• Toast for bulk actions: “5 notifications marked as read”<br>• Navigation to related entity (e.g., lead detail, property detail) upon tapping notification |
| **State Management** | • List of notification objects (server‑sent or via WS/SSE)<br>• Filter state: show all / unread only<br>• Pagination / infinite scroll state<br>• Loading flag while fetching |
| **API Integration** | • `GET /notifications` – fetch paginated list (with `?unread=true` if filter)<br>• `PATCH /notifications/:id` – set `read:true/false` (or separate endpoints `/read`, `/unread`)<br>• `DELETE /notifications/:id` – delete single<br>• `POST /notifications/read-all` – mark all as read<br>• `DELETE /notifications/all` – delete all (if allowed)<br>• Optional: Real‑time updates via WebSocket (`notification.created`, `notification.updated`, `notification.deleted`) |
| **Validation** | • ID parameters must be valid UUIDs or numeric<br>• Bulk actions require at least one item selected (or apply to all when “select all”) |
| **Error Handling** | • If marking as read fails: show inline undo toast with retry option<br>• Delete failure: show error and retain item<br>• Network error on fetch: show retry button and message |
| **Success Handling** | • Toast: “Notification marked as read” (single) or “X notifications marked as read” (bulk)<br>• After deletion: item removed with undo option |
| **Responsive Behavior** | • In header dropdown: fixed width, scrollable if many items<br>• On full page: responsive list (single column on mobile, multi‑column on desktop if desired)<br>• Bulk action bar may stick to bottom on mobile |
| **Component Hierarchy** | `NotificationCenter`<br>├─ `Header` (title, badge, refresh button)<br>├─ `FilterToggle` (Show all / Unread only)<br>├─ `NotificationList` (empty state or items)<br>│   └─ `NotificationItem` (left icon, message, time, right action buttons: mark-as-read, delete, chevron for detail)<br>├─ `BulkActionsBar` (Select all, Delete selected, Mark as read)<br>└─ `EmptyState` (icon + message “No notifications”) |
| **Accessibility** | • Each notification item is focusable (tabindex=0) and has accessible name combining type, message, and time<br>• Action buttons have aria‑label: “Mark as read”, “Delete”, “View details”<br>• Bulk action buttons labelled clearly<br>• Live region announces when new notification arrives (e.g., “You have 1 new notification”)<br>• Contrast meets WCAG 2.1 AA for text and icons<br>• Focus management: after deleting an item, focus moves to next item or to the list header if list empty<br>• Supports keyboard navigation: Tab to move between items, Enter to activate default action (usually view details), Space/Enter on action buttons |


---  

*This specification consolidates the detailed information captured in each individual screen specification file (located under `knowledge_base/ui/screens/`). It serves as a single reference point for frontend developers, QA engineers, and product stakeholders to understand expected behavior, data interactions, and accessibility considerations for every screen in the Property Vista CRM MVP.*