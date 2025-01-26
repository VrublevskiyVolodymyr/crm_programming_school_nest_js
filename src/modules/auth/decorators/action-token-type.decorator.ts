import { SetMetadata } from '@nestjs/common';

import { ActionTokenTypeEnum } from '../enums/action-token-type.enum';

export const ACTION_TOKEN_TYPE_KEY = 'actionTokenType';
export const ActionTokenType = (tokenType: ActionTokenTypeEnum) =>
  SetMetadata(ACTION_TOKEN_TYPE_KEY, tokenType);
