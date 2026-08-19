import { DoeHomeShaderImage } from "@/components/doehome/DoeHomeShaderImage";
import styles from "./ClinicSpecialtyWorkflowsArticle.module.css";

type ClinicSpecialtyWorkflowFigureProps = {
  shaderSrc: string;
  specialty: string;
  functionLabel: string;
  details: readonly string[];
  priority?: boolean;
};

/** Specialty UI mock for about-style shader figures. */
export function ClinicSpecialtyWorkflowFigure({
  shaderSrc,
  specialty,
  functionLabel,
  details,
  priority = false,
}: ClinicSpecialtyWorkflowFigureProps) {
  return (
    <div className={styles.shader}>
      <DoeHomeShaderImage src={shaderSrc} priority={priority} />
      <div className={styles.glass} aria-hidden="true">
        <div className={styles.ui}>
          <div className={styles.uiHeader}>
            <span>{specialty}</span>
            <b>Doe</b>
          </div>
          <strong>{functionLabel}</strong>
          <ul>
            {details.map((detail, detailIndex) => (
              <li key={detail}>
                <i className={detailIndex === 0 ? styles.active : undefined} />
                {detail}
              </li>
            ))}
          </ul>
          <div className={styles.uiFooter}>
            <span>Ready for review</span>
            <em>Open</em>
          </div>
        </div>
      </div>
    </div>
  );
}
