import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from '../hashing/hashing.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async signUp(data: SignUpDto) {
    try {
      const user = new User();
      user.email = data.email;
      user.password = await this.hashingService.hash(data.password);

      await this.userRepo.save(user);
    } catch (error) {
      const pgUniqueViolationErrorCode = '23505';
      if (error.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw error;
    }
  }

  async signIn(data: SignInDto) {
    const user = await this.userRepo.findOneBy({
      email: data.email,
    });

    if (!user) {
      throw new UnauthorizedException('This user not exists!');
    }

    const isEqual = await this.hashingService.compare(
      data.password,
      user.password,
    );

    if (!isEqual) {
      throw new UnauthorizedException('Email or password is not match!');
    }

    return true;
  }
}
