import { dmSans } from "@/lib/home/fonts";

/** Meet Doe Float — clinic collections window, cropped right + bottom. */
export function StoryMeetDoeFloatDashboard() {
  return (
    <div className="story-meet-doe-float-dashboard" aria-hidden="true">
      <div className={`story-meet-doe-float-dashboard__window ${dmSans.className}`}>
        <div className="story-meet-doe-float-dashboard__topline">
          <span className="story-meet-doe-float-dashboard__live">
            <i />
            Live
          </span>
        </div>

        <div className="story-meet-doe-float-dashboard__hero">
          <span className="story-meet-doe-float-dashboard__kicker">This week</span>
          <p className={`story-meet-doe-float-dashboard__amount m-0 ${dmSans.className}`}>
            $284,120
          </p>
          <span className={`story-meet-doe-float-dashboard__delta ${dmSans.className}`}>+12.4%</span>
        </div>
      </div>

      <div className="story-meet-doe-float-dashboard__visual">
        <svg
          className="story-meet-doe-float-dashboard__visual-chart"
          viewBox="0 0 200 80"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="story-float-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(232, 192, 142, 0.7)" />
              <stop offset="100%" stopColor="rgba(212, 137, 63, 0.1)" />
            </linearGradient>
          </defs>
          <path
            d="M0,58 L12,54 L24,56 L36,46 L48,48 L60,36 L72,38 L84,28 L96,30 L108,20 L120,22 L132,12 L144,14 L156,8 L168,10 L180,5 L192,7 L200,4 L200,80 L0,80 Z"
            fill="url(#story-float-area)"
          />
          <path
            d="M0,58 L12,54 L24,56 L36,46 L48,48 L60,36 L72,38 L84,28 L96,30 L108,20 L120,22 L132,12 L144,14 L156,8 L168,10 L180,5 L192,7 L200,4"
            fill="none"
            stroke="#f0d4a2"
            strokeWidth="1.4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
