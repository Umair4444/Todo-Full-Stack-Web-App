/**
 * Unit tests for shadcn/ui component setup in frontend
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

describe('shadcn/ui Components', () => {
  describe('Button Component', () => {
    it('should render with correct text', () => {
      render(<Button>Click Me</Button>);
      
      const buttonElement = screen.getByRole('button', { name: /click me/i });
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toHaveTextContent('Click Me');
    });

    it('should apply correct styling classes', () => {
      render(<Button variant="destructive" size="lg">Delete</Button>);
      
      const buttonElement = screen.getByRole('button', { name: /delete/i });
      expect(buttonElement).toHaveClass('bg-destructive');
      expect(buttonElement).toHaveClass('rounded-lg');
      expect(buttonElement).toHaveClass('text-lg');
    });

    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled Button</Button>);
      
      const buttonElement = screen.getByRole('button', { name: /disabled button/i });
      expect(buttonElement).toBeDisabled();
    });

    it('should handle click events', () => {
      const mockOnClick = vi.fn();
      render(<Button onClick={mockOnClick}>Clickable</Button>);
      
      const buttonElement = screen.getByRole('button', { name: /clickable/i });
      fireEvent.click(buttonElement);
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Input Component', () => {
    it('should render with correct type and placeholder', () => {
      render(<Input type="email" placeholder="Enter email" />);
      
      const inputElement = screen.getByPlaceholderText('Enter email');
      expect(inputElement).toBeInTheDocument();
      expect(inputElement).toHaveAttribute('type', 'email');
    });

    it('should update value when typed', () => {
      render(<Input id="test-input" />);
      
      const inputElement = screen.getByRole('textbox');
      fireEvent.change(inputElement, { target: { value: 'test@example.com' } });
      
      expect(inputElement).toHaveValue('test@example.com');
    });

    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled />);
      
      const inputElement = screen.getByRole('textbox');
      expect(inputElement).toBeDisabled();
    });
  });

  describe('Card Component', () => {
    it('should render card with header, title, content and footer', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Card content goes here</p>
          </CardContent>
          <CardFooter>
            <Button>Submit</Button>
          </CardFooter>
        </Card>
      );
      
      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card content goes here')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('should apply correct styling classes', () => {
      render(
        <Card className="custom-class">
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Test content</p>
          </CardContent>
        </Card>
      );
      
      const cardElement = screen.getByText('Test Card').closest('div');
      expect(cardElement).toHaveClass('rounded-lg');
      expect(cardElement).toHaveClass('border');
      expect(cardElement).toHaveClass('bg-card');
      expect(cardElement).toHaveClass('text-card-foreground');
      expect(cardElement).toHaveClass('shadow-sm');
      expect(cardElement).toHaveClass('custom-class');
    });
  });

  describe('Label Component', () => {
    it('should render with correct text', () => {
      render(<Label htmlFor="test-input">Email Address</Label>);
      
      const labelElement = screen.getByText('Email Address');
      expect(labelElement).toBeInTheDocument();
      expect(labelElement).toHaveAttribute('for', 'test-input');
    });

    it('should be associated with the correct input', () => {
      render(
        <>
          <Label htmlFor="email-input">Email</Label>
          <Input id="email-input" />
        </>
      );
      
      const labelElement = screen.getByText('Email');
      const inputElement = screen.getByRole('textbox');
      
      // Clicking the label should focus the input
      fireEvent.click(labelElement);
      expect(inputElement).toHaveFocus();
    });
  });

  describe('Component Integration', () => {
    it('should render a complete form with shadcn/ui components', () => {
      const TestForm = () => {
        return (
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter your password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Sign In</Button>
            </CardFooter>
          </Card>
        );
      };

      render(<TestForm />);
      
      // Verify all components are rendered
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
      
      // Verify components have correct attributes
      const emailInput = screen.getByLabelText('Email');
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('placeholder', 'Enter your email');
      
      const passwordInput = screen.getByLabelText('Password');
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('placeholder', 'Enter your password');
    });
  });
});