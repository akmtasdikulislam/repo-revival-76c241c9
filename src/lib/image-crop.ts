import type { Area } from "react-easy-crop";

/**
 * Render a rotated + cropped region of an image to a JPEG data URL.
 * Extracted from IdCardUploader so the component stays presentation-only.
 */
export async function getCroppedImg(
  src: string,
  pixels: Area,
  rotation: number,
): Promise<string> {
  const image = await loadImage(src);
  const rad = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));

  const bBoxWidth = image.width * cos + image.height * sin;
  const bBoxHeight = image.width * sin + image.height * cos;

  const rot = document.createElement("canvas");
  rot.width = bBoxWidth;
  rot.height = bBoxHeight;
  const rctx = rot.getContext("2d")!;
  rctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  rctx.rotate(rad);
  rctx.drawImage(image, -image.width / 2, -image.height / 2);

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
