$prefix = 'http://localhost:8000/'
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Serving $PWD on $prefix (Ctrl-C to stop)"
while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $reqUrl = $ctx.Request.RawUrl.TrimStart('/')
    if ($reqUrl -eq '') { $reqUrl = 'calculator.html' }
    $file = Join-Path (Get-Location) $reqUrl
    if (Test-Path $file) {
        try {
            $bytes = [System.IO.File]::ReadAllBytes($file)
            $ctx.Response.ContentLength64 = $bytes.Length
            $ctx.Response.OutputStream.Write($bytes,0,$bytes.Length)
            $ctx.Response.StatusCode = 200
        } catch {
            $ctx.Response.StatusCode = 500
            $msg = [System.Text.Encoding]::UTF8.GetBytes('Internal Server Error')
            $ctx.Response.OutputStream.Write($msg,0,$msg.Length)
        }
    } else {
        $ctx.Response.StatusCode = 404
        $buf = [System.Text.Encoding]::UTF8.GetBytes('Not Found')
        $ctx.Response.OutputStream.Write($buf,0,$buf.Length)
    }
    $ctx.Response.OutputStream.Close()
}
$listener.Stop()
$listener.Close()
