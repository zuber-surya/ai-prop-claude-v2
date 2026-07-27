# Component Library

This document lists reusable UI components identified from the HTML mockups and design specifications. Each component is documented with its purpose, props, states, variants, events, accessibility considerations, responsive behavior, dependencies, and reuse locations.

## 1. Property Card

**Purpose**: Displays a property's key information (image, price, beds/baths, location) in a consistent card format used across listings, search results, and property details.

**Props**:
- `imageUrl` (string): URL of the property's main thumbnail
- `title` (string): Property title/name
- `price` (number or string): Price formatted as currency string
- `bedrooms` (number): Number of bedrooms
- `bathrooms` (number): Number of bathrooms
- `area` (number or string): Area with unit (e.g., "1200 sq ft")
- `location` (string): City/area name
- `favorite` (boolean): Whether the property is favorited by the user
- `onFavoriteToggle` (function): Callback when favorite button is clicked
- `onClick` (function): Callback when the card is clicked (for navigation)

**States**:
- `idle`: Default state
- `hover`: When mouse pointer is over the card
- `pressed`: When card is pressed/clicked
- `favorite`: When the property is favorited (filled heart icon)
- `disabled`: Not applicable (cards are always interactive)

**Variants**:
- `small`: Used in sidebars or secondary listings (smaller image and text)
- `medium`: Standard size used in search results and property listings
- `large`: Used in featured sections with more details (may include additional badges)
- `skeleton`: Loading state placeholder with animated shimmer

**Events**:
- `onClick`: Navigates to property details page
- `onFavoriteToggle`: Toggles favorite status and updates UI

**Accessibility**:
- Must be keyboard focusable (tabindex="0")
- Include aria-label for screen readers describing the property
- Favorite button must have aria-pressed state and accessible label
- Ensure sufficient color contrast for text and icons
- Touch target minimum 48x48px

**Responsive Behavior**:
- On mobile: Stacks vertically with full-width container
- On tablet/desktop: Appears in grid layout (2-4 columns depending on screen size)
- Image maintains aspect ratio with object-fit: cover
- Text wraps appropriately on smaller screens

**Dependencies**:
- None (primitive HTML/CSS components)
- May use avatar/image component for property thumbnail
- May use badge component for labels (if added in future)

**Reuse Locations**:
- Homepage featured properties section
- Search results standard and fallback views
- Property details similar properties carousel
- Customer dashboard saved properties grid
- Property inventory admin view (as card view alternative to table)

## 2. Search Bar

**Purpose**: Allows users to enter search queries for properties, with auto-suggestions and clear button.

**Props**:
- `placeholder` (string): Placeholder text when empty
- `value` (string): Current input value (controlled)
- `onChange` (function): Called when input value changes
- `onClear` (function): Called when clear button is clicked
- `onSearch` (function): Called when user submits search (e.g., on Enter)
- `loading` (boolean): Shows loading spinner instead of search icon
- `suggestions` (array): Array of suggestion objects to display in dropdown
- `onSuggestionSelect` (function): Called when a suggestion is selected

**States**:
- `idle`: Default state
- `focused`: Input is focused
- `loading`: Search is in progress
- `has-value`: Input has a value (shows clear button)
- `suggestions-open`: Suggestion dropdown is visible
- `error`: Input has validation error

**Variants**:
- `standard`: Full-width with search icon and clear button
- `compact`: Smaller height for use in toolbars or headers
- `with-suggestions`: Shows dropdown menu for auto-completions
- `outline`: Border-only background (used on dark surfaces)

**Events**:
- `onChange`: Updates input value and triggers validation/suggestions
- `onClear`: Clears input and resets state
- `onSearch`: Submits the search query
- `onSuggestionSelect`: Sets input value to selected suggestion and closes dropdown

**Accessibility**:
- Input must have associated label (visually hidden but present for screen readers)
- Placeholder should not be used as a label
- Clear button must have aria-label (e.g., "Clear search")
- Loading spinner must have aria-label (e.g., "Searching...")
- Suggestion list must have role="listbox" and each option role="option"
- Arrow keys should navigate suggestions, Enter selects, Esc closes

**Responsive Behavior**:
- On mobile: Full-width, possibly bottom-anchored
- On desktop: Can be placed in header, sidebar, or content area
- Width adapts to container (fixed or fluid)
- Suggestion dropdown positioning adjusts to stay within viewport

**Dependencies**:
- None (primitive HTML/CSS components)
- May use icon component for search/clear/loading icons
- May use tooltip for help text (if added)

**Reuse Locations**:
- Homepage (prominent position)
- Search results pages (top, retained during navigation)
- Customer dashboard (if search is available)
- Property inventory admin view (toolbar search)
- Global admin search (in top app bar)

