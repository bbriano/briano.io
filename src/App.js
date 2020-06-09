import React from 'react';
import styled from 'styled-components';
import Div100vh from 'react-div-100vh';

export default () => {
  return (
    <Center>
      <div>
        Hi, I'm Briano. I'm a Computer Science student living in Melbourne. I
        like to build web applications and other{' '}
        <a href="https://github.com/bbriano" target="_blank">
          random things
        </a>
        . At the moment, I'm thinking a lot about life (in particular{' '}
        <a
          href="https://notes.andymatuschak.org/Evergreen_notes"
          target="_blank"
        >
          Evergreen notes
        </a>
        ). I'm working on something similar to Andy's{' '}
        <a href="https://notes.andymatuschak.org/" target="_blank">
          working notes
        </a>{' '}
        system.
      </div>
    </Center>
  );
};

const Center = styled(Div100vh)`
  margin: 0 auto;
  padding: 0 3em;
  max-width: 960px;
  display: flex;
  align-items: center;
`;
