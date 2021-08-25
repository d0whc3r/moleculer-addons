import { SlackService } from '../src';

describe('Test mixin generated for slack', () => {
  it('should exist', () => {
    expect(SlackService).toBeDefined();
  });
  // it('should have name and settings', () => {
  //   expect(SlackService)
  //     .toBeObject()
  //     .toContainEntries([
  //       ['name', 'slack'],
  //       ['settings', expect.any(Object)]
  //     ]);
  //   expect(SlackService.settings).toBeObject().toContainAllKeys(['slackToken', 'slackChannel']);
  // });
  it('should have action', () => {
    expect(SlackService).toBeObject().toContainKeys(['actions']);
    expect(SlackService.actions)
      .toBeObject()
      .toContainEntry(['sendMessage', expect.any(Object)]);
    expect(SlackService.actions.sendMessage)
      .toBeObject()
      .toContainEntries([
        ['handler', expect.any(Function)],
        ['name', 'send'],
        ['params', expect.any(Object)]
      ]);
    expect((SlackService.actions.sendMessage as any).params)
      .toBeObject()
      .toContainAllKeys(['channel', 'message', 'token']);
  });
  it('should have method', () => {
    expect(SlackService).toBeObject().toContainKeys(['methods']);
    expect(SlackService.methods)
      .toBeObject()
      .toContainEntry(['sendMessageToChannels', expect.any(Function)]);
  });
});
