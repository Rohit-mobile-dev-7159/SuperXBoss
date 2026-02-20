module.exports = {
  preset: 'react-native',

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  //  Unit-test setup ONLY
  setupFilesAfterEnv: ['./jest.setup.ts'],

  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },

  transformIgnorePatterns: [
    'node_modules/(?!(react-native' +
      '|@react-native' +
      '|@react-navigation' +
      '|react-native-gesture-handler' +
      '|react-native-reanimated' +
      '|react-native-safe-area-context' +
      '|react-redux' +
      '|@reduxjs/toolkit' +
      '|redux-persist' +
      '|react-native-size-matters' +
      '|react-native-vector-icons' +
      '|react-native-razorpay' +
      '|react-native-collapsible' +
      '|react-native-skeleton-placeholder' +
      '|react-native-linear-gradient' +
      '|react-native-swiper' +
      '|react-native-image-picker' +
      '|@react-native-firebase' +
      '|immer' +
      ')/)',
  ],

  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|tsx|js|jsx)$',

  // 🔥 IGNORE E2E COMPLETELY
  testPathIgnorePatterns: [
    '/node_modules/',
    '/android/',
    '/ios/',
    '/e2e/', // ✅ THIS FIXES EVERYTHING
  ],

  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.tsx',
  },

  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
    '!src/**/index.{ts,tsx,js,jsx}',
    '!src/**/types.{ts,tsx,js,jsx}',
    '!src/**/constants.{ts,tsx,js,jsx}',
    '!src/**/styles.{ts,tsx,js,jsx}',
    '!src/**/__tests__/**',
    '!src/Utils/NotificationHandler.tsx',
    '!src/Navigation/Bottom.tsx',
    '!src/Utils/NavigationService.tsx',
    '!src/Services/**',
    '!src/Component/FilterScreen.tsx',
    '!src/Screens/SubCatgories/SubCatgories.tsx',
    '!src/Screens/SubCatgories/SubCatgories.tsx',
  ],
};
