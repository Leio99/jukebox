export const colorLog = (text: string, color: LogColor) => `\x1b[${color}m${text}\x1b[0m`

export enum LogColor{
    RED = 31,
    GREEN = 32,
    YELLOW = 33,
    BLUE = 34,
    MAGENTA = 35,
    CYAN = 36
}