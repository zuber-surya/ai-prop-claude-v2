# Screen Inventory

This document inventories all UI/UX design references (screens) from the `raw_documents/design_reference/` directory. Each screen is documented with its attributes and grouped by module.

## Module: Public-Facing Pages (Anonymous Access)

| Screen Name | Screenshot Path | HTML Reference Path | User Type | Purpose | Navigation From | Navigation To | Related Screens | Status |
|-------------|-----------------|---------------------|-----------|---------|-----------------|---------------|-----------------|--------|
| propvista_crm_homepage | raw_documents/design_reference/propvista_crm_homepage/screen.png | raw_documents/design_reference/propvista_crm_homepage/code.html | Visitor | Main landing page showcasing the AI-first value proposition, enabling visitors to search properties, learn about the service, and express interest without navigating away. | N/A (entry point) | search_results_standard_view (via search), property_details_premium_view (via property cards), customer_account_dashboard (via sign-up/login) | search_results_standard_view, search_results_filter_fallback_view, search_results_empty_state, property_details_premium_view, customer_account_dashboard | completed |
| search_results_standard_view | raw_documents/design_reference/search_results_standard_view/screen.png | raw_documents/design_reference/search_results_standard_view/code.html | Visitor | Displays AI-ranked property results with explainable match scores and reasons when AI search is successful. | propvista_crm_homepage (search bar), search_results_filter_fallback_view (if AI fails and fallback triggered), search_results_empty_state (if no results) | property_details_premium_view (click property card) | propvista_crm_homepage, search_results_filter_fallback_view, search_results_empty_state, property_details_premium_view | completed |
| search_results_filter_fallback_view | raw_documents/design_reference/search_results_filter_fallback_view/screen.png | raw_documents/design_reference/search_results_filter_fallback_view/code.html | Visitor | Shows traditional filter-based results when AI search fails or times out, with a visible indicator that AI is unavailable. | propvista_crm_homepage (search bar when AI fails), search_results_standard_view (if AI fails during search) | property_details_premium_view (click property card) | propvista_crm_homepage, search_results_standard_view, search_results_empty_state, property_details_premium_view | completed |
| search_results_empty_state | raw_documents/design_reference/search_results_empty_state/screen.png | raw_documents/design_reference/search_results_empty_state/code.html | Visitor | Provides helpful guidance when search returns zero results, encouraging query refinement. | propvista_crm_homepage (search returns no results), search_results_standard_view (if AI returns no results), search_results_filter_fallback_view (if filter returns no results) | propvista_crm_homepage (refine search) | propvista_crm_homepage, search_results_standard_view, search_results_filter_fallback_view | completed |
| property_details_premium_view | raw_documents/design_reference/property_details_premium_view/screen.png | raw_documents/design_reference/property_details_premium_view/code.html | Visitor | Comprehensive property detail view enabling informed inquiry decisions through rich media and structured information. | search_results_standard_view (click property card), search_results_filter_fallback_view (click property card), propvista_crm_homepage (featured property card) | propvista_crm_homepage (back), customer_account_dashboard (save inquiry, if logged in) | search_results_standard_view, search_results_filter_fallback_view, propvista_crm_homepage, customer_account_dashboard | completed |

## Module: Customer Portal (Authenticated - Customer Role)

| Screen Name | Screenshot Path | HTML Reference Path | User Type | Purpose | Navigation From | Navigation To | Related Screens | Status |
|-------------|-----------------|---------------------|-----------|---------|-----------------|---------------|-----------------|--------|
| customer_account_dashboard | raw_documents/design_reference/customer_account_dashboard/screen.png | raw_documents/design_reference/customer_account_dashboard/code.html | Customer (authenticated) | Personalized dashboard for registered customers to manage their property search journey, saved items, and inquiries. | propvista_crm_homepage (login/sign up), property_details_premium_view (after saving inquiry) | property_details_premium_view (view saved property), profile edit (not in designs) | property_details_premium_view, propvista_crm_homepage | completed |

## Module: Lead Management & CRM Pipeline (Authenticated - Agent/Admin Role)

| Screen Name | Screenshot Path | HTML Reference Path | User Type | Purpose | Navigation From | Navigation To | Related Screens | Status |
|-------------|-----------------|---------------------|-----------|---------|-----------------|---------------|-----------------|--------|
| lead_pipeline_kanban_view | raw_documents/design_reference/lead_pipeline_kanban_view/screen.png | raw_documents/design_reference/lead_pipeline_kanban_view/code.html | Agent/Admin | Visual Kanban board for agents to manage leads across sales stages with filtering, bulk actions, and WIP limits. | admin_agent_command_center (navigate to leads), lead_detail_sarah_jenkins (back from lead detail) | lead_detail_sarah_jenkins (click lead card), bulk_upload_validation_results (after bulk lead upload) | lead_detail_sarah_jenkins, bulk_upload_validation_results, admin_agent_command_center | completed |
| lead_detail_sarah_jenkins | raw_documents/design_reference/lead_detail_sarah_jenkins/screen.png | raw_documents/design_reference/lead_detail_sarah_jenkins/code.html | Agent/Admin | Detailed view of an individual lead showing contact information, source, communication history, and follow-up tasks. | lead_pipeline_kanban_view (click lead card) | lead_pipeline_kanban_view (back), bulk_upload_validation_results (after bulk lead upload) | lead_pipeline_kanban_view, bulk_upload_validation_results | completed |

