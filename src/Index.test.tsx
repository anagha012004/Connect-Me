import {
  act,
  configure,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';

import '__mocks__/matchMedia';
import { App } from 'App/App';
import { AppProvider, reducer } from 'App/AppContext';
import { Footer } from 'components';
import { themes } from 'appearance';

configure({ testIdAttribute: 'data-v2' });

describe('application tests', () => {
  beforeEach(async () => {
    await act(async () => render(<App />));
  });

  /**
   * Check content element
   * @param {HTMLElement} element Element for the content
   * @param {RegExp} display Display value for the content
   * @param {string} link Optional link within the content
   */
  const checkContent = (
    element: HTMLElement,
    display: RegExp,
    link?: string,
    skipA11yNameCheck?: boolean,
  ) => {
    expect(element).toBeVisible();
    if (!skipA11yNameCheck) expect(element).toHaveAccessibleName();
    expect(element).toHaveTextContent(display);
    if (link) expect(element).toHaveAttribute('href', link);
  };

  /**
   * Check button element
   * @param {HTMLElement} parent Parent element for the button
   * @param {HTMLElement} child Child element for the button
   * @param {RegExp} display Display value for the button
   * @param {string} link Link within the button
   */
  const checkButton = (
    parent: HTMLElement,
    child: HTMLElement,
    display: RegExp,
    link: string,
  ) => {
    expect(child).toHaveTextContent(display);

    expect(parent).toBeVisible();
    expect(parent).toHaveAccessibleName();
    expect(parent).toHaveAttribute('href', link);
  };

  it('should render name: Anagha Badhe', () => {
    const element = screen.getByTestId('name');

    checkContent(element, /^Anagha Badhe$/, undefined, true);
  });

  it('should render title: Student', () => {
    const element = screen.getByTestId('title');

    checkContent(element, /^Student$/, undefined, true);
  });

  it('should render creator', () => {
    const element = screen.getByTestId('creator');

    checkContent(
      element,
      /^Anagha$/,
      'https://anagha012004.github.io/anaghawebsite.github.io/',
    );
  });

  it('should render link to source code', () => {
    const element = screen.getByTestId('source');

    checkContent(
      element,
      /^Source$/,
      'https://github.com/anagha012004/Connect-Me',
    );
  });

  it('should render GitHub button', () => {
    const parent = screen.getByTestId('button-GitHub');
    const child = screen.getByTestId('GitHub');

    checkButton(parent, child, /^GitHub$/, 'https://github.com/anagha012004');
  });

  it('should render LinkedIn button', () => {
    const parent = screen.getByTestId('button-LinkedIn');
    const child = screen.getByTestId('LinkedIn');

    checkButton(
      parent,
      child,
      /^LinkedIn$/,
      'https://www.linkedin.com/in/anagha-badhe-98366325a/',
    );
  });

  it('should render Resume button', () => {
    const parent = screen.getByTestId('button-Resume');
    const child = screen.getByTestId('Resume');

    checkButton(
      parent,
      child,
      /^Resume$/,
      'https://drive.google.com/file/d/1G2OlyroAmSZQ1hVD7zKxDeSUTKO0uwdH/view?usp=sharing',
    );
  });

  it('should render Email button', () => {
    const parent = screen.getByTestId('button-Email');
    const child = screen.getByTestId('Email');

    checkButton(parent, child, /^Email$/, 'mailto:anaghabadhe3@gmail.com');
  });

  it('should toggle between the dark and light themes', () => {
    const toggle = screen.getByTestId('toggle');
    const particles = screen.getByTestId('particles');

    expect(toggle).toBeVisible();
    expect(toggle).toHaveAccessibleName();
    expect(toggle).toHaveAccessibleDescription();

    expect(particles).toBeVisible();

    // site should default to the dark theme
    expect(toggle).toBeChecked();
    expect(particles).toHaveStyle({ backgroundColor: '#000' });

    // click the toggle
    fireEvent.click(toggle);

    // the light theme should be visible
    expect(toggle).not.toBeChecked();
    expect(particles).toHaveStyle({ backgroundColor: '#fff' });
  });

  it('should render full footer on desktop', () => {
    const footer = screen.getByTestId('footer');

    expect(footer).toHaveTextContent(
      /^Designed and built by Anagha Badhe \| Source$/,
    );
  });
});

describe('app context tests', () => {
  it('should render partial footer on mobile', async () => {
    await act(async () =>
      render(
        <AppProvider
          config={{} as any}
          isMobile={true}
          children={<Footer />}
        />,
      ),
    );

    // partial footer should now be visible
    const footer = screen.getByTestId('footer');

    expect(footer).toHaveTextContent(/^Designed and built by Anagha Badhe$/);
    expect(footer).not.toHaveTextContent(/Source/);
  });

  describe('reducer tests', () => {
    it('should return the initial state', () => {
      const state = reducer(undefined, {});

      expect(state).toEqual(undefined);
    });

    it('should return the dark theme', () => {
      const state = reducer(undefined, { type: 'SET_THEME', value: 'dark' });

      expect(state).toEqual({ theme: themes.dark });
    });

    it('should return the light theme', () => {
      const state = reducer(undefined, { type: 'SET_THEME', value: 'light' });

      expect(state).toEqual({ theme: themes.light });
    });
  });
});

describe('local storage tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should show the dark theme when 'theme' is set to 'true' in local storage", async () => {
    // set local storage item and render the app
    localStorage.setItem('theme', 'true');
    await act(async () => render(<App />));

    // check that the local storage item has been updated correctly
    expect(localStorage.getItem('theme')).toEqual('dark');
    const particles = screen.getByTestId('particles');
    expect(particles).toHaveStyle({ backgroundColor: '#000' });
  });

  it("should show the light theme when 'theme' is set to 'false' in local storage", async () => {
    // set local storage item and render the app
    localStorage.setItem('theme', 'false');
    await act(async () => render(<App />));

    // check that the local storage item has been updated correctly
    expect(localStorage.getItem('theme')).toEqual('light');

    const particles = screen.getByTestId('particles');
    expect(particles).toHaveStyle({ backgroundColor: '#fff' });
  });

  // https://testing-library.com/docs/react-testing-library/api/#rerender
  it('should persist the light theme through an app re-render', async () => {
    const { rerender } = render(<App />);

    expect(localStorage.getItem('theme')).toBeNull();
    localStorage.setItem('theme', 'light');

    // re-render the app and check the theme
    await act(async () => rerender(<App />));
    const particles = screen.getByTestId('particles');

    expect(localStorage.getItem('theme')).toEqual('light');
    expect(particles).toHaveStyle({ backgroundColor: '#fff' });
  });

  it('should change local storage value when toggle is clicked', async () => {
    // set local storage item and render the app
    localStorage.setItem('theme', 'light');
    await act(async () => render(<App />));

    // click the toggle
    const toggle = screen.getByTestId('toggle');
    fireEvent.click(toggle);

    // check that the local storage item has been changed
    expect(localStorage.getItem('theme')).not.toEqual('light');
  });
});
