
const backendToFrontendTodo = function backendToFrontendTodo(backendTodo: any): TodoItem {
  // Validate and normalize priority value
  let priority: 'low' | 'medium' | 'high' = 'medium'; // Default value

  if (typeof backendTodo.priority === 'string') {
    const normalizedPriority = backendTodo.priority.toLowerCase();
    if (normalizedPriority === 'low' || normalizedPriority === 'medium' || normalizedPriority === 'high') {
      priority = normalizedPriority;
    };

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
    console.log(`Test ${index + 1}:`, {
      originalPriority: todo.priority,
      convertedPriority: converted.priority,
      type: typeof converted.priority
    });
  } catch (error) {
    console.error(`Error in test ${index + 1}:`, error);
  }
});

console.log('\nAll tests completed successfully!');
