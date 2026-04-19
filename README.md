# markdown-extractor-bookmarklet

Extract clean Markdown from any article on the web using a simple browser bookmarklet.

## What it does

This tool allows you to convert any web article into clean, formatted Markdown directly in your browser. When you click the bookmarklet, it:
1. Uses Mozilla's **Readability** library to identify and extract the main article content (stripping away ads, navigation, and clutter).
2. Converts the extracted HTML into Markdown using **Turndown**.
3. Displays an interactive overlay on the current page where you can:
   - View the raw Markdown code.
   - View a live HTML preview of the Markdown (powered by **marked**).
   - Toggle between Split, Raw, and Preview modes.
   - One-click copy the Markdown to your clipboard.

## Two Versions

The project builds two different versions of the bookmarklet to suit your needs:

### 1. Bundled Version (`dist/bookmarklet-bundled.min.js`)
- **How it works:** Bundles all dependencies (Readability, Turndown, marked) directly into the bookmarklet code using `esbuild`.
- **Pros:** Completely self-contained. It doesn't need to download external scripts when you run it, making it faster and immune to Content Security Policy (CSP) restrictions that block third-party CDNs.
- **Cons:** The bookmarklet URL is very long because it contains all the library code.

### 2. CDN Version (`dist/bookmarklet-cdn.min.js`)
- **How it works:** Dynamically injects `<script>` tags to load dependencies from the jsDelivr CDN before running the extraction.
- **Pros:** The bookmarklet URL is very short and lightweight.
- **Cons:** Requires an internet connection to fetch the scripts. It may fail to work on websites with strict Content Security Policies (CSP) that block external scripts.

## How to use

1. Run `npm install` to install the dependencies.
2. Run `npm run build` to generate the minified bookmarklets.
3. The build script will generate ready-to-use bookmarklet URLs in the `dist/` directory:
   - `dist/bundled-url.txt`
   - `dist/cdn-url.txt`
4. Create a new bookmark in your browser, and copy-paste the contents of either text file into the URL/Location field.
5. Visit any article online and click your new bookmark!

## Development

- `src/bundled.js`: Source code for the bundled version.
- `src/cdn.js`: Source code for the CDN version.
- `build-urls.js`: Utility script that reads the minified output and safely encodes it into `javascript:` URLs.
