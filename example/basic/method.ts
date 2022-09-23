export const defineFuncs = {
  add: (p1: number, p2: number): number => {
    return p1 + p2;
  },
  join: (p1: string, p2: string, separator = ''): string => {
    return `${p1}${separator}${p2}`;
  },
} as const;
