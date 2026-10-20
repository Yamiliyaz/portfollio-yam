import type { Lang } from "@/lib/i18n";
import type { NBlock } from "@/lib/notion";
import { Blocks } from "@/components/NotionBlocks";
import Reveal from "@/components/Reveal";

/** Descanso visual entre secciones de texto: 1 imagen a todo el ancho, 2–3 en fila, más de 3 en filas de 3. */
export default function VisualBreak({ images, lang }: { images: NBlock[]; lang: Lang }) {
  return (
    <Reveal as="div" className="proj-break" rise={40}>
      <div className={`proj-break-grid n${Math.min(3, images.length)}`}>
        {images.map((b) => (
          <div className="nb" key={b.id}>
            <Blocks blocks={[b]} lang={lang} />
          </div>
        ))}
      </div>
    </Reveal>
  );
}
