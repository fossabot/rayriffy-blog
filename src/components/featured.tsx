import React from 'react'

import Img, { FluidObject } from 'gatsby-image'

import { Box, Card, Heading, Link, Text } from 'rebass'
import styled from 'styled-components'

interface IGatsbyImage {
  height?: number
}

interface IProps {
  title: string
  subtitle?: string
  slug?: string
  banner: {
    childImageSharp: {
      fluid: FluidObject
    }
  }
  featured?: boolean
}

const GatsbyImage = styled(Img)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: -1;
  border-radius: 0px;
  height: ${(props: IGatsbyImage) => props.height || 'auto'};

  @media screen and (min-width: 40em) {
    border-radius: 6px;
  }
`

const FeaturedCard = styled(Card)`
  border-radius: 0px;

  @media screen and (min-width: 40em) {
    border-radius: 6px;
  }
`

const Component: React.SFC<IProps>  = props => {
  const {slug, banner, featured, title, subtitle} = props

  const RenderedCard = (
    <FeaturedCard color='white' bg='rgba(0,0,0,0.3)' style={{ position: 'relative' }} boxShadow={`0 25px 50px -12px rgba(0, 0, 0, 0.25)`}>
      <GatsbyImage fluid={banner.childImageSharp.fluid} />
      <Box px={[3, 3, 4, 4]} pb={[3, 3, 4, 4]} style={{ position: 'absolute', left: '0', bottom: '0' }}>
        {featured ? <Text fontSize={[14, 16, 18, 20]} mb={2}>FEATURED</Text> : null}
        <Heading fontSize={[24, 28, 32, 36]}>{title}</Heading>
        {subtitle ? <Text fontSize={[16, 18, 20, 22]}>{subtitle}</Text> : null}
      </Box>
    </FeaturedCard>
  )

  return (
    <>
      {slug ? <Link href={`${slug}`}>{RenderedCard}</Link> : RenderedCard}
    </>
  )
}

export default Component
