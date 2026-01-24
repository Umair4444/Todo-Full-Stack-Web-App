// src/services/chatService.ts

interface ChatResponse {
  response: string;
  task_performed: string;
  todo_id?: string;
  timestamp: string;
}

interface ChatMessage {
  id: string;
  user_query: string;
  agent_response: string;
  task_performed: string;
  timestamp: string;
}

interface ChatHistoryResponse {
  total_count: number;
  offset: number;
  limit: number;
  history: ChatMessage[];
}

class ChatService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  /**
   * Gets the authorization header with the JWT token
   * @returns Object with Authorization header or empty object if no token
   */
  private getAuthHeader(): { [key: string]: string } {
    // Get the token from localStorage (same as the rest of the app)
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token) {
      return { 'Authorization': `Bearer ${token}` };
    }
    return {};
  }

  /**
   * Sends a message to the chat API
   * @param message The user's message
   * @returns Promise resolving to the API response
   */
  async sendMessage(message: string): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
        },
        body: JSON.stringify({
          message: message,
          session_type: 'dedicated_page'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: `HTTP error! status: ${response.status}` }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Gets chat history for the authenticated user
   * @param limit Number of records to return (default: 50)
   * @param offset Number of records to skip (default: 0)
   * @returns Promise resolving to the chat history
   */
  async getChatHistory(limit: number = 50, offset: number = 0): Promise<ChatHistoryResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/chat/history?limit=${limit}&offset=${offset}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...this.getAuthHeader(),
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: `HTTP error! status: ${response.status}` }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  }

  /**
   * Deletes a specific chat history entry
   * @param historyId The ID of the history entry to delete
   * @returns Promise resolving to the deletion result
   */
  async deleteChatHistory(historyId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat/history/${historyId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: `HTTP error! status: ${response.status}` }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting chat history:', error);
      throw error;
    }
  }

  /**
   * Gets a specific chat history entry
   * @param historyId The ID of the history entry to retrieve
   * @returns Promise resolving to the specific history entry
   */
  async getSpecificChatHistory(historyId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat/history/${historyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: `HTTP error! status: ${response.status}` }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching specific chat history:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();
export { ChatService };