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
const GOLD = "#F59E0B";
const WHITE = "#FFFFFF";

export const Concept3 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeScale = spring({ frame, fps, config: { damping: 12, stiffness: 150 } });
  const badgeOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  const bonusOpacity = interpolate(frame, [60, 80], [0, 1], { extrapolateRight: "clamp" });
  const bonusY = interpolate(frame, [60, 85], [60, 0], { extrapolateRight: "clamp" });

  const depositOpacity = interpolate(frame, [130, 150], [0, 1], { extrapolateRight: "clamp" });

  const limitedOpacity = interpolate(frame, [200, 220], [0, 1], { extrapolateRight: "clamp" });
  const limitedPulse = interpolate(frame, [220, 450], [1, 1.06], { extrapolateRight: "clamp" });

  const ctaOpacity = interpolate(frame, [300, 320], [0, 1], { extrapolateRight: "clamp" });
  const ctaScale = spring({ frame: frame - 300, fps, config: { damping: 12, stiffness: 150 } });

  const shimmer = interpolate(frame, [0, 450], [-200, 1200], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(145deg, ${NAVY} 0%, #071324 60%, #0a1a2e 100%)`,
        fontFamily: inter.fontFamily,
        overflow: "hidden",
      }}
    >
      {/* Gold accent glow */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)`,
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Shimmer line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: 120,
          background: `linear-gradient(90deg, transparent, rgba(245,158,11,0.12), transparent)`,
          transform: `skewX(-20deg) translateX(${shimmer}px)`,
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

      {/* Limited badge */}
      <div
        style={{
          position: "absolute",
          top: 360,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: badgeOpacity,
          transform: `scale(${badgeScale})`,
        }}
      >
        <div
          style={{
            background: GOLD,
            borderRadius: 16,
            padding: "16px 48px",
            transform: "rotate(-3deg)",
          }}
        >
          <p style={{ color: NAVY, fontSize: 42, margin: 0, fontWeight: 900, letterSpacing: 3 }}>
            THIS WEEK ONLY
          </p>
        </div>
      </div>

      {/* $200 Bonus */}
      <div
        style={{
          position: "absolute",
          top: 560,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: bonusOpacity,
          transform: `translateY(${bonusY}px)`,
        }}
      >
        <h1
          style={{
            fontFamily: oswald.fontFamily,
            color: GOLD,
            fontSize: 160,
            margin: 0,
            textShadow: "0 0 60px rgba(245,158,11,0.4)",
          }}
        >
          $200 BONUS
        </h1>
      </div>

      {/* Deposit detail */}
      <div
        style={{
          position: "absolute",
          top: 820,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: depositOpacity,
        }}
      >
        <p style={{ color: WHITE, fontSize: 54, margin: 0, fontWeight: 700 }}>
          Deposit <span style={{ color: EMERALD }}>$10</span> → Get{" "}
          <span style={{ color: GOLD }}>$200</span>
        </p>
      </div>

      {/* Limited spots */}
      <div
        style={{
          position: "absolute",
          top: 1000,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: limitedOpacity,
          transform: `scale(${limitedPulse})`,
        }}
      >
        <p style={{ color: "#fca5a5", fontSize: 56, margin: 0, fontWeight: 800 }}>
          Limited spots left
        </p>
      </div>

      {/* CTA */}
      <div
        style={{
          position: "absolute",
          bottom: 180,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: ctaOpacity,
          transform: `scale(${ctaScale})`,
        }}
      >
        <div
          style={{
            background: "linear-gradient(90deg, #ef4444, #dc2626)",
            borderRadius: 70,
            padding: "34px 80px",
            boxShadow: "0 20px 60px rgba(220,38,38,0.35)",
          }}
        >
          <p style={{ color: WHITE, fontSize: 50, margin: 0, fontWeight: 800 }}>
            Tap link in bio NOW
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
