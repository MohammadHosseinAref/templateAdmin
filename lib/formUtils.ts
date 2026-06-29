export function makeSetField<T extends object>(draft: T, onChange: (next: T) => void) {
  return function set<K extends keyof T>(key: K, val: T[K]) {
    onChange({ ...draft, [key]: val });
  };
}

export function validateFields<T extends object>(
  draft: T,
  rules: Array<{ key: keyof T; message: string }>,
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const rule of rules) {
    const val = draft[rule.key];
    if (val === null || val === undefined || (typeof val === 'string' && !val.trim())) {
      errors[rule.key as string] = rule.message;
    }
  }
  return errors;
}
