export interface GalleryImage {
  id: string;
  src: string;
  caption: string;
}

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: "g1",
    src: "/gallery/img_20250925_wa0010.jpg",
    caption: "Tech Carnival 2025 — Grand stage",
  },
  {
    id: "g2",
    src: "/gallery/img_0822.jpg",
    caption: "Opening ceremony with BUP faculty",
  },
  {
    id: "g3",
    src: "/gallery/img_9830.jpg",
    caption: "IUPC lab — contest in progress",
  },
  {
    id: "g4",
    src: "/gallery/img_9934.jpg",
    caption: "Pair programming — final minutes",
  },
];

export const GALLERY_IMAGES_FULL: GalleryImage[] = [
  ...GALLERY_IMAGES,
  {
    id: "g5",
    src: "/gallery/event_01.png",
    caption: "Project showcase — CSE club booth",
  },
  {
    id: "g6",
    src: "/gallery/event_02.png",
    caption: "Gaming arena — competitive lineup",
  },
  {
    id: "g7",
    src: "/gallery/event_03.png",
    caption: "Guest welcome — bouquet handover",
  },
  {
    id: "g8",
    src: "/gallery/event_05.png",
    caption: "BUP Computer Programming Club team",
  },
  {
    id: "g9",
    src: "/gallery/event_08.jpg",
    caption: "Auditorium — packed opening session",
  },
];
