import React from 'react';
import styled from 'styled-components';
import { rhythm } from '../utils/typography';

export default ({ padding, children, style }) => {
  const Card = styled.div`
    padding: ${rhythm(padding || 1)};
    box-shadow: ${rhythm(0.4)} ${rhythm(0.4)} ${rhythm(0.4)} #22222230;
    border: ${rhythm(0.1)} solid #22222230;
    border-radius: ${rhythm(0.2)};
  `;

  return (
    <Card style={style}>{children}</Card>
  );
};
