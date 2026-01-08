// Test file to validate the type fix
import React, { MouseEvent } from 'react';

// Define the same function signature we're using in MobileChatWindow
const handleSend = (messageText?: string | MouseEvent<HTMLButtonElement>) => {
  let textToSend = 'default value';

  if (typeof messageText === 'string') {
    textToSend = messageText;
  } else if (messageText !== undefined) {
    // If messageText is an event object, we'll use the default value
    // This handles the case where the function is called as an event handler
  }

  console.log(textToSend);
};

// This should compile without errors
const buttonClickHandler = () => {
  handleSend(); // Called without parameters (uses default)
  handleSend('Hello'); // Called with string
  // handleSend(event) would be called with an event object from onClick
};

export { buttonClickHandler };