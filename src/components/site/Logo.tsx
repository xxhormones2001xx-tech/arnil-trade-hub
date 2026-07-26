import logo from "@/assets/logo-arnil.png";

export function Logo({ className = "h-9 w-auto", invert = false }: { className?: string; invert?: boolean }) {
  return (
    <img
      src={logo}
      alt="Arnil Etrade"
      width={1408}
      height={512}
      className={`${className} ${invert ? "brightness-0 invert" : ""}`}
    />
  );
}
