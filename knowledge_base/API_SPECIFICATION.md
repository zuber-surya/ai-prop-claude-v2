# API Specification
## Property Website MVP

### API Standards
- **Protocol**: HTTPS (HTTP in development)
- **Data Format**: JSON for request and response bodies unless otherwise noted.
- **Character Encoding**: UTF-8
- **HTTP Methods**: 
  - `GET` for retrieving resources
  - `POST` for creating resources
  - `PATCH` for partial updates
  - `DELETE` for removing resources
- **Status Codes**: Follow standard HTTP status codes (200, 201, 204, 400, 401, 403, 404, 409, 429, 503, etc.)
- **Timestamp Format**: ISO 8601 strings (e.g., `2024-01-01T12:00:00Z`)
- **Numeric IDs**: CUID (collision‑resistant unique identifier) strings
- **Currency**: Amounts stored as integers in the smallest unit (INR paise) to avoid floating‑point inaccuracies.
- **Arrays**: Represented as JSON arrays.
- **Nullable Fields**: Explicit `null` in JSON when a value is absent.
- **Versioning**: No version prefix in the MVP; the contract is versioned implicitly via documentation. Future versions may adopt `/api/v1/...` path prefixing.

### Authentication
- **Scheme**: Session‑based cookie authentication (via `express‑session` or equivalent).
- **Cookie Name**: `connect.sid` (default) or as configured by the session middleware.
- **Transport**: Secure, HTTP‑only cookies in production (via `secure` flag); `SameSite=Lax`.
- **Endpoints**:
  - `POST /api/auth/register` – creates a user account and establishes a session.
  - `POST /api/auth/login` – validates credentials and establishes a session.
  - `POST /api/auth/logout` – destroys the session and clears the cookie.
- **Authorization**:
  - After authentication, the session stores the user record (including `id`, `email`, `isAdmin`).
  - Middleware populates `req.user` from the session.
  - **Admin Guard**: All routes under `/admin/*` require `req.user?.isAdmin === true`; otherwise:
    - Authenticated non‑admin → `403 Forbidden`
    - Unauthenticated → `401 Unauthorized` (or redirect to login for UI flows)
- **Public Endpoints**: No authentication required for:
  - `GET /api/properties` (list/search)
  - `GET /api/properties/:id` (detail)
  - `POST /api/chat/message` (chatbot)
  - Auth endpoints (`/api/auth/*`)
- **Session Management**:
  - Server‑side store (in‑memory for dev; Redis or similar for production) to enable horizontal scaling.
  - Session expiration configurable via `SESSION_MAX_AGE` (default 24 h).
  - Session ID rotated on login to mitigate session fixation.

### Endpoint Catalog
#### Public – Properties
| Method | Endpoint | Description | Query Parameters | Success Response | Error Responses |
|--------|----------|-------------|------------------|------------------|-----------------|
| `GET` | `/api/properties` | List/search published properties (FR1.1‑FR1.3) | `q` (string, free‑text location), `minPrice` (number), `maxPrice` (number), `type` (string), `bedrooms` (number), `sort` (`price_asc`\|`price_desc`\|`date_desc` default), `page` (number, default 1), `pageSize` (number, default 20, max 50) | `200 OK`<br>{<br>  `results`: [{<br>    `id`: string,<br>    `title`: string,<br>    `price`: number (paise),<br>    `bedrooms`: number,<br>    `bathrooms`: number,<br>    `area`: number,<br>    `type`: string,<br>    `location`: string,<br>    `latitude`: number\|null,<br>    `longitude`: number\|null,<br>    `thumbnailUrl`: string,<br>    `createdAt`: string (ISO‑8601)<br>  }],<br>  `page`: number,<br>  `pageSize`: number,<br>  `total`: number<br>} | `400 Bad Request` (invalid query), `500 Internal Server Error` |
| `GET` | `/api/properties/{id}` | Get a single published property (FR1.4) | Path param `id`: string | `200 OK`<br>{ full property record (all fields from `Property` model) } | `404 Not Found` (if not found or status ≠ `published`), `400 Bad Request` (invalid ID), `500 Internal Server Error` |

