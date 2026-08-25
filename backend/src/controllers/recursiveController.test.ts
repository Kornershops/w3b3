import { RecursiveController } from './recursiveController';
import { recursiveYieldService } from '../services/recursiveYieldService';

jest.mock('../services/recursiveYieldService', () => ({
  recursiveYieldService: {
    getActiveStrategies: jest.fn(),
    simulateLoop: jest.fn(),
  },
}));

describe('RecursiveController', () => {
  const controller = new RecursiveController();

  const response = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => jest.clearAllMocks());

  it('rejects unauthenticated requests', async () => {
    const req: any = { body: { strategyId: 'strat-eth-001', amount: '100', leverage: 2 } };
    const res = response();

    await controller.simulateAction(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'strategyId and authenticated user are required' });
    expect(recursiveYieldService.simulateLoop).not.toHaveBeenCalled();
  });

  it('rejects invalid amount', async () => {
    const req: any = {
      user: { id: 'user-1' },
      body: { strategyId: 'strat-eth-001', amount: '0', leverage: 2 },
    };
    const res = response();

    await controller.simulateAction(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(recursiveYieldService.simulateLoop).not.toHaveBeenCalled();
  });

  it('rejects invalid leverage', async () => {
    const req: any = {
      user: { id: 'user-1' },
      body: { strategyId: 'strat-eth-001', amount: '100', leverage: 0 },
    };
    const res = response();

    await controller.simulateAction(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(recursiveYieldService.simulateLoop).not.toHaveBeenCalled();
  });

  it('passes validated input to the service', async () => {
    const simulation = { canExecute: true, healthFactor: 1.42 };
    (recursiveYieldService.simulateLoop as jest.Mock).mockResolvedValue(simulation);

    const req: any = {
      user: { id: 'user-1' },
      body: { strategyId: 'strat-eth-001', amount: '100', leverage: '2.5' },
    };
    const res = response();

    await controller.simulateAction(req, res);

    expect(recursiveYieldService.simulateLoop).toHaveBeenCalledWith('user-1', 'strat-eth-001', '100', 2.5);
    expect(res.json).toHaveBeenCalledWith(simulation);
  });

  it('maps strategy-limit failures to HTTP 400', async () => {
    (recursiveYieldService.simulateLoop as jest.Mock).mockRejectedValue(
      new Error('Requested leverage exceeds strategy maximum'),
    );

    const req: any = {
      user: { id: 'user-1' },
      body: { strategyId: 'strat-stable-001', amount: '100', leverage: 1.5 },
    };
    const res = response();

    await controller.simulateAction(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Requested leverage exceeds strategy maximum' });
  });
});
