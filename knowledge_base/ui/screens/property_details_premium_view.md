# property_details_premium_view

## Purpose
Comprehensive property detail view enabling informed inquiry decisions through rich media and structured information.

## Screenshot reference
../../raw_documents/design_reference/property_details_premium_view/screen.png

## HTML reference
../../raw_documents/design_reference/property_details_premium_view/code.html

## Route
/properties/:id

## User roles
- Visitor (unauthenticated) – primary audience
- Customer (authenticated) – can view after login
- Agent (authenticated) – can view after login
- Admin (authenticated) – can view after login

## Components
- Property gallery (carousel/slider of images)
- Property header with title, price, beds/baths/area badges, favorite button
- Primary CTA button: "Inquire about this property"
- Secondary CTA: "Contact agent" or "Schedule tour"
- Tabs/sections: Overview, Details, Floorplan, Map, Amenities, Price breakdown, Similar properties
- Agent contact card (photo, name, phone, email)
- Property badges for beds, baths, area
- Loading states for gallery and tabs
- Error states for media loading
- Back to results link/button

## Form fields
- Favorite/save button (toggle)
- Contact form (inquiry form) - may appear as modal or inline section
  - Name (text, required)
  - Phone (tel, required)
  - Email (email, required)
  - Message (textarea, required)

## Validation
- Contact form fields: all required
- Email must be valid format
- Phone: digits, spaces, +, -, (, )
- Message cannot be empty
- Favorite button: no validation needed (toggle state)

## Business rules
- Derived from FRs: FR5.1-FR5.5
- Property data sourced from GET /properties/:id endpoint
- Favorite/save action requires authentication (creates lead or saves to user profile)
- Inquiry submission creates a lead (FR6.1-FR6.4) with property ID reference
- Must include Idempotency-Key for inquiry submission to prevent duplicates
- Source tracking: inquiry from property detail page
- Price displayed as numeric string (never float) per API conventions
- Image gallery accessible: swipe, keyboard navigation, screen reader labels
- Map component shows property location with neighborhood highlights
- Similar properties carousel uses GET /properties?similarTo=:id or recommendation endpoint
- Agent contact card shows agent photo, name, phone, email with click-to-call/email
- Responsive design: tabs may collapse to accordion on mobile, gallery remains swipeable

## Buttons
- Primary: "Inquire about this property" (submits contact form)
- Secondary: "Contact agent" (may open pre-filled email/phone or contact form)
- Secondary: "Save property" or "Favorite" (heart icon toggle)
- Tertiary: "Share" (social media sharing)
- Navigation: "Back to results" or "Close" (if modal)
- In gallery: previous/next slide buttons
- In tabs: tab buttons to switch sections
- In map: full-screen toggle, zoom controls, location pin click

## Navigation
- **From**: Search results (standard/fallback/empty), featured products on homepage, similar properties carousel, saved properties list, agent property list
- **To**: 
  - Inquiry form submission -> success message or error
  - Save favorite -> adds to user's saved properties (if authenticated)
  - Share -> opens share sheet or copies link
  - Agent contact -> initiates call/email or opens contact form
  - Related properties -> navigates to another property detail
  - Back to search results -> returns to previous search context
  - Homepage -> via logo or breadcrumb

## API endpoints
- GET /properties/:id - fetch property details (gallery, price, specs, amenities, location, agent info)
- POST /leads - create inquiry lead (requires propertyId in body or context)
- POST /favorites or POST /saved-properties - save property to user list (if authenticated)
- DELETE /favorites/:id or DELETE /saved-properties/:id - remove saved property
- GET /properties?similarTo=:id - get similar/recommended properties (optional)
- GET /agents/:agentId - get agent details for contact card (if separate endpoint)

## Success messages
- "Property saved to your favorites"
- "Inquiry sent successfully! An agent will contact you shortly."
- "Share link copied to clipboard"
- "Property unstarred from favorites"

## Error messages
- "Failed to load property details. Please try again."
- "Image failed to load" (per gallery item)
- "Map unavailable"
- "Inquiry failed to send. Please check your information and try again."
- "You must be logged in to save properties."
- "Session expired. Please log in to continue."
- "Invalid phone number or email format"
- "Message is required"

## Empty states
- If no gallery images: show placeholder "No images available"
- If no similar properties: show "No similar properties found" with suggestion to browse more
- If no amenities: none displayed or "No amenities listed"
- If agent contact not available: show "Contact information not available"

## Loading states
- Skeleton loader for property header while data fetches
- Image placeholders for gallery until each loads
- Spinner for tabs content while section data loads
- Placeholder for map while loading
- Skeletons for text sections (description, details, etc.)
- Loading state for agent contact card

## Responsive behavior
- On mobile: tabs convert to vertical accordion or collapsible sections
- Property gallery remains swipeable with visible navigation arrows
- Columns stack: image gallery full width, then information sections below
- Map may take full width and height or be collapsible
- Agent contact card may appear as a full-width call-to-action bar at bottom
- Text scales appropriately, maintaining readability
- Touch targets minimum 48x48px for buttons and interactive elements

## Accessibility notes
- All interactive elements have ARIA labels (gallery navigation, tabs, buttons, form fields)
- Keyboard navigable: tab through sections, arrow keys in gallery, enter to activate buttons
- Gallery images have descriptive alt text or aria-label (e.g., "Living room view, image 1 of 5")
- Tab panel follows ARIA tabs pattern (role=tablist, tab, tabpanel)
- Form fields associated with labels via html/aria-label
- Error messages use role="alert" or aria-live="polite"
- Color contrast meets WCAG 2.1 AA for text and icons
- Screen reader announces status updates (e.g., "Image 2 of 5 loaded")
- Focus management: after submitting inquiry, focus moves to success message
- Skip navigation link for screen reader users to bypass repetitive header