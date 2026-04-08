import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface PipelineRequest {
  step: string;
  provider: string;
  messages: Array<{ role: string; content: string }>;
  context: Record<string, unknown>;
  fallbackProvider?: string;
}

const PROVIDER_CONFIGS: Record<string, { url: string; envKey: string; model: string }> = {
  gemini: {
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    envKey: "GEMINI_API_KEY",
    model: "gemini-2.5-flash",
  },
  chatgpt: {
    url: "https://api.openai.com/v1/chat/completions",
    envKey: "OPENAI_API_KEY",
    model: "gpt-4o",
  },
  claude: {
    url: "https://api.anthropic.com/v1/messages",
    envKey: "CLAUDE_API_KEY",
    model: "claude-sonnet-4-20250514",
  },
  deepseek: {
    url: "https://api.deepseek.com/v1/chat/completions",
    envKey: "DEEPSEEK_API_KEY",
    model: "deepseek-chat",
  },
  openrouter: {
    url: "https://openrouter.ai/api/v1/chat/completions",
    envKey: "OPENROUTER_API_KEY",
    model: "anthropic/claude-sonnet-4-20250514",
  },
  grok: {
    url: "https://api.x.ai/v1/chat/completions",
    envKey: "GROK_API_KEY",
    model: "grok-3-mini",
  },
  lovable: {
    url: "https://ai.gateway.lovable.dev/v1/chat/completions",
    envKey: "LOVABLE_API_KEY", 
    model: "google/gemini-3-flash-preview",
  },
};

async function callProvider(provider: string, messages: Array<{ role: string; content: string }>): Promise<string> {
  const config = PROVIDER_CONFIGS[provider];
  if (!config) throw new Error(`Unknown provider: ${provider}`);

  const apiKey = Deno.env.get(config.envKey);
  if (!apiKey) throw new Error(`API key not configured for ${provider}`);

  // Claude has a different API format
  if (provider === "claude") {
    const systemMsg = messages.find((m) => m.role === "system");
    const nonSystemMsgs = messages.filter((m) => m.role !== "system");

    const response = await fetch(config.url, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: 8192,
        system: systemMsg?.content || "",
        messages: nonSystemMsgs,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Claude error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    return data.content?.[0]?.text || "";
  }

  // OpenAI-compatible APIs (Gemini, ChatGPT, DeepSeek, OpenRouter, Grok, Lovable)
  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      max_tokens: 8192,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`${provider} error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { step, provider, messages, context, fallbackProvider } =
      (await req.json()) as PipelineRequest;

    if (!step || !provider || !messages) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: step, provider, messages" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let result: string;
    let usedProvider = provider;

    try {
      result = await callProvider(provider, messages);
    } catch (primaryError) {
      console.error(`Primary provider ${provider} failed:`, primaryError);

      // Try fallback
      const fallback = fallbackProvider || "grok";
      try {
        result = await callProvider(fallback, messages);
        usedProvider = fallback;
        console.log(`Fallback to ${fallback} succeeded`);
      } catch (fallbackError) {
        console.error(`Fallback provider ${fallback} also failed:`, fallbackError);

        // Last resort: Lovable AI
        if (fallback !== "lovable") {
          try {
            result = await callProvider("lovable", messages);
            usedProvider = "lovable";
          } catch {
            return new Response(
              JSON.stringify({ error: "All AI providers failed. Please try again later." }),
              { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        } else {
          return new Response(
            JSON.stringify({ error: "All AI providers failed." }),
            { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }

    return new Response(
      JSON.stringify({ result, provider: usedProvider, step }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Orchestrator error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
