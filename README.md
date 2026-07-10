# Swift Injection Companion (Hot Reload)

<div align="center">
   <img width="128" height="128" alt="Swift Injection Companion" src="https://github.com/user-attachments/assets/0a8327a3-e997-4f22-a831-c2a68abf4886" />
</div>

The ultimate companion for [InjectionNext](https://github.com/johnno1962/InjectionNext) in VS Code. Automatically generate and clean up SwiftUI hot-reloading boilerplate with a single command or shortcut, with smart integration with the InjectionNext macOS app.

## 🚀 Key Features

- **⚡ Automatic Boilerplate Generation:** Instantly inject `import Inject`, `@ObserveInjection var inject`, and `.enableInjection()` into your SwiftUI views with a single tap or keyboard shortcut (`cmd + alt + i`).
- **🗑️ Automatic Boilerplate Removal:** Completely clean up and remove all injection boilerplate from your SwiftUI files with a single tap or keyboard shortcut (`cmd + alt + k`).
- **📶 Smart Status Monitoring:** Real-time status indicator in the Status Bar showing whether InjectionNext is running and active on your project.
- **👁️ Auto-Watch Project:** Automatically registers your project workspace with InjectionNext on startup.
- **🔗 Direct App Integration:** Launch InjectionNext directly from VS Code with a single click if it is not currently running.

---

## 🚦 Status Bar States

- **`$(zap) InjectionActive`**: Everything is ready! App is running and watching your project.
- **`$(eye) Watch Project?`**: App is running, but this project isn't being watched. Click to activate.
- **`$(warning) InjectionNext Off`**: App is not running. Click to launch it.

---

## How It Works

The extension parses your active SwiftUI View and intelligently inserts three core elements:

1. **`import Inject`**
   - Placed automatically in alphabetical order within your `import` block.
2. **`@ObserveInjection var inject`**
   - Inserted into the first struct conforming to `View`(ex. 'View', custom protocol like 'WrappedView' or 'ThemeableView').
3. **`.enableInjection()`**
   - Placed as the last modifier of your main `body` property.

---

## Usage & Shortcuts

### 1. Editor Toolbar Icons
- Click **⚡** to **Generate** Swift Injection.
- Click **🗑️** to **Remove** Swift Injection.

### 2. Keyboard Shortcuts
- **Generate:** `cmd + alt + i`
- **Remove:** `cmd + alt + k`

<div align="center">
   <img width="640" height="375" alt="Example" src="https://github.com/user-attachments/assets/d1f8a5d1-fd1d-4cae-9ffe-723cc7a614fe" />
</div>

---

## Installation

### 1. From IDE (VS Code, Cursor, Kiro, Antigravity, or any Forked VS Code) Extension Marketplace (Recommended)
1. Open IDE.
2. Open Extensions view (`Cmd+Shift+X`).
3. Search for **Pamungkas.swift-injection-generator**.
4. Click **Install**.

### 2. Manual Installation (From Source)
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
