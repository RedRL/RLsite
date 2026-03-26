# RLsite

Personal portfolio site for Harel J. Yerushalmi, built with Angular as a single-page experience for presenting software projects, machine learning work, music releases, and contact details.

## Highlights

- Hero section with theme toggle, social links, and smooth scrolling navigation
- Expandable `About me` section with background, education, teaching, and music experience
- Project showcase area featuring:
  - `Brain Power MVP` in a live phone-style embed
  - `Checkers Game in C#` with an interactive image carousel and lightbox
  - `License Plate Recognition on AWS` with architecture summary and visual flow
  - `Machine Learning Projects` carousel
  - GitHub callout for more work
- Music section with three video cards and in-page YouTube modal playback
- Simplified contact section with email options and WhatsApp CTA
- Light and dark themes with animated purple/teal accent styling

## Tech Stack

- Angular 21
- TypeScript
- SCSS
- Angular standalone components
- Angular signals

## Project Structure

- `src/app/profile/` - main portfolio page layout and section content
- `src/app/carousel/` - reusable machine learning projects carousel
- `src/app/contact-me/` - simplified contact section
- `src/app/shared/` - shared UI behavior such as scroll reveal
- `src/assets/` - images, fonts, media, and downloadable files

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

The app runs locally at `http://localhost:4200/`.

## Available Scripts

- `npm start` - run the Angular dev server
- `npm run build` - create a production build in `dist/`
- `npm run watch` - build in watch mode for development
- `npm test` - run unit tests with Karma

## Notes

- Some external project content is embedded from live URLs and may depend on third-party availability.
- The music section supports in-page video playback, while direct `View on YouTube` links remain available.

## Deployment

This project is set up as a standard Angular app and can be deployed to any static hosting platform that supports Angular build output.
