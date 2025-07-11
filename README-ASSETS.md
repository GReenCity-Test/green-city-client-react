# Asset Loading in GreenCity React Application

## Recent Changes

We've made changes to fix issues with accessing static assets in the public folder. The following changes were implemented:

1. Modified `setupProxy.js` to check if requested assets exist in the public folder before proxying to the backend
2. Added a new helper function `getPublicAssetPath` in `src/constants/imagePaths.js` to make it easier to correctly reference public assets
3. Added authentication support for assets proxied to the backend server
4. Modified the AuthService to store the authentication token in a cookie for the proxy middleware to access

## Best Practices for Referencing Assets

### Assets in the Public Folder

For assets in the public folder (e.g., `/public/assets/img/logo.svg`), use one of these approaches:

1. **Recommended**: Use the `getPublicAssetPath` helper function:
   ```javascript
   import { getPublicAssetPath } from '../constants/imagePaths';

   // In your component
   const logoPath = getPublicAssetPath('img/logo.svg');
   <img src={logoPath} alt="Logo" />
   ```

2. Use the predefined constants in `imagePaths.js`:
   ```javascript
   import { COMMON_IMAGES } from '../constants/imagePaths';

   // In your component
   <img src={COMMON_IMAGES.LOGO} alt="Logo" />
   ```

3. Use the `process.env.PUBLIC_URL` environment variable directly:
   ```javascript
   <img src={`${process.env.PUBLIC_URL}/assets/img/logo.svg`} alt="Logo" />
   ```

### Assets in the Src Folder

For assets in the src folder (e.g., `src/assets/img/heart.svg`), use direct imports:

```javascript
import heartIcon from '../assets/img/heart.svg';

// In your component
<img src={heartIcon} alt="Heart" />
```

## What to Avoid

Do not use absolute paths without the `process.env.PUBLIC_URL` prefix:

```javascript
// AVOID THIS
<img src="/assets/img/logo.svg" alt="Logo" /> // Missing process.env.PUBLIC_URL
```

This can cause issues with asset loading in different environments or when using client-side routing.

## Authentication for Backend Assets

Some assets are stored on the backend server and require authentication to access. The application now handles this automatically by:

1. Storing the authentication token in a cookie when a user logs in
2. Including the authentication token in requests for assets that are proxied to the backend
3. Clearing the authentication cookie when a user logs out

If you're experiencing 401 Unauthorized errors when accessing assets:

1. Make sure you're logged in to the application
2. Check that the authentication cookie is being set correctly
3. If the issue persists after logging out and back in, try clearing your browser cookies and cache

## Troubleshooting

If you're still experiencing issues with asset loading:

1. Check that the asset exists in the correct location
2. Verify that you're using the correct path format as described above
3. Check the browser console for any 404 errors related to asset loading
4. For 401 Unauthorized errors, refer to the "Authentication for Backend Assets" section above
5. If the issue persists, it might be related to the proxy configuration in `setupProxy.js`
