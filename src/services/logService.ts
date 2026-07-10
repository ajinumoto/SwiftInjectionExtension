import * as vscode from 'vscode';
import { injectionService } from './injectionService';

export class LogService {
    private outputChannel: vscode.OutputChannel;
    private lastTimestamp: number = 0;
    private isPolling: boolean = false;
    private pollTimeout?: NodeJS.Timeout;

    constructor() {
        this.outputChannel = vscode.window.createOutputChannel('InjectionNext Console');
    }

    /**
     * Start polling logs from InjectionNext
     */
    startPolling() {
        if (this.isPolling) return;
        this.isPolling = true;
        this.poll();
    }

    /**
     * Stop polling logs
     */
    stopPolling() {
        this.isPolling = false;
        if (this.pollTimeout) {
            clearTimeout(this.pollTimeout);
            this.pollTimeout = undefined;
        }
    }

    /**
     * Focuses and shows the InjectionNext output channel
     */
    showChannel() {
        this.outputChannel.show(true);
    }

    private async poll() {
        if (!this.isPolling) return;

        try {
            const status = await injectionService.getStatus();
            if (status.isRunning) {
                const logs = await injectionService.getLogs(this.lastTimestamp);
                if (logs && logs.length > 0) {
                    let maxTimestamp = this.lastTimestamp;
                    
                    for (const entry of logs) {
                        if (entry.timestamp > maxTimestamp) {
                            maxTimestamp = entry.timestamp;
                        }
                        
                        const date = new Date(entry.timestamp * 1000);
                        const timeStr = date.toLocaleTimeString([], { hour12: false });
                        const levelStr = entry.level ? entry.level.toUpperCase() : 'INFO';
                        
                        this.outputChannel.appendLine(`[${timeStr}] [${levelStr}] ${entry.message}`);
                    }
                    
                    this.lastTimestamp = maxTimestamp;
                }
            }
        } catch (error) {
            console.error('Error during log polling:', error);
        }

        // Schedule next poll (2 seconds)
        if (this.isPolling) {
            this.pollTimeout = setTimeout(() => this.poll(), 2000);
        }
    }

    dispose() {
        this.stopPolling();
        this.outputChannel.dispose();
    }
}

export const logService = new LogService();
