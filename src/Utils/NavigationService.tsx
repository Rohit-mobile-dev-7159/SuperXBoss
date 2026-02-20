// src/Utils/NavigationService.ts
import {
  createNavigationContainerRef,
  ParamListBase,
} from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef<ParamListBase>();

export function navigate(name: any, params?: Record<string, any>): void {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  } else {
    console.warn("Navigation is not ready yet");
  }
}

export function isReady(): boolean {
  return navigationRef.isReady();
}
