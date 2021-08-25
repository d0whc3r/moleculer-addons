import { TelegramService } from '../src';

describe('Test mixin generated for telegram', () => {
  it('should exist', () => {
    expect(TelegramService).toBeDefined();
  });
  // it('should have name and settings', () => {
  //   expect(TelegramService)
  //     .toBeObject()
  //     .toContainEntries([
  //       ['name', 'telegram'],
  //       ['settings', expect.any(Object)]
  //     ]);
  //   expect(TelegramService.settings).toBeObject().toContainAllKeys(['telegramToken', 'telegramChannel', 'telegramExtraInfo']);
  // });
  it('should have action', () => {
    expect(TelegramService).toBeObject().toContainKeys(['actions']);
    expect(TelegramService.actions)
      .toBeObject()
      .toContainEntry(['sendMessage', expect.any(Object)]);
    expect(TelegramService.actions.sendMessage)
      .toBeObject()
      .toContainEntries([
        ['handler', expect.any(Function)],
        ['name', 'send'],
        ['params', expect.any(Object)]
      ]);
    expect((TelegramService.actions.sendMessage as any).params)
      .toBeObject()
      .toContainAllKeys(['channel', 'extra', 'message', 'token']);
  });
  it('should have method', () => {
    expect(TelegramService).toBeObject().toContainKeys(['methods']);
    expect(TelegramService.methods)
      .toBeObject()
      .toContainEntry(['sendMessageToChannels', expect.any(Function)]);
  });
});
