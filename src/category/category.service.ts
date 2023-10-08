import { Injectable } from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>
  ) { }
  async create(createCategoryInput: CreateCategoryInput) {
    let category=  this.categoryRepository.create(createCategoryInput)
    return this.categoryRepository.save(category)
  }

  async findOneById(id: number): Promise<Category> {
    return this.categoryRepository.findOneBy({ id });
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async remove(id: number) {
    let category = await this.findOneById(id);
    return this.categoryRepository.remove(category);
  }
}
