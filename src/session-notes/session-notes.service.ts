import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SessionNote } from "./session-note.entity";
import { CreateSessionNoteDto } from "./dto/create-session-note.dto";
import { UpdateSessionNoteDto } from "./dto/update-session-note.dto";

const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class SessionNotesService {
    constructor(
        @InjectRepository(SessionNote)
        private readonly repo: Repository<SessionNote>,
    ) {}

    create(trainerId: string, dto: CreateSessionNoteDto) {
        return this.repo.save(this.repo.create({ ...dto, trainerId }));

    }

    async update(id: number, trainerId: string, dto: UpdateSessionNoteDto) {
    const note = await this.repo.findOne({ where: { id } });
    if (!note) throw new NotFoundException('Session note not found');
    if (note.trainerId !== trainerId) {
      throw new ForbiddenException('You can only edit your own notes');
    }
    if (Date.now() - note.createdAt.getTime() > EDIT_WINDOW_MS) {
      throw new ForbiddenException('Notes are locked 24 hours after creation');
    }
    Object.assign(note, dto);
    return this.repo.save(note);
  }

    findByClient(clientId: string) {
    return this.repo
      .createQueryBuilder('n')
      .leftJoin('n.trainer', 't')
      .addSelect(['t.id', 't.name'])
      .where('n.clientId = :clientId', { clientId })
      .orderBy('n.createdAt', 'DESC')
      .getMany();
  
  }

   async findClientsByTrainer(trainerId: string) {
    const notes = await this.repo
      .createQueryBuilder('n')
      .leftJoin('n.client', 'c')
      .addSelect(['c.id', 'c.name'])
      .where('n.trainerId = :trainerId', { trainerId })
      .orderBy('n.createdAt', 'DESC')
      .getMany();

    const byClient = new Map<string, SessionNote[]>();
    for (const n of notes) {
      const list = byClient.get(n.clientId) ?? [];
      list.push(n);
      byClient.set(n.clientId, list);
    }

    const thisWeek = Math.floor(Date.now() / WEEK_MS);

    return Array.from(byClient.values()).map((list) => {
      const latest = list[0];
      const weeks = new Set(list.map((n) => Math.floor(n.createdAt.getTime() / WEEK_MS)));

      let streakWeeks = 0;
      let w = weeks.has(thisWeek) ? thisWeek : thisWeek - 1;
      while (weeks.has(w)) {
        streakWeeks++;
        w--;
      }

      let activeWeeks = 0;
      for (let i = 0; i < 4; i++) if (weeks.has(thisWeek - i)) activeWeeks++;

      return {
        client: latest.client,
        sessionsDone: list.length,
        streakWeeks,
        consistencyPercent: activeWeeks * 25,
        latestSession: {
          title: latest.title,
          notes: latest.notes,
          isPersonalRecord: latest.isPersonalRecord,
          createdAt: latest.createdAt,
        },
      };
    });
  } 

}
