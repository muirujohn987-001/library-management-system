import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE A BOOK
  async create(createBookDto: CreateBookDto) {
    const { genreId, totalCopies, ...bookDetails } = createBookDto;

    // Check whether the supplied genre exists
    const genre = await this.prisma.genre.findUnique({
      where: { id: genreId },
    });

    if (!genre) {
      throw new NotFoundException('Genre not found');
    }

    try {
      return await this.prisma.book.create({
        data: {
          ...bookDetails,
          totalCopies,
          availableCopies: totalCopies,
          genre: {
            connect: { id: genreId },
          },
        },
        include: { genre: true },
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException('A book with this ISBN already exists');
      }
      throw error;
    }
  }

  // FIND ALL BOOKS WITH SEARCH, FILTERING AND PAGINATION
  async findAll(options: {
    genreId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { genreId, search } = options;

    const page = Math.max(1, options.page ?? 1);
    const limit = Math.min(100, Math.max(1, options.limit ?? 10));

    const where = {
      ...(genreId ? { genreId } : {}),
      ...(search
        ? {
            OR: [
              {
                title: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
              {
                author: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
            ],
          }
        : {}),
    };

    const [books, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        include: { genre: true },
        orderBy: { title: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),

      this.prisma.book.count({ where }),
    ]);

    return {
      data: books,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // FIND ONE BOOK
  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { genre: true },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  // UPDATE A BOOK
  async update(id: string, updateBookDto: UpdateBookDto) {
    const existingBook = await this.findOne(id);

    const {
      genreId,
      totalCopies,
      title,
      author,
      isbn,
      publishedYear,
    } = updateBookDto;

    if (genreId) {
      const genre = await this.prisma.genre.findUnique({
        where: { id: genreId },
      });

      if (!genre) {
        throw new NotFoundException('Genre not found');
      }
    }

    const data = {
      ...(title !== undefined ? { title } : {}),
      ...(author !== undefined ? { author } : {}),
      ...(isbn !== undefined ? { isbn } : {}),
      ...(publishedYear !== undefined ? { publishedYear } : {}),
      ...(genreId !== undefined
        ? { genre: { connect: { id: genreId } } }
        : {}),
      ...(totalCopies !== undefined
        ? {
            totalCopies,
            availableCopies:
              totalCopies -
              (existingBook.totalCopies - existingBook.availableCopies),
          }
        : {}),
    };

    if (
      totalCopies !== undefined &&
      totalCopies <
        existingBook.totalCopies - existingBook.availableCopies
    ) {
      throw new BadRequestException(
        'Total copies cannot be less than the number of borrowed copies',
      );
    }

    try {
      return await this.prisma.book.update({
        where: { id },
        data,
        include: { genre: true },
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException('A book with this ISBN already exists');
      }
      throw error;
    }
  }

  // DELETE A BOOK
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.book.delete({
      where: { id },
    });
  }
}

// Helper function for detecting duplicate ISBN errors
function isUniqueConstraintError(
  error: unknown,
): error is { code: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'P2002'
  );
}