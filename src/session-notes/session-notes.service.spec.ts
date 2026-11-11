import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SessionNotesService } from './session-notes.service';
import { SessionNote } from './session-note.entity';

const HOUR = 60 * 60 * 1000;

describe('SessionNotesService', () => {
  let service: SessionNotesService;
  let stored: Partial<SessionNote> | null;

  const repoStub = {
    findOne: async () => stored,
    save: async (n: Partial<SessionNote>) => n,
    create: (n: Partial<SessionNote>) => n,
    find: async () => [],
  };

  beforeEach(async () => {
    stored = null;
    const module = await Test.createTestingModule({
      providers: [
        SessionNotesService,
        { provide: getRepositoryToken(SessionNote), useValue: repoStub },
      ],
    }).compile();
    service = module.get(SessionNotesService);
  });

  it('throws NotFound when the note does not exist', async () => {
    await expect(service.update(1, 'trainer-1', { notes: 'x' })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('blocks a different trainer from editing', async () => {
    stored = { id: 1, trainerId: 'trainer-1', notes: 'old', createdAt: new Date() };
    await expect(service.update(1, 'trainer-2', { notes: 'x' })).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('blocks edits after the 24 hour window', async () => {
    stored = {
      id: 1,
      trainerId: 'trainer-1',
      notes: 'old',
      createdAt: new Date(Date.now() - 25 * HOUR),
    };
    await expect(service.update(1, 'trainer-1', { notes: 'x' })).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('allows the author to edit within 24 hours', async () => {
    stored = {
      id: 1,
      trainerId: 'trainer-1',
      notes: 'old',
      createdAt: new Date(Date.now() - 2 * HOUR),
    };
    const result = await service.update(1, 'trainer-1', { notes: 'new' });
    expect(result.notes).toBe('new');
  });
});