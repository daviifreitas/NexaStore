import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

jest.mock('./pages/Catalog', () => {
  return function Catalog() {
    return <div data-testid="catalog-component">Catalog Component</div>;
  };
});

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('catalog-component')).toBeInTheDocument();
  });

  test('has the correct main wrapper class', () => {
    const { container } = render(<App />);
    expect(container.firstChild).toHaveClass('App');
  });

  test('renders the Catalog component', () => {
    render(<App />);
    expect(screen.getByText('Catalog Component')).toBeInTheDocument();
  });
});