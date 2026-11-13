import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SessionNote } from "./session-note.entity";
import { CreateSessionNoteDto } from "./dto/create-session-note.dto";
import { UpdateSessionNoteDto } from "./dto/update-session-note.dto";

const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000;

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

}
