import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

/**
 * Stream chat response with real-time token delivery
 * @param {string} question - User question
 * @param {Array} history - Chat history
 * @param {Function} onToken - Callback for each token received
 * @param {Function} onSources - Callback when sources are received
 * @param {Function} onComplete - Callback when stream is complete
 * @param {Function} onError - Callback for errors
 */
export const streamChat = async (
  question,
  history = [],
  onToken,
  onSources,
  onComplete,
  onError
) => {
  try {
    const response = await fetch("http://localhost:8000/chat/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        history,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        if (buffer.trim()) {
          try {
            const event = JSON.parse(buffer);
            handleStreamEvent(event, onToken, onSources, onError);
          } catch (e) {
            console.error("Failed to parse final buffer:", e);
          }
        }
        onComplete?.();
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      // Process complete lines
      const lines = buffer.split("\n");
      buffer = lines.pop(); // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.trim()) {
          try {
            const event = JSON.parse(line);
            handleStreamEvent(event, onToken, onSources, onError);
          } catch (e) {
            console.error("Failed to parse stream event:", e, "Line:", line);
          }
        }
      }
    }
  } catch (error) {
    console.error("Stream chat error:", error);
    onError?.(error.message || "Connection error");
  }
};

/**
 * Handle individual stream events
 */
const handleStreamEvent = (event, onToken, onSources, onError) => {
  switch (event.type) {
    case "content":
      onToken?.(event.data);
      break;
    case "sources":
      onSources?.(event.data);
      break;
    case "done":
      // Stream complete, nothing to do here
      break;
    case "error":
      onError?.(event.data);
      break;
    default:
      console.warn("Unknown event type:", event.type);
  }
};

/**
 * Non-streaming chat (backward compatible)
 */
export const chat = async (question, history = []) => {
  try {
    const response = await API.post("/chat", {
      question,
      history,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default API;
