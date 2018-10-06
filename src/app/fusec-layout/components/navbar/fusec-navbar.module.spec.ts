import { FusecNavbarModule } from './fusec-navbar.module';

describe('NavbarModule', () => {
  let navbarModule: FusecNavbarModule;

  beforeEach(() => {
    navbarModule = new FusecNavbarModule();
  });

  it('should create an instance', () => {
    expect(navbarModule).toBeTruthy();
  });
});
