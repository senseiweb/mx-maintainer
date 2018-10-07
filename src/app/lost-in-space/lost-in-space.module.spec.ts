import { LostInSpaceModule } from './lost-in-space.module';

describe('LostInSpaceModule', () => {
  let lostInSpaceModule: LostInSpaceModule;

  beforeEach(() => {
    lostInSpaceModule = new LostInSpaceModule();
  });

  it('should create an instance', () => {
    expect(lostInSpaceModule).toBeTruthy();
  });
});
