import { GenerationManagerModule } from './generation-manager.module';

describe('GenerationManagerModule', () => {
  let generationManagerModule: GenerationManagerModule;

  beforeEach(() => {
    generationManagerModule = new GenerationManagerModule();
  });

  it('should create an instance', () => {
    expect(generationManagerModule).toBeTruthy();
  });
});
