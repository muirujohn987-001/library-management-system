import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsUUID,
  IsOptional,
  Min,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  author!: string;

  @IsString()
  @Matches(/^(?:\d{9}[\dX]|\d{13})$/, {
    message: 'ISBN must contain a valid 10 or 13 character ISBN',
  })
  isbn!: string;

  @IsInt()
  @Min(1)
  totalCopies!: number;

  @IsUUID()
  genreId!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  publishedYear?: number;
}