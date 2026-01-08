// Test for Contact page
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ContactPage from '@/src/pages/contact';

describe('ContactPage', () => {
  test('renders contact page content', () => {
    render(<ContactPage />);
    
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText('Have questions or feedback? Reach out to our team')).toBeInTheDocument();
    expect(screen.getByText('Get in Touch')).toBeInTheDocument();
    expect(screen.getByText('Send us a message')).toBeInTheDocument();
  });

  test('has contact form', () => {
    render(<ContactPage />);
    
    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('john@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('How can we help you?')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your message here...')).toBeInTheDocument();
    expect(screen.getByText('Send Message')).toBeInTheDocument();
  });
});