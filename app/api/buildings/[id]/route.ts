import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // console.log("RAW PARAM:", (await params).id);

  const id = Number((await params).id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid building id" }, { status: 400 });
  }

  const building = await prisma.buildings.findUnique({
    where: { building_id: id },
  });

  if (!building) {
    return NextResponse.json({ error: "Building not found" }, { status: 404 });
  }

  return NextResponse.json(building);
}

// export async function PUT(
//   req: Request,
//   { params }: { params: Promise<{ id: number }> },
// ) {
//   const { id } = await params;
//   const { building_name, building_number, total_floors } = await req.json();

//   try {
//     const updatedBuilding = await prisma.buildings.update({
//       where: {
//         building_id: id,
//       },
//       data: {
//         building_name,
//         building_number,
//         total_floors,
//       },
//     });
//     return NextResponse.json(updatedBuilding);
//   } catch (error: any) {
//     return NextResponse.json(
//       {
//         error: error.message,
//       },
//       { status: 500 },
//     );
//   }
// }

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = Number((await params).id);
  const { building_name, building_number, total_floors } = await req.json();

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid building id" }, { status: 400 });
  }

  const updatedBuilding = await prisma.buildings.update({
    where: { building_id: id },
    data: {
      building_name,
      building_number,
      total_floors,
    },
  });

  return NextResponse.json(updatedBuilding);
}

// export async function DELETE(
//   req: Request,
//   { params }: { params: Promise<{ id: number }> },
// ) {
//   const { id } = await params;
//   try {
//     await prisma.buildings.delete({
//       where: {
//         building_id: id,
//       },
//     });
//     return NextResponse.json({ message: "Building deleted" });
//   } catch (error: any) {
//     return NextResponse.json(
//       {
//         error: error.message,
//       },
//       { status: 500 },
//     );
//   }
// }

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = Number((await params).id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid building id" }, { status: 400 });
  }

  await prisma.buildings.delete({
    where: { building_id: id },
  });

  return NextResponse.json({ message: "Building deleted" });
}
