import { render, screen, fireEvent } from '@testing-library/react';
import { PasswordInput } from '@/components/shared/ui/PasswordInput';
import '@testing-library/jest-dom';

describe('PasswordInput', () => {
  it('renders with password type by default', () => {
    render(<PasswordInput placeholder="Enter password" />);
    const input = screen.getByPlaceholderText('Enter password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('toggles password visibility when eye icon is clicked', () => {
    render(<PasswordInput placeholder="Enter password" />);
    const input = screen.getByPlaceholderText('Enter password');
    const toggleButton = screen.getByRole('button', { name: /show password/i });

    // Initial state
    expect(input).toHaveAttribute('type', 'password');

    // Click to show password
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');
    expect(
      screen.getByRole('button', { name: /hide password/i })
    ).toBeInTheDocument();

    // Click to hide password
    const hideButton = screen.getByRole('button', { name: /hide password/i });
    fireEvent.click(hideButton);
    expect(input).toHaveAttribute('type', 'password');
    expect(
      screen.getByRole('button', { name: /show password/i })
    ).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'password');
    expect(
      screen.getByRole('button', { name: /show password/i })
    ).toBeInTheDocument();
  });

  it('passes through other props', () => {
    render(<PasswordInput data-testid="password-input" disabled />);
    const input = screen.getByTestId('password-input');
    expect(input).toBeDisabled();
  });
});
