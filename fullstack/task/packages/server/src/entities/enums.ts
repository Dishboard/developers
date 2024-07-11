import { registerEnumType } from '@nestjs/graphql';

export enum Language {
    CZ = 'CZ',
    EN = 'EN',
}

export const isLanguage = (value: string): value is Language =>
    Object.values(Language).includes(value as Language);

registerEnumType(Language, {
    name: 'Language',
    description: 'The supported languages for exchange rates',
});
