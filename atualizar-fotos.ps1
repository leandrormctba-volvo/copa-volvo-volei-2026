# ============================================================
# ATUALIZAR FOTOS DO SITE
# Lê a pasta do Google Drive e gera o arquivo fotos.js com a
# lista de jogos e fotos. Rode de novo sempre que colocar
# fotos novas no Drive.
# ============================================================
$PASTA_DRIVE = "1vY_dXxQV1b747jeOcWFVvP5UJOGlojHI"

function Ler-Pasta($id) {
  $html = (Invoke-WebRequest -UseBasicParsing "https://drive.google.com/embeddedfolderview?id=$id").Content
  $itens = @()
  $ms = [regex]::Matches($html, 'id="entry-([\w-]+)".*?flip-entry-title">([^<]*)<', 'Singleline')
  foreach ($m in $ms) {
    $itens += [pscustomobject]@{ id = $m.Groups[1].Value; nome = [System.Net.WebUtility]::HtmlDecode($m.Groups[2].Value).Trim() }
  }
  return $itens
}

function Fotos-Da-Pasta($id) {
  $fotos = @()
  foreach ($item in Ler-Pasta $id) {
    if ($item.nome -match '\.(jpe?g|png|webp)$') { $fotos += $item }
    elseif ($item.nome -notmatch '\.\w{2,4}$') { $fotos += Fotos-Da-Pasta $item.id }  # subpasta
  }
  return $fotos
}

$jogos = @()
foreach ($pasta in Ler-Pasta $PASTA_DRIVE) {
  if ($pasta.nome -match '\.\w{2,4}$') { continue }
  $fotos = Fotos-Da-Pasta $pasta.id | Sort-Object { [regex]::Replace($_.nome, '\d+', { $args[0].Value.PadLeft(6, '0') }) }
  $nome = ($pasta.nome -replace '\s+', ' ').Trim()
  Write-Host "$nome : $($fotos.Count) fotos"
  $jogos += [pscustomobject]@{ nome = $nome; pasta = $pasta.id; fotos = @($fotos | ForEach-Object { $_.id }) }
}

$json = $jogos | ConvertTo-Json -Depth 4 -Compress
$conteudo = "// Arquivo gerado automaticamente por atualizar-fotos.ps1 - não edite à mão`nconst JOGOS = $json;`n"
[System.IO.File]::WriteAllText("$PSScriptRoot\fotos.js", $conteudo, (New-Object System.Text.UTF8Encoding $false))
Write-Host "fotos.js atualizado."
