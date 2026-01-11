# Change to the todo-app directory
Set-Location -Path "D:\1.GITHUB\qwen-coder\Todo-Full-Stack-Web-App\todo-app"

# Run the build command and capture output
$output = $(npm run build 2>&1) 

# Print the output
Write-Host $output

# Also save to a file for inspection
$output | Out-File -FilePath "build_output.txt"