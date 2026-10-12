import type { ReactNode } from "react";
import type { NBlock } from "@/lib/notion";
import type { Lang } from "@/lib/i18n";
import { localizeRich, plainText } from "@/lib/bilingual";
import FigmaEmbed, { figmaEmbedUrl } from "./FigmaEmbed";

/* Espejo del cuerpo de la página de Notion: mismos bloques, mismo orden. */

const safeHref = (h?: string | null) => (h && /^(https?:|mailto:)/i.test(h) ? h : undefined);
const plain = (rich: any[] = []) => rich.map((t) => t.plain_text).join("");

export function Rich({ text, lang }: { text: any[]; lang?: Lang }) {
  const segs = lang ? localizeRich(text, lang) : text;
  return (
    <>
      {segs.map((t, i) => {
        const a = t.annotations ?? {};
        let node: ReactNode = t.plain_text;
        if (a.code) node = <code>{node}</code>;
        if (a.bold) node = <strong>{node}</strong>;
        if (a.italic) node = <em>{node}</em>;
        if (a.strikethrough) node = <s>{node}</s>;
        if (a.underline) node = <u>{node}</u>;
        const href = safeHref(t.href);
        if (href) node = <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">{node}</a>;
        return <span key={i}>{node}</span>;
      })}
    </>
  );
}

const isPending = (b: NBlock) => b.type === "callout" && /pendiente/i.test(plain(b.callout.rich_text));
const isHeading = (b: NBlock) => /^heading_[123]$/.test(b.type);
const level = (b: NBlock) => Number(b.type.slice(-1));

/** Quita avisos "⚠️ Pendiente" (notas de trabajo) y los encabezados que se quedan sin contenido. */
export function cleanBlocks(blocks: NBlock[]): NBlock[] {
  const kept = blocks.filter((b) => !isPending(b));
  return kept.filter((b, i) => {
    if (!isHeading(b)) return true;
    const next = kept[i + 1];
    return !!next && !(isHeading(next) && level(next) <= level(b));
  });
}

export type Section = { id: string; title: string; blocks: NBlock[] };

/** Agrupa por encabezados de nivel 1–2; lo anterior al primero queda sin título. */
export function toSections(blocks: NBlock[], lang: Lang): Section[] {
  const out: Section[] = [];
  const used = new Set<string>();
  let cur: Section = { id: "introduction", title: "", blocks: [] };
  const push = () => (cur.title || cur.blocks.length) && out.push(cur);
  for (const b of cleanBlocks(blocks)) {
    if (b.type === "heading_1" || b.type === "heading_2") {
      push();
      const title = plainText(localizeRich(b[b.type].rich_text, lang));
      let id = title.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
      while (used.has(id)) id += "-2";
      used.add(id);
      cur = { id, title, blocks: [] };
    } else cur.blocks.push(b);
  }
  push();
  return out;
}

function Children({ b, lang }: { b: NBlock; lang: Lang }) {
  return b.children?.length ? <Blocks blocks={b.children} lang={lang} /> : null;
}

function mediaUrl(m: any): string {
  return m?.type === "external" ? m.external.url : m?.file?.url ?? "";
}

export function Blocks({ blocks, lang }: { blocks: NBlock[]; lang: Lang }) {
  const nodes: ReactNode[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === "bulleted_list_item" || b.type === "numbered_list_item") {
      const type = b.type;
      const items: NBlock[] = [];
      while (i < blocks.length && blocks[i].type === type) items.push(blocks[i++]);
      i--;
      const Tag = type === "bulleted_list_item" ? "ul" : "ol";
      nodes.push(
        <Tag key={b.id} className="nb-list">
          {items.map((it) => (
            <li key={it.id}><Rich text={it[type].rich_text} lang={lang} /><Children b={it} lang={lang} /></li>
          ))}
        </Tag>,
      );
      continue;
    }
    nodes.push(<Block key={b.id} b={b} lang={lang} />);
  }
  return <>{nodes}</>;
}