## Module: Property Management (Authenticated - Admin Role)

| Screen Name | Screenshot Path | HTML Reference Path | User Type | Purpose | Navigation From | Navigation To | Related Screens | Status |
|-------------|-----------------|---------------------|-----------|---------|-----------------|---------------|-----------------|--------|
| listing_editor_basic_info | raw_documents/design_reference/listing_editor_basic_info/screen.png | raw_documents/design_reference/listing_editor_basic_info/code.html | Agent/Admin | Form for creating or editing core property details ensuring accurate inventory data. | property_inventory_admin_view (click "New Property" or edit icon) | property_inventory_admin_view (after save/cancel) | property_inventory_admin_view, bulk_upload_validation_results | completed |
| property_inventory_admin_view | raw_documents/design_reference/property_inventory_admin_view/screen.png | raw_documents/design_reference/property_inventory_admin_view/code.html | Agent/Admin | Administrative grid/view for managing all property listings with filtering, bulk actions, and sorting capabilities. | admin_agent_command_center (navigate to properties), listing_editor_basic_info (after save/cancel) | listing_editor_basic_info (edit/create), bulk_upload_validation_results (bulk upload) | listing_editor_basic_info, bulk_upload_validation_results, admin_agent_command_center | completed |

## Module: Bulk Operations (Authenticated - Admin Role)

| Screen Name | Screenshot Path | HTML Reference Path | User Type | Purpose | Navigation From | Navigation To | Related Screens | Status |
|-------------|-----------------|---------------------|-----------|---------|-----------------|---------------|-----------------|--------|
| bulk_upload_validation_results | raw_documents/design_reference/bulk_upload_validation_results/screen.png | raw_documents/design_reference/bulk_upload_validation_results/code.html | Admin | Displays validation results after a bulk property/lead upload attempt, enabling error correction before finalizing. | property_inventory_admin_view (bulk upload action), lead_pipeline_kanban_view (bulk lead upload) | property_inventory_admin_view (import valid rows), lead_pipeline_kanban_view (import valid leads) | property_inventory_admin_view, lead_pipeline_kanban_view, ai_chatbot_configuration (if AI-related upload) | completed |

## Module: AI Configuration & Settings (Authenticated - Admin Role)

| Screen Name | Screenshot Path | HTML Reference Path | User Type | Purpose | Navigation From | Navigation To | Related Screens | Status |
|-------------|-----------------|---------------------|-----------|---------|-----------------|---------------|-----------------|--------|
| ai_chatbot_configuration | raw_documents/design_reference/ai_chatbot_configuration/screen.png | raw_documents/design_reference/ai_chatbot_configuration/code.html | Admin | Administrative interface for configuring chatbot behavior without code deployment, enabling rapid adaptation to business needs. | admin_agent_command_center (navigate to AI settings) | admin_agent_command_center (back) | admin_agent_command_center | completed |

## Module: Admin Command Center (Authenticated - Admin Role)

| Screen Name | Screenshot Path | HTML Reference Path | User Type | Purpose | Navigation From | Navigation To | Related Screens | Status |
|-------------|-----------------|---------------------|-----------|---------|-----------------|---------------|-----------------|--------|
| admin_agent_command_center | raw_documents/design_reference/admin_agent_command_center/screen.png | raw_documents/design_reference/admin_agent_command_center/code.html | Admin | Primary administrative dashboard showing KPIs, trends, and activity feed for monitoring business health at a glance. | N/A (typically landing page after admin login) | lead_pipeline_kanban_view (navigate to leads), property_inventory_admin_view (navigate to properties), ai_chatbot_configuration (navigate to AI settings) | lead_pipeline_kanban_view, property_inventory_admin_view, ai_chatbot_configuration | completed |

## Design Assets (Non-Screen Elements)

These directories contain reusable assets, not full screens.

| Asset Name | Path | Type | Purpose |
|------------|------|------|---------|
| a_clean_modern_minimal_flat_line_illustration_of_a_magnifying_glass_over_a | raw_documents/design_reference/a_clean_modern_minimal_flat_line_illustration_of_a_magnifying_glass_over_a/screen.png | Illustration/Icon | Magnifying glass icon used in search bar UI across the application. |
| propvista_crm | raw_documents/design_reference/propvista_crm/DESIGN.md | Layout/Shell | Probable application layout container providing consistent header, footer, and navigation structure. (Contains DESIGN.md, not code.html or screen.png) |