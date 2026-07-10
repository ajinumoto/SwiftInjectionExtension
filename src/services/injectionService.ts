import * as net from 'net';
import * as fs from 'fs';
import { exec } from 'child_process';
import { LogEntry } from '../models/injection';
import { normalizePath } from '../utils/path';

const SOCKET_PATH = '/tmp/InjectionNext-control.sock';

export class InjectionService {
    /**
     * Generic method to send JSON command to InjectionNext control socket.
     */
    private sendSocketCommand(payload: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(SOCKET_PATH)) {
                reject(new Error('InjectionNext socket not found'));
                return;
            }

            const client = net.createConnection({ path: SOCKET_PATH });
            client.setTimeout(2000); // 2 second timeout

            let data = '';
            client.on('connect', () => {
                client.write(JSON.stringify(payload) + '\n');
            });

            client.on('data', (chunk) => {
                data += chunk.toString();
                try {
                    const response = JSON.parse(data);
                    resolve(response);
                    client.end();
                } catch (e) {
                    // Wait for more data
                }
            });

            client.on('timeout', () => {
                client.destroy();
                reject(new Error('Command timeout'));
            });

            client.on('error', (err) => {
                reject(err);
            });
        });
    }

    /**
     * Gets the current status of InjectionNext app via socket.
     */
    async getStatus(): Promise<any> {
        if (!fs.existsSync(SOCKET_PATH)) {
            return { isRunning: false };
        }
        try {
            const response = await this.sendSocketCommand({ action: 'status' });
            if (response && response.success) {
                const rawDirs = response.data?.watching_directories || response.watching_directories || [];
                const watched = rawDirs.map((d: string) => normalizePath(d));
                return {
                    isRunning: true,
                    watchedDirectories: watched,
                    data: response.data,
                    success: true
                };
            }
            return { isRunning: false };
        } catch (error) {
            return { isRunning: false };
        }
    }

    /**
     * Launches the InjectionNext macOS application.
     */
    async launchApp(): Promise<boolean> {
        return new Promise((resolve) => {
            exec('open -a InjectionNext', (error) => {
                if (error) {
                    console.error('Failed to launch InjectionNext:', error);
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    /**
     * Sends a watch_project command to InjectionNext.
     */
    async watchProject(projectPath: string): Promise<any> {
        return this.sendSocketCommand({ action: 'watch_project', path: projectPath });
    }

    /**
     * Sends an unhide_symbols command to InjectionNext.
     */
    async unhideSymbols(): Promise<any> {
        return this.sendSocketCommand({ action: 'unhide_symbols' });
    }

    /**
     * Sends a get_touch_events command to InjectionNext.
     */
    async getTouchEvents(): Promise<any> {
        return this.sendSocketCommand({ action: 'get_touch_events' });
    }

    /**
     * Sends a replay_touch_events command to InjectionNext.
     */
    async replayTouchEvents(events: any[]): Promise<any> {
        return this.sendSocketCommand({ action: 'replay_touch_events', events });
    }

    /**
     * Gets logs from InjectionNext app since a given timestamp.
     */
    async getLogs(since?: number): Promise<LogEntry[]> {
        const payload: any = { action: 'get_logs' };
        if (since !== undefined && since > 0) {
            payload.since = since;
        }
        try {
            const response = await this.sendSocketCommand(payload);
            if (response.success && response.data && Array.isArray(response.data.logs)) {
                return response.data.logs;
            }
            return [];
        } catch (error) {
            return [];
        }
    }
}

export const injectionService = new InjectionService();