## 3. Button

**Purpose**: Primary interactive element for triggering actions.

**Props**:
- `children` (ReactNode): Button content (text, icon, or both)
- `variant` (string): `primary` | `secondary` | `outline` | `text` | `icon`
- `size` (string): `small` | `medium` | `large`
- `disabled` (boolean): Disables the button
- `loading` (boolean): Shows spinner instead of content
- `onClick` (function): Click handler
- `icon` (ReactNode): Optional icon to show before/after text
- `iconPosition` (string): `start` | `end` (default: start)

**States**:
- `idle`: Default state
- `hover`: Mouse pointer over button
- `pressed`: Button is actively pressed
- `focused`: Button has keyboard focus
- `disabled`: Not interactable
- `loading`: Shows spinner, disables interaction

**Variants**:
- `primary`: Solid background with primary color (main CTA)
- `secondary`: Solid background with secondary color
- `outline`: Transparent background with colored border
- `text`: No background or border, only text (or icon)
- `icon`: Only shows icon (no text), square button

**Events**:
- `onClick`: Main action trigger
- `onMouseEnter`/`onMouseLeave`: For hover states (if needed)
- `onFocus`/`onBlur`: For focus states

**Accessibility**:
- Must be accessible via keyboard (tabindex="0" by default)
- Ensure sufficient color contrast between text and background (WCAG AA)
- Loading state must be announced to screen readers (aria-label or live region)
- Icon-only buttons must have accessible label (aria-label)
- Focus ring must be visible when keyboard focused

**Responsive Behavior**:
- Size scales based on `size` prop (small/medium/large)
- Text wraps if container is too narrow (avoid by using min-width)
- Icon-only buttons maintain consistent touch target size

**Dependencies**:
- May use icon component
- May use spinner/loader component for loading state

**Reuse Locations**:
- Throughout the application: primary actions, form submissions, navigation, cards, toolbars, modals, etc.
- Examples: 
  - Homepage: "Inquire about this property" (primary), "Contact agent" (secondary)
  - Search results: pagination buttons, filter buttons
  - Property details: primary/secondary CTAs
  - Customer dashboard: quick action buttons
  - Lead pipeline: bulk action buttons, "+ New Lead"
  - Property inventory: toolbar actions (Export, New Property)
  - Admin dashboard: refresh button, action buttons in activity feed
  - Forms: submit, cancel, reset buttons
  - Bulk upload results: import valid rows, fix and re-upload, download report

## 4. Icon with Label

**Purpose**: Combines an icon with a text label, used for navigation items, buttons, and info cards.

**Props**:
- `icon` (ReactNode): Icon component or SVG
- `label` (string): Text label
- `iconPosition` (string): `top` | `left` | `right` | `bottom` (default: left for horizontal, top for vertical stacks)
- `size` (string): Size of the icon (inherits from parent or explicit: small/medium/large)
- `color` (string): Color override for icon (uses text color by default)
- `onClick` (function): Click handler for the entire element

**States**:
- Same as base elements: idle, hover, pressed, focused, disabled
- Inherits states from wrapping button/link if applicable

**Variants**:
- `horizontal`: Icon and label side-by-side (most common)
- `vertical`: Icon above label (used in sidebar navigation, some cards)
- `icon-only`: Only icon is rendered (label hidden visually but available to screen readers via aria-label)
- `label-only`: Only label is rendered (icon hidden, useful for responsive hiding)

**Events**:
- `onClick`: When the entire component is clicked

**Accessibility**:
- When used as a control (button/link), must be keyboard focusable
- Icon must be hidden from screen readers if label is present (aria-hidden="true")
- If icon-only, must provide accessible label via aria-label or visible label
- Ensure sufficient color contrast between icon and background
- Touch target minimum 48x48px

**Responsive Behavior**:
- Can switch from horizontal to vertical on narrow screens (e.g., sidebar icons)
- Icon-only variant can be used in toolbars on mobile with tooltip on hover/long-press
- Text wrapping handled by parent container

**Dependencies**:
- Icon component (can be SVG icon or font-based like Material Symbols)
- No other dependencies

**Reuse Locations**:
- Sidebar navigation (vertical icon with label)
- Top app bar actions (horizontal icon with label)
- KPI cards (icon with label in header)
- Property cards (badges for beds/baths/area)
- Lead cards in pipeline (lead score/temperature indicator)
- Buttons with icons (e.g., search button, notification button)
- Empty state illustrations (accompanying text)
- Form fields (prefix/suffix icons, e.g., phone icon in phone input)
- Table headers (sort icons)

