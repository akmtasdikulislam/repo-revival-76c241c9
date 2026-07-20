import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { IconCamera, IconRotate, IconRefresh, IconWand, IconX, IconCheck } from "@tabler/icons-react";

/**
 * IdCardUploader
 * - Opens a modal cropper for University ID Card images.
 * - Features: zoom, rotate, aspect toggle (ID card 1.586:1 or free), auto-crop.
 * - Returns a base64 dataURL via `onChange` on save.
 */

type Props = {
  value: string;
  onChange: (dataUrl: string) => void;
  error?: string;
  onBlur?: () => void;
  label?: string;
};

const ID_ASPECT = 85.6 / 53.98; // CR80 standard credit-card / ID aspect

export function IdCardUploader({ value, onChange, error, onBlur, label = "University ID card photo" }: Props) {
  const [open, setOpen] = useState(false);
  const [rawSrc, setRawSrc] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  function pickFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5 MB.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setRawSrc(reader.result as string);
      setOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <div className={`wiz-field ${error ? "err" : ""}`}>
      <span>{label}</span>
      <div className="wiz-photo">
        <div
          className="wiz-photo-thumb"
          style={{
            width: 110,
            height: 70,
            borderRadius: 8,
            ...(value ? { backgroundImage: `url(${value})` } : {}),
          }}
        >
          {!value && <IconCamera size={22} />}
        </div>
        <div className="wiz-photo-actions">
          <label className="wiz-photo-btn">
            {value ? "Replace" : "Upload ID card"}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={pickFile}
              onBlur={onBlur}
            />
          </label>
          {value && (
            <button
              type="button"
              className="wiz-photo-btn secondary"
              onClick={() => {
                setRawSrc(value);
                setOpen(true);
              }}
            >
              <IconRefresh size={12} /> Re-crop
            </button>

          )}

        </div>
      </div>
      <span className="wiz-photo-hint" style={{ marginTop: 6, display: "block" }}>
        Clear photo of your ID card · JPG/PNG · max 5 MB · min 800×500 px
      </span>
      {error && <span className="wiz-err-msg">{error}</span>}

      {open && rawSrc && (
        <CropModal
          src={rawSrc}
          onCancel={() => setOpen(false)}
          onSave={(url) => {
            onChange(url);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

function CropModal({
  src,
  onCancel,
  onSave,
}: {
  src: string;
  onCancel: () => void;
  onSave: (dataUrl: string) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(ID_ASPECT);
  const [croppedPixels, setCroppedPixels] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);

  const onCropComplete = useCallback((_area: Area, pixels: Area) => {
    setCroppedPixels(pixels);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  async function handleAutoCrop() {
    // Auto-crop: reset to center, apply ID-card aspect, fit zoom.
    setAspect(ID_ASPECT);
    setRotation(0);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }

  async function handleSave() {
    if (!croppedPixels) return;
    setBusy(true);
    try {
      const url = await getCroppedImg(src, croppedPixels, rotation);
      onSave(url);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Crop ID card"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(3,10,25,0.78)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        backdropFilter: "blur(6px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div
        style={{
          width: "min(760px, 100%)",
          background: "var(--surface-1, #0b1428)",
          border: "1px solid var(--border-strong, #1f3b6b)",
          borderRadius: 16,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 18px",
            borderBottom: "1px solid var(--border-strong, #1f3b6b)",
          }}
        >
          <strong style={{ fontFamily: "var(--fm)", color: "var(--text, #cde3ff)", fontSize: 13, letterSpacing: 0.5 }}>
            // crop your university id card
          </strong>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            style={{
              background: "transparent",
              border: 0,
              color: "var(--muted, #6f89b6)",
              cursor: "pointer",
              display: "flex",
              padding: 4,
            }}
          >
            <IconX size={18} />
          </button>
        </header>

        <div style={{ position: "relative", height: 380, background: "#04091a" }}>
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            restrictPosition={false}
          />
        </div>

        <div
          style={{
            display: "grid",
            gap: 14,
            padding: 16,
            borderTop: "1px solid var(--border-strong, #1f3b6b)",
            fontFamily: "var(--fm)",
            fontSize: 12,
            color: "var(--text, #cde3ff)",
          }}
        >
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ color: "var(--muted, #6f89b6)" }}>Zoom</span>
            <input
              type="range"
              min={1}
              max={4}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
          </label>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" className="wiz-btn ghost" onClick={handleAutoCrop} style={btnSm}>
              <IconWand size={14} /> Auto-crop
            </button>
            <button
              type="button"
              className="wiz-btn ghost"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              style={btnSm}
            >
              <IconRotate size={14} /> Rotate 90°
            </button>
            <button
              type="button"
              className="wiz-btn ghost"
              onClick={() => setAspect((a) => (a ? undefined : ID_ASPECT))}
              style={btnSm}
            >
              <IconRefresh size={14} /> {aspect ? "Free crop" : "ID aspect"}
            </button>
          </div>
        </div>

        <footer
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            padding: 14,
            borderTop: "1px solid var(--border-strong, #1f3b6b)",
          }}
        >
          <button type="button" className="wiz-btn ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="wiz-btn primary" onClick={handleSave} disabled={busy || !croppedPixels}>
            <IconCheck size={14} /> {busy ? "Saving…" : "Save crop"}
          </button>
        </footer>
      </div>
    </div>
  );
}

const btnSm = { padding: "6px 12px", fontSize: 11 } as const;

async function getCroppedImg(src: string, pixels: Area, rotation: number): Promise<string> {
  const image = await loadImage(src);
  const rad = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));

  // Bounding box of rotated image
  const bBoxWidth = image.width * cos + image.height * sin;
  const bBoxHeight = image.width * sin + image.height * cos;

  // Rotate onto a canvas exactly the size of the bounding box
  const rot = document.createElement("canvas");
  rot.width = bBoxWidth;
  rot.height = bBoxHeight;
  const rctx = rot.getContext("2d")!;
  rctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  rctx.rotate(rad);
  rctx.drawImage(image, -image.width / 2, -image.height / 2);

  // Crop from the rotated canvas at pixels.{x,y,width,height}
  const canvas = document.createElement("canvas");
  canvas.width = pixels.width;
  canvas.height = pixels.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    rot,
    pixels.x,
    pixels.y,
    pixels.width,
    pixels.height,
    0,
    0,
    pixels.width,
    pixels.height,
  );
  return canvas.toDataURL("image/jpeg", 0.92);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
