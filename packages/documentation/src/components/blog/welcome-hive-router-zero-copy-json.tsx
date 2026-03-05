"use client";

import type { ReactNode } from "react";

import { useMemo, useState } from "react";

type JsonValue =
  | JsonValue[]
  | { [key: string]: JsonValue }
  | boolean
  | number
  | string
  | null;

function enc(str: string) {
  return new TextEncoder().encode(str);
}

// --- Colors (tweaked for compact contrast) ---
const COLORS = {
  bool: "#60a5fa",
  key: "#8b93ff",
  null: "#9ca3af",
  number: "#f59e0b",
  string: "#34d399",
} as const;

// --- Build stable IDs for keys & primitive values using JSON Pointer‑like paths ---
function isPrimitive(v: unknown): v is boolean | number | string | null {
  return (
    v === null ||
    typeof v === "string" ||
    typeof v === "number" ||
    typeof v === "boolean"
  );
}
function keyId(path: string, key: string) {
  return `${path}/${key}#key`;
}
function valId(path: string, key: string) {
  return `${path}/${key}#value`;
}
function idxValId(path: string, i: number) {
  return `${path}/${i}#value`;
}

// --- Serialize to MINIFIED JSON while recording byte slices per key/value ---
function escapeJSONString(s: string) {
  // escape backslashes first, then quotes
  return s.replaceAll("\\", "\\\\").replaceAll('"', String.raw`\"`);
}

type ByteMapEntry = {
  kind: keyof typeof COLORS;
  len: number;
  localId: string;
  start: number;
};

function serializeWithByteMap(val: JsonValue) {
  const entries: ByteMapEntry[] = [];
  let out = "";
  let bytePos = 0; // running UTF‑8 length
  const push = (chunk: string) => {
    out += chunk;
    bytePos += enc(chunk).length;
  };

  const walk = (v: JsonValue, path: string) => {
    if (Array.isArray(v)) {
      push("[");
      for (const [idx, item] of v.entries()) {
        if (isPrimitive(item)) {
          if (typeof item === "string") {
            push('"');
            const content = escapeJSONString(item);
            const start = bytePos;
            push(content);
            const len = enc(content).length;
            entries.push({
              kind: "string",
              len,
              localId: idxValId(path, idx),
              start,
            });
            push('"');
          } else if (typeof item === "number") {
            const text = String(item);
            const start = bytePos;
            push(text);
            const len = enc(text).length;
            entries.push({
              kind: "number",
              len,
              localId: idxValId(path, idx),
              start,
            });
          } else if (typeof item === "boolean") {
            const text = item ? "true" : "false";
            const start = bytePos;
            push(text);
            const len = enc(text).length;
            entries.push({
              kind: "bool",
              len,
              localId: idxValId(path, idx),
              start,
            });
          } else if (item === null) {
            const text = "null";
            const start = bytePos;
            push(text);
            const len = enc(text).length;
            entries.push({
              kind: "null",
              len,
              localId: idxValId(path, idx),
              start,
            });
          }
        } else {
          walk(item, `${path}/${idx}`);
        }
        if (idx < v.length - 1) push(",");
      }
      push("]");
      return;
    }

    if (v && typeof v === "object") {
      push("{");
      const keys = Object.keys(v);
      for (const [i, k] of keys.entries()) {
        // key
        push('"');
        const kEsc = escapeJSONString(k);
        const kStart = bytePos;
        push(kEsc);
        const kLen = enc(kEsc).length;
        entries.push({
          kind: "key",
          len: kLen,
          localId: keyId(path, k),
          start: kStart,
        });
        push('"');
        push(":");
        const child = (v as Record<string, JsonValue>)[k]!;
        if (isPrimitive(child)) {
          if (typeof child === "string") {
            push('"');
            const content = escapeJSONString(child);
            const start = bytePos;
            push(content);
            const len = enc(content).length;
            entries.push({
              kind: "string",
              len,
              localId: valId(path, k),
              start,
            });
            push('"');
          } else if (typeof child === "number") {
            const text = String(child);
            const start = bytePos;
            push(text);
            const len = enc(text).length;
            entries.push({
              kind: "number",
              len,
              localId: valId(path, k),
              start,
            });
          } else if (typeof child === "boolean") {
            const text = child ? "true" : "false";
            const start = bytePos;
            push(text);
            const len = enc(text).length;
            entries.push({ kind: "bool", len, localId: valId(path, k), start });
          } else if (child === null) {
            const text = "null";
            const start = bytePos;
            push(text);
            const len = enc(text).length;
            entries.push({ kind: "null", len, localId: valId(path, k), start });
          }
        } else {
          walk(child, `${path}/${k}`);
        }
        if (i < keys.length - 1) push(",");
      }
      push("}");
      return;
    }

    // primitive at root (rare for us but handle anyway)
    if (typeof v === "string") {
      push('"');
      const content = escapeJSONString(v);
      const start = bytePos;
      push(content);
      const len = enc(content).length;
      entries.push({ kind: "string", len, localId: `${path}#value`, start });
      push('"');
    } else if (typeof v === "number") {
      const text = String(v);
      const start = bytePos;
      push(text);
      const len = enc(text).length;
      entries.push({ kind: "number", len, localId: `${path}#value`, start });
    } else if (typeof v === "boolean") {
      const text = v ? "true" : "false";
      const start = bytePos;
      push(text);
      const len = enc(text).length;
      entries.push({ kind: "bool", len, localId: `${path}#value`, start });
    } else if (v === null) {
      const text = "null";
      const start = bytePos;
      push(text);
      const len = enc(text).length;
      entries.push({ kind: "null", len, localId: `${path}#value`, start });
    }
  };

  walk(val, "");
  return { entries, json: out };
}

