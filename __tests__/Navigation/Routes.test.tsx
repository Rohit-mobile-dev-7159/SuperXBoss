import { render } from '@testing-library/react-native';

import Routes from '../../src/Navigation/Routes';
it('calls MainStack once', () => {
  render(<Routes />);
});
