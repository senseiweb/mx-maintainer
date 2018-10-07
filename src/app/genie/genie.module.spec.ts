import { GenieModule } from './genie.module';

describe('GenerationManagerModule', () => {
  let genMgrModule: GenieModule;

  beforeEach(() => {
    genMgrModule = new GenieModule();
  });

  it('should create an instance', () => {
    expect(genMgrModule).toBeTruthy();
  });
});
