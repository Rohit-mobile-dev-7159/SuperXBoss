// test-utils.tsx
import React from "react";
import {render} from "@testing-library/react-native";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {SafeAreaProvider} from "react-native-safe-area-context";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {retry: false},
      mutations: {retry: false},
    },
  });

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

export function renderWithClient(ui: React.ReactElement) {
  const testQueryClient = createTestQueryClient();

  return render(
    // <NavigationContainer>
    <QueryClientProvider client={testQueryClient}>
      <SafeAreaProvider>{ui}</SafeAreaProvider>
    </QueryClientProvider>,
    //  </NavigationContainer>
  );
}
