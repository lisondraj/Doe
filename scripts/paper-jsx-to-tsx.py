#!/usr/bin/env python3
"""Convert Paper MCP inline-styles JSX dumps into Next.js TSX components."""
from __future__ import annotations

from pathlib import Path

ROOT = Path("/Users/jameslisondra/Desktop/Doe")
DUMPS = ROOT / "scripts/paper-dumps"
OUT = ROOT / "components/productemr/paper"
OUT.mkdir(parents=True, exist_ok=True)

REPLACEMENTS = (
    ("stop-color", "stopColor"),
    ("stroke-width", "strokeWidth"),
    ("stroke-dasharray", "strokeDasharray"),
    ("stroke-linecap", "strokeLinecap"),
    ("stroke-linejoin", "strokeLinejoin"),
    ("clip-path", "clipPath"),
    ("fill-rule", "fillRule"),
    ("clip-rule", "clipRule"),
)


def sanitize(jsx: str) -> str:
    jsx = jsx.strip()
    if jsx.startswith("(") and jsx.endswith(")"):
        jsx = jsx[1:-1].strip()
    for old, new in REPLACEMENTS:
        jsx = jsx.replace(old, new)
    return jsx


def add_root_class(jsx: str, class_name: str, *, width_100: bool = False) -> str:
    idx = jsx.find("<div ")
    if idx < 0:
        raise ValueError("root div not found")
    end = jsx.find("}}>", idx)
    if end < 0:
        raise ValueError("root style tag not closed")
    tag = jsx[idx : end + 3]
    if width_100:
        if "width: '0px'" not in tag:
            raise ValueError("root width 0px not found")
        tag = tag.replace("width: '0px'", "width: '100%'", 1)
    tag = tag.replace("<div ", f'<div className="{class_name}" ', 1)
    return jsx[:idx] + tag + jsx[end + 3 :]


def add_class_on_first(jsx: str, opening_tag: str, class_name: str) -> str:
    if opening_tag not in jsx:
        raise ValueError(f"opening tag not found: {opening_tag[:80]!r}")
    patched = opening_tag.replace("<div ", f'<div className="{class_name}" ', 1)
    return jsx.replace(opening_tag, patched, 1)


def add_class_on_close_glyph(jsx: str, class_name: str) -> str:
    marker = "\n          ×\n"
    pos = jsx.find(marker)
    if pos < 0:
        raise ValueError("close glyph not found")
    div_start = jsx.rfind("<div ", 0, pos)
    if div_start < 0:
        raise ValueError("close glyph wrapper not found")
    tag_end = jsx.find("}}>", div_start)
    if tag_end < 0 or tag_end > pos:
        raise ValueError("close glyph style tag not closed")
    tag = jsx[div_start : tag_end + 3]
    if "height: '28px'" not in tag or "width: '28px'" not in tag:
        raise ValueError("close glyph wrapper is not 28x28")
    tag = tag.replace("<div ", f'<div className="{class_name}" ', 1)
    return jsx[:div_start] + tag + jsx[tag_end + 3 :]


def write_component(name: str, jsx: str) -> Path:
    indented = "\n".join(("    " + line if line else line) for line in jsx.splitlines())
    src = f'''"use client";

export function {name}() {{
  return (
{indented}
  );
}}
'''
    path = OUT / f"{name}.tsx"
    path.write_text(src)
    print(f"wrote {path} ({path.stat().st_size} bytes)")
    return path


def transform_notes(jsx: str) -> str:
    jsx = add_root_class(jsx, "productemr-paper-stage productemr-paper-notes", width_100=True)
    lead = (
        "<div style={{ alignItems: 'center', backgroundColor: '#FFFFFF2E', borderRadius: '10px', "
        "boxSizing: 'border-box', display: 'flex', flexShrink: '0', gap: '10px', height: '44px', "
        "paddingLeft: '10px', paddingRight: '14px', width: '100%' }}>"
    )
    return add_class_on_first(jsx, lead, "productemr-notes-row--lead")


def transform_coverage(jsx: str) -> str:
    jsx = add_root_class(jsx, "productemr-paper-stage productemr-paper-coverage", width_100=True)
    if "width: '767px'" not in jsx:
        raise ValueError("hero 767px not found")
    if "width: '756px'" not in jsx:
        raise ValueError("ledger 756px not found")
    jsx = jsx.replace("width: '767px'", "width: '100%'", 1)
    jsx = jsx.replace("width: '756px'", "width: '100%'", 1)
    return jsx


def transform_chat(jsx: str) -> str:
    jsx = add_root_class(jsx, "productemr-paper-sheet productemr-paper-chat")
    return add_class_on_close_glyph(jsx, "productemr-sheet-close")


def transform_a1c(jsx: str) -> str:
    jsx = add_root_class(jsx, "productemr-paper-sheet productemr-paper-a1c")
    return add_class_on_close_glyph(jsx, "productemr-sheet-close")


def transform_patients(jsx: str) -> str:
    jsx = add_root_class(jsx, "productemr-paper-patients")
    elena_row = (
        "<div style={{ alignItems: 'center', borderTopColor: '#FFFFFF2E', borderTopStyle: 'solid', "
        "borderTopWidth: '1px', boxSizing: 'border-box', display: 'flex', flexGrow: '1', gap: '18px', "
        "height: '0px', minHeight: '0px', width: '100%' }}>\n"
        "            <div style={{ boxSizing: 'border-box', color: '#FFFFFF', flexShrink: '0', "
        "fontFamily: '\"Inter-Regular_Medium\", \"Inter\", system-ui, sans-serif', fontSize: '15px', "
        "fontWeight: 500, lineHeight: '20px', textShadow: '#0F172A57 0px 1px 2px, #FFFFFF3D 0px -1px 0px', "
        "width: '62px' }}>\n"
        "              8:20"
    )
    if elena_row not in jsx:
        raise ValueError("Elena 8:20 row not found")
    jsx = jsx.replace(
        elena_row,
        elena_row.replace("<div ", '<div className="productemr-elena-hit" ', 1),
        1,
    )
    ace = (
        "<div style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', "
        "flexShrink: '0', gap: '8px', paddingBottom: '6px', width: '100%' }}>"
    )
    return add_class_on_first(jsx, ace, "productemr-elena-hit")


COMPONENTS = {
    "ProductEmrPaperNotes": ("notes.jsx", transform_notes),
    "ProductEmrPaperCoverage": ("coverage.jsx", transform_coverage),
    "ProductEmrPaperChat": ("chat.jsx", transform_chat),
    "ProductEmrPaperA1c": ("a1c.jsx", transform_a1c),
    "ProductEmrPaperPatients": ("patients.jsx", transform_patients),
}


def main() -> None:
    for name, (fname, transform) in COMPONENTS.items():
        raw = (DUMPS / fname).read_text()
        jsx = transform(sanitize(raw))
        write_component(name, jsx)


if __name__ == "__main__":
    main()
