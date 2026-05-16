const _PAGE_BG = "#09090B";
const _CARD_BG = "#141417";
const _CYAN = "#06B6D4";
const _TEXT_MUTED = "rgba(255,255,255,0.30)";
const _BORDER = "rgba(255,255,255,0.07)";

const LOGOS = [
  "Brickell Group",
  "Coastal Holdings",
  "Mercato Hospitality",
  "North Star Foods",
  "Atlas Operating",
  "Verdant Brands",
  "Harbor & Co.",
  "Meridian Restaurants",
  "Olive District",
  "Westline Capital",
];

export function LogoTicker() {
  return (
    <section
      className="py-10"
      style={{
        borderTop: `1px solid ${_BORDER}`,
        borderBottom: `1px solid ${_BORDER}`,
        background: _CARD_BG,
      }}
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* Meta row — DM Mono */}
        <div className="mb-6 flex items-center justify-between">
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontWeight: 400,
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              color: _TEXT_MUTED,
            }}
          >
            Trusted by multi-unit operators
          </span>
          <span
            className="hidden sm:inline"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontWeight: 400,
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              color: _TEXT_MUTED,
            }}
          >
            110 stores · live
          </span>
        </div>

        <div className="relative overflow-hidden">
          {/* Edge fades — match card bg so they blend cleanly */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24"
            style={{
              background: `linear-gradient(to right, ${_CARD_BG}, transparent)`,
            }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24"
            style={{
              background: `linear-gradient(to left, ${_CARD_BG}, transparent)`,
            }}
          />

          {/* Ticker — DM Sans 300 Light, editorial */}
          <div className="ticker-track flex w-max gap-16 whitespace-nowrap">
            {[...LOGOS, ...LOGOS].map((l, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 300,
                  fontSize: "22px",
                  letterSpacing: "-0.02em",
                  color: _TEXT_MUTED,
                }}
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
