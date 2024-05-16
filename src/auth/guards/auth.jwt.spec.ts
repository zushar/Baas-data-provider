import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtAuthGuard } from './auth.jwt';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should allow access for valid tokens', async () => {
    const context: ExecutionContext =
      createMockExecutionContextWithToken('validToken');
    (jwtService.verify as jest.Mock).mockReturnValue({ userId: 1 }); // Simulate a valid token verification

    expect(guard.canActivate(context)).toBeTruthy();
  });

  it('should throw UnauthorizedException for invalid tokens', async () => {
    const context: ExecutionContext =
      createMockExecutionContextWithToken('invalidToken');
    (jwtService.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    // Correctly awaiting and using rejects.toThrow for asynchronous exception checking
    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException when no token is provided', async () => {
    const context: ExecutionContext = createMockExecutionContextWithToken(null);

    // Again, using the correct pattern for asynchronous exception checking
    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  // Helper function to mock ExecutionContext
  function createMockExecutionContextWithToken(
    token: string | null,
  ): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          cookies: {
            'session-token': token,
          },
        }),
      }),
    } as ExecutionContext;
  }
});
