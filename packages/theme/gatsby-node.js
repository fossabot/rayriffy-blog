const fs = require('fs')
const path = require('path')

const POST_PER_PAGE = 6
const IMAGE_QUALITY = 70

const templatesDirectory = path.resolve(__dirname, './src/templates')

const chunk = (input, size) => {
  return input.reduce((arr, item, idx) => {
    return idx % size === 0
      ? [...arr, [item]]
      : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]]
  }, [])
}

exports.createPages = async ({ graphql, actions }) => {
  // Define createPage functions
  const { createPage } = actions

  // Get all blogs
  const gqlFetch = await graphql(`
    query NodeGqlFetchQuery {
      blogs: allContentfulBlogPost(sort: { fields: date, order: DESC }) {
        edges {
          node {
            slug
            title
            subtitle
            date(formatString: "DD MMMM YYYY")
            featured
            content {
              childMarkdownRemark {
                html
              }
            }
            author {
              user
              name
            }
            banner {
              localFile {
                childImageSharp {
                  fluid(maxWidth: 1000, quality: ${IMAGE_QUALITY}) {
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

      authors: allContentfulAuthor {
        edges {
          node {
            user
            twitter
            facebook
            name
          }
        }
      }

      categories: allContentfulCategory {
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

  const { blogs, authors, categories } = gqlFetch.data

  // Get featured post
  const gqlFeatured = await graphql(`
    query NodeGqlFeaturedQuery {
      featured: allContentfulBlogPost(
        sort: { order: DESC, fields: date }
        filter: { featured: { eq: true } }
        limit: 1
      ) {
        edges {
          node {
            slug
            title
            subtitle
            date(formatString: "DD MMMM YYYY")
            featured
            content {
              childMarkdownRemark {
                html
              }
            }
            author {
              user
              name
            }
            banner {
              localFile {
                childImageSharp {
                  fluid(maxWidth: 1000, quality: ${IMAGE_QUALITY}) {
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

  const [featuredPost] = gqlFeatured.data.featured.edges

  // Create blog/listing
  const blogsChunks = chunk(blogs.edges, POST_PER_PAGE)

  blogsChunks.map((chunk, i) => {
    createPage({
      path: i === 0 ? `/` : `/pages/${i + 1}`,
      component: path.resolve(
        templatesDirectory,
        'blog/listing/components/index.tsx'
      ),
      context: {
        featured: i === 0 ? featuredPost : null,
        blogs: chunk,
        page: {
          current: i + 1,
          max: blogsChunks.length,
        },
      },
    })
  })

  // Create blog/viewing
  blogs.edges.map(async (blog, i) => {
    const previosBlog =
      i === blogs.edges.length - 1 ? null : blogs.edges[i + 1].node
    const nextBlog = i === 0 ? null : blogs.edges[i - 1].node

    createPage({
      path: blog.node.slug,
      component: path.resolve(
        templatesDirectory,
        'blog/viewing/components/index.tsx'
      ),
      context: {
        node: blog.node,
        blog: {
          previous: previosBlog,
          next: nextBlog,
        },
      },
    })
  })

  // Create category/listing
  const gqlCategoryListing = await graphql(`
    query NodeGqlCategoryListingQuery {
      categories: allContentfulCategory {
        edges {
          node {
            desc
            name
            key
            blog_post {
              banner {
                localFile {
                  childImageSharp {
                    fluid(maxWidth: 1000, quality: ${IMAGE_QUALITY}) {
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
    }
  `)

  const transformedCategoryListing = gqlCategoryListing.data.categories.edges.map(
    category => {
      return {
        key: category.node.key,
        name: category.node.name,
        desc: category.node.desc,
        banner: category.node.blog_post[0].banner,
      }
    }
  )

  createPage({
    path: `category`,
    component: path.resolve(
      templatesDirectory,
      'category/listing/components/index.tsx'
    ),
    context: {
      categories: transformedCategoryListing,
    },
  })

  // Create category/viewing
  categories.edges.map(async category => {
    const gqlCategoryViewing = await graphql(`
      query NodeGqlCategoryViewingQuery {
        blogs: allContentfulBlogPost(filter: {category: {elemMatch: {key: {eq: "${category.node.key}"}}}}, sort: {fields: date, order: DESC}) {
          edges {
            node {
              slug
              title
              subtitle
              date
              featured
              content {
                childMarkdownRemark {
                  html
                }
              }
              author {
                user
                name
              }
              banner {
                localFile {
                  childImageSharp {
                    fluid(maxWidth: 1000, quality: ${IMAGE_QUALITY}) {
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

    const categoryBanner = gqlCategoryViewing.data.blogs.edges[0].node.banner

    const categoryBlogsChunks = chunk(
      gqlCategoryViewing.data.blogs.edges,
      POST_PER_PAGE
    )

    const categoryBlogPromises = categoryBlogsChunks.map((chunk, i) => {
      return createPage({
        path:
          i === 0
            ? `/category/${category.node.key}`
            : `/category/${category.node.key}/pages/${i + 1}`,
        component: path.resolve(
          templatesDirectory,
          'category/viewing/components/index.tsx'
        ),
        context: {
          pathPrefix: `/category/${category.node.key}`,
          blogs: chunk,
          banner: categoryBanner,
          category: category.node,
          page: {
            current: i + 1,
            max: categoryBlogsChunks.length,
          },
        },
      })
    })

    await Promise.all(categoryBlogPromises)
  })

  // Create author/listing
  const gqlAuthorListing = await graphql(`
    query NodeGqlAuthorListingQuery {
      authors: allContentfulAuthor(sort: { fields: name, order: ASC }) {
        edges {
          node {
            name
            twitter
            user
            facebook
            banner {
              localFile {
                childImageSharp {
                  fluid(maxWidth: 1000, quality: ${IMAGE_QUALITY}) {
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

  const transformedAuthorListing = gqlAuthorListing.data.authors.edges.map(
    author => author.node
  )

  createPage({
    path: `author`,
    component: path.resolve(
      templatesDirectory,
      'author/listing/components/index.tsx'
    ),
    context: {
      authors: transformedAuthorListing,
    },
  })

  // Create author/viewing
  authors.edges.map(async author => {
    const gqlAuthorViewing = await graphql(`
      query NodeGqlAuthorViewingQuery {
        blogs: allContentfulBlogPost(filter: {author: {user: {eq: "${author.node.user}"}}}, sort: {fields: date, order: DESC}) {
          edges {
            node {
              slug
              title
              subtitle
              date
              featured
              content {
                childMarkdownRemark {
                  html
                }
              }
              author {
                user
                name
              }
              banner {
                localFile {
                  childImageSharp {
                    fluid(maxWidth: 1000, quality: ${IMAGE_QUALITY}) {
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

        author: contentfulAuthor(user: {eq: "${author.node.user}"}) {
          facebook
          twitter
          user
          name
          banner {
            localFile {
              childImageSharp {
                fluid(maxWidth: 1000, quality: ${IMAGE_QUALITY}) {
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
    `)

    const authorBlogChunks = chunk(
      gqlAuthorViewing.data.blogs.edges,
      POST_PER_PAGE
    )

    const authorBlogPromises = authorBlogChunks.map((chunk, i) => {
      return createPage({
        path:
          i === 0
            ? `/author/${author.node.user}`
            : `/author/${author.node.user}/pages/${i + 1}`,
        component: path.resolve(
          templatesDirectory,
          'author/viewing/components/index.tsx'
        ),
        context: {
          pathPrefix: `/author/${author.node.user}`,
          blogs: chunk,
          author: gqlAuthorViewing.data.author,
          page: {
            current: i + 1,
            max: authorBlogChunks.length,
          },
        },
      })
    })

    await Promise.all(authorBlogPromises)
  })

  /**
   * API Section
   */
  if (!fs.existsSync('public/api')) {
    fs.mkdirSync('public/api', function(err) {
      if (err) {
        console.error(err)
        throw err
      }
    })
  }

  // Create API for each author
  if (!fs.existsSync('public/api/author')) {
    fs.mkdirSync('public/api/author', function(err) {
      if (err) {
        console.error(err)
        throw err
      }
    })
  }

  authors.edges.map(async author => {
    const authorBlogs = await graphql(`
      query NodeGqlAPIAuthorQuery {
        site {
          siteMetadata {
            siteUrl
          }
        }
  
        blogs: allContentfulBlogPost(sort: {fields: date, order: DESC}, filter: {author: {user: {eq: "${author.node.user}"}}}) {
          edges {
            node {
              slug
              title
              subtitle
              banner {
                localFile {
                  childImageSharp {
                    fluid {
                      src
                    }
                  }
                }
              }
            }
          }
        }
      }    
    `)

    const blogsChunks = chunk(authorBlogs.data.blogs.edges, POST_PER_PAGE)

    if (blogsChunks.length > 0) {
      if (!fs.existsSync(`public/api/author/${author.node.user}`)) {
        fs.mkdirSync(`public/api/author/${author.node.user}`, function(err) {
          if (err) {
            console.error(err)
            throw err
          }
        })
      }
    }

    blogsChunks.map((chunk, i) => {
      const res = {
        status: 'success',
        code: 201,
        data: chunk.map(blog => ({
          url: `${authorBlogs.data.site.siteMetadata.siteUrl}/${blog.node.slug}`,
          title: blog.node.title,
          subtitle: blog.node.subtitle,
          banner: `${authorBlogs.data.site.siteMetadata.siteUrl}${blog.node.banner.localFile.childImageSharp.fluid.src}`,
        })),
      }

      fs.writeFile(
        `public/api/author/${author.node.user}/${i + 1}.json`,
        JSON.stringify(res),
        err => {
          if (err) {
            throw err
          }
        }
      )
    })
  })

  return true
}

exports.onCreateWebpackConfig = ({ actions, stage }) => {
  if (!stage.startsWith('develop')) {
    actions.setWebpackConfig({
      resolve: {
        alias: {
          react: `preact/compat`,
          'react-dom': `preact/compat`,
          'react-dom/server': `preact/compat`,
        },
      },
    })
  }
}
