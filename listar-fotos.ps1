# Listar fotos de Cloudinary - PowerShell
$cloudName = "dkpachrss"
$apiKey    = "552182674664993"
$apiSecret = "eb5ZW8Mibdyxua9fn1pJGFp8aBo"

# Auth header
$pair = "${apiKey}:${apiSecret}"
$bytes = [System.Text.Encoding]::ASCII.GetBytes($pair)
$base64 = [Convert]::ToBase64String($bytes)
$headers = @{ Authorization = "Basic $base64" }

$baseUrl = "https://api.cloudinary.com/v1_1/$cloudName"

# 1. Obtener carpetas
Write-Host "Buscando carpetas..."
try {
    $foldersRes = Invoke-RestMethod -Uri "$baseUrl/folders" -Method Get -Headers $headers
    Write-Host "  Carpetas encontradas: $($foldersRes.folders.Count)"
} catch {
    Write-Host "  ERROR: $($_.Exception.Message)"
    Write-Host "  Verificar credenciales."
    exit 1
}

$folders = @("")
foreach ($f in $foldersRes.folders) {
    $folders += $f.path
    Write-Host "    - $($f.path)"
    try {
        $subRes = Invoke-RestMethod -Uri "$baseUrl/folders/$($f.path)" -Method Get -Headers $headers
        foreach ($s in $subRes.folders) {
            $folders += $s.path
            Write-Host "      - $($s.path)"
        }
    } catch {}
}

# 2. Por cada carpeta, listar imagenes
$resultado = @{}

foreach ($carpeta in $folders) {
    $label = if ($carpeta -eq "") { "(raiz)" } else { $carpeta }
    Write-Host "  -> Listando: $label"
    
    $fotos = @()
    $nextCursor = $null
    
    do {
        $url = "$baseUrl/resources/image/upload?max_results=500"
        if ($carpeta -ne "") { $url += "&prefix=$carpeta/" }
        if ($nextCursor) { $url += "&next_cursor=$nextCursor" }
        
        $res = Invoke-RestMethod -Uri $url -Method Get -Headers $headers
        
        foreach ($r in $res.resources) {
            $parts = $r.public_id -split "/"
            if ($carpeta -eq "") {
                if ($parts.Count -eq 1) {
                    $fotos += @{
                        nombre = $parts[-1]
                        url = $r.secure_url
                        ancho = $r.width
                        alto = $r.height
                        formato = $r.format
                    }
                }
            } else {
                $expectedParts = ($carpeta -split "/").Count + 1
                if ($parts.Count -eq $expectedParts) {
                    $fotos += @{
                        nombre = $parts[-1]
                        url = $r.secure_url
                        ancho = $r.width
                        alto = $r.height
                        formato = $r.format
                    }
                }
            }
        }
        
        $nextCursor = $res.next_cursor
    } while ($nextCursor)
    
    if ($fotos.Count -gt 0) {
        $resultado[$label] = $fotos
    }
}

# 3. Guardar JSON
$json = $resultado | ConvertTo-Json -Depth 4
$json | Out-File -FilePath "fotos.json" -Encoding UTF8

# 4. Resumen
Write-Host ""
Write-Host "=== RESUMEN ==="
$total = 0
foreach ($key in $resultado.Keys) {
    $count = $resultado[$key].Count
    Write-Host "  ${key}: $count fotos"
    $total += $count
}
Write-Host ""
Write-Host "  TOTAL: $total fotos"
Write-Host "  Archivo generado: fotos.json"
