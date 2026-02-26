// Defaults for agent metadata when upstream does not supply them.
// These serve as the ultimate fallback when no provider/model is configured
// via openclaw.json (agents.defaults.model). Users can override these
// through the configuration UI or by editing openclaw.json directly.
export const DEFAULT_PROVIDER = "anthropic";
export const DEFAULT_MODEL = "claude-sonnet-4-5-20250514";
// Context window: Sonnet 4.5 supports ~200k tokens (per pi-ai models.generated.ts).
export const DEFAULT_CONTEXT_TOKENS = 200_000;
