import * as fs from 'fs';
import * as path from 'path';

/**
 * Normalizes a path for reliable comparison.
 */
export function normalizePath(p: string): string {
    try {
        // Resolve symlinks and normalize separators
        const resolved = fs.realpathSync(p);
        return path.normalize(resolved).toLowerCase().replace(/\/$/, '');
    } catch (e) {
        return path.normalize(p).toLowerCase().replace(/\/$/, '');
    }
}
