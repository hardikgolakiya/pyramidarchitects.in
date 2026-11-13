"use client";
import Crosshair from "./Crosshair";
import BackToSite from "./BackToSite";
import LookPill from "./LookPill";
import TouchJoystick from "./TouchJoystick";
import { CustomizeHint, InteractHint } from "./InteractHint";
import CustomizationPanel from "./CustomizationPanel";
import KeyboardLegend from "./KeyboardLegend";
import HudStatus from "./HudStatus";
import { useIsTouch } from "./hud";

/** HUD layer (reference `t7`): absolute inset-0 z-50, pointer-events none; children opt in. */
export default function TourHud() {
  const touch = useIsTouch();
  return (
    <div className="pointer-events-none absolute inset-0 z-50">
      <Crosshair />
      <BackToSite />
      <LookPill />
      {touch && <TouchJoystick />}
      <CustomizeHint />
      <InteractHint />
      <KeyboardLegend />
      <HudStatus />
      <CustomizationPanel />
    </div>
  );
}
