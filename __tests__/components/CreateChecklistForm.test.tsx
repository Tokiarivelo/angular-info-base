import { render, screen } from '@testing-library/react';
import CreateChecklistForm from '@/components/CreateChecklistForm';

describe('CreateChecklistForm', () => {
  it('renders the create button initially', () => {
    render(<CreateChecklistForm />);
    const button = screen.getByText('+ New Checklist');
    expect(button).toBeTruthy();
  });
});
