"""Regenerate Cardano Bridges and Sidechains thumbnail via Runware Nano Banana Pro.

Image-to-image edit of the existing thumbnail:
- Remove the word "UPDATE:"
- Remove "#WEAREALLCONNECTED"
- Keep everything else (logos, 3D coin, gradient dots, dark navy bg, font)
- Output 3:2 aspect ratio
"""

from __future__ import annotations

import base64
import json
import sys
from pathlib import Path

sys.path.insert(0, "C:/Users/georg/.claude/skills/image-generation")
from runware_direct import run_inference  # noqa: E402

REF_PATH = Path("public/images/sidechains/sidechain-thumbnail.png")
OUT_PATH = Path("public/images/sidechains/sidechain-thumbnail-v2.png")

ref_b64 = base64.b64encode(REF_PATH.read_bytes()).decode("ascii")
ref_data_uri = f"data:image/png;base64,{ref_b64}"

PROMPT = (
    "Edit this thumbnail. Make EXACTLY these two changes and nothing else: "
    "(1) remove the cyan word 'UPDATE:' completely - delete it entirely, no text in its place; "
    "(2) remove the green hashtag '#WEAREALLCONNECTED' completely - delete it entirely, no text in its place. "
    "Keep the white headline 'CARDANO BRIDGES AND SIDECHAINS' exactly as it is, same font, same weight, same position, same line breaks. "
    "Keep the wanchain x CARDANO partner-lockup at top-left exactly as it is. "
    "Keep the dark navy background with the subtle hexagonal pattern. "
    "Keep the 3D rendered Cardano coin/ring on the right side exactly as it is, same metallic purple-blue finish, same lighting, same tilt. "
    "Keep all the colorful gradient dot patterns at the corners (cyan, purple, magenta, pink, yellow, lime green) exactly as they are. "
    "Output at 3:2 aspect ratio. "
    "Pixel-precise crisp vector typography, perfect kerning, razor-sharp text, no fuzzy edges, no doubled letters."
)

NEGATIVE = (
    "the word UPDATE, the word UPDATE:, hashtag, #weareallconnected, "
    "#WEAREALLCONNECTED, cyan UPDATE label, green hashtag text, "
    "lorem ipsum, placeholder text, duplicated text, gibberish letters, "
    "misspelled words, jpeg artifacts, watermark"
)

result = run_inference(
    PROMPT,
    slug="cardano-bridges-sidechains-thumb",
    negative_prompt=NEGATIVE,
    model="google:4@2",
    width=2528,
    height=1696,
    output_format="PNG",
    extra={"referenceImages": [ref_data_uri]},
)

print(json.dumps({k: v for k, v in result.items() if k != "data"}, indent=2))
for entry in result.get("data", []):
    print(f"image: {entry.get('imageURL')}")
    print(f"cost: ${entry.get('cost')}")
    print(f"archive_png: {entry.get('archive_png')}")
    if entry.get("archive_png"):
        archived = Path(entry["archive_png"])
        OUT_PATH.write_bytes(archived.read_bytes())
        print(f"copied to: {OUT_PATH}")
