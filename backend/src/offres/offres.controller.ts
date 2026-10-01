import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { FindOffresDto } from './dto/find-offres.dto';import { OffresService } from './offres.service';
import { CreateOffreDto } from './dto/create-offre.dto';
import { UpdateOffreDto } from './dto/update-offre.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';


@Controller('offres')
export class OffresController {
  constructor(private readonly offresService: OffresService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() createOffreDto: CreateOffreDto) {
    return this.offresService.create(createOffreDto);
  }

  @Get()
findAll(@Query() query: FindOffresDto) {
  return this.offresService.findAll(query);
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offresService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOffreDto: UpdateOffreDto) {
    return this.offresService.update(id, updateOffreDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.offresService.remove(id);
  }
}