#### Public – Authentication
| Method | Endpoint | Description | Request Body | Success Response | Error Responses |
|--------|----------|-------------|--------------|------------------|-----------------|
| `POST` | `/api/auth/register` | Register a new user (FR2.1) | `{ "email": string, "password": string }` | `201 Created`<br>{ `id`: string, `email`: string } + session cookie | `409 Conflict` (email already registered), `400 Bad Request` (validation), `500 Internal Server Error` |
| `POST` | `/api/auth/login` | Log in an existing user (FR2.2) | `{ "email": string, "password": string }` | `200 OK`<br>{ `id`: string, `email`: string, `isAdmin`: boolean } + session cookie | `401 Unauthorized` (invalid credentials), `400 Bad Request`, `500 Internal Server Error` |
| `POST` | `/api/auth/logout` | Log out the current user (FR2.3) | *(none)* | `200 OK` + cleared session cookie | `500 Internal Server Error` |

#### Public – AI Chatbot
| Method | Endpoint | Description | Request Body | Success Response | Error Responses |
|--------|----------|-------------|--------------|------------------|-----------------|
| `POST` | `/api/chat/message` | Send a message to the chatbot and receive a reply (FR3.2‑FR3.6) | `{ "messages": [{ "role": "user"\|"assistant", "content": string }] }` (client may send only the latest message; server may keep history in session) | `200 OK`<br>{ `reply`: string, `propertiesReferenced`: string[] (optional) } | `400 Bad Request` (invalid payload), `429 Too Many Requests` (rate limit – includes `Retry-After` header), `503 Service Unavailable` (AI provider failure/timeout – `{ error: { code: "ai_unavailable", message: "..." } }`), `500 Internal Server Error` |

