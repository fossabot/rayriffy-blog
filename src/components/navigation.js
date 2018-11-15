import React from 'react'

import navStyle from './navigation.module.css'

class Template extends React.Component {
  render() {
    const { children } = this.props
    return (
      <div className={navStyle.navpost}>
        {children}
      </div>
    )
  }
}

export default Template
