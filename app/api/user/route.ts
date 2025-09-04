import { db } from "@/server/db";
import { usersTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

interface UserRequestBody {
  email: string;
  name: string;
  userId: string;
}

export async function POST(req: Request) {
  const { email, name, userId }: UserRequestBody = await req.json();

  const user = await db.select().from(usersTable).where(eq(usersTable.email, email));

  if (user.length === 0) {
    const result = await db
      .insert(usersTable)
      .values({
        name,
        email,
        userId,
      })
      .returning({
        name: usersTable.name,
        email: usersTable.email,
        userId: usersTable.userId,
      });

    return NextResponse.json(result);
  }

  return NextResponse.json(user[0]);
}
