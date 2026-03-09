import { prisma } from "./prisma";

interface GetBuildingsParams {
  page: number;
  search: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export async function getBuildings({
  page,
  search,
  sortBy,
  sortOrder,
}: GetBuildingsParams) {
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const where = search
    ? {
        building_name: {
          contains: search,
          mode: "insensitive" as const,
        },
      }
    : {};

  const [data, totalItems] = await Promise.all([
    prisma.buildings.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: pageSize,
    }),
    prisma.buildings.count({ where }),
  ]);

  return {
    data,
    pagination: {
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
      currentPage: page,
      pageSize,
    },
  };
}