## 5. KPI Card

**Purpose**: Displays a key performance indicator with a label, value, trend indicator, and optional icon.

**Props**:
- `title` (string): Label for the KPI (e.g., "Active Listings")
- `value` (string or number): Main value to display (e.g., "1,284" or 1284)
- `trend` (object): Optional trend data: { direction: 'up' | 'down' | 'neutral', percentage: number, label: string }
- `icon` (ReactNode): Optional icon to display
- `color` (string): Color theme for the value and trend (e.g., 'primary', 'secondary', 'success', 'error', 'warning')
- `onClick` (function): Optional click handler for the entire card

**States**:
- `idle`: Default state
- `hover`: When mouse pointer is over the card (if clickable)
- `pressed`: When card is pressed (if clickable)

**Variants**:
- `small`: Compact version for tight spaces
- `medium`: Standard size
- `large`: Larger version for dashboards
- `skeleton`: Loading state placeholder

**Events**:
- `onClick`: When the entire card is clicked (if enabled)

**Accessibility**:
- Must be keyboard focusable if clickable (tabindex="0")
- Value and trend must be announced clearly to screen readers
- Use ARIA live region for dynamic updates if value changes frequently
- Ensure sufficient color contrast for text and background
- Trend indicator should have accessible label (e.g., "increased by 12%" rather than just an arrow)

**Responsive Behavior**:
- On mobile: Full-width card, may stack vertically in a single column
- On tablet/desktop: Appears in grid layout (typically 2-4 columns)
- Text size scales appropriately but maintains hierarchy (value larger than label)
- Trend indicator remains visible

**Dependencies**:
- May use icon component
- May use trend indicator component (small arrow or badge)

**Reuse Locations**:
- Admin dashboard main KPI row
- Customer dashboard quick stats cards
- Any dashboard or overview screen showing metrics
- Could be used in reports or export summaries

## 6. Chart Wrapper

**Purpose**: Container for various chart types (line, bar, pie, etc.) with consistent styling, loading states, and error handling.

**Props**:
- `chartType` (string): Type of chart to render (e.g., 'line', 'bar', 'pie', 'donut')
- `data` (object): Chart data in format expected by the charting library
- `options` (object): Chart configuration options
- `loading` (boolean): Shows loading skeleton instead of chart
- `error` (string|object): Error message to display if chart fails to load
- `height` (number|string): Height of the chart container
- `width` (number|string): Width of the chart container (defaults to 100%)
- `refreshInterval` (number): Seconds between automatic refreshes (0 to disable)
- `onRefresh` (function): Called when manual refresh is triggered

**States**:
- `idle`: Ready to render chart
- `loading`: Fetching data or initializing chart
- `error`: Chart failed to load or render
- `displaying`: Chart is visible and interactive

**Variants**:
- `full-card`: Includes header with title and controls (like in admin dashboard)
- `inline`: Just the chart itself, no surrounding container
- `responsive`: Automatically resizes based on container size
- `static`: Fixed dimensions, does not respond to container size changes

**Events**:
- `onChartClick`: When user clicks on a chart element (if supported by library)
- `onChartHover`: When user hovers over chart element
- `onRefresh`: When user triggers refresh (if refresh button is shown)

**Accessibility**:
- Chart must be accessible via screen readers (provide aria-label or description)
- Consider providing a data table alternative for complex charts
- Interactive elements (if any) must be keyboard accessible
- Use sufficient color contrast for chart elements
- Avoid relying solely on color to convey information (use patterns or labels)

**Responsive Behavior**:
- Should resize based on container dimensions
- Maintain aspect ratio for certain chart types if specified
- Legends and labels may adjust position or become collapsible on small screens
- Tooltips should remain within viewport

**Dependencies**:
- Charting library (e.g., Recharts, Victory, Chart.js, or similar)
- May use loading skeleton or spinner component
- May use error display component

**Reuse Locations**:
- Admin dashboard charts section (lead source funnel, property views over time, lead stage distribution)
- Any analytics or reporting page
- Could be used in property details for price history or similar trends
- Customer dashboard for personal statistics (if implemented)

## 7. Activity Feed Item

**Purpose**: Represents a single item in an activity feed (e.g., new lead, property published, stage change).

**Props**:
- `icon` (ReactNode): Icon representing the activity type
- `iconBackground` (string): Background color for the icon circle (e.g., 'primary', 'secondary')
- `timestamp` (string or Date): When the activity occurred (relative time like "2 hours ago" or absolute)
- `title` (string): Main description of the activity
- `subtitle` (string): Optional secondary text (e.g., property name, lead name)
- `status` (string): Optional status indicator (e.g., 'new', 'updated', 'completed')
- `onClick` (function): Optional click handler for the entire item

