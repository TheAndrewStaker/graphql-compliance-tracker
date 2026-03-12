import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing/react';
import CreateOwnerDialog from '@/components/CreateOwnerDialog';

function renderDialog() {
  render(
    <MockedProvider mocks={[]}>
      <CreateOwnerDialog open onClose={jest.fn()} />
    </MockedProvider>
  );
}

describe('CreateOwnerDialog validation', () => {
  it('shows required errors when submitted with empty fields', async () => {
    renderDialog();
    await userEvent.click(screen.getByRole('button', { name: 'Create' }));
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  it('shows an email format error when the email is missing @', async () => {
    renderDialog();
    await userEvent.type(screen.getByRole('textbox', { name: /name/i }), 'Alice');
    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'notanemail');
    await userEvent.click(screen.getByRole('button', { name: 'Create' }));
    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
  });
});
