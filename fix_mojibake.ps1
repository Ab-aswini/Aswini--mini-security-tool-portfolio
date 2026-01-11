$files = @(
    "d:\WEBSite\aswini behera date- 7-12-2025\index.html",
    "d:\WEBSite\aswini behera date- 7-12-2025\about.html",
    "d:\WEBSite\aswini behera date- 7-12-2025\contact.html",
    "d:\WEBSite\aswini behera date- 7-12-2025\universe.html"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # 1. Quotes and Dashes
        $content = $content -replace "â€™", "’"
        $content = $content -replace "â€œ", "“"
        $content = $content -replace "â€", "”"
        $content = $content -replace "â€”", "—"
        $content = $content -replace "â€“", "–"
        
        # 2. Arrows and Keycaps
        $content = $content -replace "â†’", "→"
        $content = $content -replace "1ï¸ âƒ£", "1️⃣"
        $content = $content -replace "2ï¸ âƒ£", "2️⃣"
        $content = $content -replace "4ï¸ âƒ£", "4️⃣"
        $content = $content -replace "5ï¸ âƒ£", "5️⃣"
        $content = $content -replace "6ï¸ âƒ£", "6️⃣"
        $content = $content -replace "7ï¸ âƒ£", "7️⃣"
        $content = $content -replace "8ï¸ âƒ£", "8️⃣"
        $content = $content -replace "9ï¸ âƒ£", "9️⃣"
        
        # 3. Emojis (specifics)
        $content = $content -replace "ðŸŒ™", "🌙"
        $content = $content -replace "ðŸ’»", "💻"
        $content = $content -replace "ðŸ“ˆ", "📈"
        $content = $content -replace "ðŸ ‹ï¸ ", "🏋️"
        $content = $content -replace "ðŸŽ¯", "🎯"
        $content = $content -replace "ðŸ“‰", "📉"
        $content = $content -replace "ðŸ›¡ï¸ ", "🛡️"
        
        # 4. Contact.html specifics
        $content = $content -replace "ðŸ“ ", "📍"
        $content = $content -replace "ðŸŒ ", "🌐"
        
        Set-Content -Path $file -Value $content -Encoding UTF8
        Write-Host "Processed $file"
    } else {
        Write-Host "File not found: $file"
    }
}
