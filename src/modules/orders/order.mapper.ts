import { CommentEntity } from '../../database/entities/comment.entity';
import { GroupEntity } from '../../database/entities/group.entity';
import { OrderEntity } from '../../database/entities/order.entity';
import { CommentResDto } from '../comments/dto/res/comment.res.dto';
import { GroupResDto } from '../groups/dto/res/group.res.dto';
import { AdminUserResDto } from '../users/dto/res/admin-user.res.dto';
import { UserMapper } from '../users/user.mapper';
import { BaseOrderDto } from './dto/req/base-order.dto';
import { ExcelOrderDto } from './dto/req/excel-order.dto';

export class OrderMapper {
  public static toBaseOrderDto(entity: OrderEntity): BaseOrderDto {
    const dto = new BaseOrderDto();

    dto.id = Number(entity.id);
    dto.name = entity.name;
    dto.surname = entity.surname;
    dto.email = entity.email;
    dto.phone = entity.phone;
    dto.age = entity.age;
    dto.course = entity.course;
    dto.course_format = entity.course_format;
    dto.course_type = entity.course_type;
    dto.alreadyPaid = entity.alreadyPaid;
    dto.sum = entity.sum;
    dto.msg = entity.msg;
    dto.status = entity.status;
    dto.created_at = entity.created_at;
    dto.utm = entity.utm;

    if (entity.manager) {
      dto.manager = UserMapper.toAdminResponseDTO(entity.manager);
    } else dto.manager = null;

    if (entity.group) {
      dto.group = OrderMapper.mapToGroupResDto(entity.group);
    } else dto.group = null;

    if (entity.comments) {
      dto.comments = entity.comments.map(OrderMapper.mapToCommentResDto);
    }

    return dto;
  }

  public static mapToGroupResDto(group: GroupEntity): GroupResDto {
    return {
      id: group.id,
      name: group.name,
    } as GroupResDto;
  }

  public static mapToCommentResDto(comment: CommentEntity): CommentResDto {
    let manager: AdminUserResDto | null = null;

    if (comment.manager) {
      manager = UserMapper.toAdminResponseDTO(comment.manager);
    }

    return {
      id: comment.id,
      comment: comment.comment,
      order_id: Number(comment.order_id),
      manager: manager,
      created_at: comment.created_at,
    } as CommentResDto;
  }

  public static toExcelOrderDto(entity: OrderEntity): ExcelOrderDto {
    const dto = new ExcelOrderDto();

    dto.id = Number(entity.id);
    dto.name = entity.name;
    dto.surname = entity.surname;
    dto.email = entity.email;
    dto.phone = entity.phone;
    dto.age = entity.age;
    dto.course = entity.course;
    dto.course_format = entity.course_format;
    dto.course_type = entity.course_type;
    dto.alreadyPaid = entity.alreadyPaid;
    dto.sum = entity.sum;
    dto.status = entity.status;
    dto.created_at = entity.created_at
      ? new Date(entity.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : null;

    dto.manager = entity.manager ? entity.manager.name : null;
    dto.group = entity.group ? entity.group.name : null;

    return dto;
  }
}
