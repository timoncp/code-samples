Clear-Host

# Get-PSRepository

# Install-Module -Name Invoke-Install -Repository PSGallery -Scope CurrentUser

# Install-Module WebRequest -AllowClobber
# Install-Module remoting -Scope CurrentUser

# Measure-Command -Expression {
#   Invoke-WebRequest -Uri google.ro
# }

# Get-Service | Sort-Object -Property Status, Name

# Get-ChildItem -Recurse /Users/timo | Where-Object { $_.Length -gt 50MB } | Sort-Object -Property Length | Format-Table -AutoSize -Property Name, Length

# Get-ChildItem -Path . | ForEach-Pbject { $_ }
# Get-ChildItem -Path . | ForEach-Pbject { $_.Encrypt() }
Get-ChildItem -Path . | % `
-Begin {
  Write-Host "start" -ForegroundColor yellow
}`
-Process {
  Write-Output "$($_.FullName);$($_.Length / 1MB)MB"
}`
-End {
  Write-Host "Finished." -ForegroundColor yellow
}`

# gci . -Recurse | sort-object -Property Length -descending | select -first 20 | % { $_.Length/1024 ; $_.FullName }

$fan = New-Object psobject
$fan = $fan | Select-Object -Property Diameter,RPM,Model

$props = @{
  Manufacturer = 'VW'
  Model = 'Golf'
  Color = 'Red'
  Engine = '2.0 TDI'
  IsConvertible = $false
  MaxSpeed = 180
}

$car = New-Object PSObject -Property $props

$f = Get-Item /Users/timo/.gitconfig
$f | Add-Member -MemberType ScriptProperty -Name Size -Value {$_.Length / 1MB}
$f.PSObject.TypeNames.Insert(0, 'MyObject');
