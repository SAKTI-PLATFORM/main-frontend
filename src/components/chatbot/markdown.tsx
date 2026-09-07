import type { ReactNode } from 'react'

/**
 * Minimal Markdown renderer for chatbot replies — DeepSeek emits `**bold**`,
 * numbered/bulleted lists, headings, `code`, and links. Not a full parser;
 * just the subset that shows up in answers. Text is placed as React children
 * (never dangerouslySetInnerHTML), so it is escaped automatically.
 */
export function Markdown({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  return <div className={className}>{parseBlocks(text)}</div>
}

/** Flatten Markdown to a single line of plain text — for previews/snippets. */
export function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, ' ') // code fences
    .replace(/`([^`]*)`/g, '$1') // inline code
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1') // links / images -> label
    .replace(/^\s{0,3}#{1,6}\s+/gm, '') // headings
    .replace(/^\s{0,3}>\s?/gm, '') // blockquotes
    .replace(/^\s*(?:[-*+]|\d+[.)])\s+/gm, '') // list markers
    .replace(/[*_~#>]+/g, '') // leftover emphasis / marker chars
    .replace(/\s+/g, ' ')
    .trim()
}

const ORDERED = /^\s*(\d+)[.)]\s+(.*)$/
const UNORDERED = /^\s*[-*+]\s+(.*)$/
const HEADING = /^(#{1,6})\s+(.*)$/

function parseBlocks(raw: string): ReactNode[] {
  const lines = raw.replace(/\r\n/g, '\n').split('\n')
  const blocks: ReactNode[] = []
  let paragraph: string[] = []
  let key = 0

  const flushParagraph = () => {
    if (paragraph.length === 0) return
    const buffer = paragraph
    paragraph = []
    blocks.push(
      <p key={`p-${key++}`} className="mb-3 last:mb-0">
        {buffer.flatMap((line, index) => {
          const nodes = renderInline(line, `p-${key}-${index}`)
          return index < buffer.length - 1
            ? [...nodes, <br key={`br-${key}-${index}`} />]
            : nodes
        })}
      </p>,
    )
  }

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]

    if (line.trim() === '') {
      flushParagraph()
      continue
    }

    const heading = line.match(HEADING)
    if (heading) {
      flushParagraph()
      blocks.push(
        <p
          key={`h-${key++}`}
          className="mb-2 mt-1 font-semibold text-[#26262F] first:mt-0"
        >
          {renderInline(heading[2], `h-${key}`)}
        </p>,
      )
      continue
    }

    if (ORDERED.test(line)) {
      flushParagraph()
      const items: string[] = []
      while (i < lines.length && ORDERED.test(lines[i])) {
        items.push(lines[i].match(ORDERED)![2])
        i += 1
      }
      i -= 1
      blocks.push(
        <ol
          key={`ol-${key++}`}
          className="mb-3 list-decimal space-y-1 pl-5 last:mb-0"
        >
          {items.map((item, index) => (
            <li key={index} className="pl-1">
              {renderInline(item, `ol-${key}-${index}`)}
            </li>
          ))}
        </ol>,
      )
      continue
    }

    if (UNORDERED.test(line)) {
      flushParagraph()
      const items: string[] = []
      while (i < lines.length && UNORDERED.test(lines[i])) {
        items.push(lines[i].match(UNORDERED)![1])
        i += 1
      }
      i -= 1
      blocks.push(
        <ul
          key={`ul-${key++}`}
          className="mb-3 list-disc space-y-1 pl-5 last:mb-0"
        >
          {items.map((item, index) => (
            <li key={index} className="pl-1">
              {renderInline(item, `ul-${key}-${index}`)}
            </li>
          ))}
        </ul>,
      )
      continue
    }

    paragraph.push(line)
  }

  flushParagraph()
  return blocks
}

const INLINE_PATTERNS: {
  re: RegExp
  node: (match: RegExpMatchArray, key: string) => ReactNode
}[] = [
  {
    re: /`([^`]+)`/,
    node: (m, key) => (
      <code
        key={key}
        className="rounded bg-[#F1F1F5] px-1 py-0.5 text-[13px] text-[#4138D8]"
      >
        {m[1]}
      </code>
    ),
  },
  {
    re: /\*\*(.+?)\*\*/,
    node: (m, key) => (
      <strong key={key} className="font-semibold text-[#26262F]">
        {renderInline(m[1], `${key}-b`)}
      </strong>
    ),
  },
  {
    re: /__(.+?)__/,
    node: (m, key) => (
      <strong key={key} className="font-semibold text-[#26262F]">
        {renderInline(m[1], `${key}-b`)}
      </strong>
    ),
  },
  {
    re: /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/,
    node: (m, key) => (
      <a
        key={key}
        href={m[2]}
        target="_blank"
        rel="noreferrer"
        className="text-[#4138D8] underline"
      >
        {m[1]}
      </a>
    ),
  },
  {
    re: /(?:\*([^*\s](?:[^*]*[^*\s])?)\*|_([^_\s](?:[^_]*[^_\s])?)_)/,
    node: (m, key) => (
      <em key={key}>{renderInline(m[1] ?? m[2] ?? '', `${key}-i`)}</em>
    ),
  },
]

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let rest = text
  let counter = 0

  while (rest.length > 0) {
    let best: { index: number; length: number; node: ReactNode } | null = null

    for (const pattern of INLINE_PATTERNS) {
      const match = rest.match(pattern.re)
      if (
        match &&
        match.index !== undefined &&
        (best === null || match.index < best.index)
      ) {
        best = {
          index: match.index,
          length: match[0].length,
          node: pattern.node(match, `${keyPrefix}-${counter++}`),
        }
      }
    }

    if (!best) {
      nodes.push(rest)
      break
    }

    if (best.index > 0) nodes.push(rest.slice(0, best.index))
    nodes.push(best.node)
    rest = rest.slice(best.index + best.length)
  }

  return nodes
}
