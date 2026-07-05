import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@ApiTags('dashboard')
@ApiBearerAuth()
@UseGuards(PermissionsGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @Permissions('dashboard.read')
  getStats(@Query('range') range?: 'today' | '7days' | '30days') {
    return this.dashboardService.getOverviewStats(range);
  }

  @Get('low-stock')
  @Permissions('dashboard.read')
  getLowStock() {
    return this.dashboardService.getLowStockAlerts();
  }

  @Get('top-selling')
  @Permissions('dashboard.read')
  getTopSelling(@Query('limit') limit?: number) {
    return this.dashboardService.getTopSellingProducts(limit ? Number(limit) : undefined);
  }

  @Get('chart')
  @Permissions('dashboard.read')
  getChartData(@Query('range') range?: '7days' | '30days') {
    return this.dashboardService.getSalesChartData(range);
  }
}
