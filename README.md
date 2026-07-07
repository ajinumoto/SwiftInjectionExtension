# Swift Injection VS Code Extension

A lightweight, productivity-focused VS Code extension to **generate** and **remove** Swift `InjectionNext` boilerplate code in SwiftUI Views with exactly **one tap** or a keyboard shortcut.

Designed to seamlessly match modular SwiftUI layouts and strict sorting/formatting guidelines (e.g. alphabetical imports, proper block-level indentation).

---

## Features

- **⚡ One-Tap Generate (`Zap` Icon):** Inserts all InjectionNext boilerplate code into your active SwiftUI file instantly.
- **🗑️ One-Tap Remove (`Trash` Icon):** Completely and safely cleans up all Swift InjectionNext boilerplate before you make commits or open Pull Requests.
- **⌨️ Intuitive Keyboard Shortcuts:** No need to lift your hands off the keyboard.

---

## How It Works

The extension parses your active SwiftUI View and intelligently inserts three core elements according to Erafone's strict layout rules:

1. **`import Inject`**
   - Placed automatically in alphabetical order within your `import` block.
2. **`@ObserveInjection var inject`**
   - Placed as the first property inside your main `struct` View, matching your file's local indentation perfectly (supports 2-space or 4-space layouts).
3. **`.enableInjection()`**
   - Placed precisely as the very last modifier of your main `body` property (right before the closing brace).

---

## Usage & Shortcuts

### 1. Editor Toolbar Icons (One-Tap)
When editing a `.swift` file, you will find two new icons in the top-right corner of your editor toolbar:
- Click **⚡ (Zap)** to **Generate** Swift Injection.
- Click **🗑️ (Trash)** to **Remove** Swift Injection.

### 2. Keyboard Shortcuts
- **Generate:** `command + option + I`
- **Remove:** `command + option + U`

---

## Installation

### To Pack and Install Locally:

1. Clone or copy the extension folder.
2. Run compilation & packaging in the directory:
   ```bash
   npm install
   npm run compile
   npx @vscode/vsce package
   ```
3. Install the generated `.vsix` file in VS Code:
   - Go to Extensions (`Cmd+Shift+X`).
   - Click the `...` menu in the top-right.
   - Choose **Install from VSIX...**
   - Select `swift-injection-generator-xxx.vsix`.

---

## Requirements

- VS Code `v1.80.0` or newer.
- Swift language package installed for syntax detection.

---

## License

This extension is open-sourced under the [MIT License](LICENSE).
