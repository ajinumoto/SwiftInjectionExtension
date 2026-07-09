import * as net from 'net';
import * as fs from 'fs';
import { exec } from 'child_process';
import { InjectionStatus } from '../models/injection';
import { normalizePath } from '../utils/path';

const SOCKET_PATH = '/tmp/InjectionNext-control.sock';

export class InjectionService {
    /**
     * Gets the current status of InjectionNext app via socket.
     */
    async getStatus(): Promise<InjectionStatus> {
        return new Promise((resolve) => {
            if (!fs.existsSync(SOCKET_PATH)) {
                resolve({ isRunning: false });
                return;
            }

            const client = net.createConnection({ path: SOCKET_PATH });
            client.setTimeout(500);

            let data = '';
            client.on('connect', () => {
                client.write(JSON.stringify({ action: 'status' }) + '\n');
            });

            client.on('data', (chunk) => {
                data += chunk.toString();
                try {
                    const response = JSON.parse(data);
                    const rawDirs = response.data?.watching_directories || response.watching_directories || [];
                    const watched = rawDirs.map((d: string) => normalizePath(d));
                    
                    resolve({ 
                        isRunning: true, 
                        watchedDirectories: watched
                    });
                    client.end();
                } catch (e) {
                    // Wait for more data
                }
            });

            client.on('timeout', () => {
                client.destroy();
                resolve({ isRunning: false });
            });

            client.on('error', () => {
                resolve({ isRunning: false });
            });
        });
    }

    /**
     * Launches the InjectionNext macOS application.
     */
    async launchApp(): Promise<boolean> {
        return new Promise((resolve) => {
            exec('open -a InjectionNext', (error) => {
                resolve(!error);
            });
        });
    }

    /**
     * Sends a watch_project command to InjectionNext.
     */
    async watchProject(projectPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(SOCKET_PATH)) {
                reject(new Error('InjectionNext socket not found'));
                return;
            }

            const client = net.createConnection({ path: SOCKET_PATH });
            const command = JSON.stringify({ action: 'watch_project', path: projectPath }) + '\n';

            client.on('connect', () => {
                client.write(command);
                client.end();
                resolve();
            });

            client.on('error', (err) => {
                reject(err);
            });
        });
    }
}

export const injectionService = new InjectionService();