**States**:
- `idle`: Default state
- `hover`: When mouse pointer is over the item
- `pressed`: When item is pressed/clicked

**Variants**:
- `compact`: Smaller version with reduced padding and smaller text
- `detailed`: Includes avatar or thumbnail in addition to icon
- `divided`: Has a bottom separator line
- `unread`: Highlighted appearance for unread items (e.g., different background color)

**Events**:
- `onClick`: When the entire item is clicked

**Accessibility**:
- Must be keyboard focusable if clickable
- Timestamp should be in a format understandable by screen readers (consider using aria-label with full date/time)
- Icon should have aria-label describing its meaning
- Ensure sufficient color contrast for text and background
- Status indicator should be accessible (not color-only)

**Responsive Behavior**:
- On mobile: Full-width, vertical stacking
- On desktop: May have multi-line text that truncates with ellipsis
- In a fixed-height container: May show scrollbar when overflow occurs
- Text wrapping should be handled gracefully

**Dependencies**:
- May use icon component
- May use avatar or image component for thumbnail
- May use timestamp utility for formatting relative times
- May use badge component for status

**Reuse Locations**:
- Admin dashboard activity feed
- Could be used in customer dashboard for recent activity (if implemented)
- Could be used in lead detail for communication history (with different styling)
- Any feed or timeline showing chronological events

## 8. Filter Chip

**Purpose**: Represents an active filter value that can be removed, used in filter bars and sidebars.

**Props**:
- `label` (string): The filter value text (e.g., "Apartments", "$500k - $1M")
- `onRemove` (function): Called when the remove icon is clicked
- `disabled` (boolean): If true, remove icon is hidden and chip is not interactive
- `color` (string): Background color variant (e.g., 'primary', 'secondary', 'neutral')
- `textColor` (string): Text color (defaults to on-variant color)
- `size` (string): `small` | `medium` (default: medium)

**States**:
- `idle`: Default state
- `hover`: Mouse pointer over the chip
- `pressed`: Remove icon is being pressed
- `disabled`: Non-interactive state

**Variants**:
- `removable`: Includes an "x" icon to remove the filter (default)
- `non-removable`: Only shows the label, no remove action
- `outline`: Border only, no background fill
- `icon-leading`: Shows an icon before the label (e.g., for property type)

**Events**:
- `onRemove`: When the user clicks the remove icon

**Accessibility**:
- Remove button must be keyboard accessible (tabindex="0" if not disabled)
- Remove button must have accessible label (e.g., "Remove filter: Apartments")
- Ensure sufficient color contrast between text and background
- For icon-only variant, must have accessible label

**Responsive Behavior**:
- Wraps to next line when container width is exceeded
- In vertical layouts (like sidebar), stacks vertically
- Font size may scale slightly on very small screens
- Touch target for remove icon should be at least 24x24px (but ideally 48x48px with padding)

**Dependencies**:
- May use icon component for the "remove" (x) icon
- May use tooltip for long labels on hover (if truncated)

**Reuse Locations**:
- Search results page (showing applied filters like property type, price range)
- Property inventory admin view (toolbar filters)
- Any page with filterable lists or tables
- Could be used in advanced search or filter drawers/sidebars
- In URL query parameter representation (as chips)

## 9. Tabs

**Purpose**: Allows switching between different views or content sections within the same container.

**Props**:
- `tabs` (array): Array of tab objects: { id: string, label: string, icon?: ReactNode, disabled?: boolean }
- `activeTab` (string): ID of the currently active tab
- `onChange` (function): Called when tab selection changes (receives new tab id)
- `orientation` (string): `horizontal` | `vertical` (default: horizontal)
- `verticalPosition` (string): For vertical tabs, position of tab bar: `start` | `end` (default: start)
- `indicatorColor` (string): Color of the active tab indicator (optional, uses theme)
- `textColor` (string): Color for text (optional, uses theme)
- `disableRipple` (boolean): Whether to disable the ink ripple effect on press

**States**:
- `idle`: Tab is not active
- `active`: Tab is currently selected
- `disabled`: Tab cannot be selected
- `hover`: Mouse pointer over the tab tab
- `pressed`: Tab is being pressed

**Variants**:
- `text-only`: Tabs show only labels
- `icon-with-label`: Tabs show icon and label (horizontal or vertical)
- `icon-only`: Tabs show only icon (label hidden but available to screen readers)
- `scrollable`: Horizontally scrollable if tabs exceed width (for mobile)
- `full-width`: Tabs expand to fill container width equally
- `centered`: Tabs are centered in the container

