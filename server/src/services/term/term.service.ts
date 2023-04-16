import { Injectable } from '@nestjs/common';
import { Term } from '../../interfaces/term.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TermService {
  constructor(private readonly prismaService: PrismaService) {}

  async createOrGetTerm(term: string): Promise<Term> {
    const createdTerm = await this.prismaService.term.upsert({
      where: { term },
      update: {},
      create: { term },
    });
    return createdTerm;
  }
}
