# Server HTTP Statis Lokal untuk Portofolio Galih
param(
    [int]$Port = 8080
)

$prefix = "http://localhost:$Port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "===================================================" -ForegroundColor Green
    Write-Host "  Server Portofolio Aktif di: $prefix" -ForegroundColor Cyan
    Write-Host "  Tekan Ctrl+C di terminal ini untuk berhenti" -ForegroundColor Yellow
    Write-Host "===================================================" -ForegroundColor Green
} catch {
    Write-Error "Gagal menjalankan listener pada $prefix : $_"
    exit 1
}

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if ([string]::IsNullOrEmpty($baseDir)) {
    $baseDir = "C:\Widi Sefty Galih.K"
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".png"  = "image/png"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # Parse local path and decode URL
        $rawPath = [System.Uri]::UnescapeDataString($request.Url.AbsolutePath).TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($rawPath)) {
            $rawPath = "index.html"
        }

        # Normalize path separators
        $safeRelPath = $rawPath.Replace('/', [System.IO.Path]::DirectorySeparatorChar)
        $fullPath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($baseDir, $safeRelPath))

        # Security check: ensure path is within base directory
        if ($fullPath.StartsWith($baseDir, [System.StringComparison]::OrdinalIgnoreCase) -and (Test-Path $fullPath -PathType Leaf)) {
            $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }

            $bytes = [System.IO.File]::ReadAllBytes($fullPath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200

            # Allow CORS for local debugging
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate")

            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $notFoundHtml = [System.Text.Encoding]::UTF8.GetBytes("<html><body><h2>404 - Halaman Tidak Ditemukan</h2></body></html>")
            $response.ContentType = "text/html; charset=utf-8"
            $response.ContentLength64 = $notFoundHtml.Length
            $response.OutputStream.Write($notFoundHtml, 0, $notFoundHtml.Length)
        }

        $response.OutputStream.Close()
    } catch {
        # Silent continue on client disconnects
    }
}
