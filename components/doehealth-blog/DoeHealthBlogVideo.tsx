import Image from "next/image";

import styles from "@/components/doehealth-blog/DoeHealthBlogVideo.module.css";
import { p22Mackinac, inter } from "@/lib/home/fonts";

/**
 * The desktop video screen (the lounge photo with the founders' names and the play button), set in the
 * article's hero box. The box keeps its own size and aspect ratio from `className`.
 */
export function DoeHealthBlogVideo({
  className = "",
  src = "/doehealthdesk2/newhero.jpg",
  alt = "A bright, minimal lounge with a cream curved sofa, a sculpted coffee table and a grey lounge chair by a sunlit window",
}: {
  className?: string;
  /** The photo behind the names and play button. Defaults to the lounge photo. */
  src?: string;
  alt?: string;
}) {
  return (
    <div className={`${styles.video} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 1210px, 100vw"
        priority
      />
      <div className={`${styles.person} ${styles.james} ${p22Mackinac.className}`}>
        <p className={styles.name}>James Lisondra</p>
        <p className={`${styles.role} ${inter.className}`}>Founder, Medicine</p>
      </div>
      <div className={`${styles.person} ${styles.matthew} ${p22Mackinac.className}`}>
        <p className={styles.name}>Matthew Lisondra</p>
        <p className={`${styles.role} ${inter.className}`}>Founder, Engineering</p>
      </div>
      <span className={styles.play} aria-hidden="true">
        <svg viewBox="1.35 0 24 24" fill="currentColor">
          <path d="M7.5 4.8v14.4a.9.9 0 0 0 1.37.77l11.3-7.2a.9.9 0 0 0 0-1.54L8.87 4.03A.9.9 0 0 0 7.5 4.8Z" />
        </svg>
      </span>
    </div>
  );
}
