# Project architecture

- Read client-side AI keys through the shared key-management module, never Node environment globals, because this app runs in the browser.
- Keep recipe export normalization at the formatter boundary because converter and saved-recipe payloads have different ingredient representations.
- Declare test environment types in a source declaration file and run Jest through a CommonJS configuration because the app uses ESM and its TypeScript config is managed.