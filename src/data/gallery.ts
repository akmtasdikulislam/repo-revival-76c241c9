import img1 from "@/assets/img_20250925_wa0010.jpg.asset.json";
import img2 from "@/assets/img_0822.jpg.asset.json";
import img3 from "@/assets/img_9830.jpg.asset.json";
import img4 from "@/assets/img_9934.jpg.asset.json";

export interface GalleryImage {
  id: string;
  src: string;
  caption: string;
}

export const GALLERY_IMAGES: GalleryImage[] = [
  { id: "g1", src: img1.url, caption: "Tech Carnival 2025 — Grand stage" },
  { id: "g2", src: img2.url, caption: "Opening ceremony with BUP faculty" },
  { id: "g3", src: img3.url, caption: "IUPC lab — contest in progress" },
  { id: "g4", src: img4.url, caption: "Pair programming — final minutes" },
];
