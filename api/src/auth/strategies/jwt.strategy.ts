import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'super-secret', // Use env in prod
        });
    }

    async validate(payload: any) {
        // In our payload we'll store userId and email
        // We provide both 'id' and 'userId' for compatibility with different controllers
        return {
            id: payload.sub,
            userId: payload.sub,
            email: payload.email
        };
    }
}
