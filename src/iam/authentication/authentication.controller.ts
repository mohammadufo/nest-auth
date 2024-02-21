import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Response } from 'express';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('sign-up')
  signUp(@Body() body: SignUpDto) {
    return this.authenticationService.signUp(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() body: SignInDto,
  ) {
    const accessToke = await this.authenticationService.signIn(body);
    // response.cookie('accessToken', accessToke, {
    //   secure: true,
    //   httpOnly: true,
    //   sameSite: true,
    // });

    return accessToke;
  }
}
