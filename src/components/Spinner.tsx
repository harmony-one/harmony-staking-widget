import * as React from 'react';
import styled, { keyframes } from 'styled-components';

const animation = keyframes`
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
`
const SVGSpinner = styled('svg')`
  animation: spin 1.6s linear infinite;
  animation-name: ${animation};
  circle {
    stroke: "#1d2b5e"
  }
`;

const SpinnerContainer = styled('div')`
  display: block;
  width: 60px;
  height: 60px;
  position: relative;

  &:after {
    display: block;
    content: '';
    position: absolute;
    background: url("https://s2.coinmarketcap.com/static/img/coins/64x64/3945.png");
    background-size: cover;
    width: 40px;
    height: 40px;
    top: 9px;
    left: 10px;
  }
`;

export const Spinner: React.FC<React.SVGAttributes<SVGElement> & {
  boxSize?: number;
}> = props => {
  const boxSize = props.boxSize || 16;
  const radius = boxSize / 2 - 1;
  const middle = boxSize / 2;
  return (
    <SpinnerContainer>
      <SVGSpinner
        viewBox={`0 0 ${boxSize} ${boxSize}`}
        {...props}
      >
        <circle
          r={radius}
          cx={middle}
          cy={middle}
          strokeWidth="1"
          fill="none"
          stroke={props.color || 'black'}
          strokeDasharray={Math.floor(2 * radius * Math.PI - 6)}
        />
      </SVGSpinner>
    </SpinnerContainer>
  );
};

Spinner.displayName = 'Spinner';