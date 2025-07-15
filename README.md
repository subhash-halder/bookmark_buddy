# Bookmark Buddy

![Bookmark Buddy Logo](public/icons/icon128.png)

Bookmark Buddy is a Chrome extension that transforms your new tab experience by providing an elegant, organized display of all your bookmarks in one place. With Bookmark Buddy, finding and accessing your bookmarks becomes effortless and intuitive.

## Features

- **Instant Access**: All your bookmarks visible at a glance on every new tab
- **Beautiful Visualization**: Clean, modern interface that makes finding bookmarks a breeze
- **Dark & Light Mode**: Switch between themes with a single click for comfortable browsing day or night
- **Muscle Memory Development**: The consistent layout helps you build muscle memory, increasing your browsing efficiency over time
- **Zero Learning Curve**: Works with your existing Chrome bookmarks - no migration or setup required

Built with React, TypeScript, and Vite for optimal performance and user experience.

## Local Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Chrome browser

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/subhash-halder/bookmark_buddy.git
   cd bookmark_buddy
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top-right corner
   - Click "Load unpacked" and select the `dist` folder from your project directory

### Debugging process

1. Create a development build with source maps:
   ```bash
   npm run build:dev
   ```
   This will create a development build with source maps that point directly to your TypeScript files, making debugging easier. Note that this doesn't run in watch mode - you'll need to manually rebuild after making changes.

2. Testing changes in Chrome:
   - Load the extension initially as described in the installation steps
   - After making code changes, run `npm run build:dev` again to rebuild
   - Go to `chrome://extensions/` and click the refresh icon on the Bookmark Buddy card
   - Open a new tab to see your changes reflected

3. Debugging tips:
   - Use `console.log()` statements in your code to output debug information
   - View logs in the Chrome DevTools console:
     - For background script: right-click the extension icon → Inspect
     - For new tab page: right-click on the new tab → Inspect
   - Source maps allow you to see and debug your TypeScript code directly in Chrome DevTools
   - Set breakpoints in your original TypeScript files via the Sources panel in DevTools
   - Chrome's extension page (`chrome://extensions/`) shows errors with a red "Errors" button if they occur

### Building for Production

To create a production build:

```bash
npm run build
```

The built extension will be in the `dist` directory, ready to be packaged for the Chrome Web Store.

## Project Structure

- `src/` - Source code
  - `components/` - React components
  - `background/` - Chrome extension background scripts
  - `assets/` - Static assets
  - `interfaces/` - TypeScript interfaces
- `public/` - Static files including manifest.json and icons
- `docs/` - Documentation including privacy policy

## Privacy

Bookmark Buddy values your privacy. The extension processes all data locally on your device and does not send any information to external servers. For more details, see our [Privacy Policy](docs/privacy-policy.md).

## License

[MIT](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
