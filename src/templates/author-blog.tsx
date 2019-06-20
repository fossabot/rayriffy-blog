import React from 'react'
import Helmet from 'react-helmet'

import { graphql } from 'gatsby'
import { FluidObject } from 'gatsby-image'

import { Box, Flex } from 'rebass'

import Card from '../components/card'
import Featured from '../components/featured'
import Navbar from '../components/navbar'
import Pagination from '../components/pagination'
import SEO from '../components/seo'

interface IProps {
  pageContext: {
    currentPage: number
    numPages: number
    pathPrefix: string
    banner: {
      childImageSharp: {
        fluid: FluidObject
      }
    }
  }
  data: {
    allMarkdownRemark: {
      edges: {
        node: {
          fields: {
            slug: string
          }
          frontmatter: {
            title: string
            subtitle: string
            date: string
            featured: boolean
            banner: {
              childImageSharp: {
                fluid: FluidObject
              }
            }
          }
        }
      }[]
    }
    authorsJson: {
      user: string
      name: string
      facebook: string
      twitter: string
    }
  }
}

const AuthorBlog: React.SFC<IProps> = props => {
  const posts = props.data.allMarkdownRemark.edges
  const author = props.data.authorsJson
  const authorName = author.name

  const {currentPage, numPages, pathPrefix, banner} = props.pageContext

  return (
    <>
      <Helmet title={authorName} />
      <SEO
        title={authorName}
        banner={banner.childImageSharp.fluid.src}
        author={{
          facebook: 'https://facebook.com/rayriffy',
          name: 'Phumrapee Limpianchop',
          twitter: '@rayriffy',
        }}
        type={`page`} />
      <Box my={4}>
        <Flex justifyContent={`center`}>
          <Box width={[1, 18/24, 16/24, 14/24]}>
            <Featured
              title={authorName}
              banner={banner}
              featured={false}
            />
          </Box>
        </Flex>
      </Box>
      <Box mb={3}>
        <Navbar
          align={`center`}
          tabs={[
            {
              href: author.facebook,
              name: 'Facebook',
            },
            {
              href: 'https://twitter.com/' + author.twitter.split('@')[1],
              name: 'Twitter',
            },
          ]}
        />
      </Box>
      <Box>
        <Flex justifyContent={`center`}>
          <Box width={[22/24, 22/24, 20/24, 18/24]}>
            <Flex flexWrap={`wrap`}>
              {posts.map(({node}) => {
                return (
                  <Box width={[1, 1, 1/2, 1/2]} p={3} key={node.fields.slug}>
                    <Card
                      slug={node.fields.slug}
                      author={props.data.authorsJson}
                      blog={node.frontmatter}
                      type={`listing`}
                    />
                  </Box>
                )
              })}
            </Flex>
          </Box>
        </Flex>
      </Box>
      <Pagination numPages={numPages} currentPage={currentPage} pathPrefix={pathPrefix} />
    </>
  )
}

export default AuthorBlog

export const pageQuery = graphql`
  query AuthorPage($author: String!, $limit: Int!, $regex: String!, $skip: Int!) {
    authorsJson(user: {eq: $author}) {
      user
      name
      facebook
      twitter
    }
    allMarkdownRemark(
      sort: {fields: [frontmatter___date], order: DESC}
      filter: {frontmatter: {author: {regex: $regex}}}
      limit: $limit
      skip: $skip
    ) {
      totalCount
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
  }
`
