module.exports = {
  preset: 'react-native',

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Unit-test setup ONLY
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

  // Ignore E2E tests completely
  testPathIgnorePatterns: [
    '/node_modules/',
    '/android/',
    '/ios/',
    '/e2e/',
  ],

  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.tsx',

    // Optional: module alias mapping to fix relative imports
    '^@Redux/(.*)$': '<rootDir>/src/Redux/$1',
    '^@Components/(.*)$': '<rootDir>/src/Componnets/$1',
    '^@Screens/(.*)$': '<rootDir>/src/Screens/$1',
    '^@Utils/(.*)$': '<rootDir>/src/Utils/$1',
    '^@Services/(.*)$': '<rootDir>/src/Services/$1',
    '^@Constant/(.*)$': '<rootDir>/src/Constant/$1',
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
    '!src/Componnets/FilterScreen.tsx',
    '!src/Screens/SubCatgories/SubCatgories.tsx',
  ],
};