/** Paper ShaderMount defaults — matches @paper-design/shaders-react GrainGradient. */
export const PROTO_GRAIN_SHADER_MIN_PIXEL_RATIO = 2;

export function protoGrainColorStopsKey(colors: readonly string[]) {
  return colors.join("|");
}

export function isShaderMountContainerReady(node: HTMLElement) {
  const { width, height } = node.getBoundingClientRect();
  if (width > 1 && height > 1) {
    return true;
  }

  const parent = node.parentElement;
  if (!parent) {
    return false;
  }

  const parentRect = parent.getBoundingClientRect();
  return parentRect.width > 1 && parentRect.height > 1;
}
