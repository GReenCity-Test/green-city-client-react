# Favicon Generation Instructions

This document provides instructions on how to generate the favicon.ico file for the GreenCity project.

## Source File
The source file for the favicon is located at:
```
/public/assets/img/logo.svg
```

## How to Generate Favicon Files
1. Use an online favicon generator tool like [RealFaviconGenerator](https://realfavicongenerator.net/) or [Favicon.io](https://favicon.io/favicon-converter/)
2. Upload the logo.svg file
3. Generate the favicon.ico file and other necessary sizes
4. Place the favicon.ico file in the `/public` directory
5. Place any additional favicon files in the `/public/favicon` directory

## Recommended Favicon Sizes
For comprehensive browser and device support, generate the following sizes:
- 16x16 (favicon-16x16.png)
- 32x32 (favicon-32x32.png)
- 48x48 (favicon-48x48.png)
- 192x192 (android-chrome-192x192.png)
- 512x512 (android-chrome-512x512.png)

## Configuration
The favicon is already configured in:
- `/public/index.html`
- `/public/manifest.json`

No additional configuration is needed after placing the favicon.ico file in the public directory.