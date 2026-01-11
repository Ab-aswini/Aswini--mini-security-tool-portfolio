import os

replacements = [
    ("â€™", "’"),
    ("â€œ", "“"),
    # Handle Right Double Quote which often appears as â€ plus a hidden char or just â€
    # But usually it is â€ if 9D is mapped. 
    # Let's replace "â€" followed by space? No.
    ("â€”", "—"),
    ("ðŸŒ™", "🌙"),
    ("ðŸ’»", "💻"),
    ("ðŸ“ˆ", "📈"),
    ("ðŸ ‹ï¸ ", "🏋️"),
    ("ðŸŽ¯", "🎯"),
    ("ðŸ“‰", "📉"),
    ("ðŸ›¡ï¸ ", "🛡️"),
    ("ðŸ“ ", "📍"),
    ("ðŸŒ ", "🌐"),
    ("â†’", "→"),
    ("1ï¸ âƒ£", "1️⃣"),
    ("2ï¸ âƒ£", "2️⃣"),
    ("4ï¸ âƒ£", "4️⃣"),
    ("5ï¸ âƒ£", "5️⃣"),
    ("6ï¸ âƒ£", "6️⃣"),
    ("7ï¸ âƒ£", "7️⃣"),
    ("8ï¸ âƒ£", "8️⃣"),
    ("9ï¸ âƒ£", "9️⃣"),
    # Fallbacks for keycaps without VS16
    ("1âƒ£", "1️⃣"),
    ("2âƒ£", "2️⃣"),
    ("4âƒ£", "4️⃣"),
    ("5âƒ£", "5️⃣"),
    ("6âƒ£", "6️⃣"),
    ("7âƒ£", "7️⃣"),
    ("8âƒ£", "8️⃣"),
    ("9âƒ£", "9️⃣"),
    # General Fixes verified from files
    ("Letâ€™s", "Let’s"), 
    ("Iâ€™m", "I’m")
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
            print(f"Skipping {p}, not found")
            continue
            
        with open(p, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content
        for k, v in replacements:
            new_content = new_content.replace(k, v)
            
        # Extra pass for standalone â€ which might be part of Right Double Quote
        # If we replaced â€œ (Left) and â€” (Dash), usually â€ remaining is part of ”
        # But let's be careful.
        # "â€" followed by space or end of tag?
        # new_content = new_content.replace("â€ ", "” ") 
        
        if new_content != content:
             with open(p, 'w', encoding='utf-8') as f:
                 f.write(new_content)
             print(f"Fixed {p}")
        else:
             print(f"No changes in {p}")
    except Exception as e:
        print(f"Error processing {p}: {e}")
