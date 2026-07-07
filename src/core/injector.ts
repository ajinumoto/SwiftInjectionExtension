// ==================== GENERATORS & REMOVERS ====================

export function generateInjection(text: string): string {
    let newText = insertImportInject(text);
    newText = insertObserveInjection(newText);
    newText = insertEnableInjection(newText);
    return newText;
}

export function removeInjection(text: string): string {
    let newText = removeImportInject(text);
    newText = removeObserveInjection(newText);
    newText = removeEnableInjection(newText);
    return newText;
}

export function insertImportInject(text: string): string {
    if (text.includes("import Inject")) return text;
    
    const lines = text.split(/\r?\n/);
    let importLines: { line: string; index: number; name: string }[] = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith("import ")) {
            const name = line.replace("import ", "").trim();
            importLines.push({ line: lines[i], index: i, name });
        } else if (line !== "" && !line.startsWith("//") && !line.startsWith("/*") && !line.startsWith("*")) {
            if (importLines.length > 0) break;
        }
    }

    if (importLines.length > 0) {
        let inserted = false;
        for (let j = 0; j < importLines.length; j++) {
            if (importLines[j].name.localeCompare("Inject") > 0) {
                lines.splice(importLines[j].index, 0, "import Inject");
                inserted = true;
                break;
            }
        }
        if (!inserted) {
            lines.splice(importLines[importLines.length - 1].index + 1, 0, "import Inject");
        }
    } else {
        let insertIndex = 0;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim() !== "" && !lines[i].trim().startsWith("//")) {
                insertIndex = i;
                break;
            }
        }
        lines.splice(insertIndex, 0, "import Inject");
    }
    return lines.join("\n");
}

export function insertObserveInjection(text: string): string {
    if (text.includes("@ObserveInjection")) return text;
    
    const lines = text.split(/\r?\n/);
    const structRegex = /struct\s+(\w+)\s*:\s*([^{]+)\{/;
    
    for (let i = 0; i < lines.length; i++) {
        const match = lines[i].match(structRegex);
        if (match) {
            const protocols = match[2];
            if (protocols.includes("View")) {
                let indent = "  "; // Default 2 spaces
                if (i + 1 < lines.length) {
                    const nextLineMatch = lines[i + 1].match(/^(\s+)/);
                    if (nextLineMatch) {
                        indent = nextLineMatch[1];
                    }
                }
                lines.splice(i + 1, 0, `${indent}@ObserveInjection var inject`);
                break;
            }
        }
    }
    return lines.join("\n");
}

export function insertEnableInjection(text: string): string {
    if (text.includes(".enableInjection()")) return text;
    
    const lines = text.split(/\r?\n/);
    const bodyRegex = /var\s+body\s*:\s*some\s+View\s*\{/;
    let bodyStartLine = -1;
    
    for (let i = 0; i < lines.length; i++) {
        if (bodyRegex.test(lines[i])) {
            bodyStartLine = i;
            break;
        }
    }

    if (bodyStartLine === -1) return text;

    let braceCount = 0;
    let bodyEndLine = -1;
    
    for (let i = bodyStartLine; i < lines.length; i++) {
        const line = lines[i];
        for (let j = 0; j < line.length; j++) {
            if (line[j] === "{") {
                braceCount++;
            } else if (line[j] === "}") {
                braceCount--;
                if (braceCount === 0) {
                    bodyEndLine = i;
                    break;
                }
            }
        }
        if (bodyEndLine !== -1) break;
    }

    if (bodyEndLine !== -1) {
        const braceLine = lines[bodyEndLine];
        const braceIndentMatch = braceLine.match(/^(\s*)\}/);
        if (braceIndentMatch) {
            const baseIndent = braceIndentMatch[1];
            let modifierIndent = baseIndent + "  ";
            if (bodyStartLine + 1 < lines.length) {
                const nextLineMatch = lines[bodyStartLine + 1].match(/^(\s+)/);
                if (nextLineMatch) {
                    modifierIndent = nextLineMatch[1];
                }
            }
            lines.splice(bodyEndLine, 0, `${modifierIndent}.enableInjection()`);
        } else {
            const line = lines[bodyEndLine];
            const lastBraceIndex = line.lastIndexOf("}");
            const beforeBrace = line.substring(0, lastBraceIndex);
            const afterBrace = line.substring(lastBraceIndex);
            lines[bodyEndLine] = `${beforeBrace}\n    .enableInjection()\n${afterBrace}`;
        }
    }
    return lines.join("\n");
}

export function removeImportInject(text: string): string {
    const lines = text.split(/\r?\n/);
    const index = lines.findIndex(line => line.trim() === "import Inject");
    if (index !== -1) {
        lines.splice(index, 1);
    }
    return lines.join("\n");
}

export function removeObserveInjection(text: string): string {
    const lines = text.split(/\r?\n/);
    const index = lines.findIndex(line => line.includes("@ObserveInjection var inject"));
    if (index !== -1) {
        lines.splice(index, 1);
    }
    return lines.join("\n");
}

export function removeEnableInjection(text: string): string {
    const lines = text.split(/\r?\n/);
    const index = lines.findIndex(line => line.includes(".enableInjection()"));
    if (index !== -1) {
        lines.splice(index, 1);
    }
    return lines.join("\n");
}
