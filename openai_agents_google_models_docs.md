# OpenAI Agents SDK with OpenAIChatCompletionsModel and Google Models

The OpenAI Agents SDK supports integration with various LLM providers, including Google's Gemini models, through multiple approaches:

## 1. Using LiteLLM Integration

The most straightforward way to use Google Gemini models with the OpenAI Agents SDK is through the LiteLLM integration:

```bash
pip install "openai-agents[litellm]"
```

Then you can create agents with Gemini models:

```python
from agents import Agent, Runner
from agents.extensions.models.litellm_model import LitellmModel

# Using LitellmModel with Google Gemini
gemini_agent = Agent(
    name="Gemini Assistant",
    model=LitellmModel(
        model="gemini/gemini-2.0-flash",
        api_key="your-gemini-api-key"
    )
)

result = await Runner.run(gemini_agent, "Explain quantum computing.")
```

Alternatively, you can use the string format:

```python
gemini_agent = Agent(
    model="litellm/gemini/gemini-2.5-flash-preview-04-17",
    # other parameters...
)
```

## 2. Using OpenAIChatCompletionsModel with Google Models

For more direct control, you can use OpenAIChatCompletionsModel with Google models when they are accessed through an OpenAI-compatible API. This is possible with services like Google's Vertex AI, which offers OpenAI-compatible endpoints for Gemini models:

```python
from agents import Agent, OpenAIChatCompletionsModel
from openai import AsyncOpenAI

# Configure client for Google's OpenAI-compatible endpoint
client = AsyncOpenAI(
    base_url="https://your-vertex-ai-endpoint",  # Google's OpenAI-compatible endpoint
    api_key="your-api-key"
)

agent = Agent(
    name="Google Model Agent",
    model=OpenAIChatCompletionsModel(
        model="google/gemini-2.0-flash-001",  # Model identifier
        openai_client=client
    )
)
```

## 3. Important Considerations

- **Responses API Limitation**: The OpenAI Agents SDK uses the Responses API by default, but most non-OpenAI providers (including Google) don't support it yet. You may encounter 404 errors or similar issues.

- **Solution Options**:
  1. Use `set_default_openai_api("chat_completions")` if you're using environment variables for OpenAI settings
  2. Use `OpenAIChatCompletionsModel` directly for better compatibility with various providers

- **LiteLLM Approach**: This is often the recommended approach as it provides a unified interface for many different LLM providers, including Google Gemini, Anthropic Claude, and others.

## 4. Complete Example with LiteLLM

```python
import asyncio
from agents import Agent, Runner, function_tool, set_tracing_disabled
from agents.extensions.models.litellm_model import LitellmModel

set_tracing_disabled(disabled=True)

@function_tool
def get_weather(city: str):
    """Get weather for a city."""
    return f"The weather in {city} is sunny."

async def main():
    # Use Google Gemini via LiteLLM
    gemini_agent = Agent(
        name="Gemini Assistant",
        model=LitellmModel(
            model="gemini/gemini-2.0-flash",
            api_key="your-gemini-api-key"
        )
    )

    result = await Runner.run(gemini_agent, "Explain quantum computing.")
    print(result.final_output)

asyncio.run(main())
```

This approach allows you to seamlessly integrate Google's Gemini models with the OpenAI Agents SDK using the LiteLLM abstraction layer, which handles the differences between various LLM providers' APIs.