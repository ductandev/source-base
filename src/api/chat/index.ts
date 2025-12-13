// src/api/chat/index.ts
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import {
  ChatError,
  ChatRequestDto,
  ChatResponseDto,
  chatService,
} from "@/api/chat/api";

// ============================================================================
// QUERY KEYS (optional for mutations, but keep consistent with your style)
// ============================================================================

export const chatKeys = {
  all: ["chat"] as const,
  message: () => [...chatKeys.all, "message"] as const,
};

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Mutation hook to send a chat message
 */
export function useChatMutation(): UseMutationResult<
  ChatResponseDto,
  ChatError,
  ChatRequestDto
> {
  return useMutation<ChatResponseDto, ChatError, ChatRequestDto>({
    mutationKey: chatKeys.message(),
    mutationFn: (payload) => chatService.chat(payload),
  });
}
