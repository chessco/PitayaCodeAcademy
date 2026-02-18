import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(pass, user.passwordHash)) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async getProfile(userId: string) {
        const user = await this.usersService.findById(userId);
        if (!user) return null;
        const { passwordHash, ...result } = user;
        return result;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                memberships: user.memberships,
            }
        };
    }

    async signUp(email: string, pass: string, name?: string) {
        const existing = await this.usersService.findByEmail(email);
        if (existing) {
            throw new UnauthorizedException('User already exists');
        }
        const user = await this.usersService.create(email, pass, name);
        return this.login(user);
    }
}
