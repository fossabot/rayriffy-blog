const { GATSBY_ENV = 'production' } = process.env

module.exports = {
  siteMetadata: {
    title: 'Riffy Blog',
    author: 'Phumrapee Limpianchop',
    description: 'The Nerdy Blogger',
    siteUrl: `${
      GATSBY_ENV === 'production'
        ? `https://blog.rayriffy.com`
        : GATSBY_ENV === 'staging'
        ? `https://blog-staging.rayriffy.com`
        : `https://localhost:8000`
    }`,
    fbApp: '342680353046527',
  },
  pathPrefix: '/',
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
        ignore: [`**/.*`],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
        ignore: [`**/.*`],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
        ignore: [`**/.*`],
      },
    },
    `gatsby-plugin-styled-components`,
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/database`,
      },
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        resolveEnv: () => GATSBY_ENV,
        env: {
          production: {
            policy: [
              {
                userAgent: '*',
                disallow: ['/pages', '/category', '/author'],
              },
            ],
          },
          staging: {
            policy: [
              {
                userAgent: '*',
                disallow: ['/'],
              },
            ],
          },
          development: {
            policy: [
              {
                userAgent: '*',
                disallow: ['/'],
              },
            ],
          },
        },
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: `/sitemap.xml`,
        exclude: [
          '/pages/*',
          '/category',
          '/category/*',
          '/author',
          '/author/*',
          '/category/lifestyle/pages/*',
          '/category/misc/pages/*',
          '/category/music/pages/*',
          '/category/programming/pages/*',
          '/category/review/pages/*',
          '/category/tutorial/pages/*',
          '/author/rayriffy/pages/*',
          '/author/SiriuSStarS/pages/*',
        ],
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `@raae/gatsby-remark-oembed`,
            options: {
              usePrefix: true,
              providers: {
                include: [
                  'SoundCloud',
                  'Instagram',
                  'Spotify',
                  'Facebook (Post)',
                  'Facebook (Video)',
                  'Twitter',
                ],
                settings: {
                  SoundCloud: {
                    color: '#1976d2',
                    show_comments: false,
                    visual: false,
                    hide_related: true,
                    auto_play: false,
                    show_user: false,
                    show_reposts: false,
                    show_teaser: false,
                  },
                  Instagram: { hidecaption: true },
                },
              },
            },
          },
          'gatsby-remark-embed-video',
          {
            resolve: 'gatsby-remark-embed-gist',
            options: {
              username: 'rayriffy',
              includeDefaultCss: true,
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1000,
              linkImagesToOriginal: false,
              backgroundColor: `rgb(60, 60, 60)`,
              withWebp: true,
              quality: 80,
            },
          },
          'gatsby-remark-responsive-iframe',
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `${
          GATSBY_ENV === 'production'
            ? 'UA-85367836-2'
            : GATSBY_ENV === 'staging'
            ? 'UA-85367836-3'
            : ''
        }`,
      },
    },
    `gatsby-plugin-remove-serviceworker`,
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Riffy Blog`,
        short_name: `Riffy Blog`,
        start_url: `/`,
        background_color: `#f5f5f5`,
        theme_color: `#1e88e5`,
        display: `minimal-ui`,
        icon: `${__dirname}/content/assets/logo.png`,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: `${__dirname}/src/utils/typography`,
        omitGoogleFont: true,
      },
    },
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        headers: {
          '/api/*': ['Access-Control-Allow-Origin: *'],
        },
      },
    },
    {
      resolve: "gatsby-plugin-netlify-cache",
      options: {
        cachePublic: true,
      },
    },
    {
      resolve: `gatsby-plugin-typescript`,
      options: {
        isTSX: true,
        allExtensions: true,
      },
    },
  ],
}
