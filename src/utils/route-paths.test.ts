import {
  rootPath,
  homePagePath,
  codingPagePath,
  photographyPagePath,
  gamingPagePath,
  aboutPagePath,
  contactPagePath,
} from './route-paths';

describe('Route Paths', () => {
  it('should have the correct root path', () => {
    expect(rootPath).toBe('/');
  });

  it('should have the correct home page path', () => {
    expect(homePagePath).toBe('/');
  });

  it('should have the correct coding page path', () => {
    expect(codingPagePath).toBe('/coding');
  });

  it('should have the correct photography page path', () => {
    expect(photographyPagePath).toBe('/photography');
  });

  it('should have the correct gaming page path', () => {
    expect(gamingPagePath).toBe('/gaming');
  });

  it('should have the correct about page path', () => {
    expect(aboutPagePath).toBe('/about');
  });

  it('should have the correct contact page path', () => {
    expect(contactPagePath).toBe('/contact');
  });
});
