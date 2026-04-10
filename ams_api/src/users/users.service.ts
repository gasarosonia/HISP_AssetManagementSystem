import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Department } from 'src/departments/entities/department.entity';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
  ) {
    console.log('[UsersService] Service Instantiated');
  }

  async onModuleInit() {
    console.log('[UsersService] onModuleInit triggered');
    await this.seedUsers();
  }

  async seedUsers() {
    try {
      console.log('[UsersService] [SEED] Starting synchronization...');

      const deptRepo = this.dataSource.getRepository(Department);
      const userRepo = this.dataSource.getRepository(User);

      const defaultDeptName = 'Operations';
      let defaultDept = await deptRepo.findOne({
        where: { name: defaultDeptName },
      });

      if (!defaultDept) {
        console.log(
          `[UsersService] [SEED] Creating Department: ${defaultDeptName}`,
        );
        defaultDept = deptRepo.create({
          name: defaultDeptName,
          type: 'Directorate',
          status: 'Active',
        });
        await deptRepo.save(defaultDept);
      }

      const usersToSeed = [
        {
          email: 'admin@hisprwanda.org',
          full_name: 'Test Admin',
          password: 'Admin123!',
          role: 'Admin and Finance Director',
        },
        {
          email: 'staff@hisprwanda.org',
          full_name: 'Test Staff',
          password: 'Staff123!',
          role: 'Staff',
        },
        {
          email: 'hod@hisprwanda.org',
          full_name: 'Test HOD',
          password: 'Hod123!',
          role: 'Head of Operations',
        },
        {
          email: 'ceo@hisprwanda.org',
          full_name: 'Test CEO',
          password: 'Ceo123!',
          role: 'Office of the CEO',
        },
      ];

      for (const seed of usersToSeed) {
        const hashedPassword = await bcrypt.hash(seed.password, 10);
        let user = await userRepo.findOne({ where: { email: seed.email } });

        if (!user) {
          console.log(`[UsersService] [SEED] Creating User: ${seed.email}`);
          user = userRepo.create({
            full_name: seed.full_name,
            email: seed.email,
            password_hash: hashedPassword,
            role: seed.role,
            department: defaultDept,
          });
        } else {
          console.log(`[UsersService] [SEED] Updating User: ${seed.email}`);
          user.password_hash = hashedPassword;
          user.role = seed.role;
          user.department = defaultDept;
          user.full_name = seed.full_name;
        }
        await userRepo.save(user);
      }
      console.log('[UsersService] [SEED] ALL USERS SYNCHRONIZED');
    } catch (error) {
      console.error('[UsersService] [SEED] ERROR:', error);
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { department_id, ...userData } = createUserDto;
    const user = this.userRepo.create({
      ...userData,
      department: { id: department_id } as Department,
    });
    return await this.userRepo.save(user);
  }

  async findAll(departmentId?: string): Promise<User[]> {
    if (departmentId) {
      return await this.userRepo.find({
        where: { department: { id: departmentId } },
        relations: ['department'],
      });
    }
    return await this.userRepo.find({ relations: ['department'] });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['department'],
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async findByName(full_name: string): Promise<User[]> {
    const users = await this.userRepo.find({
      where: { full_name },
      relations: ['department'],
    });
    if (!users || users.length === 0)
      throw new NotFoundException(`No users found with name '${full_name}'`);
    return users;
  }

  async findByEmail(email: string): Promise<User | null> {
    let user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password_hash')
      .leftJoinAndSelect('user.department', 'department')
      .where('user.email = :email', { email })
      .getOne();

    if (!user && email === 'ceo@hisprwanda.org') {
      console.log(
        `[UsersService] findByEmail: CEO not found. Triggering emergency re-seed...`,
      );
      await this.seedUsers();
      user = await this.userRepo
        .createQueryBuilder('user')
        .addSelect('user.password_hash')
        .leftJoinAndSelect('user.department', 'department')
        .where('user.email = :email', { email })
        .getOne();
    }

    if (user) {
      console.log(
        `[UsersService] findByEmail: Found user ${email}, has password_hash: ${!!user.password_hash}`,
      );
    } else {
      console.log(`[UsersService] findByEmail: User ${email} NOT found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    const { department_id, ...userData } = updateUserDto;

    if (department_id) {
      user.department = { id: department_id } as Department;
    }

    Object.assign(user, userData);
    return await this.userRepo.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepo.remove(user);
  }
}
