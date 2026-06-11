# Unity WebGL Play Zone Deployment

This directory holds your Unity WebGL builds that will be rendered dynamically inside the portfolio website's **Unity Play Zone** iframe.

## How to Deploy Your Game:

1. **Build your game in Unity**:
   * Open your Unity project.
   * Go to **File > Build Settings...**
   * Select **WebGL** as the platform.
   * (Optional) Check **Decompression Fallback** in Player Settings if your server has trouble serving compressed GZip/Brotli assets.
   * Click **Build** and choose an export folder.

2. **Copy the build files**:
   * Once built, Unity will output an `index.html` file and folders like `Build/` and `TemplateData/`.
   * Copy **all** of these generated files/folders directly into this directory (`public/unity-games/`).
   * So the folder structure looks like this:
     ```
     public/
     └── unity-games/
         ├── Build/
         │   ├── game.loader.js
         │   ├── game.framework.js
         │   ├── game.data
         │   └── game.wasm
         ├── TemplateData/
         ├── index.html   <-- This is the entry point loaded by the iframe
         └── README.md
     ```

3. **Verify**:
   * Run `npm run dev` and click on the **Game Unity WebGL** tab under the **Unity Play Zone** section.
   * The website's iframe will automatically load `./unity-games/index.html` and run your game directly in the browser!
