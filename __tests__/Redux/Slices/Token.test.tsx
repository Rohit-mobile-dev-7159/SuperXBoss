import reducer, {
  setToken,
  removeToken,
} from '../../../src/Redux/Slices/Token';

describe('tokenSlice', () => {
  it('should return the initial state', () => {
    const state = reducer(undefined, { type: 'unknown' });

    expect(state).toEqual({
      token: '',
    });
  });

  it('should handle setToken', () => {
    const previousState = { token: '' };

    const newState = reducer(previousState, setToken('abc123'));

    expect(newState.token).toBe('abc123');
  });

  it('should handle removeToken', () => {
    const previousState = { token: 'abc123' };

    const newState = reducer(previousState, removeToken());

    expect(newState.token).toBe('');
  });
});
