/** Paper ShaderMount defaults — matches @paper-design/shaders-react GrainGradient. */
export const PROTO_GRAIN_SHADER_MIN_PIXEL_RATIO = 2;

export function protoGrainColorStopsKey(colors: readonly string[]) {
  return colors.join("|");
}
