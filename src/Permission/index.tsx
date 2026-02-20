import {
  check,
  request,
  RESULTS,
  PermissionStatus,
  openSettings,
  PERMISSIONS,
  Permission,
} from "react-native-permissions";
import {Platform} from "react-native";

// Normalize permission for platform
const normalizePermission = (perm: string): string => {
  return Platform.select({
    ios: (PERMISSIONS.IOS as Record<string, string>)[perm] || perm,
    android: (PERMISSIONS.ANDROID as Record<string, string>)[perm] || perm,
    default: perm,
  })!;
};

// Generic permission requester
export const requestSinglePermission = async (
  permission: string,
): Promise<boolean> => {
  const normalized = normalizePermission(permission);

  const status: PermissionStatus = await check(normalized);

  if (status === RESULTS.GRANTED) {
    console.log(`✅ ${permission} already granted.`);
    return true;
  }

  if (status === RESULTS.BLOCKED) {
    console.log(`🚫 ${permission} is blocked. Prompt user to go to settings.`);
    openSettings();
    return false;
  }

  if (status === RESULTS.DENIED || status === RESULTS.LIMITED) {
    const result: PermissionStatus = await request(normalized);
    if (result === RESULTS.GRANTED) {
      console.log(`✅ ${permission} granted after request.`);
      return true;
    } else {
      console.log(`❌ ${permission} denied.`);
      return false;
    }
  }

  return false;
};

// Fallback definition
const POST_NOTIFICATIONS =
  Platform.OS === "android" ? "android.permission.POST_NOTIFICATIONS" : "";

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS !== "android" || !POST_NOTIFICATIONS) {
    console.log("Notification permission not needed on this platform.");
    return true;
  }

  const status: PermissionStatus = await check(POST_NOTIFICATIONS);

  if (status === RESULTS.GRANTED) {
    console.log("🔔 Notification permission already granted.");
    return true;
  }

  if (status === RESULTS.BLOCKED) {
    console.log(
      "🔕 Notification permission is blocked. Prompt user to open settings.",
    );
    openSettings();
    return false;
  }

  if (status === RESULTS.DENIED) {
    const result: PermissionStatus = await request(POST_NOTIFICATIONS);
    if (result === RESULTS.GRANTED) {
      console.log("✅ Notification permission granted.");
      return true;
    } else {
      console.log("❌ Notification permission denied.");
      return false;
    }
  }

  return false;
};

export const isAnyPermissionGranted = async (
  permissions: Permission[],
): Promise<boolean> => {
  for (const permission of permissions) {
    const result = await check(permission);

    if (result === RESULTS.GRANTED) {
      return true; // At least one permission is granted
    }
  }

  return false; // No permissions granted
};

export async function checkPermission(permission: any) {
  try {
    const result = await check(permission);
    return result === RESULTS.GRANTED;
  } catch (error) {
    console.warn("Permission check error:", error);
    return false;
  }
}
