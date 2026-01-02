import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../entities/user.entity';

@Controller('todos')
@UseGuards(AuthGuard('jwt'))
export class TodosController {
    constructor(private readonly todosService: TodosService) { }

    @Post()
    create(@Body() createTodoDto: CreateTodoDto, @GetUser() user: User) {
        return this.todosService.create(createTodoDto, user);
    }

    @Get()
    findAll(@GetUser() user: User) {
        return this.todosService.findAll(user);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @GetUser() user: User) {
        return this.todosService.findOne(+id, user);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto, @GetUser() user: User) {
        return this.todosService.update(+id, updateTodoDto, user);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @GetUser() user: User) {
        return this.todosService.remove(+id, user);
    }
}
