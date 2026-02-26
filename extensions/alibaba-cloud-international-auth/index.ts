import { emptyPluginConfigSchema } from "openclaw/plugin-sdk";

const PROVIDER_ID = "alibaba-cloud-international";
const PROVIDER_LABEL = "Alibaba Cloud International";
const DEFAULT_BASE_URL = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1";
const SP_BASE_URL = "https://coding-intl.dashscope.aliyuncs.com/v1"; // sk-sp- prefixed key base URL for international
const OAUTH_PLACEHOLDER = "alibaba-cloud-intl-api-key";

function normalizeBaseUrl(value: string | undefined, apiKey?: string): string {
  // If API key is provided and starts with 'sk-sp-', use SP_BASE_URL for international
  if (apiKey && apiKey.startsWith("sk-sp-")) {
    return SP_BASE_URL;
  }
  const raw = value?.trim() || DEFAULT_BASE_URL;
  const withProtocol = raw.startsWith("http") ? raw : `https://${raw}`;
  return withProtocol.endsWith("/v1") ? withProtocol : `${withProtocol.replace(/\/+$/, "")}/v1`;
}

const alibabaCloudInternationalPlugin = {
  id: "alibaba-cloud-international-auth",
  name: "Alibaba Cloud International Auth",
  description: "API key authentication for Alibaba Cloud International (Global region)",
  configSchema: emptyPluginConfigSchema(),
  register(api) {
    api.registerProvider({
      id: PROVIDER_ID,
      label: PROVIDER_LABEL,
      docsPath: "/providers/alibaba-cloud",
      aliases: ["alibaba-intl", "aliyun-intl", "dashscope-intl"],
      envVars: ["ALIBABA_CLOUD_INTERNATIONAL_API_KEY"],
      auth: [
        {
          id: "api_key",
          label: "Alibaba Cloud International API Key",
          hint: "Enter your Alibaba Cloud International API key",
          kind: "api_key",
          run: async (ctx) => {
            const progress = ctx.prompter.progress(
              "Setting up Alibaba Cloud International API key…",
            );
            try {
              // Get the API key from user input
              const apiKey = await ctx.prompter.text({
                message: "Enter your Alibaba Cloud International API key",
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
                  `Invalid Alibaba Cloud International API key: ${testResponse.status} ${errorText}`,
                );
              }

              progress.stop("Alibaba Cloud International API key validated");

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
                  "Alibaba Cloud International API key configured successfully.",
                  `Base URL set to ${normalizedBaseUrl}.`,
                  "Models will be discovered automatically from the API.",
                ],
              };
            } catch (err) {
              progress.stop("Alibaba Cloud International setup failed");
              throw err;
            }
          },
        },
      ],
    });
  },
};

export default alibabaCloudInternationalPlugin;
