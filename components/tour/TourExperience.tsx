"use client";
import { Component, useEffect, type ReactNode } from "react";
import TourPreloader, { TourLoadError } from "./TourPreloader";
import TourHud from "./TourHud";
import TourStage from "./TourStage";
import TourScene from "./TourScene";
import { loadTourAssets } from "./loadAssets";
import { isCustomizable, tourLook, tourStore } from "./store";

class TourErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.error("Tour failed to load:", error);
  }
  render() {
    return this.state.failed ? <TourLoadError /> : this.props.children;
  }
}

function onKeyDown(e: KeyboardEvent) {
  if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
  const key = e.key.toLowerCase();
  const s = tourStore.getState();
  if (key === "q") {
    if (s.isPanelOpen) {
      tourStore.closePanel();
      return;
    }
    if (s.isHintVisible && s.activeInteraction && isCustomizable(s.activeInteraction)) {
      tourStore.openPanel(s.activeInteraction);
      if (document.pointerLockElement) document.exitPointerLock();
    }
  } else if (key === "e") {
    tourStore.interact();
  } else if (key === "escape" && s.isPanelOpen) {
    tourStore.closePanel();
  }
}

function Tour() {
  useEffect(() => {
    const abort = loadTourAssets();
    window.addEventListener("keydown", onKeyDown);
    return () => {
      abort();
      window.removeEventListener("keydown", onKeyDown);
      tourStore.reset();
      tourLook.yaw = 0;
      tourLook.pitch = 0;
    };
  }, []);

  return (
    <div className="flex h-screen w-screen">
      <TourPreloader />
      <TourHud />
      <TourStage>
        <TourScene />
      </TourStage>
    </div>
  );
}

/** /tour root (reference `ol` inside error boundary `on`). */
export default function TourExperience() {
  return (
    <TourErrorBoundary>
      <Tour />
    </TourErrorBoundary>
  );
}
