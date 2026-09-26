# Contributing

Contributions are welcome. For bugs or feature ideas, open an issue on GitHub before starting substantial work so the change can be discussed.

## Development setup

1. Fork the repository and clone your fork.
2. Install dependencies with `npm ci`.
3. Create a branch for your change.
4. Run `npm run dev` to start the documentation and playground locally.

## Before opening a pull request

Run the relevant checks for your change:

```sh
npm test
npm run typecheck
npm run build
npm run test:package
npm run format:check
```

Keep changes focused, add or update tests for behavior changes, and update the documentation when public behavior or options change. Include a concise summary and the checks you ran in your pull request.
