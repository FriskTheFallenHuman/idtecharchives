import remarkGfm from "remark-gfm";
import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Idtech4 Archives",
  tagline: "Documentation ❤️ Research",
  favicon: "img/favicon.ico",

  future: {
    v4: true,
  },

  url: "https://friskthefallenhuman.github.io",
  baseUrl: "/idtecharchives/",
  organizationName: "FriskTheFallenHuman",
  projectName: "idtecharchives",
  trailingSlash: false,
  onBrokenLinks: "throw",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: "./sidebars.js",
          remarkPlugins: [remarkGfm],
        },
        theme: { customCss: "./src/css/custom.css" },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/docusaurus-social-card.jpg",
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: "Idtech4 Archives",
        logo: {
          alt: "Idtech Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "docsSidebar",
            position: "left",
            label: "Documentation",
          },
          {
            href: "https://github.com/FriskTheFallenHuman/idtecharchives",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Documentation",
            items: [
              {
                label: "Doom 3",
                to: "/docs/intro",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Discord",
                href: "https://discord.gg/tJDGrk6w4H",
              },
              {
                label: "BlueSky",
                href: "https://bsky.app/profile/krispygoat.bsky.social",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/FriskTheFallenHuman/idtecharchives",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} idTechArchives, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
