clear
$date = Get-Date

$date.DayOfWeek
$date.AddDays(5)
$date.ToString()

# New-Variable -Name mom -Value Get-Date -Option ReadOnly

$mom2 = "123"

[string] 123 -eq $mom2

# ./script.ps1 -age 123 -name blabla

