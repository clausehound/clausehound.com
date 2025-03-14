import { createElement as h } from 'react';
import PawLogo from '@atoms/logo';
import styled from 'styled-components';
import Link from '@atoms/link';
import { media } from '@utils/media';

const Navigation = ({ siteTitle = '' }: { siteTitle: string }) => h(Nav, null, h(PawLogo));

export default Navigation;

const Nav = styled.nav`
  align-items: center;
  display: flex;
  justify-content: flex-start;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1000;
  flex-wrap: wrap;
  padding: 1rem;
  @media ${media.lg} {
    padding: 2rem;
  }
`;

const NavLinks = styled.ul`
  display: flex;
  justify-content: flex-start;
  list-style: none;
  margin: 0;
  padding-left: 0;
  padding-top: 0;
  @media ${media.md} {
    padding-left: 2rem;
    padding-top: 0.5rem;
  }

  li {
    margin: 0;

    a {
      font-size: 16px;
      font-weight: 500;
    }
  }
`;

const NavLink = styled(Link)({
  marginRight: '1.75rem',
  lineHeight: '1.1rem',
});
