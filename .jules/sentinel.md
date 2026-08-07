## 2024-08-07 - SSRF Vulnerability in Open Graph URL Fetcher
**Vulnerability:** The `/api/og` endpoint accepted user-provided URLs and passed them directly to `fetch` without validating the protocol or the destination hostname. This exposed the application to Server-Side Request Forgery (SSRF).
**Learning:** This existed because the feature relies on fetching an arbitrary URL provided by the user to extract Open Graph metadata without proper sanitization.
**Prevention:** Next time, ensure all URLs provided by the user and fetched by the server are checked to only use allowed protocols (e.g., `http:` or `https:`) and ensure the destination is not pointing to an internal or loopback address (e.g., `localhost`, `127.0.0.1`, `.local`).

## 2024-08-07 - Denial of Wallet (Resource Exhaustion) in Chat Endpoint
**Vulnerability:** The `/api/chat` endpoint accepted user messages of any length. A malicious actor could submit a massively long string, causing Node.js to consume excessive memory parsing the JSON payload and generating large charges on the OpenAI API (Denial of Wallet).
**Learning:** This occurred because developers often trust user input length in prototype phases without adding safety constraints on the backend.
**Prevention:** Next time, ensure *every* user input that connects to a metered, paid third-party API (like OpenAI) or requires significant memory allocation has strict length constraints on the server side, matched by HTML input constraints (like `maxLength`) on the frontend.
