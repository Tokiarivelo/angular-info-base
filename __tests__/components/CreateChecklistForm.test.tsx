import { render, screen } from '@testing-library/react';
import CreateChecklistForm from '@/components/CreateChecklistForm';

describe('CreateChecklistForm', () => {
  it('renders the create button initially', () => {
    render(<CreateChecklistForm />);
    expect(screen.getByText('+ New Checklist')).toBeInTheDocument();
  });
});
