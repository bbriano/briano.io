import React from 'react';
import styled from 'styled-components';
import Div100vh from 'react-div-100vh';

export default () => {
  return (
    <App>
      <Heading>
        <b>briano</b>
      </Heading>
      <Links>
        <Link href="https://github.com/bbriano" target="_blank">
          <b>Github</b>
        </Link>
      </Links>
    </App>
  );
};

const App = styled(Div100vh)`
  margin: auto;
  padding: 0 2em;
  max-width: 1800px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Heading = styled.span`
  font-family: Konstant Grotesk;
  font-size: 4em;
  animation: fadeIn 1s;
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Links = styled.div`
  display: flex;
  justify-content: flex-end;
  animation: fromRight 1s 300ms forwards;
  transform: translateX(60%);
  @keyframes fromRight {
    from {
      transform: translateX(60%);
    }
    to {
      transform: translateX(0);
    }
  }
`;

const Link = styled.a`
  font-family: Radio Grotesk;
  color: var(--red);
  transition: color 150ms;
  text-decoration: none;
  :hover {
    color: var(--magenta);
    text-decoration: underline;
  }
`;
