import "../../shared/theme.css";
import "./styles.css";
import { LuckyWheel, type Segment } from "./wheel";

const STORAGE_KEY = "lucky-wheel-segments";

function getStoredSegments(): string[] | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

function saveSegments(segments: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(segments));
}

function init(): void {
  const canvas = document.getElementById("wheel-canvas") as HTMLCanvasElement;
  const spinBtn = document.getElementById("spin-btn") as HTMLButtonElement;
  const resultDiv = document.getElementById("result") as HTMLDivElement;
  const resultText = document.getElementById("result-text") as HTMLSpanElement;
  const segmentsInput = document.getElementById(
    "segments-input",
  ) as HTMLTextAreaElement;
  const updateBtn = document.getElementById("update-btn") as HTMLButtonElement;

  if (
    !canvas ||
    !spinBtn ||
    !resultDiv ||
    !resultText ||
    !segmentsInput ||
    !updateBtn
  ) {
    console.error("Missing required elements");
    return;
  }

  const wheel = new LuckyWheel(canvas);

  // Load stored segments or use defaults
  const storedSegments = getStoredSegments();
  if (storedSegments) {
    wheel.setSegments(storedSegments);
    segmentsInput.value = storedSegments.join("\n");
  } else {
    segmentsInput.value = [
      "Giải nhất",
      "Giải nhì",
      "Giải ba",
      "Chúc may mắn",
      "Thử lại",
      "Giải khuyến khích",
    ].join("\n");
  }

  // Handle result
  wheel.setOnResult((segment: Segment) => {
    resultText.textContent = segment.label;
    resultDiv.classList.remove("hidden");
    resultDiv.classList.add("show");
  });

  // Spin button
  spinBtn.addEventListener("click", () => {
    if (wheel.isCurrentlySpinning()) return;

    resultDiv.classList.remove("show");
    resultDiv.classList.add("hidden");
    wheel.spin();
  });

  // Update segments
  updateBtn.addEventListener("click", () => {
    const lines = segmentsInput.value
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length < 2) {
      alert("Vui lòng nhập ít nhất 2 mục");
      return;
    }

    if (lines.length > 12) {
      alert("Tối đa 12 mục");
      return;
    }

    wheel.setSegments(lines);
    saveSegments(lines);
    resultDiv.classList.remove("show");
    resultDiv.classList.add("hidden");
  });

  // Handle resize
  let resizeTimeout: ReturnType<typeof setTimeout>;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      wheel.resize();
    }, 200);
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
