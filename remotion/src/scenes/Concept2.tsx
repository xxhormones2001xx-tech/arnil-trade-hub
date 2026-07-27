import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Img,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";

const inter = loadFont("normal", { weights: ["400", "700"], subsets: ["latin"] });
const oswald = loadOswald("normal", { weights: ["700"], subsets: ["latin"] });

const NAVY = "#0A2540";
const EMERALD = "#10B981";
const WHITE = "#FFFFFF";

export const Concept2 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tenOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const tenScale = spring({ frame, fps, config: { damping: 12, stiffness: 150 } });

  const arrowOpacity = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" });
  const arrowX = interpolate(frame, [40, 70], [-100, 0], { extrapolateRight: "clamp" });

  const twoHundredOpacity = interpolate(frame, [80, 100], [0, 1], { extrapolateRight: "clamp" });
  const twoHundredScale = spring({ frame: frame - 80, fps, config: { damping: 10, stiffness: 180 } });

  const glowOpacity = interpolate(frame, [100, 160], [0, 1], { extrapolateRight: "clamp" });

  const withdrawOpacity = interpolate(frame, [180, 200], [0, 1], { extrapolateRight: "clamp" });
  const unlockScale = spring({ frame: frame - 180, fps, config: { damping: 14, stiffness: 130 } });

  const ctaOpacity = interpolate(frame, [260, 280], [0, 1], { extrapolateRight: "clamp" });
  const ctaY = interpolate(frame, [280, 300], [60, 0], { extrapolateRight: "clamp" });

  const chartProgress = interpolate(frame, [120, 300], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${NAVY} 0%, #081829 100%)`,
        fontFamily: inter.fontFamily,
        overflow: "hidden",
      }}
    >
      {/* Subtle grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(16,185,129,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16,185,129,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Logo */}
      <Img
        src={staticFile("images/logo-arnil.png")}
        style={{
          position: "absolute",
          top: 60,
          left: 60,
          width: 260,
          objectFit: "contain",
        }}
      />

      {/* $10 */}
      <div
        style={{
          position: "absolute",
          top: 420,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: tenOpacity,
          transform: `scale(${tenScale})`,
        }}
      >
        <span
          style={{
            fontFamily: oswald.fontFamily,
            color: "#94a3b8",
            fontSize: 120,
          }}
        >
          $10
        </span>
      </div>

      {/* Arrow */}
      <div
        style={{
          position: "absolute",
          top: 580,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: arrowOpacity,
          transform: `translateX(${arrowX}px)`,
        }}
      >
        <span style={{ color: EMERALD, fontSize: 100, fontWeight: 800 }}>→</span>
      </div>

      {/* $200 */}
      <div
        style={{
          position: "absolute",
          top: 720,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: twoHundredOpacity,
          transform: `scale(${twoHundredScale})`,
        }}
      >
        <span
          style={{
            fontFamily: oswald.fontFamily,
            color: EMERALD,
            fontSize: 180,
            textShadow: "0 0 80px rgba(16,185,129,0.5)",
          }}
        >
          $200
        </span>
      </div>

      {/* Glow line chart */}
      <svg
        width={1080}
        height={300}
        style={{
          position: "absolute",
          bottom: 420,
          left: 0,
          opacity: glowOpacity,
        }}
      >
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={EMERALD} stopOpacity={0.2} />
            <stop offset="100%" stopColor={EMERALD} stopOpacity={1} />
          </linearGradient>
        </defs>
        <path
          d={`M 0 250 Q ${200 * chartProgress} ${250 - 80 * chartProgress} ${400 * chartProgress} ${200 - 100 * chartProgress} T ${1080 * chartProgress} ${120 - 60 * chartProgress}`}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth={8}
          strokeLinecap="round"
        />
      </svg>

      {/* Withdraw anytime */}
      <div
        style={{
          position: "absolute",
          top: 1080,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: withdrawOpacity,
          transform: `scale(${unlockScale})`,
        }}
      >
        <p style={{ color: WHITE, fontSize: 52, margin: 0, fontWeight: 700 }}>
          Withdraw anytime
        </p>
      </div>

      {/* CTA */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: ctaOpacity,
          transform: `translateY(${ctaY}px)`,
        }}
      >
        <div
          style={{
            background: EMERALD,
            borderRadius: 70,
            padding: "32px 80px",
            boxShadow: "0 20px 60px rgba(16,185,129,0.35)",
          }}
        >
          <p style={{ color: NAVY, fontSize: 48, margin: 0, fontWeight: 800 }}>
            Open Instant Access
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
