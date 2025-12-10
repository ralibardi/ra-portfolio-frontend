# API Documentation

This folder contains API endpoint specifications and integration guides.

## 📡 What's Here?

Documentation for:
- API endpoints and specifications
- Request/response formats
- Authentication and authorization
- Error codes and handling
- Integration examples

## 📚 Planned Documents

### `ENDPOINTS.md` (Coming Soon)
**Purpose**: Complete API endpoint reference

**Contents**:
- All available endpoints
- HTTP methods
- Request parameters
- Response formats
- Example requests/responses

---

### `AUTHENTICATION.md` (Coming Soon)
**Purpose**: Authentication and authorization guide

**Contents**:
- JWT token usage
- Authentication flow
- Authorization scopes
- Token refresh
- Security best practices

---

### `ERROR_CODES.md` (Coming Soon)
**Purpose**: Error handling reference

**Contents**:
- HTTP status codes
- Custom error codes
- Error response format
- Troubleshooting errors

---

### `INTEGRATION.md` (Coming Soon)
**Purpose**: Integrating with the API

**Contents**:
- Setup and configuration
- Making requests
- Handling responses
- Error handling
- Best practices

---

## 🎯 API Overview

### Base URL
```
Development: http://localhost:7071/api
Production: https://ra-portfolio-api-prod.azurewebsites.net/api
```

### Authentication
- JWT Bearer tokens
- Obtained from Auth0/Azure AD B2C
- Include in Authorization header

### Response Format
```json
{
  "data": {},
  "error": null,
  "timestamp": "2024-12-10T15:00:00Z"
}
```

## 📝 Documentation Standards

### Endpoint Documentation Format
```markdown
## GET /endpoint

**Description**: What this endpoint does

**Authentication**: Required/Optional

**Parameters**:
- `param1` (string, required): Description
- `param2` (number, optional): Description

**Request Example**:
\`\`\`http
GET /api/endpoint?param1=value
Authorization: Bearer <token>
\`\`\`

**Response Example**:
\`\`\`json
{
  "data": {},
  "error": null
}
\`\`\`

**Error Responses**:
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
```

## 🔍 Quick Reference

### Common Endpoints (Planned)

#### Projects
- `GET /projects` - List all projects
- `GET /projects/:id` - Get project details
- `POST /projects` - Create project (auth required)
- `PUT /projects/:id` - Update project (auth required)
- `DELETE /projects/:id` - Delete project (auth required)

#### Skills
- `GET /skills` - List all skills
- `GET /skills/:id` - Get skill details

#### Contact
- `POST /contact` - Send contact message

## 🎨 API Design Principles

### RESTful Design
- Resource-based URLs
- HTTP methods for operations
- Consistent response format
- Proper status codes

### Security
- JWT authentication
- HTTPS only
- CORS configuration
- Rate limiting

### Performance
- Caching headers
- Pagination for lists
- Efficient queries
- Response compression

### Developer Experience
- Clear error messages
- Consistent naming
- Comprehensive documentation
- Example requests

## 🔄 Versioning

### Current Version
- **v1** - Initial API version

### Version Strategy
- URL-based versioning: `/api/v1/`
- Backward compatibility maintained
- Deprecation notices for changes
- Migration guides for major versions

## 🧪 Testing the API

### Tools
- **Postman**: Collection available (coming soon)
- **cURL**: Command-line examples in docs
- **Swagger/OpenAPI**: Interactive documentation (planned)

### Test Environments
- **Development**: Local Azure Functions
- **Staging**: Azure dev environment
- **Production**: Azure prod environment

## 📊 API Status

| Endpoint Category | Status | Documentation |
|-------------------|--------|---------------|
| Projects | 🟡 In Development | Coming Soon |
| Skills | 🟡 In Development | Coming Soon |
| Contact | 🟡 In Development | Coming Soon |
| Authentication | 🟡 Planned | Coming Soon |

## 🆘 Need Help?

- **API not working?** Check `../guides/TROUBLESHOOTING.md`
- **Integration questions?** Review `INTEGRATION.md` (coming soon)
- **Found a bug?** Create an issue
- **Contact**: ronny.alibardi@outlook.com

---

**Note**: API documentation will be added as endpoints are implemented.