#### Admin – Properties (require `isAdmin = true`)
| Method | Endpoint | Description | Query Parameters / Request Body | Success Response | Error Responses |
|--------|----------|-------------|---------------------------------|------------------|-----------------|
| `GET` | `/admin/properties` | List all properties (draft + published) for admin UI | `status` (`draft`\|`published` optional), `page`, `pageSize` | `200 OK`<br>{ `results`: [{ full property record }], `page`, `pageSize`, `total` } | `401 Unauthorized`, `403 Forbidden`, `400 Bad Request`, `500 Internal Server Error` |
| `POST` | `/admin/properties` | Create a new property (FR4.2) | `{ "title": string, "description": string, "price": number, "bedrooms": number, "bathrooms": number, "area": number, "type": string, "location": string, "latitude"?: number, "longitude"?: number, "amenities": string[], "photos": string[], "status": "draft"\|"published" }` | `201 Created`<br>{ created property record } | `400 Bad Request` (validation), `401 Unauthorized`, `403 Forbidden`, `500 Internal Server Error` |
| `GET` | `/admin/properties/{id}` | Get a specific property regardless of status (FR4.3) | Path param `id`: string | `200 OK`<br>{ full property record } | `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `400 Bad Request`, `500 Internal Server Error` |
| `PATCH` | `/admin/properties/{id}` | Partially update a property (FR4.3) | Same fields as `POST` (partial) | `200 OK`<br>{ updated property record } | `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error` |
| `DELETE` | `/admin/properties/{id}` | Delete a property (FR4.4) | Path param `id`: string | `204 No Content` | `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error` |

### Request/Response Standards
#### Requests
- **Content-Type**: `application/json`
- **Body**: Must be valid JSON matching the schema defined for each endpoint.
- **Query Parameters**: URL‑encoded; numbers parsed as JSON numbers; booleans as `true`/`false` strings if used.
- **Headers**: 
  - `Accept: application/json`
  - `Cookie`: present for authenticated endpoints.
  - Optional: `Authorization` header not used (session cookie only).

#### Responses
- **Content-Type**: `application/json`
- **Success Shape**: As defined per endpoint above.
- **Error Shape** (standardized per API_CONTRACT §8‑9):
  ```json
  {
    "error": {
      "code": "string",   // machine‑readable error code (e.g., "validation_error", "ai_unavailable")
      "message": "string" // human‑readable description
    }
  }
  ```
- **Headers**:
  - `Content-Type: application/json`
  - For rate‑limit responses (`429`): `Retry-After: <seconds>`.
  - For successful mutations that affect caching: appropriate `Cache-Control` headers (e.g., `no-store` for POST/PATCH/DELETE).
- **Empty Bodies**: `204 No Content` returns no body.
- **Pagination**: Consistent `page`, `pageSize`, `total` fields.
- **Timestamps**: ISO‑8601 strings in UTC (Zulu).
- **IDs**: CUID strings (e.g., `clx0abc123def456ghi789jk0`).
- **Arrays**: Empty arrays (`[]`) when no items.

### Error Handling
- **General Principles**:
  - All unexpected errors return `500 Internal Server Error` with a generic message (to avoid leaking stack traces).
  - Known error conditions return appropriate status codes with structured error bodies.
  - Error messages are concise but helpful for developers; never expose sensitive data (passwords, tokens, internal paths).
- **Specific Error Codes** (examples):
  - `validation_error` – Invalid request payload or query parameters.
  - `email_taken` – Registration attempted with an existing email.
  - `invalid_credentials` – Login with wrong email/password.
  - `session_invalid` – Session cookie missing, tampered, or expired.
  - `insufficient_permissions` – Authenticated user lacks `isAdmin` for admin endpoint.
  - `rate_limit_exceeded` – Too many requests from a session/IP (includes `Retry-After`).
  - `ai_unavailable` – Anthropic API call failed or timed out (see FR3.4).
  - `not_found` – Requested resource does not exist or is not accessible (e.g., unpublished property via public endpoint).
  - `conflict` – Resource already exists where uniqueness is required (e.g., duplicate email).
- **Validation**:
  - Request bodies are validated against JSON schemas (type, length, format, required fields).
  - Query parameters are validated for type and range (e.g., `page` ≥ 1, `pageSize` between 1 and 50).
  - Validation failures yield `400 Bad Request` with `error.code = "validation_error"` and a message detailing the first or all violations.
- **Rate Limiting**:
  - Applied per client IP (or per session ID where appropriate) on:
    - `/api/chat/message`
    - `/api/auth/register`
    - `/api/auth/login`
  - Configured via environment variables (`CHAT_RATE_LIMIT_WINDOW_MS`, `CHAT_RATE_LIMIT_MAX`, `AUTH_RATE_LIMIT_*`).
  - On limit breach: `429 Too Many Requests` with `Retry-After` header and error body `{ error: { code: "rate_limit_exceeded", message: "Too many requests, please try again later." } }`.
- **External Service Failures**:
  - If the Anphobic API is unreachable, returns `503 Service Unavailable` with `error.code = "ai_unavailable"`.
  - Downstream database errors (e.g., connection failure) result in `500 Internal Server Error` after logging.
- **Logging**:
  - All errors (including 500s) are logged server‑side with sufficient context (request ID, timestamp, error message) for debugging, but without PII or credentials.
  - Client‑side error handling should display user‑friendly messages based on the `error.code`.

### Versioning
- **Current Version**: The API is version‑less in the MVP; the contract is defined by `API_CONTRACT.md` and this document.
- **Future Versioning Strategy**:
  - When backward‑incompatible changes are required, introduce a version prefix in the path: `/api/v1/...`.
  - Maintain backward compatibility for a deprecation period (e.g., 2 releases) by supporting both `/api/` (alias to latest stable) and `/api/v1/`.
  - Version increments follow semantic versioning: 
    - **Major** (`v2`) – breaking changes (e.g., removing fields, changing auth mechanism).
    - **Minor** (`v1.1`) – backward‑compatible additions (new endpoints, optional fields).
    - **Patch** (`v1.0.1`) – internal fixes, non‑contract changes.
  - Version must be reflected in:
    - API documentation (`API_CONTRACT.md` and this file).
    - Server routing (express router prefix).
    - Client configuration (base URL).
  - Deprecation warnings:
    - Deprecated endpoints return a `Warning` header or include a `deprecated` field in the response.
    - Sunset date communicated in release notes and documentation.
- **Change Management**:
  - Any change to the API contract (addition, removal, modification) must be accompanied by an update to `API_CONTRACT.md` and this `API_SPECIFICATION.md` in the same pull request.
  - The version number (if adopted) must be incremented appropriately.
  - API changes are subject to the Definition of Done (TESTING_STRATEGY_AND_DOD.md) and must pass the full test suite before closing a PR.

---
*This specification is derived from the official API Contract (`API_CONTRACT.md`), Non‑Functional Requirements (`NFR.md`), Product Requirements (`PRD.md`), Roadmap (`ROADMAP.md`), Schema (`SCHEMA.md`), UI Reference (`UI_REFERENCE.md`), Testing Strategy (`TESTING_STRATEGY_AND_DOD.md`), GitHub Workflow (`GITHUB_WORKFLOW.md`), and Design System (`design_reference/propvista_crm/DESIGN.md`).*