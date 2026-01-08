// Test for About page
import React from 'react';
import { render, screen } from '@testing-library/react';
import AboutPage from '@/src/pages/about';

describe('AboutPage', () => {
  test('renders about page content', () => {
    render(<AboutPage />);
    
    expect(screen.getByText('About TodoApp')).toBeInTheDocument();
    expect(screen.getByText('Our Story')).toBeInTheDocument();
    expect(screen.getByText('Our Mission')).toBeInTheDocument();
    expect(screen.getByText('Our Vision')).toBeInTheDocument();
    expect(screen.getByText('Features')).toBeInTheDocument();
  });

  test('displays feature list', () => {
    render(<AboutPage />);
    
    expect(screen.getByText('Intuitive task management')).toBeInTheDocument();
    expect(screen.getByText('Dark/Light mode support')).toBeInTheDocument();
    expect(screen.getByText('Multilingual support (English & Urdu)')).toBeInTheDocument();
  });
});