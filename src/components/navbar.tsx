import React, { ReactNode } from 'react'

import { Flex, Link, Text } from 'rebass'
import styled from 'styled-components'

const NavLink = styled(Link)`
  text-decoration: none;
`

const NavText = styled(Text)`
  @media (prefers-color-scheme: dark) {
    & {
      color: rgb(255, 255, 255);
    }
  }
`

interface IProps {
  align: string
  children?: ReactNode
  tabs: {
    name: string
    href: string
  }[]
}

const Component: React.FC<IProps> = props => {
  const { align, tabs } = props
  return (
    <Flex justifyContent={align}>
      {tabs.map(tab => {
        const {name, href} = tab

        return (
          <NavLink px={3} href={href} key={`navbar-${align}-${name}`}>
            <NavText color={`rgba(34, 34, 34, 1)`} fontFamily={`Lato, Helvetica, Arial, sans-serif`} fontSize={13}>{name.toUpperCase()}</NavText>
          </NavLink>
        )
      })}
    </Flex>
  )
}

export default Component
