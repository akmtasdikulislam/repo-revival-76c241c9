import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { IconCamera, IconRotate, IconRefresh, IconWand, IconX, IconCheck } from "@tabler/icons-react";
import { getCroppedImg } from "@/lib/image-crop";


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
          className="wiz-photo-thumb !h-[70px] !w-[110px] !rounded-lg"
          style={value ? { backgroundImage: `url(${value})` } : undefined}
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
      <span className="wiz-photo-hint mt-1.5 block">
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
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-md bg-[rgba(3,10,25,0.78)]"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="flex w-[min(760px,100%)] flex-col overflow-hidden rounded-2xl border border-[color:var(--border-strong,#1f3b6b)] bg-[color:var(--surface-1,#0b1428)]">
        <header className="flex items-center justify-between border-b border-[color:var(--border-strong,#1f3b6b)] px-[18px] py-[14px]">
          <strong className="font-mono text-[13px] tracking-wider text-[color:var(--text,#cde3ff)]">
            // crop your university id card
          </strong>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="flex cursor-pointer border-0 bg-transparent p-1 text-[color:var(--muted,#6f89b6)]"
          >
            <IconX size={18} />
          </button>
        </header>

        <div className="relative h-[380px] bg-[#04091a]">
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

        <div className="grid gap-3.5 border-t border-[color:var(--border-strong,#1f3b6b)] p-4 font-mono text-xs text-[color:var(--text,#cde3ff)]">
          <label className="grid gap-1.5">
            <span className="text-[color:var(--muted,#6f89b6)]">Zoom</span>
            <input
              type="range"
              min={1}
              max={4}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <button type="button" className="wiz-btn ghost !px-3 !py-1.5 !text-[11px]" onClick={handleAutoCrop}>
              <IconWand size={14} /> Auto-crop
            </button>
            <button
              type="button"
              className="wiz-btn ghost !px-3 !py-1.5 !text-[11px]"
              onClick={() => setRotation((r) => (r + 90) % 360)}
            >
              <IconRotate size={14} /> Rotate 90°
            </button>
            <button
              type="button"
              className="wiz-btn ghost !px-3 !py-1.5 !text-[11px]"
              onClick={() => setAspect((a) => (a ? undefined : ID_ASPECT))}
            >
              <IconRefresh size={14} /> {aspect ? "Free crop" : "ID aspect"}
            </button>
          </div>
        </div>

        <footer className="flex justify-end gap-2.5 border-t border-[color:var(--border-strong,#1f3b6b)] p-3.5">
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



