const _ = require('lodash')
const Promise = require('bluebird')
const fs = require('fs')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

const POST_PER_PAGE = 6

exports.createPages = async ({ graphql, actions, reporter }) => {
  // Define createPage functions
  const { createPage } = actions

  // Get all blogs, authors and categories
  const dataResult = await graphql(`
    {
      site {
        siteMetadata {
          siteUrl
        }
      }

      blogs: allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              subtitle
              author
              banner {
                childImageSharp {
                  fluid(maxWidth: 1000, quality: 90) {
                    base64
                    tracedSVG
                    aspectRatio
                    src
                    srcSet
                    srcWebp
                    srcSetWebp
                    sizes
                  }
                }
              }
            }
          }
        }
      }

      authors: allAuthorsJson {
        edges {
          node {
            user
            name
            facebook
            twitter
          }
        }
      }

      categories: allCategoriesJson {
        edges {
          node {
            key
            name
            desc
          }
        }
      }
    }
  `)

  const {site, blogs, authors, categories} = dataResult.data

  // Get featured post
  const featuredResult = await graphql(`
    {
      featured: allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}, filter: {frontmatter: {featured: {eq: true}}}, limit: 1) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              subtitle
              author
              banner {
                childImageSharp {
                  fluid(maxWidth: 1000, quality: 90) {
                    base64
                    tracedSVG
                    aspectRatio
                    src
                    srcSet
                    srcWebp
                    srcSetWebp
                    sizes
                  }
                }
              }
            }
          }
        }
      }
    }
  `)

  const featuredPost = _.head(featuredResult.data.featured.edges)

  // Create blog listing
  const blogListingPages = Math.ceil(blogs.edges.length / POST_PER_PAGE)

  _.times(blogListingPages, i => {
    createPage({
      path: i === 0 ? `/` : `/pages/${i + 1}`,
      component: path.resolve('./src/templates/blog-list.tsx'),
      context: {
        featured: i === 0 ? featuredPost : null,
        skip: i * POST_PER_PAGE,
        limit: POST_PER_PAGE,
        currentPage: i + 1,
        numPages: blogListingPages,
      },
    })
  })

  // Create blog posts
  _.each(blogs.edges, (blog, i) => {
    const previousBlog = i === blogs.edges.length - 1 ? null : blogs.edges[i + 1].node
    const nextBlog = i === 0 ? null : blogs.edges[i - 1].node

    createPage({
      path: blog.node.fields.slug,
      component: path.resolve('./src/templates/blog-post.tsx'),
      context: {
        author: blog.node.frontmatter.author,
        slug: blog.node.fields.slug,
        previous: previousBlog,
        next: nextBlog,
      },
    })
  })

  // Create feed API
  const feedBlogs = _.slice(blogs.edges, 0, 5).map(o => ({
    name: o.node.frontmatter.title,
    desc: o.node.frontmatter.subtitle,
    slug: `${site.siteMetadata.siteUrl}${o.node.fields.slug}`,
    banner: `${site.siteMetadata.siteUrl}${o.node.frontmatter.banner.childImageSharp.fluid.src}`,
  }))

  fs.writeFile('public/feed.json', JSON.stringify(feedBlogs), err => {
    if (err) {
      throw err
    }
  })

  // Create category blog listing page
  _.each(categories.edges, async category => {
    const categoryResult = await graphql(`
      {
        blogs: allMarkdownRemark(
          filter: {frontmatter: {category: {regex: "/${category.node.key}/"}}}
        ) {
          edges {
            node {
              frontmatter {
                title
              }
            }
          }
        }
        banner: allMarkdownRemark(
          sort: {fields: [frontmatter___date], order: DESC}
          filter: {frontmatter: {category: {regex: "/${category.node.key}/"}}}
          limit: 1
        ) {
          edges {
            node {
              frontmatter {
                banner {
                  childImageSharp {
                    fluid(maxWidth: 1000, quality: 90) {
                      base64
                      tracedSVG
                      aspectRatio
                      src
                      srcSet
                      srcWebp
                      srcSetWebp
                      sizes
                    }
                  }
                }
              }
            }
          }
        }
      }
    `)

    const categoryListingPages = Math.ceil(categoryResult.data.blogs.edges.length / POST_PER_PAGE)

    _.times(categoryListingPages, i => {
      createPage({
        path: i === 0 ? `/category/${category.node.key}` : `/category/${category.node.key}/pages/${i + 1}`,
        component: path.resolve('./src/templates/category-blog.tsx'),
        context: {
          pathPrefix: `/category/${category.node.key}`,
          banner: _.head(categoryResult.data.banner.edges),
          category: category.node.key,
          currentPage: i + 1,
          numPages: categoryListingPages,
          regex: `/${category.node.key}/`,
          limit: POST_PER_PAGE,
          skip: i * POST_PER_PAGE,
        },
      })
    })
  })

  // Create author blog listing page
  _.each(authors.edges, async author => {
    const authorResult = await graphql(`
      {
        blogs: allMarkdownRemark(
          filter: {frontmatter: {author: {regex: "/${author.node.user}/"}}}
        ) {
          edges {
            node {
              frontmatter {
                title
              }
            }
          }
        }
        banner: file(relativePath: {eq: "${author.node.user}.jpg"}) {
          childImageSharp {
            fluid(maxWidth: 1000, quality: 90) {
              base64
              tracedSVG
              aspectRatio
              src
              srcSet
              srcWebp
              srcSetWebp
              sizes
            }
          }
        }
      }
    `)

    const authorListingPages = Math.ceil(authorResult.data.blogs.edges.length / POST_PER_PAGE)

    _.times(authorListingPages, i => {
      createPage({
        path: i === 0 ? `/author/${author.node.user}` : `/author/${author.node.user}/pages/${i + 1}`,
        component: path.resolve('./src/templates/author-blog.tsx'),
        context: {
          pathPrefix: `/author/${author.node.user}`,
          banner: authorResult.data.banner,
          author: author.node.user,
          currentPage: i + 1,
          numPages: authorListingPages,
          regex: `/${author.node.user}/`,
          limit: POST_PER_PAGE,
          skip: i * POST_PER_PAGE,
        },
      })
    })
  })

  /*
   * NOTE: PageContext cannot pass variable that return from async function!
   */

  // Create category list page
  const categoryRaw = []
  const categoryPromise = []

  const fetchCategory = async category => {
    const categoryResult = await graphql(
      `
        {
          blogs: allMarkdownRemark(
            sort: {fields: [frontmatter___date], order: DESC}
            filter: {frontmatter: {category: {regex: "/${category.node.key}/"}}}
            limit: 1
          ) {
            edges {
              node {
                frontmatter {
                  banner {
                    childImageSharp {
                      fluid(maxWidth: 1000, quality: 90) {
                        base64
                        tracedSVG
                        aspectRatio
                        src
                        srcSet
                        srcWebp
                        srcSetWebp
                        sizes
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `
    )

    const categoryTopBlog = _.head(categoryResult.data.blogs.edges)

    return categoryRaw.push({
      key: category.node.key,
      name: category.node.name,
      desc: category.node.desc,
      banner: categoryTopBlog.node.frontmatter.banner,
    })
  }

  _.each(categories.edges, category => {
    categoryPromise.push(fetchCategory(category))
  })

  await Promise.all(categoryPromise)

  createPage({
    path: `/category`,
    component: path.resolve('./src/templates/category-list.tsx'),
    context: {
      categories: _.sortBy(categoryRaw, o => o.key),
    },
  })

  // Create author list page
  const authorRaw = []
  const authorPromise = []

  const fetchAuthor = async author => {
    const authorResult = await graphql(
      `
        {
          author: file(relativePath: {eq: "${author.node.user}.jpg"}) {
            childImageSharp {
              fluid(maxWidth: 1000, quality: 90) {
                base64
                tracedSVG
                aspectRatio
                src
                srcSet
                srcWebp
                srcSetWebp
                sizes
              }
            }
          }
        }
      `
    )

    return authorRaw.push({
      user: author.node.user,
      name: author.node.name,
      facebook: author.node.facebook,
      twitter: author.node.twitter,
      banner: authorResult.data.author,
    })
  }

  _.each(authors.edges, author => {
    authorPromise.push(fetchAuthor(author))
  })

  await Promise.all(authorPromise)

  createPage({
    path: `/author`,
    component: path.resolve('./src/templates/author-list.tsx'),
    context: {
      authors: authorRaw,
    },
  })

  return true
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

exports.onCreateWebpackConfig = ({ getConfig, stage }) => {
  const config = getConfig()
  if (stage.startsWith('develop') && config.resolve) {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-dom': '@hot-loader/react-dom',
    }
  }
}
