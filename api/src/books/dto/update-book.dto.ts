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

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  author?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(?:\d{9}[\dX]|\d{13})$/)
  isbn?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  totalCopies?: number;

  @IsOptional()
  @IsUUID()
  genreId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  publishedYear?: number;
}