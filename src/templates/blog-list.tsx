import { graphql } from 'gatsby'
import _ from 'lodash'
import React from 'react'
import Helmet from 'react-helmet'

import { FluidObject } from 'gatsby-image'

import { Card } from '../components/card'
import { Pagination } from '../components/pagination'

interface PostInterface {
  fields: {
    slug: string
  }
  frontmatter: {
    title: string
    subtitle: string
    author: string
    date: string
    featured: boolean
    banner: {
      childImageSharp: {
        fluid: FluidObject
      }
    }
  }
}

interface PropsInterface {
  location: object
  pageContext: {
    currentPage: number
    numPages: number
  }
  data: {
    [key: string]: any
    site: {
      siteMetadata: {
        author: string
        description: string
        title: string
        siteUrl: string
        fbApp: string
      }
    }
    allMarkdownRemark: {
      edges: {
        node: PostInterface
      }[]
    }
    allAuthorsJson: {
      edges: {
        node: {
          user: string
          name: string
          facebook: string
        }
      }[]
    }
  }
}

const BlogList: React.SFC<PropsInterface> = props => {
  const siteTitle = props.data.site.siteMetadata.title
  const siteUrl = props.data.site.siteMetadata.siteUrl
  const siteAuthor = props.data.site.siteMetadata.author
  const siteDescription = props.data.site.siteMetadata.description
  const posts = props.data.allMarkdownRemark.edges
  const {currentPage, numPages} = props.pageContext
  const facebookAppID = props.data.site.siteMetadata.fbApp

  return (
    <>
      <Helmet
        htmlAttributes={{lang: 'en'}}
        meta={[
          {
            content: siteTitle,
            name: 'name',
          },
          {
            content: siteDescription,
            name: 'description',
          },
          {
            content: siteAuthor,
            name: 'author',
          },
          {
            content: `${siteUrl}/default.jpg`,
            name: 'image',
          },
          {
            content: siteUrl,
            property: 'og:url',
          },
          {
            content: 'article',
            property: 'og:type',
          },
          {
            content: 'th_TH',
            property: 'og:locale',
          },
          {
            content: 'en_US',
            property: 'og:locale:alternate',
          },
          {
            content: siteTitle,
            property: 'og:title',
          },
          {
            content: siteDescription,
            property: 'og:description',
          },
          {
            content: facebookAppID,
            property: 'fb:app_id',
          },
          {
            content: 'https://facebook.com/rayriffy',
            property: 'article:author',
          },
          {
            content: `${siteUrl}/default.jpg`,
            property: 'og:image',
          },
          {
            content: `${siteUrl}/default.jpg`,
            property: 'og:image:secure_url',
          },
          {
            content: 'banner',
            property: 'og:image:alt',
          },
          {
            content: '1500',
            property: 'og:image:width',
          },
          {
            content: '788',
            property: 'og:image:height',
          },
          {
            content: 'summary_large_image',
            name: 'twitter:card',
          },
          {
            content: '@rayriffy',
            name: 'twitter:site',
          },
          {
            content: '@rayriffy',
            name: 'twitter:creator',
          },
          {
            content: siteTitle,
            name: 'twitter:title',
          },
          {
            content: siteDescription,
            name: 'twitter:description',
          },
          {
            content: `${siteUrl}/default.jpg`,
            name: 'twitter:image',
          },
        ]}
        title={siteTitle}>
        <script type="application/ld+json" data-react-helmet="true">
          {`
            {
              "@context": "http://schema.org/",
              "@type" : "Website",
              "url" : "${siteUrl}"
            }
          `}
        </script>
      </Helmet>
      {posts.map(post => {
        const node: PostInterface = post.node

        const author: any = _.head(_.filter(props.data.allAuthorsJson.edges, o => o.node.user === node.frontmatter.author))
        return (
          <Card
            key={node.fields.slug}
            slug={node.fields.slug}
            author={author.node}
            banner={node.frontmatter.banner.childImageSharp.fluid}
            title={node.frontmatter.title}
            date={node.frontmatter.date}
            subtitle={node.frontmatter.subtitle}
            featured={node.frontmatter.featured}
            link={true}
          />
        )
      })}
      <Pagination numPages={numPages} currentPage={currentPage} pathPrefix="/" />
    </>
  )
}

export default BlogList

export const pageQuery = graphql`
  query blogPageQuery($limit: Int!, $skip: Int!) {
    site {
      siteMetadata {
        title
        description
        author
        siteUrl
        fbApp
      }
    }
    allMarkdownRemark(
      sort: {fields: [frontmatter___date], order: DESC}
      limit: $limit
      skip: $skip
      filter: {frontmatter: {type: {eq: "blog"}}}
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "DD MMMM, YYYY")
            title
            subtitle
            status
            featured
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
    allAuthorsJson {
      edges {
        node {
          user
          name
          facebook
        }
      }
    }
  }
`
