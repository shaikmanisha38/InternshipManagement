import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signupDto: SignupDto) {
    const { name, email, password, role, college, department } = signupDto;

    // 1. Defensive Unique Constraints: Explicit async lookup
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    // 2. Cryptographic Protection: Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Ensure role exists or let it throw if invalid
    // We connect the role by roleName. Ensure Roles are seeded in DB first!
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: { connect: { roleName: role as any } },
        college,
        department,
      },
      include: { role: true }
    });

    // Strip password from response
    const { password: _, role: userRole, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, role: userRole.roleName };
  }

  async logIn(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 1. Strict Existence Check
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true }
    });

    if (!user) {
      throw new UnauthorizedException('Please signup before login');
    }

    // 2. Password Match Verification
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 3. Token Emission
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role.roleName,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.roleName,
      }
    };
  }
}
