jest.mock('@react-native-async-storage/async-storage', () => {
  return require('@react-native-async-storage/async-storage/jest/async-storage-mock.js');
});

jest.mock('react-native-screens', () => ({
  ...jest.requireActual('react-native-screens'),
  enableScreens: jest.fn(),
}));
