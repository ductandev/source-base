import axiosInstance from "@/api/axios-instance";

export type ChatRequestDto = {
  message: string;

  // ✅ optional now (so AI not stuck to 1 location)
  locationName?: string;

  lang?: string; // "en" | "vi" | ...
  scenarioId?: string;
};

export type ChatResponseDto = {
  answer: string;
  suggestedActions: string[];
  lang: string; // keep only what UI really needs
};

export type ChatError = {
  message: string;
  status?: number;
};

export const chatService = {
  async chat(body: ChatRequestDto): Promise<ChatResponseDto> {
    try {
      // remove undefined keys (clean payload)
      const payload = Object.fromEntries(
        Object.entries(body).filter(([, v]) => v !== undefined && v !== ""),
      ) as ChatRequestDto;

      const { data } = await axiosInstance.post("/api/chat", payload);
      return data as ChatResponseDto;
    } catch (err: any) {
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.message || err?.message || "Chat request failed";
      throw { message: msg, status } satisfies ChatError;
    }
  },
};
