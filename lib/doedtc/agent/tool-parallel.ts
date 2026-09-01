const SERIAL_TOOL_NAMES = new Set([
  "start_browser_task",
  "browser_navigate",
  "browser_act",
  "browser_computer",
  "browser_snapshot",
  "request_vault",
  "request_live_login",
  "show_session",
  "request_commit",
  "schedule_text",
  "save_guide",
  "start_accountability",
  "start_habit_workflow",
  "start_workflow",
  "propose_workflow",
]);

export function isSerialDoeDtcTool(name: string): boolean {
  return SERIAL_TOOL_NAMES.has(name);
}

export type PartitionedToolCalls<T> = {
  ordered: T[];
  parallelIndexes: number[];
  serialIndexes: number[];
};

export function partitionDoeDtcToolCalls<T extends { function: { name: string } }>(
  toolCalls: T[],
): PartitionedToolCalls<T> {
  const parallelIndexes: number[] = [];
  const serialIndexes: number[] = [];
  for (let index = 0; index < toolCalls.length; index += 1) {
    const name = toolCalls[index]?.function.name ?? "";
    if (isSerialDoeDtcTool(name)) {
      serialIndexes.push(index);
    } else {
      parallelIndexes.push(index);
    }
  }
  return { ordered: toolCalls, parallelIndexes, serialIndexes };
}

export async function executeDoeDtcToolCallsPartitioned<T extends { id: string; function: { name: string; arguments: string } }, O>(params: {
  toolCalls: T[];
  executeOne: (toolCall: T) => Promise<O>;
}): Promise<O[]> {
  const { ordered, parallelIndexes, serialIndexes } = partitionDoeDtcToolCalls(params.toolCalls);
  const outputs = new Array<O>(ordered.length);

  await Promise.all(
    parallelIndexes.map(async (index) => {
      outputs[index] = await params.executeOne(ordered[index]!);
    }),
  );

  for (const index of serialIndexes) {
    outputs[index] = await params.executeOne(ordered[index]!);
  }

  return outputs;
}
