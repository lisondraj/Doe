import { BLOG_LANDING_HERO } from "@/lib/blog/blog-landing-hero-colors";

const { lineSoft, line, lineStrong, accentWarm, focal } = BLOG_LANDING_HERO;

/**
 * Hero graphic — stacked parallel horizontal lines with gentle
 * undulation and thinning rhythm. The bottom third is intentionally
 * empty so the Lora headline has clear space. Modern / boho / minimal.
 *
 * ViewBox 400 × 520. Lines occupy y = 30 … 280 (top 54 %).
 * Headline sits below y ≈ 350 so there is no overlap.
 */
export function BlogLandingHeroGraphic() {
  // Each band: y position, left-indent, right-indent, stroke color, stroke-width, opacity
  type Band = [number, number, number, string, number, number];

  const bands: Band[] = [
    // y     left  right  color        sw    op
    [ 30,    0,    0,    lineSoft,   0.55, 0.55 ],
    [ 42,    0,    0,    lineSoft,   0.55, 0.6  ],
    [ 55,   14,    0,    lineSoft,   0.6,  0.65 ],
    [ 68,    0,    0,    line,       0.7,  0.7  ],
    [ 82,    0,   22,    line,       0.7,  0.75 ],
    [ 97,    0,    0,    line,       0.75, 0.8  ],
    [113,   30,    0,    lineStrong, 0.8,  0.85 ],
    [130,    0,    0,    lineStrong, 0.85, 0.9  ],
    [148,    0,   40,    lineStrong, 0.85, 0.85 ],
    [167,    0,    0,    line,       0.8,  0.8  ],
    [187,   18,    0,    line,       0.75, 0.75 ],
    [208,    0,    0,    line,       0.7,  0.72 ],
    [230,    0,   28,    lineSoft,   0.65, 0.65 ],
    [252,    0,    0,    lineSoft,   0.6,  0.6  ],
    [275,   36,    0,    lineSoft,   0.55, 0.55 ],
    // Three accent lines — tighter spacing, slightly bolder, distinct weight
    [144,    0,    0,    accentWarm, 0.5,  0.35 ],
    [204,   18,    0,    accentWarm, 0.45, 0.28 ],
    [265,    0,   28,    accentWarm, 0.4,  0.22 ],
  ];

  // Small vertical tick marks at the left and right terminal points of select lines
  const ticks: { x: number; y: number; h: number; col: string }[] = [
    { x: 14,  y: 55,  h: 7, col: lineSoft  },
    { x: 378, y: 82,  h: 7, col: lineSoft  },
    { x: 30,  y: 113, h: 8, col: lineStrong },
    { x: 360, y: 148, h: 8, col: lineStrong },
    { x: 18,  y: 187, h: 7, col: line      },
    { x: 372, y: 230, h: 7, col: lineSoft  },
    { x: 36,  y: 275, h: 7, col: lineSoft  },
  ];

  // Small dots scattered precisely at line-left or line-right terminals
  const dots: { x: number; y: number; r: number; col: string }[] = [
    { x: 14,  y: 55,  r: 1.8, col: lineSoft   },
    { x: 378, y: 82,  r: 1.8, col: line       },
    { x: 30,  y: 113, r: 2.2, col: lineStrong },
    { x: 360, y: 148, r: 2,   col: lineStrong },
    { x: 18,  y: 187, r: 2,   col: line       },
    { x: 372, y: 230, r: 1.8, col: lineSoft   },
    { x: 36,  y: 275, r: 1.8, col: lineSoft   },
    // A few interior accent dots — on the accent band lines
    { x: 200, y: 144, r: 2.5, col: accentWarm },
    { x: 120, y: 204, r: 2,   col: focal      },
    { x: 280, y: 265, r: 1.8, col: accentWarm },
  ];

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 400 520"
      fill="none"
      preserveAspectRatio="xMidYMin meet"
      aria-hidden
    >
      {bands.map(([y, left, right, col, sw, op], i) => (
        <line
          key={i}
          x1={left} y1={y}
          x2={400 - right} y2={y}
          stroke={col}
          strokeWidth={sw}
          opacity={op}
          strokeLinecap="round"
        />
      ))}

      {ticks.map(({ x, y, h, col }, i) => (
        <line
          key={`t${i}`}
          x1={x} y1={y - h / 2}
          x2={x} y2={y + h / 2}
          stroke={col}
          strokeWidth="0.75"
          strokeLinecap="round"
          opacity={0.7}
        />
      ))}

      {dots.map(({ x, y, r, col }, i) => (
        <circle key={`d${i}`} cx={x} cy={y} r={r} fill={col} opacity={0.85} />
      ))}
    </svg>
  );
}
