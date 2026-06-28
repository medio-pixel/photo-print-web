$pair = "158817229629542:W9ACxNWwLW3EGzp-DoRGqBjrTIY"
$bytes = [System.Text.Encoding]::ASCII.GetBytes($pair)
$b64 = [Convert]::ToBase64String($bytes)
$headers = @{ Authorization = "Basic $b64" }

$base = "https://api.cloudinary.com/v1_1/dkpachrss"

$resultado = @{}
$carpetas = @(
    "(raiz)",
    "FOTOGRAFIA/FOTOLIBRO ULTIMO",
    "FOTOGRAFIA/graduacion candela",
    "FOTOGRAFIA/JG ROCK",
    "FOTOGRAFIA/kill hill humamity"
)

foreach ($carpeta in $carpetas) {
    Write-Host "Listando: $carpeta"
    $fotos = @()
    $nextCursor = $null
    
    do {
        if ($carpeta -eq "(raiz)") {
            $url = "$base/resources/image/upload?max_results=500"
        } else {
            $encoded = [uri]::EscapeDataString($carpeta + "/")
            $url = "$base/resources/image/upload?max_results=500&prefix=$encoded"
        }
        if ($nextCursor) { $url += "&next_cursor=$nextCursor" }
        
        $res = Invoke-RestMethod -Uri $url -Method Get -Headers $headers
        
        foreach ($r in $res.resources) {
            $parts = $r.public_id -split "/"
            if ($carpeta -eq "(raiz)") {
                if ($parts.Count -eq 1) {
                    $fotos += [PSCustomObject]@{
                        nombre = $r.public_id
                        url = $r.secure_url
                        ancho = $r.width
                        alto = $r.height
                        formato = $r.format
                    }
                }
            } else {
                $fotos += [PSCustomObject]@{
                    nombre = $parts[-1]
                    url = $r.secure_url
                    ancho = $r.width
                    alto = $r.height
                    formato = $r.format
                }
            }
        }
        
        $nextCursor = $res.next_cursor
    } while ($nextCursor)
    
    Write-Host "  -> $($fotos.Count) fotos"
    if ($fotos.Count -gt 0) {
        $resultado[$carpeta] = $fotos
    }
}

# Guardar JSON
$json = $resultado | ConvertTo-Json -Depth 4
$json | Out-File -FilePath "fotos.json" -Encoding UTF8

Write-Host ""
Write-Host "=== RESUMEN ==="
$total = 0
foreach ($key in $resultado.Keys) {
    $count = $resultado[$key].Count
    Write-Host "  ${key}: $count fotos"
    $total += $count
}
Write-Host "  TOTAL: $total"
Write-Host "  -> fotos.json generado"
