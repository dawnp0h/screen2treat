# Screen to Treat: website

A plain static website: HTML, CSS and a little JavaScript. There's no build step, no database and no plugins to update.

## Structure

```
index.html            The whole site on one scrolling page, in sections:
                      #home, #the-case, #objections, #evidence, #about,
                      #get-involved, #contact, #privacy
404.html              Page-not-found page
assets/css/style.css  All styling. Change colours and fonts in :root at the top.
assets/js/main.js     Shared header and footer; menu links jump to sections
```

To link straight to a section, add its id to the address, e.g. `yoursite.org/#evidence`.
Sub-sections can be linked too: #duty, #justice, #rights, #legacy, #stewardship,
#treatment, #burden, #inequity, #screening, #response, #path, #proof, #references.

## Preview on your computer

Open `index.html` in a browser, or run a local server from this folder:

```
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Editing

- Replace every `[placeholder in square brackets]`.
- Search for `TODO` to find things that must be done before launch.
- The header, menu and footer are built in `assets/js/main.js`. Edit them there once and every page updates.
- Every statistic has a source listed at the bottom of its page. Items marked [Verify] must be checked before launch.

## Before launch

1. **Check every statistic** against its listed source.
2. **Connect the contact form** to a form service (e.g. Formspree, Netlify Forms) by setting the form's `action` URL.
3. **Add a donation link** on `get-involved.html` (e.g. ToyyibPay, Billplz, Stripe payment link, or a DuitNow QR image).
4. **Write the privacy notice** and have it checked against the PDPA.
5. **Test the quick-exit button** and the Esc key on a phone and on a computer.
6. Decide on analytics. If you use any, choose a privacy-friendly option and say so in the privacy notice. 

## Free hosting

Any static host works. Common free options:

- **GitHub Pages**: put this folder in a GitHub repository under an organisation account, then turn on Pages in the repository settings.
- **Netlify** or **Cloudflare Pages**: drag and drop this folder, or connect the GitHub repository for automatic updates.

Then point your domain at the host by following its custom-domain instructions.

## Ownership

Keep the code, domain and hosting under organisation accounts, not personal ones, and record who holds the logins.
