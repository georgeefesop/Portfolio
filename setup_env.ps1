# Replace with your OpenAI API key from https://platform.openai.com/api-keys
$ApiKey = "your_openai_api_key_here"
$Content = @"
# OpenAI API Key for Project Estimator
OPENAI_API_KEY=$ApiKey

# Resend API Key for contact form email functionality
# Get your API key from https://resend.com/api-keys
RESEND_API_KEY=re_your_api_key_here
"@

$Path = ".env"
$Content | Set-Content -Path $Path -Encoding utf8
Write-Host "✅ .env file generated successfully at $Path" -ForegroundColor Green
Write-Host "🚀 Restart your dev server to apply changes." -ForegroundColor Cyan
