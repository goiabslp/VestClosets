import { render } from '@testing-library/react';
import { GlobalModal } from './GlobalModal';
import { describe, it } from 'vitest';

describe('GlobalModal', () => {
  it('renders without crashing', () => {
    render(<GlobalModal />);
  });
});
