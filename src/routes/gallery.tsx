import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SiteLayout } from "@/components/carnival/SiteLayout";
import { GALLERY_IMAGES, type GalleryImage } from "@/data/gallery";

// Repeat the curated images to build a rich media wall.
const IMAGES: GalleryImage[] = Array.from({ length: 3 })
  .flatMap((_, r) =>
    GALLERY_IMAGES.map((g, i) => ({
      ...g,
      id: `${g.id}-${r}-${i}`,
    })),
  );

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — BUP CSE Tech Carnival 2.0" },
      { name: "description", content: "Photos from BUP CSE Tech Carnival events." },
      { property: "og:title", content: "Gallery — BUP CSE Tech Carnival 2.0" },
      { property: "og:description", content: "Moments from past programming contests and CTF nights." },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  const [active, setActive] = useState<null | GalleryImage>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActive(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <SiteLayout>
      <section className="section" style={{ paddingTop: 150 }}>
        <div className="sec-hdr">
          <span className="sec-num">// gallery --all</span>
          <h2 className="sec-title">
            From the <em>archives</em>
          </h2>
          <p className="sec-sub">Moments from past events.</p>
        </div>
        <div id="galleryGrid" className="simple-gallery-grid">
          {IMAGES.map((img, i) => (
            <motion.button
              key={img.id}
              className="simple-gallery-item"
              type="button"
              onClick={() => setActive(img)}
              aria-label={img.caption}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: (i % 8) * 0.04 }}
            >
              <img src={img.src} alt={img.caption} loading="lazy" />
            </motion.button>
          ))}
        </div>
      </section>

      {active && (
        <div
          id="lightbox"
          className="open"
          role="dialog"
          aria-hidden="false"
          onClick={() => setActive(null)}
        >
          <button
            id="lightboxClose"
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              setActive(null);
            }}
          >
            ×
          </button>
          <img id="lightboxImg" src={active.src} alt={active.caption} />
        </div>
      )}
    </SiteLayout>
  );
}
