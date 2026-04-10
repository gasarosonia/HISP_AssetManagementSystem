import { Controller, Get, Patch, Param, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications for a user' })
  @ApiQuery({ name: 'userId', required: true })
  getForUser(@Query('userId') userId: string) {
    return this.notificationsService.getForUser(userId);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count for a user' })
  @ApiQuery({ name: 'userId', required: true })
  getUnreadCount(@Query('userId') userId: string) {
    return this.notificationsService
      .getUnreadCount(userId)
      .then((count) => ({ count }));
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiQuery({ name: 'userId', required: true })
  markRead(@Param('id') id: string, @Query('userId') userId: string) {
    return this.notificationsService.markRead(id, userId);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read for a user' })
  @ApiQuery({ name: 'userId', required: true })
  markAllRead(@Query('userId') userId: string) {
    return this.notificationsService.markAllRead(userId);
  }
}
