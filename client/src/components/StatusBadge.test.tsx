import { render, screen } from '@testing-library/react';
import StatusBadge from '@/components/StatusBadge';

describe('StatusBadge', () => {
  it('renders PASSING status', () => {
    render(<StatusBadge status="PASSING" />);
    expect(screen.getByText('PASSING')).toBeInTheDocument();
  });

  it('renders FAILING status', () => {
    render(<StatusBadge status="FAILING" />);
    expect(screen.getByText('FAILING')).toBeInTheDocument();
  });

  it('renders UNKNOWN status', () => {
    render(<StatusBadge status="UNKNOWN" />);
    expect(screen.getByText('UNKNOWN')).toBeInTheDocument();
  });
});
