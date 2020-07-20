import React from 'react';
import { Link } from 'gatsby';
import { createGlobalStyle } from 'styled-components';

import { rhythm, scale } from '../utils/typography';

export default ({ location, title, children }) => {
  // eslint-disable-next-line no-undef
  const rootPath = `${__PATH_PREFIX__}/`;
  let header;

  if (location.pathname === rootPath) {
    header = (
      <h1
        style={{
          ...scale(1.5),
          marginBottom: rhythm(1.5),
          marginTop: 0,
        }}
      >
        <Link
          style={{
            boxShadow: 'none',
            color: 'inherit',
          }}
          to="/"
        >
          {title}
        </Link>
      </h1>
    );
  } else {
    header = (
      <h3>
        <Link
          style={{
            boxShadow: 'none',
            color: 'inherit',
          }}
          to="/"
        >
          {title}
        </Link>
      </h3>
    );
  }
  return (
    <div
      style={{
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: rhythm(36),
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
      }}
    >
      <GlobalStyle />
      <header>{header}</header>
      <main>{children}</main>
    </div>
  );
};

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box
  }

  body {
    background: #272C36;
    color: #D4D4D4;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;
