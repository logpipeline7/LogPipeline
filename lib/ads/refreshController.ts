import { GoogletagSlot } from "./config";

interface RegisteredSlot {
  slotId: string;
  element: HTMLElement;
  gptSlot: GoogletagSlot;
  activeSeconds: number;
  refreshCount: number;
  isVisible: boolean;
}

export class ActiveRefreshController {
  private static instance: ActiveRefreshController | null = null;

  // 30 seconds of active visible attention per IAB standard
  private readonly REFRESH_THRESHOLD_SECONDS = 30;
  // 45 seconds of user inactivity before pausing dwell time
  private readonly IDLE_TIMEOUT_MS = 45000;

  private slots = new Map<string, RegisteredSlot>();
  private intersectionObserver: IntersectionObserver | null = null;
  private intervalTimer: NodeJS.Timeout | null = null;
  private lastActivityTimestamp = Date.now();
  private isWindowFocused = true;
  private isDocumentVisible = true;

  private boundActivityHandler: () => void;
  private boundVisibilityHandler: () => void;
  private boundFocusHandler: () => void;
  private boundBlurHandler: () => void;

  private constructor() {
    this.boundActivityHandler = this.recordUserActivity.bind(this);
    this.boundVisibilityHandler = this.handleVisibilityChange.bind(this);
    this.boundFocusHandler = this.handleFocus.bind(this);
    this.boundBlurHandler = this.handleBlur.bind(this);
  }

  public static getInstance(): ActiveRefreshController {
    if (!ActiveRefreshController.instance) {
      ActiveRefreshController.instance = new ActiveRefreshController();
    }
    return ActiveRefreshController.instance;
  }

  /**
   * Registers an ad slot for active dwell-time tracking and viewability-gated refreshing.
   */
  public registerSlot(slotId: string, element: HTMLElement, gptSlot: GoogletagSlot): void {
    if (typeof window === "undefined") return;

    this.ensureGlobalListeners();
    this.ensureObserver();

    const registered: RegisteredSlot = {
      slotId,
      element,
      gptSlot,
      activeSeconds: 0,
      refreshCount: 0,
      isVisible: false,
    };

    this.slots.set(slotId, registered);

    if (this.intersectionObserver) {
      this.intersectionObserver.observe(element);
    }

    this.ensureTicker();
  }

  /**
   * Unregisters an ad slot and cleans up observers.
   */
  public unregisterSlot(slotId: string): void {
    const slot = this.slots.get(slotId);
    if (slot) {
      if (this.intersectionObserver && slot.element) {
        this.intersectionObserver.unobserve(slot.element);
      }
      this.slots.delete(slotId);
    }

    if (this.slots.size === 0) {
      this.teardownTicker();
      this.teardownGlobalListeners();
    }
  }

  /**
   * Checks if user is currently active (interacted within 45s), tab is focused, and document visible.
   */
  public isUserAttentive(): boolean {
    if (typeof document === "undefined") return false;
    const isDocVisible = document.visibilityState === "visible";
    const hasFocus = typeof document.hasFocus === "function" ? document.hasFocus() : this.isWindowFocused;
    const isUnderIdleTimeout = Date.now() - this.lastActivityTimestamp < this.IDLE_TIMEOUT_MS;
    return isDocVisible && hasFocus && isUnderIdleTimeout;
  }

  /**
   * Ticks every second to accumulate active viewability time for each eligible slot.
   */
  private onTick(): void {
    if (!this.isUserAttentive()) {
      return;
    }

    for (const [, slot] of this.slots) {
      // Must be >= 50% visible in the viewport
      if (!slot.isVisible) {
        continue;
      }

      slot.activeSeconds += 1;

      // Trigger refresh when exactly meeting the 30-second active visible threshold
      if (slot.activeSeconds >= this.REFRESH_THRESHOLD_SECONDS) {
        slot.activeSeconds = 0;
        slot.refreshCount += 1;
        this.triggerSlotRefresh(slot);
      }
    }
  }

  /**
   * Safely triggers an ad refresh via GPT.
   */
  private triggerSlotRefresh(slot: RegisteredSlot): void {
    if (typeof window === "undefined" || !window.googletag?.pubads) return;

    window.googletag.cmd.push(() => {
      try {
        const pubads = window.googletag?.pubads?.();
        if (pubads && typeof pubads.refresh === "function") {
          pubads.refresh([slot.gptSlot]);
        }
      } catch (err) {
        console.warn(`[AdRefreshController] Failed to refresh slot ${slot.slotId}:`, err);
      }
    });
  }

  private ensureObserver(): void {
    if (this.intersectionObserver || typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const target = entry.target as HTMLElement;
          // Find matching registered slot
          for (const [, slot] of this.slots) {
            if (slot.element === target) {
              // IAB Standard: element must have at least 50% visibility
              slot.isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.50;
              break;
            }
          }
        }
      },
      {
        threshold: [0.0, 0.50, 1.0],
      }
    );
  }

  private ensureTicker(): void {
    if (!this.intervalTimer && typeof window !== "undefined") {
      this.intervalTimer = setInterval(() => this.onTick(), 1000);
    }
  }

  private teardownTicker(): void {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }
  }

  private recordUserActivity(): void {
    this.lastActivityTimestamp = Date.now();
  }

  private handleVisibilityChange(): void {
    this.isDocumentVisible = typeof document !== "undefined" && document.visibilityState === "visible";
  }

  private handleFocus(): void {
    this.isWindowFocused = true;
    this.recordUserActivity();
  }

  private handleBlur(): void {
    this.isWindowFocused = false;
  }

  private ensureGlobalListeners(): void {
    if (typeof window === "undefined") return;

    const activityEvents = ["mousemove", "keydown", "scroll", "click", "touchstart"];
    activityEvents.forEach((evt) => {
      window.addEventListener(evt, this.boundActivityHandler, { passive: true });
    });

    document.addEventListener("visibilitychange", this.boundVisibilityHandler);
    window.addEventListener("focus", this.boundFocusHandler);
    window.addEventListener("blur", this.boundBlurHandler);
  }

  private teardownGlobalListeners(): void {
    if (typeof window === "undefined") return;

    const activityEvents = ["mousemove", "keydown", "scroll", "click", "touchstart"];
    activityEvents.forEach((evt) => {
      window.removeEventListener(evt, this.boundActivityHandler);
    });

    document.removeEventListener("visibilitychange", this.boundVisibilityHandler);
    window.removeEventListener("focus", this.boundFocusHandler);
    window.removeEventListener("blur", this.boundBlurHandler);

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }
  }

  /**
   * Diagnostic helper to inspect active slot metrics in development or tests.
   */
  public getSlotStatus(slotId: string) {
    const slot = this.slots.get(slotId);
    if (!slot) return null;
    return {
      slotId: slot.slotId,
      activeSeconds: slot.activeSeconds,
      refreshCount: slot.refreshCount,
      isVisible: slot.isVisible,
      isUserAttentive: this.isUserAttentive(),
    };
  }
}
