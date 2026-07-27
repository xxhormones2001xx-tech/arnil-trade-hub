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

export const Concept1 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const hookOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const hookY = interpolate(frame, [0, 25], [40, 0], { extrapolateRight: "clamp" });

  const bonusScale = spring({ frame: frame - 50, fps, config: { damping: 12, stiffness: 150 } });
  const bonusOpacity = interpolate(frame, [50, 70], [0, 1], { extrapolateRight: "clamp" });

  const depositOpacity = interpolate(frame, [130, 150], [0, 1], { extrapolateRight: "clamp" });
  const depositX = interpolate(frame, [130, 155], [-60, 0], { extrapolateRight: "clamp" });

  const accountOpacity = interpolate(frame, [210, 230], [0, 1], { extrapolateRight: "clamp" });
  const accountScale = spring({ frame: frame - 210, fps, config: { damping: 15, stiffness: 120 } });

  const ctaOpacity = interpolate(frame, [290, 310], [0, 1], { extrapolateRight: "clamp" });
  const ctaPulse = interpolate(frame, [310, 450], [1, 1.08], { extrapolateRight: "clamp" });

  const bgProgress = interpolate(frame, [0, 450], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${NAVY} 0%, #0d1f33 50%, #081829 100%)`,
        fontFamily: inter.fontFamily,
        overflow: "hidden",
      }}
    >
      {/* Animated emerald glow */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)`,
          left: `${20 + bgProgress * 40}%`,
          top: `${10 + bgProgress * 30}%`,
          transform: "translate(-50%, -50%)",
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

      {/* Hook text */}
      <div
        style={{
          position: "absolute",
          top: 360,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: hookOpacity,
          transform: `translateY(${hookY}px)`,
          padding: "0 80px",
        }}
      >
        <p style={{ color: "#94a3b8", fontSize: 44, margin: 0, lineHeight: 1.3 }}>
          Trading fees eating your profits?
        </p>
      </div>

      {/* Bonus headline */}
      <div
        style={{
          position: "absolute",
          top: 560,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: bonusOpacity,
          transform: `scale(${bonusScale})`,
        }}
      >
        <h1
          style={{
            fontFamily: oswald.fontFamily,
            color: EMERALD,
            fontSize: 140,
            margin: 0,
            lineHeight: 0.95,
            textShadow: "0 0 60px rgba(16,185,129,0.4)",
          }}
        >
          $200
        </h1>
        <h2
          style={{
            fontFamily: oswald.fontFamily,
            color: WHITE,
            fontSize: 80,
            margin: 0,
            letterSpacing: 2,
          }}
        >
          WELCOME BONUS
        </h2>
      </div>

      {/* Deposit detail */}
      <div
        style={{
          position: "absolute",
          top: 920,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: depositOpacity,
          transform: `translateX(${depositX}px)`,
        }}
      >
        <p style={{ color: WHITE, fontSize: 56, margin: 0, fontWeight: 700 }}>
          Deposit just{" "}
          <span style={{ color: EMERALD, fontSize: 72 }}>$10</span>
        </p>
      </div>

      {/* Account badge */}
      <div
        style={{
          position: "absolute",
          top: 1080,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: accountOpacity,
          transform: `scale(${accountScale})`,
        }}
      >
        <div
          style={{
            background: "rgba(16,185,129,0.15)",
            border: `3px solid ${EMERALD}`,
            borderRadius: 24,
            padding: "24px 56px",
          }}
        >
          <p style={{ color: EMERALD, fontSize: 48, margin: 0, fontWeight: 700 }}>
            Instant Access Account
          </p>
        </div>
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
          transform: `scale(${ctaPulse})`,
        }}
      >
        <div
          style={{
            background: EMERALD,
            borderRadius: 70,
            padding: "32px 90px",
            boxShadow: "0 20px 60px rgba(16,185,129,0.35)",
          }}
        >
          <p style={{ color: NAVY, fontSize: 52, margin: 0, fontWeight: 800 }}>
            Link in bio →
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
