# Nova Glass — Futuristic Portfolio Website

A modern, glass-themed portfolio website for a digital designer, built with **plain HTML, CSS and JavaScript** and animated with **GSAP + ScrollTrigger**.
Silver, chrome and ice-blue visuals, a mouse-reveal hero, scroll-driven storytelling and a bold animated footer.

<!-- Add a screenshot or GIF of your site here -->
<!-- ![Nova Glass preview](images/preview.png) -->

**Live demo:** [best-project-three.vercel.app](https://best-project-three.vercel.app/)

---

## Features

- **Mouse-reveal hero:** move the cursor and a glass circle reveals a second image underneath. Works with touch too.
- **Featured case studies:** cards slide in on scroll, images have a soft parallax, and clicking an image opens it in a smooth popup (lightbox).
- **Pinned scroll story:** one image grows to full screen, then strips wipe in, cards sweep across and a final text reveals.
- **Circular gallery:** a rotating orbit slider with buttons, click-to-select and keyboard arrows.
- **Animated footer:** all text and the giant "novaglass" word rise up while scrolling.
- **Working contact links:** Instagram, LinkedIn and Email icons open the real profiles.
- **Contact form:** the footer form opens the visitor's mail app with a ready message.
- **Smart navbar:** a glass navbar appears when scrolling up.
- **Scroll progress bar** and **smooth scrolling** for all anchor links.
- Fully **responsive** and respects `prefers-reduced-motion`.

---

## Built With

| Tech | Use |
|------|-----|
| HTML5 | Structure |
| CSS3 | Glassmorphism, grid, flexbox, responsive layout |
| JavaScript (ES6) | Interactions and logic |
| [GSAP 3.12](https://gsap.com/) | Animations |
| GSAP ScrollTrigger | Scroll-based animation and pinning |
| Google Fonts | Montserrat and DM Sans |

No build tools or frameworks are needed.

---

## Project Structure

```
nova-glass/
├── index.html
├── style.css
├── script.js
├── README.md
└── images/
    ├── normal.png          # hero image (eyes closed)
    ├── reveal.png          # hero reveal image (glasses on)
    ├── case-1.jpg          # case study images
    ├── case-2.jpg
    ├── case-3.jpg
    ├── story-1.jpg         # story: opening image
    ├── story-2.jpg         # story: wide image (split into 3 strips)
    ├── story-card-1.jpg    # story: cards
    ├── story-card-2.jpg
    ├── story-card-3.jpg
    ├── story-3.jpg         # story: final image
    └── orbit-1.jpg ... orbit-9.jpg   # circular gallery
```

---

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/sanaashraf/nova-glass.git
   cd nova-glass
   ```

2. **Open the site**
   - Double-click `index.html`, or
   - Use the **Live Server** extension in VS Code (recommended).

That's it. GSAP is loaded from a CDN, so you need an internet connection on the first load.

---

## Customization

### 1. Your contact details

Open `script.js`, find `CONFIG` and add your own info:

```js
const CONFIG = {
  email: "yourname@gmail.com",
  instagram: "https://instagram.com/yourusername",
  linkedin: "https://www.linkedin.com/in/yourusername",
};
```

### 2. Images

Replace the files inside the `images/` folder, keeping the same names (or change the `src` paths in `index.html`).
The strips image path is set in `style.css` under `.rs-strip`.

**Recommended sizes**

| Image | Ratio | Size |
|-------|-------|------|
| Hero images | 16:9 | 1920×1080 |
| `story-1`, `story-3` | 16:9 | 1920×1080 |
| `story-2` | wide | 2400×1080 |
| Story cards, orbit images | 3:4 | 900×1200 |
| Case study images | 16:10 | 1600×1000 |

Tip: use `.webp` and keep each image under 300 KB for smooth scrolling.

### 3. Text and colors

- Edit titles, descriptions and tags directly in `index.html`.
- Main colors are in `:root` at the top of `style.css`.
- Scroll length of the pinned story: change `end: "+=600%"` in `script.js`.
- Size of the footer word: change `font-size` of `.ft-word` in `style.css`.
- Size of the reveal circle in the hero: change `getMaxRadius()` in `script.js`.

---

## Deployment

This site is deployed on **Vercel**: https://best-project-three.vercel.app/

To deploy your own copy:

1. Push the project to a GitHub repository.
2. Go to [vercel.com](https://vercel.com), click **Add New → Project** and import the repository.
3. Keep the default settings (no build command needed) and click **Deploy**.

Every `git push` to the `main` branch updates the live site automatically.
It also works on GitHub Pages (**Settings → Pages → main branch / root**) or any static hosting.

---

## Browser Support

Works in the latest versions of Chrome, Edge, Firefox and Safari.
Uses `backdrop-filter`, `clip-path` and CSS masks, so very old browsers may show a simpler version.

---

## Credits

- Animations by [GSAP](https://gsap.com/)
- Fonts by [Google Fonts](https://fonts.google.com/)
- Images are AI-generated or owned by the author. Replace them with your own work.

---

## License

This project is open source under the [MIT License](LICENSE).
Add a `LICENSE` file to your repository if you want to use this license.

---

Made with care by **Sana Ashraf**. Connect with me on [Instagram](https://www.instagram.com/moondev_code/?hl=en#) · [LinkedIn](www.linkedin.com/in/sanashahzadi33)
