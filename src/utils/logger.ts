type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  details?: unknown;
}

class Logger {
  private logs: LogEntry[] = [];
  private readonly maxLogs = 100;

  private createLogEntry(level: LogLevel, message: string, details?: unknown): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      details
    };
  }

  private addLog(entry: LogEntry) {
    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    // 開発環境でのみ、重要なログを出力
    if (process.env.NODE_ENV === 'development') {
      if (entry.level === 'error' || 
          (entry.level === 'warn' && this.isImportantWarning(entry.message))) {
        console[entry.level](
          `[${entry.timestamp}] ${entry.message}`,
          entry.details || ''
        );
      }
    }
  }

  private isImportantWarning(message: string): boolean {
    const importantPatterns = [
      'auth',
      'firebase',
      'verification',
      'permission',
      'security',
      'critical'
    ];
    return importantPatterns.some(pattern => 
      message.toLowerCase().includes(pattern)
    );
  }

  info(message: string, details?: unknown) {
    // info レベルのログは最小限に
    if (this.isImportantInfo(message)) {
      this.addLog(this.createLogEntry('info', message, details));
    }
  }

  private isImportantInfo(message: string): boolean {
    const importantPatterns = [
      'initialization',
      'authentication',
      'configuration'
    ];
    return importantPatterns.some(pattern => 
      message.toLowerCase().includes(pattern)
    );
  }

  warn(message: string, details?: unknown) {
    this.addLog(this.createLogEntry('warn', message, details));
  }

  error(message: string, details?: unknown) {
    this.addLog(this.createLogEntry('error', message, details));
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();