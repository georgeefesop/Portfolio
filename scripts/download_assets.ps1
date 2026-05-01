# Create directories
New-Item -ItemType Directory -Force -Path "public/images/gallery"
New-Item -ItemType Directory -Force -Path "public/images/sidechains"
New-Item -ItemType Directory -Force -Path "public/images/about"

# Function to download
function Download-Image {
    param ($Url, $Dest)
    Write-Host "Downloading $Url to $Dest..."
    Invoke-WebRequest -Uri $Url -OutFile $Dest
}

# Gallery Images
Download-Image "https://mir-s3-cdn-cf.behance.net/project_modules/1400/88ddbd127314683.613f971636116.png" "public/images/gallery/boc.png"
Download-Image "https://mir-s3-cdn-cf.behance.net/project_modules/1400/3e0b95228295245.6850988cae31b.png" "public/images/gallery/labline.png"
Download-Image "https://mir-s3-cdn-cf.behance.net/project_modules/hd/0dd07d126781545.6134b4ef30d20.jpg" "public/images/gallery/shackle.jpg"
Download-Image "https://mir-s3-cdn-cf.behance.net/project_modules/1400/c6078b126787469.6134d45ba2ebd.png" "public/images/gallery/smartjobs.png"

# Sidechains Images (Cleaned Sanity URLs)
Download-Image "https://cdn.sanity.io/images/5ro2r81m/production/466db3b918d73c13577939e30a090d03b6f1bf3d-1920x960.png" "public/images/sidechains/hero.png"
Download-Image "https://cdn.sanity.io/images/5ro2r81m/production/7d8d4c3388bf2d27ad2866723ae38ee01179a884a-3840x1920.png" "public/images/sidechains/diagram.png"

# About Profile
Download-Image "https://pps.services.adobe.com/api/profile/353E061A514DD78C0A490D4C@AdobeID/image/358d4d79-c75b-430d-ae03-fdd05fb93499/276" "public/images/about/profile.jpg"

Write-Host "All assets downloaded!"
