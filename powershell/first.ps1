# $processes = Get-Process
# $processes | Sort-Object -Property Handles -Descending | Select-Object -First 10

Get-ChildItem -Recurse |
Group-Object -Property Name, Length, LastWriteTime |
Where-Object { $_.Count -gt 1 } |
ForEach-Object { $_.Group } |
Sort-Object -Property LastWriteTime |
Format-Table -Property FullName, Length, LastWriteTime
