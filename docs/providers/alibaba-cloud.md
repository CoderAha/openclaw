# Alibaba Cloud Provider

Alibaba Cloud (also known as Aliyun) provides access to Qwen and other AI models through the DashScope platform. This provider supports both Chinese and International regions.

## Getting Started

### Alibaba Cloud (China Region)
1. Visit the [Alibaba Cloud Console](https://home.console.aliyun.com/)
2. Navigate to the Model Studio (DashScope)
3. Go to the API-Key management page
4. Create a new API key or use an existing one
5. Use the API key when prompted during configuration

### Alibaba Cloud International
1. Visit the [Alibaba Cloud International Console](https://www.alibabacloud.com/)
2. Navigate to the DashScope service
3. Go to the API-Key management page
4. Create a new API key or use an existing one
5. Use the API key when prompted during configuration

## Configuration

The Alibaba Cloud provider can be configured through the interactive onboarding process:

```bash
clawdbot onboard
```

During the process, you'll be able to select:
- "Alibaba Cloud API key" for the Chinese region
- "Alibaba Cloud International API key" for the international region

Alternatively, you can set the API key directly using environment variables:

- For Chinese region: `ALIBABA_CLOUD_API_KEY`
- For International region: `ALIBABA_CLOUD_INTERNATIONAL_API_KEY`

## Endpoints

- **Chinese Region**: `https://dashscope.aliyuncs.com/compatible-mode/v1`
- **International Region**: `https://dashscope-intl.aliyuncs.com/compatible-mode/v1`

Both endpoints are OpenAI-compatible, allowing access to models like Qwen series, Tongyi series, and other AI services provided by Alibaba Cloud.

## Supported Models

The provider will automatically discover available models from Alibaba Cloud's API. Commonly available models include:

- Qwen series (Qwen, Qwen2, Qwen-Max, Qwen-Plus, etc.)
- Tongyi series
- Image generation models
- Speech recognition models
- And more depending on your region and access permissions

## Notes

- The Chinese region endpoint is subject to Chinese regulations and may have different model availability compared to the international region
- Some models may require additional permissions or subscriptions in the Alibaba Cloud Console
- API usage is billed according to your Alibaba Cloud account's billing plan