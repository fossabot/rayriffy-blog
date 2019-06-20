import React from 'react'
import Helmet from 'react-helmet'

import { graphql } from 'gatsby'
import { FluidObject } from 'gatsby-image'

import { Box, Flex } from 'rebass'

import Card from '../components/card'

interface PropsInterface {
  data: {
    site: {
      siteMetadata: {
        title: string
        siteUrl: string
        author: string
        fbApp: string
      }
    }
    banner: {
      childImageSharp: {
        fluid: FluidObject
      }
    }
  }
}

const NotFound: React.SFC<PropsInterface> = props => {
  return (
    <Flex justifyContent={`center`}>
      <Box width={[20/24, 18/24, 14/24, 12/24]} mb={4}>
        <Helmet title={'Not Found'} />
        <Card
          blog={{
            banner: props.data.banner,
            subtitle: 'Whoops! Looks like you&#39;re lost in the woods...with Cirno.',
            title: 'Not Found',
          }}
          type={`post`}>
            <Box px={[4, 5]} pb={4}>
              <a href="/">Back to home</a>
            </Box>
        </Card>
      </Box>
    </Flex>
  )
}

export default NotFound

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        siteUrl
        author
        fbApp
      }
    }
    banner: file(relativePath: {eq: "404.jpg"}) {
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
