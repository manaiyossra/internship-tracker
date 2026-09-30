import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { CandidaturesService } from './candidatures.service';
import { CreateCandidatureDto } from './dto/create-candidature.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('candidatures')
export class CandidaturesController {
  constructor(private readonly candidaturesService: CandidaturesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('candidat')
  @Post()
  create(@Req() req: any, @Body() createCandidatureDto: CreateCandidatureDto) {
    return this.candidaturesService.create(req.user.userId, createCandidatureDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('candidat')
  @Get('mes-candidatures')
  findMine(@Req() req: any) {
    return this.candidaturesService.findMine(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/statut')
  updateStatut(@Param('id') id: string, @Body('statut') statut: string) {
    return this.candidaturesService.updateStatut(id, statut);
  }
}