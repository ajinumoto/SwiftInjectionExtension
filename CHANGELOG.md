# Changelog

All notable changes to this project will be documented in this file.

## [1.3.1] - 2026-07-10
### Added
- **InjectionNext Companion Panel**: Introducing a unified sidebar in the VS Code Activity Bar (labeled "InjectionNext Companion") representing the complete companion interface.
- **Live Status Overview**: Displays real-time status indicators (Xcode Running, Compiler Intercepted, Connected Client, and Device Injection) with a periodic 3-second live-status poll via control socket.
- **Event Recorder (Touch Capturing & Replay Macro)**:
  - **Record Action**: Fetches and aggregates active touch events from the connected client application, indicating the captured count via a color-coded badge.
  - **Remove**: Clears recorded events in one click.
  - **Replay**: Sends the recorded macro back to the client application for lightning-fast hot-reloaded UI state reproduction.
- **Diagnostics & Log Utilities**: Combined "Unhide Symbols" (fixes default-argument symbol visibility) and "Show Logs" actions side-by-side.
- **Clean Architecture Refactoring**: Restructured the panel by separating raw HTML/CSS/JS view templates (`src/views/dashboardHtml.ts`) from the controller and lifecycle logic (`src/services/dashboardViewProvider.ts`).

### Fixed
- **TypeScript Resolution**: Configured explicit `"types": ["node"]` compiler option in `tsconfig.json` to eliminate inline NodeJS type and global namespace errors inside VS Code's TS Server.
- **Implicit Any Warnings**: Resolved explicit typing inside `statusBarService` to ensure standard compliance under strict compilation modes.

## [1.3.0] - 2026-07-09
### Added
- **Rebranding**: Renamed to **Swift Injection Companion (Hot Reload)** to reflect its role as a comprehensive toolset.
- **Status Bar Integration**: Real-time indicator showing if InjectionNext is running and if the current project is being watched.
- **Auto-Watch Project**: Seamlessly registers the current workspace with InjectionNext upon opening.
- **Socket Communication**: Direct integration with InjectionNext's Unix Domain Socket for fast, lightweight status checks.
- **Smart Notifications**: Interactive warnings with "Open InjectionNext" and "Watch Project" actions.
- **App Launch Handling**: Automatically detects if the app is missing and provides a direct download link to the GitHub repository.
- **Visual Feedback**: Loading spinners and busy states for all background communication tasks.

### Refactored
- **Clean Architecture**: Reorganized the codebase into Models, Services, Utils, and Commands for industry-standard maintainability.
- **Path Normalization**: Robust project path matching that handles symlinks and macOS-specific path variations.

## [1.2.4] - 2026-07-08
### Added
- Marketplace Discoverability: Added `Programming Languages` and `Snippets` categories to `package.json` for better reach.

## [1.2.3] - 2026-07-07
### Added
- Marketplace Installation: Added instructions for installing directly from the VS Code Marketplace.
- Media Assets: Added rich-media preview recording and logo to `README.md`.

## [1.2.2] - 2026-07-07
### Changed
- Keyboard Shortcuts: Remapped **Remove Swift Injection** default keybinding from `cmd+alt+u` to `cmd+alt+k` to prevent cursor navigation conflicts.

## [1.2.1] - 2026-07-07
### Fixed
- Protocol Targeting: Restricted `@ObserveInjection` insertion to target structs explicitly conforming to `View` protocol.
- Housekeeping: Updated `.gitignore` rules and removed redundant files.

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

