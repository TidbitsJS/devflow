import { Webhook, WebhookRequiredHeaders } from "svix";
import { headers } from "next/headers";

import { IncomingHttpHeaders } from "http";

import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs";
import { createUser } from "@/lib/actions/user.action";

// Resource: https://clerk.com/docs/integration/webhooks#supported-events
// Above document lists the supported events
type EventType = "user.created" | "user.updated" | "user.deleted";

type Event = {
  data: Record<string, string | number | Record<string, string>[]>;
  object: "event";
  type: EventType;
};

export const POST = async (request: Request) => {
  const payload = await request.json();
  const header = headers();

  const heads = {
    "svix-id": header.get("svix-id"),
    "svix-timestamp": header.get("svix-timestamp"),
    "svix-signature": header.get("svix-signature"),
  };

  // Activitate Webhook in the Clerk Dashboard.
  // After adding the endpoint, you'll see the secret on the right side.
  const wh = new Webhook(process.env.NEXT_CLERK_WEBHOOK_SECRET || "");

  let evnt: Event | null = null;

  try {
    evnt = wh.verify(
      JSON.stringify(payload),
      heads as IncomingHttpHeaders & WebhookRequiredHeaders
    ) as Event;
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 400 });
  }

  const eventType: EventType = evnt?.type!;

  if (eventType === "user.created") {
    const { id, email_addresses, image_url, username, first_name, last_name } =
      evnt.data;

    const mongoUser = await createUser({
      name: `${first_name}${last_name}`,
      username,
      email: email_addresses[0].email_address,
      picture: image_url,
    });

    return NextResponse.json({ message: "Ok", user: mongoUser });
  }

  if (eventType === "user.updated") {
    const { id, username, first_name } = evnt.data;

    console.log("User Updated", { id, username, first_name });
    return NextResponse.json({ message: "Ok" });
  }

  if (eventType === "user.deleted") {
    const { id } = evnt.data;

    console.log("User Deleted", { id });
    return NextResponse.json({ message: "Ok" });
  }
};
