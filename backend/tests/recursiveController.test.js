const { RecursiveController } = require('../dist/controllers/recursiveController');
const { recursiveYieldService } = require('../dist/services/recursiveYieldService');

describe('RecursiveController', () => {
  const controller = new RecursiveController();

  const response = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  let simulateLoop;

  beforeEach(() => {
    jest.restoreAllMocks();
    simulateLoop = jest.spyOn(recursiveYieldService, 'simulateLoop');
  });

  test('rejects unauthenticated requests', async () => {
    const req = { body: { strategyId: 'strat-eth-001', amount: '100', leverage: 2 } };
    const res = response();
    await controller.simulateAction(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(simulateLoop).not.toHaveBeenCalled();
  });

  test('rejects invalid amount', async () => {
    const req = { user: { id: 'user-1' }, body: { strategyId: 'strat-eth-001', amount: '0', leverage: 2 } };
    const res = response();
    await controller.simulateAction(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(simulateLoop).not.toHaveBeenCalled();
  });

  test('rejects invalid leverage', async () => {
    const req = { user: { id: 'user-1' }, body: { strategyId: 'strat-eth-001', amount: '100', leverage: 0 } };
    const res = response();
    await controller.simulateAction(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(simulateLoop).not.toHaveBeenCalled();
  });

  test('passes validated input to the service', async () => {
    const simulation = { canExecute: true, healthFactor: 1.42 };
    simulateLoop.mockResolvedValue(simulation);
    const req = { user: { id: 'user-1' }, body: { strategyId: 'strat-eth-001', amount: '100', leverage: '2.5' } };
    const res = response();
    await controller.simulateAction(req, res);
    expect(simulateLoop).toHaveBeenCalledWith('user-1', 'strat-eth-001', '100', 2.5);
    expect(res.json).toHaveBeenCalledWith(simulation);
  });

  test('maps strategy-limit failures to HTTP 400', async () => {
    simulateLoop.mockRejectedValue(new Error('Requested leverage exceeds strategy maximum'));
    const req = { user: { id: 'user-1' }, body: { strategyId: 'strat-stable-001', amount: '100', leverage: 1.5 } };
    const res = response();
    await controller.simulateAction(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Requested leverage exceeds strategy maximum' });
  });
});
