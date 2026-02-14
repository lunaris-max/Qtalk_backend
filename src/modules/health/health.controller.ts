import { Controller, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HealthService } from './health.service';
import { HealthResponseDto } from './dto/health-response.dto';
import { Public } from '@src/common/decorators';
import { routesV1 } from '@src/config';

@ApiTags(routesV1.health.root)
@Controller(routesV1.version)
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get(routesV1.health.liveness)
  @ApiOperation({
    summary: 'Liveness probe',
    description: 'Checks that the Node.js process is alive',
  })
  @ApiOkResponse({ type: HealthResponseDto })
  liveness(): HealthResponseDto {
    return this.healthService.liveness();
  }

  @Public()
  @Get(routesV1.health.readiness)
  @ApiOperation({
    summary: 'Readiness probe',
    description: 'Checks if the service is ready to receive traffic',
  })
  @ApiOkResponse({ type: HealthResponseDto })
  @ApiServiceUnavailableResponse({ type: HealthResponseDto })
  async readiness(): Promise<HealthResponseDto> {
    return this.healthService.readiness();
  }

  @Public()
  @Get(routesV1.health.root)
  @ApiOperation({
    summary: 'Full health status',
    description: 'Detailed health information for monitoring and debugging',
  })
  @ApiOkResponse({ type: HealthResponseDto })
  @ApiServiceUnavailableResponse({ type: HealthResponseDto })
  async full(): Promise<HealthResponseDto> {
    return this.healthService.full();
  }
}
