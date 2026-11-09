import { Test, TestingModule } from '@nestjs/testing';
import { TrainersController } from './trainers.controller';
import { TrainersService } from './trainers.service';

describe('TrainersController', () => {
  let controller: TrainersController;

  const serviceStub = {
    create: async () => ({}),
    search: async () => ({ data: [], total: 0, page: 1, limit: 10 }),
    findOne: async () => ({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainersController],
      providers: [{ provide: TrainersService, useValue: serviceStub }],
    }).compile();

    controller = module.get(TrainersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('search returns paginated result', async () => {
    const result = await controller.search({});
    expect(result.total).toBe(0);
  });
});