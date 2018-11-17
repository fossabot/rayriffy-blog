import React from "react"
import PropTypes from "prop-types"

export default class HTML extends React.Component {
  render() {
    console.log(this.props)
    return (
      <html {...this.props.htmlAttributes}>
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <link href="https://fonts.googleapis.com/css?family=Kanit" rel="stylesheet" />
          <link href="/icon.png" rel="shortcut icon" type="image/x-icon"></link>
          <link href="/icon.png" rel="apple-touch-icon-precomposed"></link>
          {this.props.headComponents}
        </head>
        <body {...this.props.bodyAttributes} bgcolor="#f5f5f5">
          <noscript>
            For full functionality of this site it is necessary to enable JavaScript.
            Here are the <a href="https://www.enable-javascript.com/">
            instructions how to enable JavaScript in your web browser</a>.
          </noscript>
          {this.props.preBodyComponents}
          <div
            key={`body`}
            id="___gatsby"
            dangerouslySetInnerHTML={{ __html: this.props.body }}
          />
          {this.props.postBodyComponents}
        </body>
      </html>
    )
  }
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
}