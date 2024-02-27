import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ApiKeysService } from '../api-keys.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiKey } from 'src/users/api-keys/entities/api-key.entity';
import { Repository } from 'typeorm';
import { REQUEST_USER_KEY } from 'src/iam/iam.constant';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly apiKeyService: ApiKeysService,
    @InjectRepository(ApiKey)
    private readonly apiKeyRepo: Repository<ApiKey>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = this.extractKeyForHeader(request);
    if (!apiKey) {
      throw new UnauthorizedException();
    }
    const apiKeyEntityId = this.apiKeyService.extractIdFromApiKey(apiKey);
    try {
      const apiKeyEntity = await this.apiKeyRepo.findOne({
        where: { uuid: apiKeyEntityId },
        relations: { user: true },
      });
      await this.apiKeyService.validate(apiKey, apiKeyEntity.key);
      request[REQUEST_USER_KEY] = {
        sub: apiKeyEntity.user.id,
        email: apiKeyEntity.user.email,
        role: apiKeyEntity.user.role,
        permissions: apiKeyEntity.user.permissions,
      } as ActiveUserData;
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractKeyForHeader(request: Request): string | undefined {
    const [type, key] = request.headers.authorization?.split(' ') ?? [];
    return type === 'ApiKey' ? key : undefined;
  }
}
