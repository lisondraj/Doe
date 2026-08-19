import { DoeHomeShaderImage } from "@/components/doehome/DoeHomeShaderImage";
import styles from "./ClinicSpecialtyWorkflowsArticle.module.css";

type ClinicSpecialtyWorkflowFigureProps = {
  shaderSrc: string;
  specialty: string;
  functionLabel: string;
  details: readonly string[];
  priority?: boolean;
};

/** Clean editorial shader figure for the specialty workflows longform article. */
export function ClinicSpecialtyWorkflowFigure({
  shaderSrc,
  priority = false,
}: ClinicSpecialtyWorkflowFigureProps) {
  return (
    <div className={styles.shader}>
      <DoeHomeShaderImage src={shaderSrc} priority={priority} />
    </div>
  );
}
