import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';

describe('DeleteConfirmDialog', () => {
  it('calls onConfirm when the Delete button is clicked', async () => {
    const onConfirm = jest.fn();
    render(
      <DeleteConfirmDialog
        open
        title="Delete this item?"
        onConfirm={onConfirm}
        onClose={jest.fn()}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onClose and not onConfirm when Cancel is clicked', async () => {
    const onConfirm = jest.fn();
    const onClose = jest.fn();
    render(
      <DeleteConfirmDialog
        open
        title="Delete this item?"
        onConfirm={onConfirm}
        onClose={onClose}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('renders the warning text when provided', () => {
    render(
      <DeleteConfirmDialog
        open
        title="Delete this item?"
        warning="All related records will also be deleted."
        onConfirm={jest.fn()}
        onClose={jest.fn()}
      />
    );
    expect(screen.getByText('All related records will also be deleted.')).toBeInTheDocument();
  });
});
