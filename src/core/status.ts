import * as net from 'net';
import * as fs from 'fs';
import { exec } from 'child_process';

/**
 * Checks if the InjectionNext helper app is actively listening on its control socket.
 * @returns Promise<boolean> true if InjectionNext is running and listening, false otherwise.
 */
export function checkInjectionNextStatus(): Promise<boolean> {
    return new Promise((resolve) => {
        const socketPath = '/tmp/InjectionNext-control.sock';
        
        if (!fs.existsSync(socketPath)) {
            resolve(false);
            return;
        }

        const client = net.createConnection({ path: socketPath });

        client.setTimeout(500);

        client.on('connect', () => {
            client.end();
            resolve(true);
        });

        client.on('timeout', () => {
            client.destroy();
            resolve(false);
        });

        client.on('error', () => {
            resolve(false);
        });
    });
}

/**
 * Launches the InjectionNext macOS application.
 * @returns Promise<boolean> true if command was successful, false otherwise.
 */
export function openInjectionNext(): Promise<boolean> {
    return new Promise((resolve) => {
        exec('open -a InjectionNext', (error) => {
            if (error) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}
