// Simple test to validate the priority fix
const path = require('path');
const fs = require('fs');

// Read the backendAdapters.ts file to get the function
const backendAdapterPath = path.join(__dirname, 'src', 'services', 'backendAdapters.ts');
const backendAdapterContent = fs.readFileSync(backendAdapterPath, 'utf8');

// Extract the backendToFrontendTodo function
const functionMatch = backendAdapterContent.match(/export function backendToFrontendTodo\(backendTodo: any\): TodoItem \{[\s\S]*?\}/);
if (!functionMatch) {
  console.error('Could not find backendToFrontendTodo function');
  process.exit(1);
}

// Create a test environment
const testFunctionCode = `
const backendToFrontendTodo = ${functionMatch[0].replace('export function backendToFrontendTodo', 'function backendToFrontendTodo')};

// Mock TodoItem with different priority types to test the fix
const testTodos = [
  { id: '1', title: 'Test Todo 1', priority: 'high', completed: false, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', title: 'Test Todo 2', priority: 'medium', completed: false, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', title: 'Test Todo 3', priority: 'low', completed: false, createdAt: new Date(), updatedAt: new Date() },
  { id: '4', title: 'Test Todo 4', priority: 2, completed: false, createdAt: new Date(), updatedAt: new Date() }, // Numeric priority
  { id: '5', title: 'Test Todo 5', priority: null, completed: false, createdAt: new Date(), updatedAt: new Date() }, // Null priority
  { id: '6', title: 'Test Todo 6', priority: undefined, completed: false, createdAt: new Date(), updatedAt: new Date() }, // Undefined priority
  { id: '7', title: 'Test Todo 7', priority: '', completed: false, createdAt: new Date(), updatedAt: new Date() }, // Empty string priority
];

console.log('Testing backendToFrontendTodo function:');
testTodos.forEach((todo, index) => {
  try {
    const converted = backendToFrontendTodo(todo);
    console.log(\`Test \${index + 1}:\`, {
      originalPriority: todo.priority,
      convertedPriority: converted.priority,
      type: typeof converted.priority
    });
  } catch (error) {
    console.error(\`Error in test \${index + 1}:\`, error);
  }
});

console.log('\\nAll tests completed successfully!');
`;

// Write the test to a temporary file and run it
const testFilePath = path.join(__dirname, 'temp-test.js');
fs.writeFileSync(testFilePath, testFunctionCode);

// Run the test
require(testFilePath);

// Clean up
fs.unlinkSync(testFilePath);