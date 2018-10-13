import { KingMakerModule } from './king-maker.module';

describe('KingMakerModule', () => {
  let kingMakerModule: KingMakerModule;

  beforeEach(() => {
    kingMakerModule = new KingMakerModule();
  });

  it('should create an instance', () => {
    expect(kingMakerModule).toBeTruthy();
  });
});
