import { useContext } from 'react';
import styled, { css } from 'styled-components';

import { AppContext } from 'App/AppContext';
import { Theme } from 'types';

const sharedStyles = css`
  transition: color 0.5s linear;
  font-weight: normal;
  position: relative;
  z-index: 1;
`;

const C = {
  Name: styled.div<{ $theme: Theme }>`
    ${sharedStyles};
    font-size: 6rem;
    color: ${({ $theme }) => $theme.primaryTextColor};
    @media only screen and (max-device-width: 820px) and (-webkit-min-device-pixel-ratio: 2) {
      font-size: 4.5rem;
    }
  `,
  Title: styled.div<{ $theme: Theme }>`
    ${sharedStyles};
    font-size: 3.5rem;
    margin: 4rem 0;
    color: ${({ $theme }) => $theme.secondaryTextColor};
    @media only screen and (max-device-width: 820px) and (-webkit-min-device-pixel-ratio: 2) {
      font-size: 2.5rem;
    }
  `,
};

export const Content = () => {
  const { config, theme } = useContext(AppContext);

  return (
    <>
      <C.Name
        data-v2="name"
        aria-label={config.name.aria}
        title={config.name.aria}
        $theme={theme}
      >
        {config.name.display}
      </C.Name>
      <C.Title
        data-v2="title"
        aria-label={config.title.aria}
        title={config.title.aria}
        $theme={theme}
      >
        {config.title.display}
      </C.Title>
    </>
  );
};