**Events**:
- `onChange`: When the user selects a different tab

**Accessibility**:
- Tabs must follow WAI-ARIA tabs pattern: role="tablist", role="tab", role="tabpanel"
- Selected tab must have aria-selected="true", others aria-selected="false"
- Each tab must have a unique id and reference its tabpanel via aria-controls
- Tabpanel must have role="tabpanel" and aria-labelledby pointing to the tab
- Must be keyboard navigable: left/right arrows move focus, home/end go to first/last, tab/tab+shift moves to tabpanel
- Must have visible focus indicator
- Ensure sufficient color contrast for text and indicator

**Responsive Behavior**:
- Horizontal tabs may convert to vertical sidebar on very narrow screens (if designed as responsive)
- On mobile, tabs may become a vertical accordion or dropdown menu
- Label text may truncate with ellipsis if too long
- Active indicator should remain visible and adapt to vertical/horizontal orientation

**Dependencies**:
- None (primitive HTML/CSS components)
- May use icon component for tab icons
- May use ripple effect utility for touch feedback

**Reuse Locations**:
- Property details view (Overview, Details, Floorplan, Map, Amenities, Price breakdown, Similar properties)
- Could be used in settings or configuration screens (e.g., AI chatbot configuration sections)
- Any screen that needs to organize content into separate views without full page navigation
- User profile/edit screens (Personal Info, Preferences, Notifications, etc.)

## 10. Toast Notification

**Purpose**: Brief, non-intrusive message that appears temporarily to inform users of an action's result.

**Props**:
- `message` (string): The text to display
- `type` (string): `success` | `error` | `warning` | `info` | `default`
- `duration` (number): Time in milliseconds before auto-dismiss (default: 4000)
- `position` (string): `top-right` | `top-left` | `bottom-right` | `bottom-left` | `top-center` | `bottom-center` (default: top-right)
- `icon` (boolean): Whether to show an icon based on type (default: true)
- `onClose` (function): Called when toast is dismissed (by timer or user)
- `closeButton` (boolean): Whether to show a manual close button (default: true)
- `pauseOnHover` (boolean): Whether to pause the timer when user hovers over the toast (default: true)

**States**:
- `entering`: Animation into view
- `visible`: Fully visible and stable
- `exiting`: Animation out of view
- `hidden`: Not in DOM
- `paused`: Timer paused due to hover (if pauseOnHover=true)

**Variants**:
- `simple`: Just text, no icon or actions
- `with-action`: Includes a button for user to take action (e.g., "Undo")
- `sticky`: Does not auto-dismiss, requires user action to close
- `inline`: Appears within the flow of the page (e.g., form validation) rather than overlay

**Events**:
- `onClose`: When the toast is dismissed (by timer, swipe, or close button)

**Accessibility**:
- Should be announced to screen readers when it appears (aria-live="polite")
- Must not trap focus; should not interfere with page navigation
- If action button is present, it must be keyboard accessible
- Color contrast must meet WCAG AA for text and background
- Should disappear automatically but also be dismissible via keyboard (Escape key)

**Responsive Behavior**:
- Position adjusts to avoid being cut off by screen edges
- On very small screens, may default to bottom-center or top-center width-full
- Width may be limited to a max-width with horizontal padding
- Should not obscure important content or navigation elements

**Dependencies**:
- May use icon component for status icons
- May use button component for action button
- May use transition/timing functions for enter/exit animations

**Reuse Locations**:
- Form submissions (success/error messages)
- API call results (data loaded, update successful, etc.)
- User actions (item deleted, settings saved, etc.)
- Validation errors (inline or toast depending on severity)
- Empty state actions (e.g., after importing valid rows)
- Bulk operation results
- Auth-related events (login successful, session expired, etc.)
- Any asynchronous operation that completes with user feedback

## 11. Loading Spinner / Skeleton

**Purpose**: Indicates that content is being loaded, either as a spinning indicator or as placeholder shapes.

**Props**:
- `type` (string): `spinner` | `skeleton` (default: spinner)
- `size` (string): `small` | `medium` | `large` (default: medium)
- `visible` (boolean): Whether to show the loader (default: true)
- `label` (string): Optional text to display alongside (e.g., "Loading...")
- `wrapperStyle` (object): Additional styling for the container (if needed)
- `showLabel` (boolean): Whether to show the label text (default: true for spinner, false for skeleton)

**States**:
- `idle`: Not visible
- `active`: Animating (spinner) or showing placeholder shapes (skeleton)
- `hiding`: Fading out (if used with transition)

