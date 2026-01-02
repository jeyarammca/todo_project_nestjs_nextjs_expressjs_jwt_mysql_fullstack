import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from '../entities/todo.entity';
import { User } from '../entities/user.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
    constructor(
        @InjectRepository(Todo)
        private todoRepository: Repository<Todo>,
    ) { }

    async create(createTodoDto: CreateTodoDto, user: User): Promise<Todo> {
        const todo = this.todoRepository.create({
            ...createTodoDto,
            user,
        });
        return this.todoRepository.save(todo);
    }

    async findAll(user: User): Promise<Todo[]> {
        return this.todoRepository.find({
            where: { user: { id: user.id } },
        });
    }

    async findOne(id: number, user: User): Promise<Todo> {
        const todo = await this.todoRepository.findOne({
            where: { id, user: { id: user.id } },
        });
        if (!todo) {
            throw new NotFoundException(`Todo with ID "${id}" not found`);
        }
        return todo;
    }

    async update(id: number, updateTodoDto: UpdateTodoDto, user: User): Promise<Todo> {
        const todo = await this.findOne(id, user);
        Object.assign(todo, updateTodoDto);
        return this.todoRepository.save(todo);
    }

    async remove(id: number, user: User): Promise<void> {
        const todo = await this.findOne(id, user);
        await this.todoRepository.remove(todo);
    }
}
