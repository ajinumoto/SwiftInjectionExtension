export interface InjectionStatus {
    isRunning: boolean;
    watchedDirectories?: string[];
}

export interface LogEntry {
    timestamp: number;
    message: string;
    level: string;
}