// --- Module-scope constants (stable across renders) ---
const subgraphA: JsonValue = {
  active: true,
  user: { email: "ada@lab", id: 1, name: "Ada" },
};

const finalJson: JsonValue = {
  active: true,
  user: { id: 1, name: "Ada" },
};

let _adata: ReturnType<typeof serializeWithByteMap> | undefined;
let _mapA:
  | Map<string, { kind: keyof typeof COLORS; len: number; start: number }>
  | undefined;

function getAdata() {
  _adata ||= serializeWithByteMap(subgraphA);
  return _adata;
}

function getMapA() {
  if (!_mapA) {
    _mapA = new Map();
    for (const e of getAdata().entries)
      _mapA.set(e.localId, { kind: e.kind, len: e.len, start: e.start });
  }
  return _mapA;
}

const FINAL_MAP = new Map<string, string>([
  ["/active#key", "A:/active#key"],
  ["/active#value", "A:/active#value"],
  ["/price#key", "B:/price#key"],
  ["/price#value", "B:/price#value"],
  ["/user#key", "A:/user#key"],
  ["/user/id#key", "A:/user/id#key"],
  ["/user/id#value", "A:/user/id#value"],
  ["/user/name#key", "A:/user/name#key"],
  ["/user/name#value", "A:/user/name#value"],
  ["/user/tags#key", "B:/user/tags#key"],
  ["/user/tags/0#value", "B:/user/tags/0#value"],
  ["/user/tags/1#value", "B:/user/tags/1#value"],
]);

type IdMapperInfo = {
  index?: number;
  key?: string;
  kind: "index" | "key" | "value";
  path: string;
};

function idMapperFinal(info: IdMapperInfo) {
  if (info.kind === "key" && info.key)
    return FINAL_MAP.get(`${info.path}/${info.key}#key`);
  if (info.kind === "value" && info.key)
    return FINAL_MAP.get(`${info.path}/${info.key}#value`);
  if (info.kind === "index" && typeof info.index === "number")
    return FINAL_MAP.get(`${info.path}/${info.index}#value`);
  return;
}

function sliceLookup(gid: string) {
  if (gid.startsWith("A:")) {
    const local = gid.slice(2);
    const e = getMapA().get(local);
    if (!e) return null;
    return { len: e.len, src: "A" as const, start: e.start };
  }
  return null;
}

