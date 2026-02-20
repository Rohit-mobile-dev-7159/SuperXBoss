import { store, persistor } from '../../src/Redux/store';

jest.mock('redux-persist', () => {
  const actual = jest.requireActual('redux-persist');
  return {
    ...actual,
    persistStore: jest.fn(() => ({
      persist: jest.fn(),
      flush: jest.fn(),
      purge: jest.fn(),
    })),
  };
});

describe('Redux Store Configuration', () => {
  it('should create the Redux store', () => {
    expect(store).toBeDefined();
    expect(typeof store.dispatch).toBe('function');
    expect(typeof store.getState).toBe('function');
  });

  it('should have correct initial state shape', () => {
    const state = store.getState();

    expect(state).toHaveProperty('token');
    expect(state).toHaveProperty('search');
    expect(state).toHaveProperty('cart');
  });

  it('should create persistor', () => {
    expect(persistor).toBeDefined();
    expect(typeof persistor.persist).toBe('function');
  });

  it('should allow dispatching actions', () => {
    store.dispatch({ type: 'UNKNOWN_ACTION' });

    const state = store.getState();
    expect(state).toBeDefined();
  });
});
