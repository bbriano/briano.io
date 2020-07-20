import React from 'react';
import styled from 'styled-components';
import { rhythm } from '../utils/typography';

export default ({ children, vertical, gap }) => {
  const Row = styled.div`
    display: flex;
    flex-direction: ${vertical ? 'column' : 'row'};
    gap: ${rhythm(gap || 1)};
  `;

  return (
    <Row>
      {children}
    </Row>
  );
};
