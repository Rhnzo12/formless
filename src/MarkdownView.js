import { useSearchParams } from 'react-router-dom';

const MarkdownView = () => {
  const [searchParams] = useSearchParams();
  const section = searchParams.get('section') || 'welcome';

  // Markdown content for each section
  const markdownContent = {
    'welcome': `# Welcome to the SHARE Protocol API

> Micropayments, revenue sharing and distribution.

The SHARE Protocol API helps you offer flexible revenue sharing to your products and experiences. It's built for creators, businesses and developers.

## OpenAPI

\`\`\`yaml
openapi: 3.0.0
info:
  title: SHARE Protocol API
  description: Micropayments, revenue sharing and distribution.
  version: 1.0.0
  contact:
    name: Formless
    url: https://www.formless.xyz
servers:
  - url: https://share-ddn.formless.xyz
    description: Production server
\`\`\`

## Core Features

- **Revenue Sharing** - Split payments automatically between multiple parties
- **Identity Management** - Look up user identities by email address
- **Contract Creation** - Create revenue sharing contracts programmatically
- **Payouts** - Execute batch payouts to multiple recipients

## Authentication

All API requests require a Bearer token in the Authorization header:

\`\`\`
Authorization: Bearer <token>
\`\`\`

## Base URL

\`\`\`
https://share-ddn.formless.xyz
\`\`\`
`,

    'identity-lookup': `# Identity Lookup

> Retrieve user identity information by email address

Retrieve user identity information based on an email address using the \`identity_get_by_email_address\` method.

## OpenAPI

\`\`\`yaml POST /v1#identity_get_by_email_address
openapi: 3.0.0
info:
  title: SHARE Protocol API
  description: Micropayments, revenue sharing and distribution.
  version: 1.0.0
  contact:
    name: Formless
    url: https://www.formless.xyz
servers:
  - url: https://share-ddn.formless.xyz
    description: Production server
security: []
paths:
  /v1#identity_get_by_email_address:
    post:
      tags:
        - Account Management
      summary: Identity Lookup
      description: Retrieve user identity information by email address
      operationId: identity_get_by_email_address
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - jsonrpc
                - id
                - method
                - params
              properties:
                jsonrpc:
                  type: string
                  example: "2.0"
                id:
                  type: string
                  example: "1"
                method:
                  type: string
                  example: "identity_get_by_email_address"
                params:
                  type: object
                  required:
                    - email_address
                  properties:
                    email_address:
                      type: string
                      format: email
                      example: "jsmith@example.com"
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  jsonrpc:
                    type: string
                  id:
                    type: string
                  result:
                    type: object
                    properties:
                      success:
                        type: boolean
                      user_unique_id:
                        type: string
                      email_address:
                        type: string
                      display_name:
                        type: string
\`\`\`

## Authorization

**Authorization** \`string\`

JWT token with Unique User ID for auth.

## Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| jsonrpc | string | Yes | JSON-RPC version, always "2.0" |
| id | string | Yes | Request identifier |
| method | string | Yes | Method name: "identity_get_by_email_address" |
| params.email_address | string | Yes | Email address to look up |

## Example Request

\`\`\`bash
curl --request POST \\
  --url 'https://share-ddn.formless.xyz/v1#identity_get_by_email_address' \\
  --header 'Authorization: Bearer <token>' \\
  --header 'Content-Type: application/json' \\
  --data '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "identity_get_by_email_address",
    "params": {
      "email_address": "jsmith@example.com"
    }
  }'
\`\`\`

## Example Response

\`\`\`json
{
  "jsonrpc": "2.0",
  "id": "<string>",
  "result": {
    "success": true,
    "user_unique_id": "<string>",
    "email_address": "jsmith@example.com",
    "display_name": "<string>"
  }
}
\`\`\`
`,

    'create-contract': `# Create Contract

> Create a new revenue sharing contract

Create a new revenue sharing contract with specified split percentages between parties.

## OpenAPI

\`\`\`yaml POST /v1#create_contract
openapi: 3.0.0
info:
  title: SHARE Protocol API
  description: Micropayments, revenue sharing and distribution.
  version: 1.0.0
paths:
  /v1#create_contract:
    post:
      tags:
        - Revenue Sharing
      summary: Create Contract
      description: Create a new revenue sharing contract
      operationId: create_contract
\`\`\`

## Authorization

**Authorization** \`string\`

JWT token with Unique User ID for auth.

## Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| jsonrpc | string | Yes | JSON-RPC version, always "2.0" |
| id | string | Yes | Request identifier |
| method | string | Yes | Method name: "create_contract" |
| params | object | Yes | Contract parameters |
`,

    'fetch-split-data': `# Fetch Split Data

> Retrieve split data for a contract

Fetch the revenue split configuration for an existing contract.

## OpenAPI

\`\`\`yaml POST /v1#fetch_split_data
openapi: 3.0.0
info:
  title: SHARE Protocol API
  description: Micropayments, revenue sharing and distribution.
  version: 1.0.0
paths:
  /v1#fetch_split_data:
    post:
      tags:
        - Revenue Sharing
      summary: Fetch Split Data
      description: Retrieve split data for a contract
      operationId: fetch_split_data
\`\`\`

## Authorization

**Authorization** \`string\`

JWT token with Unique User ID for auth.
`,

    'execute-payout': `# Execute Payout

> Execute a batch payout to recipients

Execute a payout to distribute funds to multiple recipients based on their split percentages.

## OpenAPI

\`\`\`yaml POST /v1#execute_payout
openapi: 3.0.0
info:
  title: SHARE Protocol API
  description: Micropayments, revenue sharing and distribution.
  version: 1.0.0
paths:
  /v1#execute_payout:
    post:
      tags:
        - Payouts
      summary: Execute Payout
      description: Execute a batch payout to recipients
      operationId: execute_payout
\`\`\`

## Authorization

**Authorization** \`string\`

JWT token with Unique User ID for auth.
`,

    'query-batch-status': `# Query Batch Status

> Check the status of a batch payout

Query the current status of a previously submitted batch payout.

## OpenAPI

\`\`\`yaml POST /v1#query_batch_status
openapi: 3.0.0
info:
  title: SHARE Protocol API
  description: Micropayments, revenue sharing and distribution.
  version: 1.0.0
paths:
  /v1#query_batch_status:
    post:
      tags:
        - Payouts
      summary: Query Batch Status
      description: Check the status of a batch payout
      operationId: query_batch_status
\`\`\`

## Authorization

**Authorization** \`string\`

JWT token with Unique User ID for auth.
`,
  };

  const content = markdownContent[section] || markdownContent['welcome'];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      color: '#e0e0e0',
      fontFamily: 'monospace',
      padding: '40px',
      whiteSpace: 'pre-wrap',
      lineHeight: '1.6',
      fontSize: '14px',
    }}>
      <pre style={{
        margin: 0,
        fontFamily: 'inherit',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
      }}>
        {content}
      </pre>
    </div>
  );
};

export default MarkdownView;
