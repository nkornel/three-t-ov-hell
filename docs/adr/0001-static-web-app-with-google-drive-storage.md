# Static web app with Google Drive storage instead of a desktop app

The tracker was first conceived as a Windows desktop app, but it is built as a static web page on GitHub Pages that stores its data in the operator's Google Drive, in a folder the app creates and is limited to. Every desktop route cost more than a stopwatch and a leaderboard justify, and the operator wanted the data to live as plain files in their own Drive rather than inside a browser profile.

## Considered Options

- **Avalonia on .NET 8**: rejected as too heavy; the published app is about 70 MB.
- **Tauri with SQLite**: rejected because building for Windows needs Rust and the Microsoft C++ build tools installed on a machine with little free disk.
- **Static page with browser storage**: rejected because the data would be invisible and lost if site data were cleared.
- **Static page writing to a locally synced folder**: rejected in favour of talking to Google Drive directly; it would have needed Google Drive for Desktop installed and works only in Chrome.

## Consequences

- The app needs a one-time Google Cloud project and OAuth client ID, created by the operator.
- The operator signs in with Google to use the app, and it does not work offline.
- The app can see only the Drive files it created itself, so nothing can be placed in its folder from outside.
