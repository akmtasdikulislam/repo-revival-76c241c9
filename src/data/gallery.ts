import img1 from "@/assets/img_20250925_wa0010.jpg.asset.json";
import img2 from "@/assets/img_0822.jpg.asset.json";
import img3 from "@/assets/img_9830.jpg.asset.json";
import img4 from "@/assets/img_9934.jpg.asset.json";
import event01 from "@/assets/event_01.png.asset.json";
import event02 from "@/assets/event_02.png.asset.json";
import event03 from "@/assets/event_03.png.asset.json";
import event05 from "@/assets/event_05.png.asset.json";
import event08 from "@/assets/event_08.jpg.asset.json";

export interface GalleryImage {
  id: string;
  src: string;
  caption: string;
}

// Home page preview keeps its original 4-tile layout — do not extend.
export const GALLERY_IMAGES: GalleryImage[] = [
  { id: "g1", src: img1.url, caption: "Tech Carnival 2025 — Grand stage" },
  { id: "g2", src: img2.url, caption: "Opening ceremony with BUP faculty" },
  { id: "g3", src: img3.url, caption: "IUPC lab — contest in progress" },
  { id: "g4", src: img4.url, caption: "Pair programming — final minutes" },
];

// Full gallery page — includes every archived photo.
export const GALLERY_IMAGES_FULL: GalleryImage[] = [
  ...GALLERY_IMAGES,
  { id: "g5", src: event01.url, caption: "Project showcase — CSE club booth" },
  { id: "g6", src: event02.url, caption: "Gaming arena — competitive lineup" },
  { id: "g7", src: event03.url, caption: "Guest welcome — bouquet handover" },
  { id: "g8", src: event05.url, caption: "BUP Computer Programming Club team" },
  { id: "g9", src: event08.url, caption: "Auditorium — packed opening session" },
];
