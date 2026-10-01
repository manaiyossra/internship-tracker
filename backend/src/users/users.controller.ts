import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(JwtAuthGuard)
@Post('me/cv')
@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, callback) => {
        const uploadPath = './uploads/cv';
        fs.mkdirSync(uploadPath, { recursive: true });
        callback(null, uploadPath);
      },
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(pdf|doc|docx)$/i)) {
        return callback(new BadRequestException('Seuls les fichiers PDF, DOC ou DOCX sont acceptés'), false);
      }
      callback(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  }),
)
uploadCv(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
  return this.usersService.updateCv(req.user.userId, `/uploads/cv/${file.filename}`);
}

@UseGuards(JwtAuthGuard)
@Post('me/lettre-motivation')
@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, callback) => {
        const uploadPath = './uploads/lettres';
        fs.mkdirSync(uploadPath, { recursive: true });
        callback(null, uploadPath);
      },
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(pdf|doc|docx)$/i)) {
        return callback(new BadRequestException('Seuls les fichiers PDF, DOC ou DOCX sont acceptés'), false);
      }
      callback(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  }),
)
uploadLettreMotivation(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
  return this.usersService.updateLettreMotivation(req.user.userId, `/uploads/lettres/${file.filename}`);
}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}