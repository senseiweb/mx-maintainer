import { TimeKeeperModule } from './time-keeper.module';

describe('TimeKeeperModule', () => {
  let timeKeeperModule: TimeKeeperModule;

  beforeEach(() => {
    timeKeeperModule = new TimeKeeperModule();
  });

  it('should create an instance', () => {
    expect(timeKeeperModule).toBeTruthy();
  });
});
