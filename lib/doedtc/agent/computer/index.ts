import { Agent, tool } from "@openai/agents";
import { z } from "zod";

import {
  execInSession,
  listSessionFiles,
  readFileFromSession,
  writeFileToSession,
} from "@/lib/doedtc/doedtc-browser";
import { getDoeDtcFile } from "@/lib/doedtc/doedtc-files-db";
import { sendDoeDtcFileOutbound } from "@/lib/doedtc/doedtc-files";
import type { DoeDtcRunContext } from "@/lib/doedtc/agent/types";

export type ComputerRunContext = {
  taskText: string;
  fileIds: string[];
  sessionId: string;
  userId: string;
  chatId?: string;
  phone: string;
};

const ALLOWED_EXEC_PREFIXES = ["which ", "python3 ", "soffice ", "pdftoppm ", "qpdf ", "ls ", "cat "];

function execNeedsApproval(command: string): boolean {
  const trimmed = command.trim();
  return !ALLOWED_EXEC_PREFIXES.some((prefix) => trimmed.startsWith(prefix));
}

export function createComputerSpecialistAgent(ctx: ComputerRunContext) {
  return new Agent<ComputerRunContext>({
    name: "computer",
    instructions: `You are Doe's general computer specialist. Plan multi-step work on a cloud VM.
Task: ${ctx.taskText}
File ids available: ${ctx.fileIds.join(", ") || "none"}
Never access health profile data. Use low-level primitives only.`,
    tools: [
      tool({
        name: "computer_read_file",
        description: "Read a file from the VM.",
        parameters: z.object({ path: z.string() }),
        execute: async ({ path }, runContext) => {
          const buffer = await readFileFromSession({ sessionId: runContext.context.sessionId, path });
          return { ok: true, bytes: buffer.byteLength, preview: buffer.toString("utf8").slice(0, 500) };
        },
      }),
      tool({
        name: "computer_write_file",
        description: "Write a stored doedtc file onto the VM.",
        parameters: z.object({ path: z.string(), file_id: z.string() }),
        execute: async ({ path, file_id }, runContext) => {
          const file = await getDoeDtcFile({ userId: runContext.context.userId, fileId: file_id });
          if (!file) return { ok: false, error: "File not found." };
          const response = await fetch(file.blob_url);
          const buffer = Buffer.from(await response.arrayBuffer());
          await writeFileToSession({ sessionId: runContext.context.sessionId, path, content: buffer });
          return { ok: true, path, bytes: buffer.byteLength };
        },
      }),
      tool({
        name: "computer_list_files",
        description: "List files in a VM directory.",
        parameters: z.object({ path: z.string().default("/home/kernel") }),
        execute: async ({ path }, runContext) => {
          const files = await listSessionFiles(runContext.context.sessionId, path);
          return { ok: true, files };
        },
      }),
      tool({
        name: "computer_exec",
        description: "Run a shell command on the VM.",
        parameters: z.object({ command: z.string() }),
        needsApproval: ({ command }) => execNeedsApproval(command),
        execute: async ({ command }, runContext) => {
          const result = await execInSession({ sessionId: runContext.context.sessionId, command });
          return { ok: result.exitCode === 0, ...result };
        },
      }),
      tool({
        name: "computer_send_file",
        description: "Send a generated file back to the patient via iMessage.",
        parameters: z.object({ file_id: z.string(), caption: z.string().nullable().default(null) }),
        execute: async ({ file_id, caption }, runContext) => {
          const file = await getDoeDtcFile({ userId: runContext.context.userId, fileId: file_id });
          if (!file) return { ok: false, error: "File not found." };
          await sendDoeDtcFileOutbound({
            user: { id: runContext.context.userId, phone: runContext.context.phone } as never,
            chatId: runContext.context.chatId,
            to: runContext.context.phone,
            blobUrl: file.blob_url,
            caption: caption ?? undefined,
            idempotencyKey: `doedtc-computer-file-${file_id}-${Date.now()}`,
          });
          return { ok: true, sent: true };
        },
      }),
      tool({
        name: "computer_done",
        description: "Finish computer work with a short summary.",
        parameters: z.object({ summary: z.string() }),
        execute: async ({ summary }) => ({ ok: true, summary }),
      }),
    ],
  });
}
