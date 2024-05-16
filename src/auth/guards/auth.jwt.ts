import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['session-token']; // Assuming the JWT is stored in a cookie named 'session-token'

    // Immediately reject if no token is provided
    if (!token) {
      return Promise.reject(
        new UnauthorizedException('No authentication token provided.'),
      );
    }

    // Attempt to verify the token asynchronously
    return new Promise((resolve, reject) => {
      try {
        const decoded = this.jwtService.verify(token); // Synchronously verifies the token
        request.user = decoded; // Attach the decoded JWT payload to the request object
        resolve(true);
      } catch (error) {
        reject(new UnauthorizedException('Invalid authentication token.'));
      }
    });
  }
}
