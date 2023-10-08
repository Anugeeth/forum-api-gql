import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/entities/role.enum';


@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) { }

  @Roles(Role.ADMIN, Role.USER)
  @Mutation(() => Category, { name: 'createCategory' })
  async createCategory(@Args('createCategoryInput') createCategoryInput: CreateCategoryInput) {
    return this.categoryService.create(createCategoryInput);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Query(() => [Category], { name: 'getAllCategory' })
  async findAll() {
    return this.categoryService.findAll();
  }

  @Roles(Role.ADMIN, Role.USER)
  @Query(() => Category, { name: 'category' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.categoryService.findOneById(id);
  }


  @Roles(Role.ADMIN)
  @Mutation(() => Category, { name: 'deleteCategory' })
  async removeCategory(@Args('id', { type: () => Int }) id: number) {
    return this.categoryService.remove(id);
  }
}