function Block({ b, lang }: { b: NBlock; lang: Lang }) {
  switch (b.type) {
    case "paragraph":
      return plain(b.paragraph.rich_text) || b.children?.length ? (
        <><p className="nb-p"><Rich text={b.paragraph.rich_text} lang={lang} /></p><Children b={b} lang={lang} /></>
      ) : null;
    case "heading_3":
      return <h3 className="nb-h3"><Rich text={b.heading_3.rich_text} lang={lang} /></h3>;
    case "heading_1":
    case "heading_2":
      return <h3 className="nb-h3"><Rich text={b[b.type].rich_text} lang={lang} /></h3>;
    case "to_do":
      return (
        <p className="nb-p nb-todo"><input type="checkbox" checked={b.to_do.checked} readOnly aria-label="" /> <Rich text={b.to_do.rich_text} lang={lang} /></p>
      );
    case "toggle":
      return (
        <details className="nb-toggle"><summary><Rich text={b.toggle.rich_text} lang={lang} /></summary><Children b={b} lang={lang} /></details>
      );
    case "quote":
      return <blockquote className="nb-quote"><Rich text={b.quote.rich_text} lang={lang} /><Children b={b} lang={lang} /></blockquote>;
    case "callout":
      return (
        <aside className="nb-callout">
          {b.callout.icon?.type === "emoji" && <span aria-hidden="true">{b.callout.icon.emoji}</span>}
          <div><p className="nb-p"><Rich text={b.callout.rich_text} lang={lang} /></p><Children b={b} lang={lang} /></div>
        </aside>
      );
    case "divider":
      return <hr className="nb-hr" />;
    case "code":
      return <pre className="nb-code"><code>{plain(b.code.rich_text)}</code></pre>;
    case "image": {
      const src = mediaUrl(b.image);
      return src ? (
        <figure className="nb-figure">
          <img src={src} alt={plain(b.image.caption) || ""} loading="lazy" />
          {b.image.caption?.length > 0 && <figcaption><Rich text={b.image.caption} lang={lang} /></figcaption>}
        </figure>
      ) : null;
    }
    case "video": {
      const v = b.video;
      if (v.type === "file") return <figure className="nb-figure"><video src={v.file.url} controls playsInline preload="metadata" /></figure>;
      const url = v.external?.url;
      return url ? <p className="nb-p"><a href={safeHref(url)} target="_blank" rel="noopener noreferrer">{plain(v.caption) || url}</a></p> : null;
    }
    case "embed": {
      const url = b.embed.url as string;
      if (figmaEmbedUrl(url)) return <FigmaEmbed url={url} title={plain(b.embed.caption) || "Figma"} />;
      return <p className="nb-p"><a href={safeHref(url)} target="_blank" rel="noopener noreferrer">{plain(b.embed.caption) || url}</a></p>;
    }
    case "bookmark":
    case "link_preview": {
      const url = b[b.type].url as string;
      return <p className="nb-p"><a href={safeHref(url)} target="_blank" rel="noopener noreferrer">{plain(b[b.type].caption) || url}</a></p>;
    }
    case "file":
    case "pdf": {
      const url = mediaUrl(b[b.type]);
      return url ? <p className="nb-p"><a href={url} target="_blank" rel="noopener noreferrer">{plain(b[b.type].caption) || b[b.type].name || "Download"}</a></p> : null;
    }
    case "column_list":
      return <div className="nb-cols">{(b.children ?? []).map((c: NBlock) => <div key={c.id}><Children b={c} lang={lang} /></div>)}</div>;
    case "table": {
      const rows: NBlock[] = b.children ?? [];
      return (
        <div className="nb-table-wrap">
          <table className="nb-table">
            <tbody>
              {rows.map((r, ri) => (
                <tr key={r.id}>
                  {r.table_row.cells.map((cell: any[], ci: number) => {
                    const head = (b.table.has_column_header && ri === 0) || (b.table.has_row_header && ci === 0);
                    const Cell = head ? "th" : "td";
                    return <Cell key={ci}><Rich text={cell} lang={lang} /></Cell>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    default:
      return null;
  }
}
