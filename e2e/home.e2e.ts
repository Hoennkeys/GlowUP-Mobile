describe('Home Screen', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('shows home screen with at least one campaign card', async () => {
    await waitFor(element(by.id('home-screen')))
      .toBeVisible()
      .withTimeout(10000);

    await waitFor(element(by.id('campaign-card-camp-1')))
      .toBeVisible()
      .withTimeout(10000);
  });
});
