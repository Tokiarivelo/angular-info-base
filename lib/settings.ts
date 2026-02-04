import { prisma } from '@/lib/prisma';

export async function getSetting<T = string>(
  key: string,
  defaultValue?: T
): Promise<T | undefined> {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: key },
    });

    if (setting?.value) {
      return setting.value as unknown as T;
    }
  } catch (error) {
    // In case of DB error or during build/migration when table might not exist
    // console.warn(`Failed to fetch setting ${key} from DB, falling back to env.`);
  }

  // Fallback to process.env
  const envValue = process.env[key];
  if (envValue !== undefined) {
    return envValue as unknown as T;
  }

  return defaultValue;
}

export async function setSetting(key: string, value: string) {
  return prisma.systemSetting.upsert({
    where: { key: key },
    update: { value },
    create: { key, value },
  });
}

export async function getAllSettings() {
  return prisma.systemSetting.findMany({
    orderBy: { key: 'asc' },
  });
}

// Function to get specific known keys with type safety if needed,
// though dynamic keys are requested.
import { SETTINGS_KEYS } from '@/lib/settings-keys';

export { SETTINGS_KEYS };
