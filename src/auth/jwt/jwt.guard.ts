import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';

type Payload = {
	id: string
	name: string
}

@Injectable()
export class JwtGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userService: UserService
	) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
	const request: Request = context.switchToHttp().getRequest()

	if(!request.headers.authorization) {
		throw new UnauthorizedException('Auth token not provided')
	}

	return this.attachUserToRequest(request)
  }

  async attachUserToRequest(request: Request) {
	const token = request.headers.authorization.split(' ')

	if(token[0] !== 'Bearer') {
		throw new UnauthorizedException('Invalid Token Bearer')
	}
	try {
		const payload: Payload = await this.jwtService.verifyAsync(token[1], {
			secret: process.env.JWT_SECRET
		})
		const [user] = await this.userService.userById(payload.id)
		request['user'] = user
		return true
	}
	catch(e) {
		console.error(e)
		throw new UnauthorizedException('Auth token expired or is invalid')
	}




  }
}