// --- Pretty JSON renderer with colored spans and cross‑highlight ---
function JsonBlock({
  hoverId,
  idMapper,
  idPrefix = "",
  pretty,
  setHoverId,
  sliceLookup: sliceLookupFn,
  title,
  value,
}: {
  hoverId: string | null;
  idMapper?: (info: IdMapperInfo) => string | null | undefined;
  idPrefix?: string;
  pretty: boolean;
  setHoverId: (id: string | null) => void;
  sliceLookup?: (
    globalId: string,
  ) => { len: number; src: "A" | "B"; start: number } | null;
  title?: string;
  value: JsonValue;
}) {
  let keySeq = 0;
  const K = () => keySeq++;

  const RefChip = ({ gid }: { gid: string }) => {
    if (!sliceLookupFn) return null;
    const info = sliceLookupFn(gid);
    if (!info) return null;
    return (
      <span
        className="ml-1 rounded-sm border border-neutral-700 bg-neutral-800 px-1 py-0.5 align-middle text-[10px]"
        onMouseEnter={() => setHoverId(gid)}
        onMouseLeave={() => setHoverId(null)}
        title={`References ${info.src} slice(${info.start}, ${info.len})`}
      >
        {info.src}: {info.start}…{info.start + info.len - 1}
      </span>
    );
  };

  const coloredSpan = (text: string, kind: keyof typeof COLORS, id: string) => {
    const color = COLORS[kind];
    const active = hoverId === id;
    return (
      <span
        key={K()}
        onMouseEnter={() => setHoverId(id)}
        onMouseLeave={() => setHoverId(null)}
        style={{
          background: color + (active ? "55" : "22"),
          border: `1px solid ${color}`,
          borderColor: color + (active ? "" : "66"),
          borderRadius: 5,
          padding: "0 3px",
        }}
      >
        {text}
      </span>
    );
  };

  const renderVal = (
    v: JsonValue,
    path: string,
    indent: number,
  ): ReactNode[] => {
    const pad = "  ".repeat(indent);
    const parts: ReactNode[] = [];
    if (Array.isArray(v)) {
      parts.push(<span key={K()}>[</span>);
      if (pretty) {
        parts.push(<span key={K()}>{"\n"}</span>);
      }
      for (const [idx, item] of v.entries()) {
        if (pretty) {
          parts.push(<span key={K()}>{pad + "  "}</span>);
        }
        if (isPrimitive(item)) {
          const localId = idxValId(path, idx);
          const globalId = idMapper
            ? idMapper({ index: idx, kind: "index", path }) ||
              `${idPrefix}${localId}`
            : `${idPrefix}${localId}`;
          const kind: keyof typeof COLORS =
            typeof item === "string"
              ? "string"
              : typeof item === "number"
                ? "number"
                : typeof item === "boolean"
                  ? "bool"
                  : "null";
          if (typeof item === "string") parts.push(<span key={K()}>"</span>);
          parts.push(coloredSpan(String(item), kind, globalId));
          if (typeof item === "string") parts.push(<span key={K()}>"</span>);
          if (sliceLookupFn) parts.push(<RefChip gid={globalId} key={K()} />);
        } else {
          parts.push(...renderVal(item, `${path}/${idx}`, indent + 1));
        }
        parts.push(<span key={K()}>{idx < v.length - 1 ? "," : ""}</span>);
        if (pretty) {
          parts.push(<span key={K()}>{"\n"}</span>);
        }
      }
      if (pretty) {
        parts.push(<span key={K()}>{pad}</span>);
      }
      parts.push(<span key={K()}>]</span>);
      return parts;
    }
    if (v && typeof v === "object") {
      const keys = Object.keys(v);
      parts.push(<span key={K()}>{"{"}</span>);
      if (pretty) {
        parts.push(<span key={K()}>{"\n"}</span>);
      }
      for (const [idx, k] of keys.entries()) {
        const localKeyId = keyId(path, k);
        const keyGlobalId = idMapper
          ? idMapper({ key: k, kind: "key", path }) ||
            `${idPrefix}${localKeyId}`
          : `${idPrefix}${localKeyId}`;
        if (pretty) {
          parts.push(<span key={K()}>{pad + "  "}</span>);
        }
        parts.push(
          <span key={K()}>"</span>,
          coloredSpan(k, "key", keyGlobalId),
          <span key={K()}>"</span>,
          <span key={K()}>:</span>,
        );
        const v2 = (v as Record<string, JsonValue>)[k]!;
        if (isPrimitive(v2)) {
          const localValId = valId(path, k);
          const valGlobalId = idMapper
            ? idMapper({ key: k, kind: "value", path }) ||
              `${idPrefix}${localValId}`
            : `${idPrefix}${localValId}`;
          const kind: keyof typeof COLORS =
            typeof v2 === "string"
              ? "string"
              : typeof v2 === "number"
                ? "number"
                : typeof v2 === "boolean"
                  ? "bool"
                  : "null";
          if (typeof v2 === "string") parts.push(<span key={K()}>"</span>);
          parts.push(coloredSpan(String(v2), kind, valGlobalId));
          if (typeof v2 === "string") parts.push(<span key={K()}>"</span>);
          if (sliceLookupFn)
            parts.push(<RefChip gid={valGlobalId} key={K()} />);
        } else {
          parts.push(...renderVal(v2, `${path}/${k}`, indent + 1));
        }
        parts.push(<span key={K()}>{idx < keys.length - 1 ? "," : ""}</span>);
        if (pretty) {
          parts.push(<span key={K()}>{"\n"}</span>);
        }
      }
      if (pretty) {
        parts.push(<span key={K()}>{pad}</span>);
      }
      parts.push(<span key={K()}>{"}"}</span>);
      return parts;
    }
    // primitive at root
    const localId = `${path}#value`;
    const globalId = idMapper
      ? idMapper({ kind: "value", path }) || `${idPrefix}${localId}`
      : `${idPrefix}${localId}`;
    const kind: keyof typeof COLORS =
      typeof v === "string"
        ? "string"
        : typeof v === "number"
          ? "number"
          : typeof v === "boolean"
            ? "bool"
            : "null";
    if (typeof v === "string") parts.push(<span key={K()}>"</span>);
    parts.push(coloredSpan(String(v), kind, globalId));
    if (typeof v === "string") parts.push(<span key={K()}>"</span>);
    if (sliceLookupFn) parts.push(<RefChip gid={globalId} key={K()} />);
    return parts;
  };

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-slate-100 shadow-sm">
      {title && (
        <h3 className="mb-1 text-sm font-medium tracking-wide text-slate-200">
          {title}
        </h3>
      )}
      <pre className="max-h-40 overflow-auto rounded-lg border border-neutral-800 bg-[#111111] p-2 font-mono text-[12px]/5 text-neutral-200">
        {renderVal(value, "", 0)}
      </pre>
    </div>
  );
}

// --- Byte buffer renderer for a subgraph (auto‑scales to card width) ---
function ByteBuffer({
  entries,
  hoverId,
  idPrefix,
  json,
  setHoverId,
  title,
}: {
  entries: ByteMapEntry[];
  hoverId: string | null;
  idPrefix: "A:" | "B:";
  json: string;
  setHoverId: (id: string | null) => void;
  title: string;
}) {
  const bytes = useMemo(() => enc(json), [json]);
  const PX = 6;
  const H = 12;
  const viewW = Math.max(bytes.length * PX, 1);
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-neutral-100">
      <div className="flex items-baseline justify-between">
        <h3 className="mb-1 text-sm font-medium tracking-wide text-slate-200">
          {title}
        </h3>
      </div>
      <div className="mt-2 border border-neutral-800 bg-[#111111]">
        <svg
          className="block"
          height={H + 8}
          preserveAspectRatio="none"
          viewBox={`0 0 ${viewW} ${H + 8}`}
          width="100%"
        >
          <rect fill="#111111" height={H + 8} width={viewW} x={0} y={0} />
          {Array.from(bytes, (_, i) => (
            <rect
              fill="#111111"
              height={H}
              key={i}
              width={PX - 1}
              x={i * PX}
              y={4}
            />
          ))}
          {entries.map((e, i) => {
            const x = e.start * PX;
            const w = Math.max(2, e.len * PX);
            const gid = `${idPrefix}${e.localId}`;
            const active = hoverId === gid;
            return (
              <rect
                fill={COLORS[e.kind] + (active ? "66" : "33")}
                height={H}
                key={i}
                onMouseEnter={() => setHoverId(gid)}
                onMouseLeave={() => setHoverId(null)}
                stroke={COLORS[e.kind]}
                strokeWidth={active ? 2 : 1}
                width={w}
                x={x}
                y={4}
              />
            );
          })}
        </svg>
      </div>
      <p className="mt-1 text-xs text-neutral-400">
        Colored bars are <strong>byte slices</strong>. Final response references
        these offsets; no copies.
      </p>
    </div>
  );
}

export function ZeroCopyBlocks() {
  const [hoverId, setHoverId] = useState<string | null>(null);

  return (
    <div className="w-full p-4 text-neutral-100">
      <div className="space-y-4">
        {/* Row 1: Subgraph A */}
        <section>
          <div className="space-y-2">
            <JsonBlock
              hoverId={hoverId}
              idPrefix="A:"
              pretty={false}
              setHoverId={setHoverId}
              title="Subgraph response as JSON"
              value={subgraphA}
            />
            <ByteBuffer
              entries={getAdata().entries}
              hoverId={hoverId}
              idPrefix="A:"
              json={getAdata().json}
              setHoverId={setHoverId}
              title="Subgraph response is stored as bytes"
            />
          </div>
        </section>

        {/* Row 3: Final full‑width */}
        <section>
          <div>
            <JsonBlock
              hoverId={hoverId}
              idMapper={idMapperFinal}
              pretty
              setHoverId={setHoverId}
              sliceLookup={sliceLookup}
              title="Final Response (reuses the bytes from subgraph response)"
              value={finalJson}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
