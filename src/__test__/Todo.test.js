import { render, screen } from '@testing-library/react';
import Todo from './../Todo';

test('renders learn react link', () => {
    render(<App />);
    const linkElement = screen.getByText(/Todolist/i);
    expect(linkElement).toBeInTheDocument();
});
