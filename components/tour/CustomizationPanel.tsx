"use client";
import { cn } from "@/lib/cn";
import { furnitureGroups, tourPanel, type FurnitureKey } from "@/content/tour";
import { tourStore, useTour, type PanelTab, type TourState } from "./store";

const selectedFor: Record<FurnitureKey, (s: TourState) => string> = {
  bed: (s) => s.selectedBed,
  smallbed: (s) => s.selectedSmallBed,
  cupboard: (s) => s.selectedCupboard,
  tv: (s) => s.selectedTv,
  sofa: (s) => s.selectedSofa,
};

/** Which furniture group a looked-at object belongs to (reference: bed excludes smallbed). */
const groupMatches = (key: FurnitureKey, target: string) =>
  key === "bed" ? target.includes("bed") && !target.includes("smallbed") : target.includes(key);

function StylePicker({ group }: { group: (typeof furnitureGroups)[number] }) {
  const value = useTour(selectedFor[group.key]);
  return (
    <div>
      <h3 className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
        <span className="h-[2px] w-3 rounded-full bg-amber-400" />
        {group.label}
      </h3>
      <div className="flex gap-2">
        {group.options.map((opt) => {
          const on = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              aria-pressed={on}
              onClick={() => tourStore.setFurniture(group.key, opt.id)}
              className={cn(
                "flex-1 rounded-xl border-2 px-3 py-2.5 text-xs font-semibold tracking-wide transition-all duration-150",
                on
                  ? "border-amber-400 bg-amber-50 text-amber-700 shadow-[0_2px_10px_-2px_rgba(245,158,11,0.45)]"
                  : "border-gray-200 bg-white text-gray-500 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 hover:shadow-sm",
              )}
            >
              {opt.label.toUpperCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SurfacePicker({ target }: { target: string }) {
  const activeTab = useTour((s) => s.activeTab);
  const wallColor = useTour((s) => s.wallColor);
  const floorColor = useTour((s) => s.floorColor);

  const forced: PanelTab | null =
    target.includes("walls") && !target.includes("floor") ? "walls" : target.includes("floor") && !target.includes("walls") ? "floor" : null;
  const isWalls = forced ? forced === "walls" : activeTab === "walls";
  const palette = isWalls ? tourPanel.wallPalette : tourPanel.floorPalette;
  const current = isWalls ? wallColor : floorColor;
  const setColor = isWalls ? tourStore.setWallColor : tourStore.setFloorColor;

  return (
    <>
      {!forced && (
        <div className="mb-4 flex gap-1 rounded-xl border border-gray-200 bg-gray-100 p-1" role="tablist">
          {tourPanel.tabs.map((tab) => {
            const on = tab.key === "walls" ? isWalls : !isWalls;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => tourStore.setActiveTab(tab.key)}
                className={cn(
                  "flex-1 rounded-lg py-2 text-xs font-semibold tracking-wide transition-all duration-150",
                  on ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5" : "text-gray-400 hover:text-gray-700",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}
      <div className="flex items-center gap-4">
        {palette.map((sw) => {
          const on = current === sw.hex;
          return (
            <button
              key={sw.name}
              type="button"
              aria-pressed={on}
              onClick={() => setColor(sw.hex)}
              className="group flex shrink-0 flex-col items-center gap-2"
            >
              <span
                className={cn(
                  "relative flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-150 ease-out",
                  on ? "scale-100" : "group-hover:scale-110",
                )}
              >
                <span
                  className={cn(
                    "absolute inset-[-4px] rounded-full border-2 transition-all duration-150",
                    on ? "border-amber-400 shadow-[0_0_0_3px_rgba(251,191,36,0.25)]" : "border-transparent group-hover:border-gray-300",
                  )}
                />
                <span className="h-full w-full rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: sw.hex }} />
              </span>
              <span
                className={cn(
                  "max-w-[4.5rem] truncate text-center text-[10px] font-medium tracking-wide transition-colors",
                  on ? "text-amber-700" : "text-gray-400 group-hover:text-gray-700",
                )}
              >
                {sw.name}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

/** Customization card (reference `tG`, variant "bottom"), shown bottom-centre while `isPanelOpen`. */
export default function CustomizationPanel() {
  const open = useTour((s) => s.isPanelOpen);
  const target = useTour((s) => (s.activeInteraction ?? "").toLowerCase());
  if (!open) return null;

  const surface = target.includes("walls") || target.includes("floor");

  return (
    <div className="pointer-events-auto absolute bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div
        role="dialog"
        aria-label={tourPanel.title}
        className="flex w-full min-w-xs flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-5 pt-3 shadow-[0_-8px_40px_-10px_rgba(0,0,0,0.15)]"
      >
        <div className="mb-2">
          <h2 className="text-lg font-bold tracking-tight text-gray-900">{tourPanel.title}</h2>
        </div>
        {surface && <SurfacePicker target={target} />}
        {furnitureGroups
          .filter((g) => groupMatches(g.key, target))
          .map((g) => (
            <StylePicker key={g.key} group={g} />
          ))}
        <div className="mt-2 flex items-center justify-center gap-2 border-t border-gray-100 pt-3 text-[10px] font-medium uppercase tracking-[0.14em] text-gray-300">
          <span className="h-1 w-1 animate-pulse rounded-full bg-amber-400" />
          {tourPanel.walkAway}
        </div>
      </div>
    </div>
  );
}
