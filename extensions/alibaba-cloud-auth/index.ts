import { emptyPluginConfigSchema } from "openclaw/plugin-sdk";

const PROVIDER_ID = "alibaba-cloud";
const PROVIDER_LABEL = "Alibaba Cloud";
const DEFAULT_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1";
const SP_BASE_URL = "https://coding.dashscope.aliyuncs.com/v1"; // sk-sp- prefixed key base URL
const OAUTH_PLACEHOLDER = "alibaba-cloud-api-key";

function normalizeBaseUrl(value: string | undefined, apiKey?: string): string {
  // If API key is provided and starts with 'sk-sp-', use SP_BASE_URL
  if (apiKey && apiKey.startsWith("sk-sp-")) {
    return SP_BASE_URL;
  }
  const raw = value?.trim() || DEFAULT_BASE_URL;
  const withProtocol = raw.startsWith("http") ? raw : `https://${raw}`;
  return withProtocol.endsWith("/v1") ? withProtocol : `${withProtocol.replace(/\/+$/, "")}/v1`;
}

const alibabaCloudPlugin = {
  id: "alibaba-cloud-auth",
  name: "Alibaba Cloud Auth",
  description: "API key authentication for Alibaba Cloud (Chinese region)",
  configSchema: emptyPluginConfigSchema(),
  register(api) {
    api.registerProvider({
      id: PROVIDER_ID,
      label: PROVIDER_LABEL,
      docsPath: "/providers/alibaba-cloud",
      aliases: ["alibaba", "aliyun", "dashscope"],
      envVars: ["ALIBABA_CLOUD_API_KEY"],
      auth: [
        {
          id: "api_key",
          label: "Alibaba Cloud API Key",
          hint: "Enter your Alibaba Cloud API key",
          kind: "api_key",
          run: async (ctx) => {
            const progress = ctx.prompter.progress("Setting up Alibaba Cloud API key…");
            try {
              // Get the API key from user input
              const apiKey = await ctx.prompter.text({
                message: "Enter your Alibaba Cloud API key",
                validate: (value) => {
                  if (!value || typeof value !== "string" || value.trim().length === 0) {
                    return "API key is required";
                  }
                  return undefined;
                },
              });

              const normalizedKey = String(apiKey).trim();
              progress.update("Validating API key…");

              // Validate the API key by making a test call
              const baseUrl = normalizeBaseUrl(undefined);
              const testResponse = await fetch(`${baseUrl}/models`, {
                headers: {
                  Authorization: `Bearer ${normalizedKey}`,
                  "Content-Type": "application/json",
                },
              });

              if (!testResponse.ok) {
                const errorText = await testResponse.text();
                throw new Error(
                  `Invalid Alibaba Cloud API key: ${testResponse.status} ${errorText}`,
                );
              }

              progress.stop("Alibaba Cloud API key validated");

              const profileId = `${PROVIDER_ID}:default`;
              const normalizedBaseUrl = normalizeBaseUrl(undefined);

              return {
                profiles: [
                  {
                    profileId,
                    credential: {
                      type: "api_key",
                      provider: PROVIDER_ID,
                      apiKey: normalizedKey,
                    },
                  },
                ],
                configPatch: {
                  models: {
                    providers: {
                      [PROVIDER_ID]: {
                        baseUrl: normalizedBaseUrl,
                        apiKey: normalizedKey,
                        api: "openai-completions",
                        // Models will be discovered dynamically in models-config.providers.ts
                        models: [], // Empty initially, will be populated by discoverAlibabaCloudModels
                      },
                    },
                  },
                  agents: {
                    defaults: {
                      models: {},
                    },
                  },
                },
                defaultModel: undefined, // Will be determined by model discovery
                notes: [
                  "Alibaba Cloud API key configured successfully.",
                  `Base URL set to ${normalizedBaseUrl}.`,
                  "Models will be discovered automatically from the API.",
                ],
              };
            } catch (err) {
              progress.stop("Alibaba Cloud setup failed");
              throw err;
            }
          },
        },
      ],
    });
  },
};

export default alibabaCloudPlugin;
