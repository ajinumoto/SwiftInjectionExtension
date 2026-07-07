# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2026-07-07
### Added
- Context Menu Support: Added **One-Tap Generate** and **One-Tap Remove** options to the VS Code right-click editor context menu for Swift files.
- Command Emojis: Enhanced command titles with descriptive emojis and names.
- Project Scaffolding: Added standard `.vscode/launch.json` and `.vscode/tasks.json` for F5 debugging and auto-compilation.
- Extension Packaging: Added `.vscodeignore` to exclude development source files and optimize `.vsix` package size.
- Asset Organization: Consolidated extension logo files into an `images/` directory and updated manifest configuration.

### Refactored
- Modular Architecture: Deconstructed monolithic `src/extension.ts` into a cleaner, standardized structure:
  - Extracted core injection and removal logic into `src/core/injector.ts`.
  - Organized command handlers into `src/commands/generate.ts` and `src/commands/remove.ts`.
  - Simplified `extension.ts` to act as a minimal entry point.

## [1.1.0] - 2026-07-07
### Added
- Feature **Remove Swift Injection** with toolbar icon (Trash icon) and keyboard shortcut (`command + option + U`).

## [1.0.0] - 2026-07-07
### Added
- First release of **Swift SwiftUI Injection Generator**.
- Alphabetical `import Inject` insertion.
- Indentation-aware `@ObserveInjection var inject` insertion inside main struct.
- Braces-matched `.enableInjection()` modifier insertion at the end of the View's `body` property.
- Editor title action icon (Zap) and default keyboard shortcut (`command + option + I`).

