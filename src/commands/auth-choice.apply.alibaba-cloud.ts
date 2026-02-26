import type { ApplyAuthChoiceParams, ApplyAuthChoiceResult } from "./auth-choice.apply.js";
import { applyAuthChoicePluginProvider } from "./auth-choice.apply.plugin-provider.js";

export async function applyAuthChoiceAlibabaCloud(
  params: ApplyAuthChoiceParams,
): Promise<ApplyAuthChoiceResult | null> {
  if (params.authChoice === "alibaba-cloud-api-key") {
    return await applyAuthChoicePluginProvider(params, {
      authChoice: "alibaba-cloud-api-key",
      pluginId: "alibaba-cloud-auth",
      providerId: "alibaba-cloud",
      methodId: "api_key",
      label: "Alibaba Cloud",
    });
  }
  return null;
}

export async function applyAuthChoiceAlibabaCloudInternational(
  params: ApplyAuthChoiceParams,
): Promise<ApplyAuthChoiceResult | null> {
  if (params.authChoice === "alibaba-cloud-international-api-key") {
    return await applyAuthChoicePluginProvider(params, {
      authChoice: "alibaba-cloud-international-api-key",
      pluginId: "alibaba-cloud-international-auth",
      providerId: "alibaba-cloud-international",
      methodId: "api_key",
      label: "Alibaba Cloud International",
    });
  }
  return null;
}

export async function applyAuthChoiceAlibabaCloudUS(
  params: ApplyAuthChoiceParams,
): Promise<ApplyAuthChoiceResult | null> {
  if (params.authChoice === "alibaba-cloud-us-api-key") {
    return await applyAuthChoicePluginProvider(params, {
      authChoice: "alibaba-cloud-us-api-key",
      pluginId: "alibaba-cloud-us-auth",
      providerId: "alibaba-cloud-us",
      methodId: "api_key",
      label: "Alibaba Cloud US",
    });
  }
  return null;
}
