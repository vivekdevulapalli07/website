# Vivek Devulapalli - Academic Website

This is the source code for my personal academic website, showcasing my research, interactive tools, and professional profile.

## 🌐 Live Site
Visit the site at: [https://vivekdevulapalli07.github.io/website/](https://vivekdevulapalli07.github.io/website/)

## 🛠️ Built With
- **Jekyll** - Static site generator
- **GitHub Pages** - Hosting
- **Minima Theme** - Base theme with custom styling

## 📂 Site Structure
- **Research** (`index.md`) - Research overview with image carousel
- **Interactive Tools** (`tools/`) - Scientific calculators and visualization tools
  - D-spacing Calculator
  - Angle Calculator
  - Schmid Factor Calculator
  - Aberration Visualisation
  - Grain Misorientation Calculator
- **Research Notes** (`notes/`) - Technical references and personal notes
- **About** (`about.md`) - Professional profile, CV, work experience, and education

## 🚀 Running Locally

### Prerequisites
- Ruby (version 2.5.0 or higher)
- Bundler gem

### Setup
```bash
# Clone the repository
git clone https://github.com/vivekdevulapalli07/website.git
cd website

# Install dependencies
bundle install

# Run the site locally
bundle exec jekyll serve

# Open http://localhost:4000/website/ in your browser
```

## 📝 Site Configuration
Key configuration is in `_config.yml`:
- Site metadata (title, description, URL)
- Social links (GitHub, LinkedIn, Google Scholar, ORCID, Web of Science)
- Navigation is managed in `_includes/header.html`

## 🎨 Customization
- Main stylesheet: `assets/css/style.scss`
- Custom header with dropdown navigation: `_includes/header.html`
- Interactive tools use custom JavaScript in `assets/js/`

## 📄 Adding Content
- **New tool**: Add a markdown file in `tools/` and update the dropdown in `header.html`
- **New note**: Create a markdown file in `notes/` with layout: `note`
- **Update profile**: Edit `about.md`

## 📧 Contact
- Email: vivek.devulapalli@empa.ch
- LinkedIn: [vivek-devulapalli-stem](https://www.linkedin.com/in/vivek-devulapalli-stem/)
- ORCID: [0000-0002-1743-3246](https://orcid.org/0000-0002-1743-3246)

## 📜 License
This repository is for personal use. Feel free to use the code structure and design as inspiration for your own site.
