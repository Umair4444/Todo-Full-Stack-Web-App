// Simple validation of the fix
import React, { MouseEvent } from 'react';
import { Button } from '@/components/ui/button'; // Assuming this is the button component

// Fixed function that can handle both string and MouseEvent
const handleSend = (messageText?: string | MouseEvent<HTMLButtonElement>) => {
  let textToSend = 'default value';

  if (typeof messageText === 'string') {
    textToSend = messageText;
  } 
  // When messageText is MouseEvent or undefined, we use the default value

  console.log('Sending message:', textToSend);
};

// This simulates how it would be used in JSX
const TestComponent = () => {
  return (
    <div>
      {/* This simulates the button usage from the original code */}
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export { handleSend, TestComponent };