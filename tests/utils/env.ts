function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
}

export const env = {
  USERNAME: requireEnv('APP_USERNAME'),
  PASSWORD: requireEnv('PASSWORD'),
  BASE_URL: requireEnv('BASE_URL'),
};
