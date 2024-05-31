import { InputType, OmitType } from '@nestjs/graphql';
import { omittedEntityMetaColumns } from '../../../common';
import { ExchangeRate } from '../../../entities';

@InputType()
export class CreateExchangeRateInputType extends OmitType(
    ExchangeRate,
    ['id', ...omittedEntityMetaColumns],
    InputType
) {}
