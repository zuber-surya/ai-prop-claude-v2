# API Specification

This document defines the RESTful API endpoints for the Property Vista CRM MVP. Each endpoint includes the HTTP method, URL, authentication requirements, request structure, successful response, validation rules, possible error responses, and example requests/responses.

---

## Table of Contents
1. [Authentication](#authentication)
2. [Property Management](#property-management)
3. [Booking](#booking)
4. [Payments](#payments)
5. [Notifications](#notifications)
6. [AI Search](#ai-search)
7. [Favorites](#favorites)
8. [Reports](#reports)

---

## Authentication
Endpoints for user authentication, token management, and password recovery.

### Register
- **Method**: `POST`
- **URL**: `/auth/register`
- **Authentication**: None (public)
- **Request Body**:
  ```json
  {
    "name": "string (required, max 100)",
    "email": "string (required, valid email)",
    "password": "string (required, min 8 chars, at least one letter and one number)",
    "role": "enum: 'customer' | 'agent' (required)"
  }
  ```
- **Success Response** (201 Created):
  ```json
  {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "role": "customer|agent",
    "createdAt": "ISO timestamp",
    "accessToken": "string (JWT)",
    "refreshToken": "string (JWT, HttpOnly cookie in real implementation)"
  }
  ```
- **Validation**:
  - `name`: required, max 100
  - `email`: required, valid email format, must be unique
  - `password`: required, min 8 chars, at least one letter and one number
  - `role`: required, must be `customer` or `agent`
- **Error Responses**:
  - 400 Bad Request: validation errors (e.g., `{ "errors": [{ "field": "email", "message": "Email already exists" }] }`)
  - 429 Too Many Requests: rate limit exceeded
- **Example**:
  ```http
  POST /auth/register
  Content-Type: application/json

  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "SecurePass123!",
    "role": "customer"
  }
  ```

### Login
- **Method**: `POST`
- **URL**: `/auth/login`
- **Authentication**: None
- **Request Body**:
  ```json
  {
    "email": "string (required)",
    "password": "string (required)"
  }
  ```
- **Success Response** (200 OK):
  ```json
  {
    "accessToken": "string (JWT)",
    "refreshToken": "string (JWT, HttpOnly cookie)",
    "user": {
      "id": "uuid",
      "name": "string",
      "email": "string",
      "role": "customer|agent"
    }
  }
  ```
- **Validation**:
  - `email`: required
  - `password`: required
- **Error Responses**:
  - 400 Bad Request: missing fields
  - 401 Unauthorized: invalid credentials
  - 403 Forbidden: account locked or email not verified
  - 429 Too Many Requests: rate limit exceeded
- **Example**:
  ```http
  POST /auth/login
  Content-Type: application/json

  {
    "email": "jane@example.com",
    "password": "SecurePass123!"
  }
  ```

### Refresh Token
- **Method**: `POST`
- **URL**: `/auth/refresh`
- **Authentication**: None (uses refresh token in cookie or body; here we accept body for simplicity)
- **Request Body**:
  ```json
  {
    "refreshToken": "string (required)"
  }
  ```
- **Success Response** (200 OK):
  ```json
  {
    "accessToken": "string (new JWT)",
    "refreshToken": "string (new JWT)"
  }
  ```
- **Validation**:
  - `refreshToken`: required, valid JWT, not revoked
- **Error Responses**:
  - 400 Bad Request: missing token
  - 401 Unauthorized: invalid or expired refresh token
- **Example**:
  ```http
  POST /auth/refresh
  Content-Type: application/json

  {
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### Logout
- **Method**: `POST`
- **URL**: `/auth/logout`
- **Authentication**: Requires valid access token (Bearer)
- **Request Body**: none (or optional `{}` for consistency)
- **Success Response** (200 OK):
  ```json
  { "message": "Logged out successfully" }
  ```
- **Validation**: None beyond auth
- **Error Responses**:
  - 401 Unauthorized: missing or invalid token
- **Example**:
  ```http
  POST /auth/logout
  Authorization: Bearer <access_token>
  ```

### Forgot Password
- **Method**: `POST`
- **URL**: `/auth/forgot-password`
- **Authentication**: None
- **Request Body**:
  ```json
  {
    "email": "string (required)"
  }
  ```
- **Success Response** (200 OK):
  ```json
  { "message": "If an account with that email exists, a reset link has been sent." }
  ```
- **Validation**:
  - `email`: required, valid email format
- **Error Responses**:
  - 400 Bad Request: invalid email
  - 429 Too Many Requests: rate limit exceeded
- **Example**:
  ```http
  POST /auth/forgot-password
  Content-Type: application/json

  {
    "email": "jane@example.com"
  }
  ```

### Reset Password
- **Method**: `POST`
- **URL**: `/auth/reset-password`
- **Authentication**: None
- **Request Body**:
  ```json
  {
    "token": "string (required)",
    "newPassword": "string (required, min 8 chars, at least one letter and one number)"
  }
  ```
- **Success Response** (200 OK):
  ```json
  { "message": "Password has been reset successfully." }
  ```
- **Validation**:
  - `token`: required, valid and not expired
  - `newPassword`: required, meets policy
- **Error Responses**:
  - 400 Bad Request: invalid token or password does not meet policy
  - 401 Unauthorized: token invalid/expired
- **Example**:
  ```http
  POST /auth/reset-password
  Content-Type: application/json

  {
    "token": "abcdef123456",
    "newPassword": "NewPass456!"
  }
  ```

### Verify Email
- **Method**: `GET`
- **URL**: `/auth/verify-email/:token`
- **Authentication**: None
- **URL Parameters**:
  - `token`: string (required)
- **Success Response** (200 OK):
  ```json
  { "message": "Email verified successfully." }
  ```
- **Validation**:
  - `token`: required, valid and not used before
- **Error Responses**:
  - 400 Bad Request: invalid token
  - 410 Gone: token already used
- **Example**:
  ```http
  GET /auth/verify-email/abcdef123456
  ```

---

## Property Management
Endpoints for managing property listings.

### List Properties
- **Method**: `GET`
- **URL**: `/properties`
- **Authentication**: Optional (public listings); authenticated users may see additional fields (e.g., favorite status)
- **Query Parameters**:
  - `page`: integer (default 1)
  - `limit`: integer (default 10, max 100)
  - `priceMin`: number (optional)
  - `priceMax`: number (optional)
  - `bedsMin`: integer (optional)
  - `bedsMax`: integer (optional)
  - `bathsMin`: number (optional)
  - `bathsMax`: number (optional)
  - `propertyType`: string (optional, enum from config)
  - `location`: string (optional, free-text search)
  - `sort`: string (optional, e.g., `price_asc`, `date_desc`)
- **Success Response** (200 OK):
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "title": "string",
        "price": "number",
        "beds": "integer",
        "baths": "number",
        "area": "number",
        "propertyType": "string",
        "location": "string",
        "thumbnail": "string (URL)",
        "isFavorite": "boolean (only if authenticated)",
        "createdAt": "ISO timestamp"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "pages": 15
    }
  }
  ```
- **Validation**:
  - Pagination params: positive integers
  - Price/area: non-negative numbers
  - Beds/baths: non-negative numbers
  - `priceMin` ≤ `priceMax` if both provided
  - `bedsMin` ≤ `bedsMax` if both provided
  - `bathsMin` ≤ `bathsMax` if both provided
- **Error Responses**:
  - 400 Bad Request: invalid query parameters
- **Example**:
  ```http
  GET /properties?priceMin=100000&priceMax=500000&bedsMin=2&page=1&limit=20
  ```

### Get Property Detail
- **Method**: `GET`
- **URL**: `/properties/:id`
- **Authentication**: Optional (public); authenticated may see favorite flag
- **URL Parameters**:
  - `id`: uuid (required)
- **Success Response** (200 OK):
  ```json
  {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "price": "number",
    "beds": "integer",
    "baths": "number",
    "area": "number",
    "areaUnit": "string (sqft|sqm)",
    "propertyType": "string",
    "location": {
      "street": "string",
      "city": "string",
      "state": "string",
      "postalCode": "string",
      "country": "string"
    },
    "yearBuilt": "integer (optional)",
    "images": [
      {
        "id": "uuid",
        "url": "string",
        "caption": "string (optional)"
      }
    ],
    "amenities": ["string"],
    "isPublished": "boolean",
    "isFavorite": "boolean (only if authenticated)",
    "createdAt": "ISO timestamp",
    "updatedAt": "ISO timestamp"
  }
  ```
- **Validation**:
  - `id`: valid UUID
- **Error Responses**:
  - 400 Bad Request: invalid ID format
  - 404 Not Found: property not found or not published (for non‑admin/owner)
  - 403 Forbidden: user tries to access unpublished property they don’t own
- **Example**:
  ```http
  GET /properties/550e8400-e29b-41d4-a716-446655440000
  ```

### Create Property
- **Method**: `POST`
- **URL**: `/properties`
- **Authentication**: Requires `agent` or `admin` role
- **Request Body** (multipart/form‑data for images; JSON for other fields shown):
  ```json
  {
    "title": "string (required, max 200)",
    "description": "string (required, min 20)",
    "price": "number (required, > 0)",
    "beds": "integer (required, >= 0)",
    "baths": "number (required, >= 0, supports .5 increments)",
    "area": "number (required, > 0)",
    "areaUnit": "enum: 'sqft' | 'sqm' (required)",
    "propertyType": "string (required, from allowed list)",
    "location": {
      "street": "string (required)",
      "city": "string (required)",
      "state": "string (optional)",
      "postalCode": "string (required)",
      "country": "string (required)"
    },
    "yearBuilt": "integer (optional, between 1800 and current year)",
    "amenities": ["string"] (optional)
  }
  ```
  Images sent as separate file parts (key `images[]`).
- **Success Response** (201 Created):
  ```json
  {
    "id": "uuid",
    "title": "string",
    "status": "draft",
    "createdAt": "ISO timestamp"
  }
  ```
- **Validation**:
  - All required fields present and correct type
  - Price > 0
  - Beds ≥ 0, Baths ≥ 0
  - Area > 0
  - Year built between 1800 and current year (if provided)
  - Location fields not empty
  - At least one image uploaded (valid MIME type jpeg/png, size ≤5 MB each)
- **Error Responses**:
  - 400 Bad Request: validation errors
  - 401 Unauthorized: missing or invalid token
  - 403 Forbidden: user role not allowed (must be agent/admin)
  - 413 Payload Too Large: image(s) exceed size limit
  - 415 Unsupported Media Type: invalid image type
- **Example**:
  ```http
  POST /properties
  Authorization: Bearer <access_token>
  Content-Type: multipart/form-data

  (form fields as JSON above + image files)
  ```

### Update Property (Partial)
- **Method**: `PATCH`
- **URL**: `/properties/:id`
- **Authentication**: Requires `agent` (owner) or `admin`
- **URL Parameters**: `id`: uuid
- **Request Body**: JSON with any subset of creatable fields (same structure as create, but all optional)
- **Success Response** (200 OK):
  ```json
  {
    "id": "uuid",
    "message": "Property updated successfully"
  }
  ```
- **Validation**:
  - `id`: valid UUID
  - Any provided fields must meet creation validation rules
  - User must be owner (agentId matches JWT sub) or admin
- **Error Responses**:
  - 400 Bad Request: validation errors
  - 401 Unauthorized: missing/invalid token
  - 403 Forbidden: not owner and not admin
  - 404 Not Found: property not found
- **Example**:
  ```http
  PATCH /properties/550e8400-e29b-41d4-a716-446655440000
  Authorization: Bearer <access_token>
  Content-Type: application/json

  {
    "price": 350000,
    "description": "Updated description with more details."
  }
  ```

### Delete Property
- **Method**: `DELETE`
- **URL**: `/properties/:id`
- **Authentication**: Requires `admin` (or owner with special permission; default only admin)
- **URL Parameters**: `id`: uuid
- **Success Response** (200 OK):
  ```json
  { "message": "Property deleted successfully" }
  ```
- **Validation**:
  - `id`: valid UUID
  - User must be admin (or owner if policy allows)
- **Error Responses**:
  - 401 Unauthorized: missing/invalid token
  - 403 Forbidden: insufficient permissions
  - 404 Not Found: property not found
- **Example**:
  ```http
  DELETE /properties/550e8400-e29b-41d4-a716-446655440000
  Authorization: Bearer <access_token>
  ```

### Publish/Unpublish Property
- **Method**: `PATCH`
- **URL**: `/properties/:id/publish`
- **Authentication**: Requires `agent` (owner) or `admin`
- **URL Parameters**: `id`: uuid
- **Request Body**:
  ```json
  {
    "publish": "boolean (true to publish, false to unpause/draft)"
  }
  ```
- **Success Response** (200 OK):
  ```json
  {
    "id": "uuid",
    "isPublished": true,
    "message": "Property published successfully"
  }
  ```
- **Validation**:
  - `id`: valid UUID
  - `publish`: boolean
  - Property must have required data to publish (at least one image, title, price, location, description)
  - User must be owner or admin
- **Error Responses**:
  - 400 Bad Request: validation errors or cannot publish due to missing required data
  - 401 Unauthorized: missing/invalid token
  - 403 Forbidden: not owner/admin
  - 404 Not Found: property not found
- **Example**:
  ```http
  PATCH /properties/550e8400-e29b-41d4-a716-446655440000/publish
  Authorization: Bearer <access_token>
  Content-Type: application/json

  {
    "publish": true
  }
  ```

### Upload Property Media
- **Method**: `POST`
- **URL**: `/properties/:id/media`
- **Authentication**: Requires `agent` (owner) or `admin`
- **URL Parameters**: `id`: uuid
- **Request**: multipart/form‑data with file field(s) `image`
- **Success Response** (201 Created):
  ```json
  {
    "mediaId": "uuid",
    "url": "string (URL to uploaded image)",
    "message": "Image uploaded successfully"
  }
  ```
- **Validation**:
  - `id`: valid UUID
  - File: MIME type image/jpeg or image/png, size ≤5 MB
  - User must be owner or admin
- **Error Responses**:
  - 400 Bad Request: missing file or invalid type/size
  - 401 Unauthorized: missing/invalid token
  - 403 Forbidden: not owner/admin
  - 404 Not Found: property not found
  - 413 Payload Too Large: file too large
- **Example**:
  ```http
  POST /properties/550e8400-e29b-41d4-a716-446655440000/media
  Authorization: Bearer <access_token>
  Content-Type: multipart/form-data

  (file binary)
  ```

### Delete Property Media
- **Method**: `DELETE`
- **URL**: `/properties/:id/media/:mediaId`
- **Authentication**: Requires `agent` (owner) or `admin`
- **URL Parameters**: `id`: uuid, `mediaId`: uuid
- **Success Response** (200 OK):
  ```json
  { "message": "Media deleted successfully" }
  ```
- **Validation**:
  - Both IDs valid UUIDs
  - Media belongs to the property
  - User must be owner or admin
- **Error Responses**:
  - 400 Bad Request: invalid IDs
  - 401 Unauthorized: missing/invalid token
  - 403 Forbidden: not owner/admin
  - 404 Not Found: property or media not found
- **Example**:
  ```http
  DELETE /properties/550e8400-e29b-41d4-a716-446655440000/media/aaaa1111-bbbb-2222-cccc-3333dddd4444
  Authorization: Bearer <access_token>
  ```

---

## Booking
Endpoints for managing property viewings/bookings.

### Create Booking Request
- **Method**: `POST`
- **URL**: `/bookings`
- **Authentication**: Requires `customer` role (or visitor with temporary token; here we require authenticated customer)
- **Request Body**:
  ```json
  {
    "agentId": "uuid (required)",
    "propertyId": "uuid (required)",
    "startTime": "ISO timestamp (required, future)",
    "endTime": "ISO timestamp (optional; if omitted, default duration 60 minutes added to startTime)",
    "notes": "string (optional)"
  }
  ```
- **Success Response** (201 Created):
  ```json
  {
    "id": "uuid",
    "status": "requested",
    "createdAt": "ISO timestamp"
  }
  ```
- **Validation**:
  - `agentId`: valid UUID, user with role `agent` or `admin`
  - `propertyId`: valid UUID, property must be published
  - `startTime`: must be in future (>= now + 1 hour) and <= now + 30 days
  - `endTime`: if provided, must be after startTime; duration typically 15‑180 minutes
  - No overlapping bookings for the same agent (checked via service)
- **Error Responses**:
  - 400 Bad Request: validation errors
  - 401 Unauthorized: missing/invalid token
  - 403 Forbidden: user not a customer
  - 404 Not Found: agent or property not found
  - 409 Conflict: double‑booking detected
- **Example**:
  ```http
  POST /bookings
  Authorization: Bearer <access_token>
  Content-Type: application/json

  {
    "agentId": "11111111-1111-1111-1111-111111111111",
    "propertyId": "550e8400-e29b-41d4-a716-446655440000",
    "startTime": "2026-08-01T14:00:00Z",
    "notes": "Please call 30 mins before arrival."
  }
  ```

### List Bookings
- **Method**: `GET`
- **URL**: `/bookings`
- **Authentication**: Requires authentication; filter results based on role:
  - `customer`: see own bookings
  - `agent`: see bookings where they are the agent
  - `admin`: see all (optional filters)
- **Query Parameters**:
  - `page`: integer (default 1)
  - `limit`: integer (default 10, max 100)
  - `status`: string (optional, filter by status: requested, confirmed, completed, cancelled, no_show)
  - `from`: ISO date (optional, start of range)
  - `to`: ISO date (optional, end of range)
- **Success Response** (200 OK):
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "property": {
          "id": "uuid",
          "title": "string",
          "thumbnail": "string"
        },
        "agent": {
          "id": "uuid",
          "name": "string"
        },
        "customer": {
          "id": "uuid",
          "name": "string"
        },
        "startTime": "ISO timestamp",
        "endTime": "ISO timestamp",
        "status": "string",
        "createdAt": "ISO timestamp"
      }
    ],
    "pagination": { /* same as above */ }
  }
  ```
- **Validation**:
  - Pagination params positive integers
  - `from` ≤ `to` if both provided
  - `status` must be one of allowed values
- **Error Responses**:
  - 400 Bad Request: invalid query parameters
  - 401 Unauthorized: missing/invalid token
- **Example**:
  ```http
  GET /bookings?status=confirmed&page=1&limit=10
  Authorization: Bearer <access_token>
  ```

### Get Booking Detail
- **Method**: `GET`
- **URL**: `/bookings/:id`
- **Authentication**: Requires authentication; user must be involved (customer, agent) or admin
- **URL Parameters**: `id`: uuid
- **Success Response** (200 OK):
  ```json
  {
    "id": "uuid",
    "property": {
      "id": "uuid",
      "title": "string",
      "address": "string"
    },
    "agent": {
      "id": "uuid",
      "name": "string",
      "email": "string",
      "phone": "string"
    },
    "customer": {
      "id": "uuid",
      "name": "string",
      "email": "string",
      "phone": "string"
    },
    "startTime": "ISO timestamp",
    "endTime": "ISO timestamp",
    "status": "string",
    "notes": "string (optional)",
    "createdAt": "ISO timestamp",
    "updatedAt": "ISO timestamp"
  }
  ```
- **Validation**:
  - `id`: valid UUID
  - User must be participant or admin
- **Error Responses**:
  - 400 Bad Request: invalid ID
  - 401 Unauthorized: missing/invalid token
  - 403 Forbidden: not authorized to view this booking
  - 404 Not Found: booking not found
- **Example**:
  ```http
  GET /bookings/88888888-8888-8888-8888-888888888888
  Authorization: Bearer <access_token>
  ```

### Update Booking (Reschedule/Cancel)
- **Method**: `PATCH`
- **URL**: `/bookings/:id`
- **Authentication**: Requires authentication; only the agent (or admin) can modify time/status; customer can cancel (subject to policy)
- **URL Parameters**: `id`: uuid
- **Request Body** (partial):
  ```json
  {
    "startTime": "ISO timestamp (optional)",
    "endTime": "ISO timestamp (optional)",
    "status": "enum: 'requested'|'confirmed'|'cancelled'|'completed' (optional)",
    "notes": "string (optional)"
  }
  ```
- **Success Response** (200 OK):
  ```json
  {
    "id": "uuid",
    "message": "Booking updated successfully"
  }
  ```
- **Validation**:
  - `id`: valid UUID
  - If `startTime` or `endTime` provided, must be valid future times, no overlap for agent
  - `status` transitions allowed:
    - customer: can set to `cancelled` if >24h before startTime (or per policy)
    - agent/admin: can set any status (`confirmed`, `cancelled`, `completed`)
  - User must be authorized per above
- **Error Responses**:
  - 400 Bad Request: validation errors
  - 401 Unauthorized: missing/invalid token
  - 403 Forbidden: not allowed to perform this action
  - 404 Not Found: booking not found
  - 409 Conflict: new time causes overlap
- **Example** (agent confirming):
  ```http
  PATCH /bookings/88888888-8888-8888-8888-888888888888
  Authorization: Bearer <access_token>
  Content-Type: application/json

  {
    "status": "confirmed"
  }
  ```

### Delete Booking
- **Method**: `DELETE`
- **URL**: `/bookings/:id`
- **Authentication**: Requires authentication; only agent (or admin) can delete; customer can delete only if status is `requested` and >24h before start (or per policy)
- **URL Parameters**: `id`: uuid
- **Success Response** (200 OK):
  ```json
  { "message": "Booking deleted successfully" }
  ```
- **Validation**:
  - `id`: valid UUID
  - Permission rules as above
- **Error Responses**:
  - 400 Bad Request: invalid ID
  - 401 Unauthorized: missing/invalid token
  - 403 Forbidden: not allowed
  - 404 Not Found: booking not found
- **Example**:
  ```http
  DELETE /bookings/88888888-8888-8888-8888-888888888888
  Authorization: Bearer <access_token>
  ```

### Confirm Booking (Agent Action)
- **Method**: `POST`
- **URL**: `/bookings/:id/confirm`
- **Authentication**: Requires `agent` (must be the assigned agent) or `admin`
- **URL Parameters`: `id`: uuid
- **Request Body**: none (or `{}`)
- **Success Response** (200 OK):
  ```json
  {
    "id": "uuid",
    "status": "confirmed",
    "message": "Booking confirmed"
  }
  ```
- **Validation**:
  - `id`: valid UUID
  - Booking must exist and be in `requested` state
  - User must be the agent assigned or admin
- **Error Responses**:
  - 400 Bad Request: booking not in requested state
  - 401 Unauthorized: missing/invalid token
  - 403 Forbidden: not the assigned agent/admin
  - 404 Not Found: booking not found
- **Example**:
  ```http
  POST /bookings/88888888-8888-8888-8888-888888888888/confirm
  Authorization: Bearer <access_token>
  ```

### Mark Booking Completed
- **Method**: `POST`
- **URL**: `/bookings/:id/complete`
- **Authentication**: Requires `agent` (assigned) or `admin`
- **URL Parameters**: `id`: uuid
- **Request Body**: none
- **Success Response** (200 OK):
  ```json
  {
    "id": "uuid",
    "status": "completed",
    "message": "Booking marked as completed"
  }
  ```
- **Validation**:
  - `id`: valid UUID
  - Booking must be in `confirmed` state
  - User must be assigned agent or admin
- **Error Responses**:
  - 400 Bad Request: booking not in confirmed state
  - 401 Unauthorized: missing/invalid token
  - 403 Forbidden: not assigned agent/admin
  - 404 Not Found: booking not found
- **Example**:
  ```http
  POST /bookings/88888888-8888-8888-8888-888888888888/complete
  Authorization: Bearer <access_token>
  ```

---

## Payments
Endpoints for processing payments.

### Create Payment Intent
- **Method**: `POST`
- **URL**: `/payment-intent`
- **Authentication**: Requires authentication (any role; guest checkout handled via temporary user – out of scope here)
- **Request Body**:
  ```json
  {
    "amount": "integer (required, amount in cents, min 100, max 1000000)",
    "currency": "string (required, enum: 'usd')",
    "metadata": {
      "type": "enum: 'property_premium' | 'booking_deposit' (required)",
      "id": "uuid (required, corresponds to propertyId or bookingId)"
    }
  }
  ```
- **Success Response** (200 OK):
  ```json
  {
    "clientSecret": "string (to be used with frontend SDK)",
    "paymentIntentId": "string (stripe id)",
    "amount": 15000,
    "currency": "usd"
  }
  ```
- **Validation**:
  - `amount`: integer > 0, within min/max
  - `currency`: must be supported
  - `metadata.type`: must be one of allowed
  - `metadata.id`: valid UUID, and referenced entity must exist and be appropriate (e.g., property must be publishable for premium, booking must exist)
- **Error Responses**:
  - 400 Bad Request: validation errors
  - 401 Unauthorized: missing/invalid token
  - 404 Not Found: referenced entity not found
  - 402 Payment Required: if card issues (handled by gateway, but we may map)
- **Example**:
  ```http
  POST /payment-intent
  Authorization: Bearer <access_token>
  Content-Type: application/json

  {
    "amount": 15000,
    "currency": "usd",
    "metadata": {
      "type": "property_premium",
      "id": "550e8400-e29b-41d4-a716-446655440000"
    }
  }
  ```

### Confirm Payment
- **Method**: `POST`
- **URL**: `/payment/confirm`
- **Authentication**: Requires authentication
- **Request Body**:
  ```json
  {
    "paymentIntentId": "string (required, returned from intent creation)",
    "paymentMethodId": "string (optional, if using saved method)",
    "useStripeSdk": "boolean (true if confirming via frontend SDK; we just verify outcome)"
  }
  ```
  In practice, the frontend confirms with Stripe using the clientSecret; this endpoint verifies the outcome.
- **Success Response** (200 OK):
  ```json
  {
    "status": "succeeded",
    "paymentIntentId": "string",
    "amount": 15000,
    "currency": "usd",
    "receiptUrl": "string (optional)",
    "metadata": { /* echoed */ }
  }
  ```
- **Validation**:
  - `paymentIntentId`: required, matches a pending intent
- **Error Responses**:
  - 400 Bad Request: missing/invalid ID
  - 402 Payment Required: payment failed (e.g., card declined)
  - 401 Unauthorized: missing/invalid token
  - 502 Bad Gateway: gateway error
- **Example**:
  ```http
  POST /payment/confirm
  Authorization: Bearer <access_token>
  Content-Type: application/json

  {
    "paymentIntentId": "pi_1xxxxxxxxxxxxxxxx"
  }
  ```

### Get Payment Details
- **Method**: `GET`
- **URL**: `/payments/:id`
- **Authentication**: Requires authentication; user must be involved (owner of related entity) or admin
- **URL Parameters**: `id`: string (payment intent ID from gateway)
- **Success Response** (200 OK):
  ```json
  {
    "id": "string",
    "amount": 15000,
    "currency": "usd",
    "status": "succeeded",
    "createdAt": "ISO timestamp",
    "metadata": {
      "type": "property_premium",
      "id": "550e8400-e29b-41d4-a716-446655440000"
    },
    "receiptUrl": "string"
  }
  ```
- **Validation**:
  - `id`: valid string
  - Authorization check
- **Error Responses**:
  - 400 Bad Request: invalid ID
  - 401 Unauthorized: missing/invalid token
  - 403 Forbidden: not authorized
  - 404 Not Found: payment not found
- **Example**:
  ```http
  GET /payments/pi_1xxxxxxxxxxxxxxxx
  Authorization: Bearer <access_token>
  ```

### Stripe Webhook (example)
- **Method**: `POST`
- **URL**: `/webhook/stripe`
- **Authentication**: None (uses signature verification via header)
- **Headers**: `Stripe-Signature`: string
- **Request Body**: raw JSON payload from Stripe
- **Success Response** (200 OK): `{ "received": true }`
- **Validation**:
  - Verify signature using endpoint secret
  - Parse event type
- **Error Responses**:
  - 400 Bad Request: invalid payload or signature
  - 500 Internal Server Error: processing error
- **Note**: Actual implementation will map event types to internal actions (e.g., `payment_intent.succeeded` → update payment status, trigger premium activation, etc.)

---

## Notifications
Endpoints for user notifications.

### List Notifications
- **Method**: `GET`
- **URL**: `/notifications`
- **Authentication**: Requires authentication
- **Query Parameters**:
  - `page`: integer (default 1)
  - `limit`: integer (default 20, max 100)
  - `unread`: boolean (optional, if true return only unread)
  - `type`: string (optional, filter by notification type)
- **Success Response** (200 OK):
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "type": "string",
        "title": "string",
        "message": "string",
        "relatedEntityId": "uuid (optional)",
        "relatedEntityType": "string (optional)",
        "isRead": "boolean",
        "createdAt": "ISO timestamp"
      }
    ],
    "pagination": { /* same */ },
    "unreadCount": 5
  }
  ```
- **Validation**:
  - Pagination params positive ints
  - `unread` must be boolean if provided
  - `type` must be from allowed list if provided
- **Error Responses**:
  - 400 Bad Request: invalid query parameters
  - 401 Unauthorized: missing/invalid token
- **Example**:
  ```http
  GET /notifications?unread=true&page=1&limit=10
  Authorization: Bearer <access_token>
  ```

### Create Notification (Internal Use – usually triggered by services)
- **Method**: `POST`
- **URL**: `/notifications`
- **Authentication**: Requires `admin` or internal service token (for simplicity we treat as protected)
- **Request Body**:
  ```json
  {
    "recipientId": "uuid (required)",
    "type": "string (required, from allowed enum)",
    "title": "string (required, max 100)",
    "message": "string (required, max 500)",
    "relatedEntityId": "uuid (optional)",
    "relatedEntityType": "string (optional)"
  }
  ```
- **Success Response** (201 Created):
  ```json
  {
    "id": "uuid",
    "message": "Notification created"
  }
  ```
- **Validation**:
  - `recipientId`: valid UUID, user exists
  - `type`: must be allowed
  - `title` and `message`: required, within length limits
- **Error Responses**:
  - 400 Bad Request: validation errors
  - 401 Unauthorized: missing/invalid token
  - 403 Forbidden: not allowed
  - 404 Not Found: recipient not found
- **Example**:
  ```http
  POST /notifications
  Authorization: Bearer <access_token>
  Content-Type: application/json

  {
    "recipientId": "11111111-1111-1111-1111-111111111111",
    "type": "lead_assigned",
    "title": "New Lead Assigned",
    "message": "You have been assigned a new lead from inquiry on property XYZ.",
    "relatedEntityId": "22222222-2222-2222-2222-222222222222",
    "relatedEntityType": "lead"
  }
  ```

### Mark Notification as Read/Unread
- **Method**: `PATCH`
- **URL**: `/notifications/:id`
- **Authentication**: Requires authentication; user must be the recipient
- **URL Parameters**: `id`: uuid
- **Request Body**:
  ```json
  {
    "isRead": "boolean (required)"
  }
  ```
- **Success Response** (200 OK):
  ```json
  {
    "id": "uuid",
    "isRead": true,
    "message": "Notification updated"
  }
  ```
- **Validation**:
  - `id`: valid UUID and belongs to user
  - `isRead`: boolean
- **Error Responses**:
  - 400 Bad Request: invalid ID or payload
  - 401 Unauthorized: missing/invalid token
  - 403 Forbidden: not the recipient
  - 404 Not Found: notification not found
- **Example**:
  ```http
  PATCH /notifications/33333333-3333-3333-3333-333333333333
  Authorization: Bearer <access_token>
  Content-Type: application/json

  {
    "isRead": true
  }
  ```

### Delete Notification
- **Method**: `DELETE`
- **URL**: `/notifications/:id`
- **Authentication**: Requires authentication; user must be the recipient
- **URL Parameters**: `id`: uuid
- **Success Response** (200 OK):
  ```json
  { "message": "Notification deleted" }
  ```
- **Validation**:
  - `id`: valid UUID and belongs to user
- **Error Responses**:
  - 400 Bad Request: invalid ID
  - 401 Unauthorized: missing/invalid token
  - 403 Forbidden: not the recipient
  - 404 Not Found: notification not found
- **Example**:
  ```http
  DELETE /notifications/33333333-3333-3333-3333-333333333333
  Authorization: Bearer <access_token>
  ```

### Mark All as Read
- **Method**: `POST`
- **URL**: `/notifications/read-all`
- **Authentication**: Requires authentication
- **Request Body**: none
- **Success Response** (200 OK):
  ```json
  { "message": "All notifications marked as read", "updatedCount": 12 }
  ```
- **Validation**: None beyond auth
- **Error Responses**:
  - 401 Unauthorized: missing/invalid token
- **Example**:
  ```http
  POST /notifications/read-all
  Authorization: Bearer <access_token>
  ```

### Delete All Notifications
- **Method**: `DELETE`
- **URL**: `/notifications`
- **Authentication**: Requires authentication
- **Request Body**: none
- **Success Response** (200 OK):
  ```json
  { "message": "All notifications deleted", "deletedCount": 15 }
  ```
- **Validation**: None beyond auth
- **Error Responses**:
  - 401 Unauthorized: missing/invalid token
- **Example**:
  ```http
  DELETE /notifications
  Authorization: Bearer <access_token>
  ```

---

## AI Search
Endpoints for AI‑powered property search.

### Perform Search
- **Method**: `GET`
- **URL**: `/search`
- **Authentication**: Optional (public); authenticated users may see favorite flags etc.
- **Query Parameters**:
  - `q`: string (required, natural language query, max 200 chars)
  - `source`: string (optional, `ai` or `fallback`; defaults to `ai` – if AI unavailable, system may fallback and set source=fallback)
  - `page`: integer (default 1)
  - `limit`: integer (default 10, max 100)
- **Success Response** (200 OK):
  ```json
  {
    "query": "string (echo)",
    "source": "ai|fallback",
    "data": [
      {
        "id": "uuid",
        "title": "string",
        "price": "number",
        "beds": "integer",
        "baths": "number",
        "area": "number",
        "propertyType": "string",
        "location": "string",
        "thumbnail": "string",
        "score": "integer (0‑100)",
        "explanations": [
          { "criteria": "location", "match": true },
          { "criteria": "price", "match": false },
          { "criteria": "beds", "match": true }
        ],
        "isFavorite": "boolean (optional, if authenticated)"
      }
    ],
    "pagination": { /* same */ },
    "total": 150
  }
  ```
- **Validation**:
  - `q`: required, trimmed, max 200 characters
  - `source`: if provided, must be `ai` or `fallback`
  - Pagination params positive ints
- **Error Responses**:
  - 400 Bad Request: invalid query parameters
  - 502 Bad Gateway: AI service temporarily unavailable (system will fallback and still return 200 with source=fallback)
  - 500 Internal Server Error: unexpected error
- **Example**:
  ```http
  GET /search?q=family%20home%20under%20400k%20with%20garden&page=1&limit=10
  ```

### Search Suggestions
- **Method**: `GET`
- **URL**: `/search/suggest`
- **Authentication**: Optional
- **Query Parameters**:
  - `q`: string (required, partial query, max 100 chars)
  - `limit`: integer (default 5, max 20)
- **Success Response** (200 OK):
  ```json
  {
    "query": "string",
    "suggestions": [
      "family home under 400k with garden",
      "family home with garden",
      "home under 400k"
    ]
  }
  ```
- **Validation**:
  - `q`: required, max 100 chars
  - `limit`: positive integer
- **Error Responses**:
  - 400 Bad Request: invalid parameters
  - 500 Internal Server Error: unexpected error
- **Example**:
  ```http
  GET /search/suggest?q=fam&limit=5
  ```

---

## Favorites
Endpoints for managing user‑favorite properties.

### Add to Favorites
- **Method**: `POST`
- **URL**: `/favorites`
- **Authentication**: Requires authentication
- **Request Body**:
  ```json
  {
    "propertyId": "uuid (required)"
  }
  ```
- **Success Response** (201 Created):
  ```json
  {
    "id": "uuid",
    "propertyId": "uuid",
    "createdAt": "ISO timestamp",
    "message": "Added to favorites"
  }
  ```
- **Validation**:
  - `propertyId`: valid UUID, property exists and is published (or accessible to user based on role)
- **Error Responses**:
  - 400 Bad Request: validation errors
  - 401 Unauthorized: missing/invalid token
  - 403 Forbidden: not authenticated
  - 404 Not Found: property not found
  - 409 Conflict: already in favorites (idempotent – could return 200 with existing)
- **Example**:
  ```http
  POST /favorites
  Authorization: Bearer <access_token>
  Content-Type: application/json

  {
    "propertyId": "550e8400-e29b-41d4-a716-446655440000"
  }
  ```

### Remove from Favorites
- **Method**: `DELETE`
- **URL**: `/favorites/:propertyId`
- **Authentication**: Requires authentication
- **URL Parameters**: `propertyId`: uuid
- **Success Response** (200 OK):
  ```json
  { "message": "Removed from favorites" }
  ```
- **Validation**:
  - `propertyId`: valid UUID and must exist in user’s favorites
- **Error Responses**:
  - 400 Bad Request: invalid ID
  - 401 Unauthorized: missing/invalid token
  - 403 Forbidden: not authenticated
  - 404 Not Found: not found in favorites
- **Example**:
  ```http
  DELETE /favorites/550e8400-e29b-41d4-a716-446655440000
  Authorization: Bearer <access_token>
  ```

### List Favorites
- **Method**: `GET`
- **URL**: `/favorites`
- **Authentication**: Requires authentication
- **Query Parameters**:
  - `page`: integer (default 1)
  - `limit`: integer (default 10, max 100)
- **Success Response** (200 OK):
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "property": {
          "id": "uuid",
          "title": "string",
          "price": "number",
          "thumbnail": "string"
        },
        "createdAt": "ISO timestamp"
      }
    ],
    "pagination": { /* same */ }
  }
  ```
- **Validation**:
  - Pagination params positive ints
- **Error Responses**:
  - 400 Bad Request: invalid pagination
  - 401 Unauthorized: missing/invalid token
- **Example**:
  ```http
  GET /favorites?page=1&limit=20
  Authorization: Bearer <access_token>
  ```

---

## Reports
Endpoints for generating and exporting reports.

### Sales Summary
- **Method**: `GET`
- **URL**: `/reports/sales`
- **Authentication**: Requires `admin` role
- **Query Parameters**:
  - `from`: ISO date (optional, default 30 days ago)
  - `to`: ISO date (optional, default today)
- **Success Response** (200 OK):
  ```json
  {
    "period": {
      "from": "2026-06-24",
      "to": "2026-07-24"
    },
    "totalSales": 1250000,
    "totalTransactions": 45,
    "averageSale": 27777.78,
    "byPropertyType": [
      { "type": "single_family", "count": 20, "amount": 600000 },
      { "type": "condo", "count": 15, "amount": 375000 },
      { "type": "townhouse", "count": 10, "amount": 275000 }
    ]
  }
  ```
- **Validation**:
  - `from` ≤ `to` if both provided
  - Dates must be valid
- **Error Responses**:
  - 400 Bad Request: invalid date range
  - 401 Unauthorized: missing/invalid token
  - 403 Forbidden: not admin
- **Example**:
  ```http
  GET /reports/sales?from=2026-06-01&to=2026-06-30
  Authorization: Bearer <access_token>
  ```

### Leads Conversion Funnel
- **Method**: `GET`
- **URL**: `/reports/leads`
- **Authentication**: Requires `admin` role
- **Query Parameters**: same as sales (date range)
- **Success Response** (200 OK):
  ```json
  {
    "period": { "from": "...", "to": "..." },
    "totalLeads": 120,
    "leadsBySource": [
      { "source": "website", "count": 50 },
      { "source": "referral", "count": 30 },
      { "source": "social", "count": 20 },
      { "source": "advertising", "count": 20 }
    ],
    "conversions": {
      "toInquiry": 80,
      "toBooking": 40,
      "toSale": 15
    },
    "conversionRates": {
      "inquiryRate": 0.667,
      "bookingRate": 0.5,
      "saleRate": 0.375
    }
  }
  ```
- **Validation**: same as above
- **Error Responses**: 400, 401, 403
- **Example**:
  ```http
  GET /reports/leads
  Authorization: Bearer <access_token>
  ```

### Property Views Report
- **Method**: `GET`
- **URL**: `/reports/property-views`
- **Authentication**: Requires `admin` role
- **Query Parameters**: date range, optional `propertyId` to filter
- **Success Response** (200 OK):
  ```json
  {
    "period": { "from": "...", "to": "..." },
    "totalViews": 5420,
    "topProperties": [
      {
        "propertyId": "550e8400-e29b-41d4-a716-446655440000",
        "title": "Modern Family Home",
        "views": 340
      },
      { /* ... */ }
    ],
    "viewsByDay": [
      { "date": "2026-07-01", "count": 120 },
      { "date": "2026-07-02", "count": 135 },
      /* ... */
    ]
  }
  ```
- **Validation**: date range, propertyId valid if provided
- **Error Responses**: 400, 401, 403
- **Example**:
  ```http
  GET /reports/property-views?from=2026-07-01&to=2026-07-31
  Authorization: Bearer <access_token>
  ```

### Users Report
- **Method**: `GET`
- **URL**: `/reports/users`
- **Authentication**: Requires `admin` role
- **Query Parameters**: date range
- **Success Response** (200 OK):
  ```json
  {
    "period": { "from": "...", "to": "..." },
    "totalUsers": 2500,
    "newUsers": 120,
    "activeUsers": 800,
    "byRole": [
      { "role": "visitor", "count": 1500 },
      { "role": "customer", "count": 600 },
      { "role": "agent", "count": 300 },
      { "role": "admin", "count": 100 }
    ]
  }
  ```
- **Validation**: date range
- **Error Responses**: 400, 401, 403
- **Example**:
  ```http
  GET /reports/users
  Authorization: Bearer <access_token>
  ```

### Request Export
- **Method**: `POST`
- **URL**: `/reports/export`
- **Authentication**: Requires `admin` role
- **Request Body**:
  ```json
  {
    "reportType": "enum: 'sales' | 'leads' | 'property-views' | 'users' (required)",
    "format": "enum: 'csv' | 'xlsx' | 'pdf' (required)",
    "filters": {
      "from": "ISO date (optional)",
      "to": "ISO date (optional)",
      "/* additional filters per report type */"
    }
  }
  ```
- **Success Response** (202 Accepted): (for async processing) or 200 with file if small
  ```json
  {
    "jobId": "uuid",
    "status": "processing",
    "message": "Export request accepted"
  }
  ```
  If immediate:
  ```json
  {
    "downloadUrl": "string (temporary URL)",
    "expiresAt": "ISO timestamp"
  }
  ```
- **Validation**:
  - `reportType`: must be valid
  - `format`: must be valid
  - `filters`: date range validation if present
- **Error Responses**:
  - 400 Bad Request: invalid parameters
  - 401 Unauthorized: missing/invalid token
  - 403 Forbidden: not admin
  - 422 Unprocessable Entity: invalid filter combination
- **Example**:
  ```http
  POST /reports/export
  Authorization: Bearer <access_token>
  Content-Type: application/json

  {
    "reportType": "sales",
    "format": "csv",
    "filters": {
      "from": "2026-06-01",
      "to": "2026-06-30"
    }
  }
  ```

### List Scheduled Reports
- **Method**: `GET`
- **URL**: `/reports/scheduled`
- **Authentication**: Requires `admin` role
- **Success Response** (200 OK):
  ```json
  {
    "scheduledReports": [
      {
        "id": "uuid",
        "reportType": "sales",
        "format": "email",
        "schedule": "0 0 * * MON", // weekly Monday at midnight
        "recipients": ["manager@example.com"],
        "active": true,
        "createdAt": "ISO timestamp"
      }
    ]
  }
  ```
- **Validation**: None beyond auth
- **Error Responses**: 401, 403
- **Example**:
  ```http
  GET /reports/scheduled
  Authorization: Bearer <access_token>
  ```

### Create Scheduled Report
- **Method**: `POST`
- **URL**: `/reports/scheduled`
- **Authentication**: Requires `admin` role
- **Request Body**:
  ```json
  {
    "reportType": "string (required)",
    "format": "string (required, e.g., 'email' or 'storage')",
    "schedule": "string (required, cron expression)",
    "recipients": ["string"] (required if format includes email),
    "filters": { /* same as export filters */ }
  }
  ```
- **Success Response** (201 Created):
  ```json
  {
    "id": "uuid",
    "message": "Scheduled request created"
  }
  ```
- **Validation**:
  - `reportType`: valid
  - `format`: valid
  - `schedule`: valid cron expression
  - `recipients`: valid email addresses if required
- **Error Responses**:
  - 400 Bad Request: invalid fields
  - 401 Unauthorized: missing/invalid token
  - 403 Forbidden: not admin
- **Example**:
  ```http
  POST /reports/scheduled
  Authorization: Bearer <access_token>
  Content-Type: application/json

  {
    "reportType": "sales",
    "format": "email",
    "schedule": "0 0 * * MON",
    "recipients": ["manager@example.com"],
    "filters": {
      "from": "2026-06-01",
      "to": "2026-06-30"
    }
  }
  ```

---

*End of API Specification*