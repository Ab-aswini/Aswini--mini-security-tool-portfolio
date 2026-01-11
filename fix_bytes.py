import os

# Byte patterns for Mojibake -> Correct UTF-8
# Based on UTF-8 bytes interpreted as Windows-1252 then re-encoded as UTF-8
replacements = [
    # â€œ -> “
    (b'\xc3\xa2\xe2\x82\xac\xc5\x93', b'\xe2\x80\x9c'),
    # â€™ -> ’
    (b'\xc3\xa2\xe2\x82\xac\xe2\x84\xa2', b'\xe2\x80\x99'),
    # â€” -> — (Em dash)
    (b'\xc3\xa2\xe2\x82\xac\xe2\x80\x9d', b'\xe2\x80\x94'),
    # â€“ -> – (En dash)
    (b'\xc3\xa2\xe2\x82\xac\xe2\x80\x93', b'\xe2\x80\x93'),
    # â€ -> ” (Right double quote) - Checking various possibilities
    # 9D in Win1252 is rarely mapped to \u009d, but often is.
    (b'\xc3\xa2\xe2\x82\xac\xc2\x9d', b'\xe2\x80\x9d'),
    
    # Emojis
    # ðŸŒ™ (Moon)
    (b'\xc3\xb0\xc5\x9f\xc5\x92\xe2\x84\xa2', b'\xf0\x9f\x8c\x99'),
    # ðŸ’» (Laptop) F0 9F 92 BB
    # F0->ð(C3 B0), 9F->Ÿ(C5 9F), 92->’(E2 80 99), BB->»(C2 BB)
    (b'\xc3\xb0\xc5\x9f\xe2\x80\x99\xc2\xbb', b'\xf0\x9f\x92\xbb'),
    # ðŸ“ˆ (Chart Increasing) F0 9F 93 88
    # 93->“(E2 80 9C), 88->ˆ(CB 86)
    (b'\xc3\xb0\xc5\x9f\xe2\x80\x9c\xcb\x86', b'\xf0\x9f\x93\x88'),
    
    # ðŸ ‹ï¸  (Lifter) F0 9F 8F 8B EF B8 8F
    # This is getting long.
    
    # Generic Fixes for strings I saw in file (e.g. Letâ€™s)
    # Letâ€™s -> Let’s
    (b'Let\xc3\xa2\xe2\x82\xac\xe2\x84\xa2s', b'Let\xe2\x80\x99s'),
    (b'I\xc3\xa2\xe2\x82\xac\xe2\x84\xa2m', b'I\xe2\x80\x99m'),
    (b'don\xc3\xa2\xe2\x82\xac\xe2\x84\xa2t', b'don\xe2\x80\x99t'),
    
    # Arrows â†’ (→) E2 86 92
    # E2->â(C3 A2), 86->†(E2 80 A0), 92->’(E2 80 99)
    (b'\xc3\xa2\xe2\x80\xa0\xe2\x80\x99', b'\xe2\x86\x92')
]

files = [
    "d:/WEBSite/aswini behera date- 7-12-2025/index.html",
    "d:/WEBSite/aswini behera date- 7-12-2025/about.html",
    "d:/WEBSite/aswini behera date- 7-12-2025/contact.html",
    "d:/WEBSite/aswini behera date- 7-12-2025/universe.html"
]

for p in files:
    try:
        if not os.path.exists(p):
            print(f"Skipping {p}")
            continue
            
        with open(p, 'rb') as f:
            content = f.read()
            
        new_content = content
        for bad, good in replacements:
            new_content = new_content.replace(bad, good)
            
        if new_content != content:
             with open(p, 'wb') as f:
                 f.write(new_content)
             print(f"Fixed {p}")
        else:
             print(f"No changes in {p}")
    except Exception as e:
        print(f"Error {p}: {e}")