**Variants**:
- `spinner`: Circular spinning animation
- `skeleton`: Gray placeholder shapes that mimic the layout of loading content
- `pulsing`: Subtle opacity animation (alternative to spinner)
- `bar`: Horizontal progress bar (for determinate progress, though less common in SPAs)
- `dot-pulsing`: Multiple dots pulsating in sequence

**Events**:
- None (purely visual indicator)

**Accessibility**:
- For spinner: Should have aria-label describing what is loading (e.g., "Loading search results")
- For screen readers, consider using aria-live="polite" on the container that is loading
- Skeleton should not be announced to screen readers (it's purely visual)
- Ensure the loading indicator does not prevent access to other parts of the page
- If the loading state affects usability, consider additional alerts or disabling controls

**Responsive Behavior**:
- Size adjusts based on `size` prop
- In containers: should inherit width/height or use relative units
- Skeleton blocks should resize with their container
- Positioning: typically centers itself in available space or aligns as specified by parent layout

**Dependencies**:
- None (primitive HTML/CSS components with CSS animations)
- May use timer or animation frame for controlling duration

**Reuse Locations**:
- Page-level loading: while initial data is fetching
- Section-level loading: while a specific widget or card is loading data
- Component-level: while waiting for async data within a component (e.g., chart data, comment list)
- Button loading state: shows spinner inside button
- Search bar: shows spinner instead of search icon during API call
- Tab content: shows while switching tabs and loading new content
- Modal content: while modal body is loading
- Image loading: placeholder while actual image loads
- List loading: skeleton rows for list items while data fetches

## 12. Empty State

**Purpose**: Displayed when a list, table, or collection has no content to show, providing guidance to the user.

**Props**:
- `icon` (ReactNode): Illustrative icon or graphic
- `title` (string): Main message (e.g., "No properties found")
- `description` (string): Additional explanation or guidance
- `primaryAction` (object): { label: string, onClick: function } for main call-to-action
- `secondaryAction` (object): Optional secondary action (e.g., "Learn more")
- `illustration` (boolean): Whether to show a larger illustration (default: true)
- `actionsAlign` (string): `center` | `start` | `end` (default: center)
- `image` (string): URL to an illustration image (if using image instead of icon)

**States**:
- `idle`: Default state
- `loading`: Should not be shown when loading (use loader instead)
- `error`: Different variant for error states (see Error Message component)

**Variants**:
- `illustrated`: Includes a large graphic or image (default)
- `simple`: Just text and actions, no illustration
- `banner`: Thin banner that appears at the top of a section (e.g., for filtered results)
- `full-page`: Takes up the entire viewport (common for no-results pages)
- `section-specific`: Fits within a card or container (e.g., empty saved properties list)
- `with-actions`: Includes one or two action buttons

**Events**:
- `onPrimaryActionClick`: When primary action button is clicked
- `onSecondaryActionClick`: When secondary action button is clicked

**Accessibility**:
- Must be announced to screen readers when it appears (if it replaces content)
- Text must be clear and concise, avoiding jargon
- Action buttons must be accessible (see Button component)
- Illustration should be decorative (aria-hidden="true") unless it conveys information
- Ensure sufficient color contrast for text and background
- Focus management: after action, focus should move appropriately (e.g., to input field after "Create new" button)

**Responsive Behavior**:
- On mobile: Centers vertically and horizontally, may use full-screen height
- On tablet/desktop: May appear above the fold in a container, not necessarily full viewport
- Text wrapping: should wrap and hyphenate appropriately
- Image/icon scales to fit width while maintaining aspect ratio
- Actions stack vertically on very narrow screens, side-by-side on wider screens

**Dependencies**:
- May use icon or image component for illustration
- Uses button component for actions
- May use typography styles for title and description

**Reuse Locations**:
- Search results: when no properties match the query
- Saved properties list: when user hasn't saved any properties
- Inquiry history: when user has no inquiries
- Requirement profile: when no criteria have been set
- Lead pipeline: when no leads match current filters
- Property inventory: when no properties match filters (admin view)
- Notification center: when no notifications
- Saved searches: when user hasn't saved any searches
- Following/followers lists: in social features (if implemented)
- Messaging: when no conversations exist
- Profile sections: when no data to display (e.g., no saved listings)
- Onboarding steps: to guide user to take first action

## 13. Status Badge

**Purpose**: Displays the status of an item (e.g., lead stage, property status, task state) with color coding.

**Props**:
- `text` (string): The status text to display (e.g., "Published", "New Lead", "In Progress")
- `variant` (string): Color variant based on status meaning: 
  - `success`: Green (e.g., published, approved, completed)
  - `warning`: Yellow/Orange (e.g., pending, draft, in review)
  - `error`: Red (e.g., archived, rejected, failed)
  - `info`: Blue (e.g., scheduled, pending action)
  - `neutral`: Gray (e.g., draft, inactive)
  - `secondary`: Purple (e.g., featured, promoted)
- `outline` (boolean): If true, only shows border with text color (no background fill)
- `size` (string): `small` | `medium` | `large` (default: medium)
- `icon` (ReactNode): Optional icon to display before text
- `rounded` (boolean): Whether to have fully rounded pill shape (default: true)

**States**:
- `idle`: Default state
- `hover`: Slight elevation or opacity change (if interactive)
- `pressed`: When pressed (if made interactive, though typically not)

**Variants**:
- `text-only`: Just the text with background color
- `icon-with-icon`: Icon before text
- `outline`: Border only, transparent background
- `pill`: Fully rounded on both sides (default)
- `square`: Square corners
- `dot`: Small circle indicator (often used in lists or tables)
- `status-indicator`: Small dot with tooltip on hover (for dense data tables)

**Events**:
- Typically none (display-only component)
- If made interactive (e.g., to change status), would have onClick

**Accessibility**:
- Must not rely on color alone to convey meaning (include text or icon)
- Ensure sufficient color contrast between text and background (for filled variants)
- For outline variant, ensure border color contrast
- If used as a status indicator in a table cell, consider adding tooltip with full description on hover/focus
- Should not be focusable by default unless it has an action

**Responsive Behavior**:
- Text may truncate with ellipsis if container is too narrow (consider tooltip on hover)
- Padding may reduce slightly on very small screens
- Icon size scales with text size
- In tables: may wrap to multiple lines if text is long (avoid by using abbreviations or tooltips)

**Dependencies**:
- May use icon component
- May use tooltip component for truncated text or additional info

**Reuse Locations**:
- Property cards: status badge (draft/published/archived)
- Lead cards in pipeline: stage badge (New, Contacted, etc.)
- Lead detail: current stage badge
- Property inventory table: status column
- Task lists: completion status
- Buttons: as indicator (e.g., "Out of stock" badge on button)
- Form fields: validation status (success/error)
- User profiles: status (active, inactive, pending verification)
- Orders/payments: status (pending, paid, failed, refunded)
- Notifications: read/unread status
- Features flags: enabled/disabled

## 14. Avatar

**Purpose**: Displays a user's image or initials in a circular frame.

**Props**:
- `src` (string): URL to the user's image (optional)
- `alt` (string): Alternative text for the image (if src provided)
- `name` (string): User's full name (used to generate initials if no image)
- `size` (string): `xs` | `sm` | `md` | `lg` | `xl` (default: md)
- `shape` (string): `circle` | `square` (default: circle)
- `fallback` (string): Custom fallback string for initials (defaults to first letters of name)
- `onError` (function): Called if image fails to load (can trigger fallback to initials)
- `onClick` (function): Optional click handler for the avatar

**States**:
- `idle`: Default state
- `hover`: When mouse pointer is over the avatar
- `pressed`: When avatar is pressed/clicked
- `loading`: While image is loading (shows skeleton or placeholder)
- `error`: When image fails to load (shows initials or fallback)
- `online`: Shows an indicator dot for online status (if status prop provided)
- `offline`: No indicator or different color for offline

**Variants**:
- `image-only`: Shows only the image, falls back to broken image icon if fails (not recommended)
- `initials-only`: Always shows the text initials, no image attempt
- `with-status`: Includes a colored dot indicator for online/offline/away status
- `group`: Used to show multiple overlapping avatars (for team photos)
- `square`: Square shape instead of circle
- `bordered`: Has an outline/stroke around the avatar

**Events**:
- `onClick`: When the avatar is clicked
- `onError`: When the image fails to load (useful for fallback handling)

**Accessibility**:
- If image is decorative (when name is provided), use aria-hidden="true"
- If image is the only representation of the user (no adjacent text), alt should be the person's name
- If used as a button (e.g., to open profile), must be keyboard accessible
- Status indicator should not be color-only; consider tooltip for meaning
- Ensure sufficient contrast for the initials text against the background color
- For grouped avatars, provide aria-label describing the group (e.g., "3 people in team")

**Responsive Behavior**:
- Size scales according to the `size` prop
- In flexible containers: can be set to width/height: 100% to fill container
- Initials scale proportionally with size
- Status indicator dot scales with size and maintains position (typically bottom-right corner)
- In lists or grids: aligns properly with adjacent text
- When used in buttons: maintains minimum touch target size

**Dependencies**:
- May use image loading/error handling (can use native img onerror)
- May use color utilities for generating varied background colors for initials
- May use timestamp or user status logic for online/offline indicators

**Reuse Locations**:
- User profile header
- Sidebar user section (bottom of nav)
- Comment or message author
- Leaderboard or list items showing people
- Avatar picker or user selector
- Badges or achievements (if user-specific)
- Initials in document previews or ownership tags
- Chat/message bubbles (sender avatar)
- Form fields for user selection (e.g., assigning a lead to an agent)
- Header/user menu in top app bar
- Card headers showing ownership (e.g., "Listed by: [Agent Avatar]")
- Timeline items showing who performed an action
- Presence indicators in collaborative features

## 15. Form Field Group

**Purpose**: Container for a form label, input field, help text, and validation message, ensuring consistent layout and accessibility.

**Props**:
- `label` (string): The field label
- `name` (string): The field name (for form submission)
- `component` (ReactNode): The input component (e.g., Input, Select, Textarea, Checkbox, RadioGroup)
- `helpText` (string): Optional helper text below the field
- `error` (string): Optional error message to display (if validation fails)
- `required` (boolean): Whether the field is required (shows asterisk)
- `disabled` (boolean): Whether the field is disabled
- `readOnly` (boolean): Whether the field is read-only
- `fullWidth` (boolean): Whether the field should take 100% width of container (default: true)
- `margin` (string): Spacing below the field: `none` | `dense` | `normal` (default: normal)
- `variant` (string): `outlined` | `filled` | `standard` (default: outlined)
- `startAdornment` (ReactNode): Element to display at the start of the input (e.g., icon, prefix text)
- `endAdornment` (ReactNode): Element to display at the end of the input (e.g., suffix text, button, icon)
- `rows` (number): For textarea, number of rows (if applicable)
- `type` (string): For input, the HTML type (e.g., text, email, password, number, tel)

**States**:
- `idle`: Default state
- `focused`: Input is focused
- `disabled`: Field is not editable
- `error`: Field has validation error (shows error message in red)
- `success`: Field has passed validation (can show success icon if desired)
- `readonly`: Field displays value but cannot be modified
- `loading`: Shows spinner inside input (e.g., for async validation)

**Variants**:
- `text`: Single-line input (text, email, password, etc.)
- `textarea`: Multi-line text area
- `select`: Dropdown select (uses Select component)
- `checkbox`: Single checkbox
- `radio`: Radio button group
- `switch`: Toggle switch (alternative to checkbox)
- `file`: File upload input
- `date`: Date picker input
- `time`: Time picker input
- `number`: Numeric input with step controls
- `password`: Password input with toggle visibility
- `combobox`: Editable dropdown (combines input and select)
- `slider`: Range input (for numeric ranges like price, area)

**Events**:
- `onChange`: When the input value changes
- `onFocus`: When the input gains focus
- `onBlur`: When the input loses focus
- `onKeyDown`: For specific key handling (e.g., Enter to submit)

**Accessibility**:
- Label must be explicitly associated with the input via htmlFor/id or aria-label
- Required fields must indicate requirement (visual asterisk and aria-required="true")
- Error message must be associated with input via aria-describedby (or element with role="alert")
- Disabled fields must have aria-disabled="true"
- Read-only fields should be clear they are not editable (may use readonly attribute)
- Input types must match the expected data (e.g., email type for email addresses)
- For complex inputs (like date pickers), ensure keyboard accessibility and screen reader support
- Error messages should be descriptive and suggest a fix when possible
- Success states should be subtle and not rely on color alone (consider icon + text)

**Responsive Behavior**:
- Label and input stack vertically on very narrow screens if label is long
- Inline label + input is standard on medium and wider screens
- Full-width fields expand to fill container (common in forms)
- Input width can be constrained (e.g., for postal code, phone extension)
- Help text and error text wrap as needed
- Adornments (prefix/suffix) stay with the input field
- In grid layouts: label width may be fixed while input takes remaining space

**Dependencies**:
- Depends on specific input components (Input, Select, Textarea, Checkbox, Radio, etc.)
- May use icon component for adornments (prefix/suffix)
- May use button component for actions within adornments (e.g., show/hide password)
- May use helper text or tooltip components for additional guidance

**Reuse Locations**:
- Every form in the application: 
  - Homepage contact form
  - Login/registration forms
  - Property listing editor (all fields)
  - Lead creation/editing forms
  - User profile settings
  - Search filters (when expanded in sidebar/drawer)
  - Requirement profile editor
  - AI chatbot configuration (text areas, selects, toggles)
  - Bulk upload template download/customization
  - Feedback or support forms
  - Settings pages (notifications, preferences, account)
  - Checkout or payment forms (if applicable)
  - Anywhere user input is required