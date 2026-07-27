# PropVista CRM Homepage

## Purpose
Main landing page showcasing the AI-first value proposition, enabling visitors to search properties, learn about the service, and express interest without navigating away.

## Screenshot Reference
`../../raw_documents/design_reference/propvista_crm_homepage/screen.png`

## HTML Reference
`../../raw_documents/design_reference/propvista_crm_homepage/code.html`

## Route
`/` (root)

## User Roles
- **Visitor** (unauthenticated) – primary audience
- **Customer** (authenticated) – can view homepage after login
- **Agent** (authenticated) – can view homepage after login
- **Admin** (authenticated) – can view homepage after login

## Components
- Company branding and navigation (top)
- Prominent AI-powered search bar (natural language input)
- Featured properties section (3‑6 cards with image, price, beds/baths, location)
- “How it works” section (search → match → connect process with icons)
- Customer testimonials (quotes with photos)
- Chat widget (bottom‑right corner)
- Contact form (name, phone, email, message/callback)
- Footer (legal, resources, company links)

## Form Fields (Contact Form)
- Name (text, required)
- Phone (tel, required)
- Email (email, required)
- Message / Callback request (textarea, required)

## Validation
- All contact form fields are required.
- Email field must match email format.
- Phone field accepts digits, spaces, +, -, (, ) – basic validation.
- On submission, client‑side validation runs; server‑side validates using schema (e.g., Zod) and returns field‑level errors if any.

## Business Rules
- Submitting the contact form creates an anonymous lead (FR6.1‑FR6.4).
- Lead creation must include Idempotency‑Key to prevent duplicates.
- Source tracking captures that the lead originated from the homepage contact form.
- Validation includes checking for duplicate leads based on email/phone within a time window.
- The homepage must load CMS‑driven content via `GET /cms/homepage` for banners/sections.
- Featured properties are fetched via `GET /properties/featured`.
- Implements responsive design for mobile/viewport compatibility.

## Buttons
- **Contact Form Submit** – sends inquiry.
- **Chat Widget Icon** – opens/closes the chatbot interface.
- Navigation links in header/footer (e.g., About, Blog, Contact) – assumed.

## Navigation
- **From**: Entry point (direct URL or via logo/link from other pages).
- **To**:
  - Search results (standard/fallback/empty) via AI‑powered search bar.
  - Property detail page via featured property cards.
  - Login / Sign‑up flow (via header links).
  - Chatbot widget (bottom‑right) for AI‑powered Q&A.

## API Endpoints
- `GET /cms/homepage` – homepage dynamic content.
- `GET /properties/featured` – featured property cards.
- `POST /leads` – create lead from contact form (requires Idempotency‑Key, source tracking).
- `POST /chat/messages` – send message to chatbot (if chat widget used).
- `GET /chat/messages?stream=true` – receive SSE stream for chatbot responses (if applicable).
- `GET /search/suggest` – auto‑suggestions as user types in search bar.

## Success Messages
- “Thank you! We’ve received your inquiry and will get back to you shortly.” (displayed after successful contact form submission).
- Chatbot welcome message (from FR1.1).

## Error Messages
- Field‑level validation errors: “Please enter a valid name”, “Invalid phone number”, “Please provide a valid email address”, “Message cannot be empty”.
- Submission failure: “Something went wrong. Please try again later.”
- Chatbot errors: fallback message per FR13.1 – “I’m having trouble right now — try the search filters above.”

## Empty States
- If no featured properties are returned, the featured properties section can be hidden or show a placeholder (e.g., “No featured properties at the moment”).

## Loading States
- Skeleton loaders or spinners while fetching:
  - CMS content (`GET /cms/homepage`).
  - Featured properties (`GET /properties/featured`).
  - Search auto‑suggestions (`GET /search/suggest`).
  - Chatbot initial greeting (if loaded via API).

## Responsive Behavior
- Layout adapts to mobile/viewport sizes (per notes).
- Search bar remains prominent; on narrow viewports may stack vertically.
- Featured properties cards transform from horizontal carousel to vertical list.
- Chat widget remains fixed bottom‑right but respects safe areas.
- Footer links may collapse into a “hamburger” menu on mobile.

## Accessibility Notes
- All interactive elements have ARIA labels (search bar, chat widget toggle, form fields, submit button).
- Sufficient color contrast (WCAG 2.1 AA) for text and icons.
- Keyboard navigable: users can tab through header nav, search bar, form fields, and footer.
- Focus management for modal/dialogs (if contact form opens in modal).
- Screen‑reader friendly labels for image carousels (use `aria‑label` on each slide).
- Live region for dynamic messages (success/error toast) so changes are announced.