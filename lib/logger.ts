import pino, { Logger, LoggerOptions } from "pino";

type LogLevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace";

interface EmojiLoggerOptions extends Omit<LoggerOptions, "customLevels"> {
  emoji?: Record<LogLevel, string>;
}

const defaultEmojis: Record<LogLevel, string> = {
  fatal: "💀",
  error: "🔥",
  warn: "⚠️",
  info: "💡",
  debug: "🔍",
  trace: "🔎",
} as const;

class AppLogger {
  private logger: Logger;
  private emojis: Record<LogLevel, string>;

  constructor(options?: EmojiLoggerOptions) {
    this.emojis = options?.emoji ?? defaultEmojis;

    this.logger = pino({
      customLevels: {
        fatal: 60,
        error: 50,
        warn: 40,
        info: 30,
        debug: 20,
        trace: 10,
      },
      formatters: {
        level: (label: string): { level: string } => ({
          level: this.emojis[label as LogLevel] ?? "📝",
        }),
        bindings: () => ({}), // Remove pid and hostname
      },
      timestamp: () => `,"time":"${new Date().toISOString()}"`,
      messageKey: "msg",
      level: "info",
      ...options,
    });
  }

  public fatal = (message: string, ...args: unknown[]): void =>
    this.logger.fatal({ msg: message, ...this.formatArgs(args) });

  public error = (message: string, ...args: unknown[]): void =>
    this.logger.error({ msg: message, ...this.formatArgs(args) });

  public warn = (message: string, ...args: unknown[]): void =>
    this.logger.warn({ msg: message, ...this.formatArgs(args) });

  public info = (message: string, ...args: unknown[]): void =>
    this.logger.info({ msg: message, ...this.formatArgs(args) });

  public debug = (message: string, ...args: unknown[]): void =>
    this.logger.debug({ msg: message, ...this.formatArgs(args) });

  public trace = (message: string, ...args: unknown[]): void =>
    this.logger.trace({ msg: message, ...this.formatArgs(args) });

  // Helper method to format additional arguments
  private formatArgs(args: unknown[]): Record<string, unknown> {
    if (args.length === 0) return {};
    if (args.length === 1 && typeof args[0] === "object") {
      return args[0] as Record<string, unknown>;
    }
    return { args };
  }
}

export const logger = new AppLogger();
