import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { WorkspaceChat } from "@/modules/workspace/components/workspace-chat";
import db from "@/lib/db";

export default async function ChatPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  // Get the user's first workspace or active workspace
  const workspace = await db.workspace.findFirst({
    where: {
      OR: [
        { ownerId: userId },
        {
          members: {
            some: {
              userId: userId,
            },
          },
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!workspace) {
    redirect("/workspace");
  }

  return (
    <div className="h-full">
      <WorkspaceChat
        workspaceId={workspace.id}
        currentUser={{
          id: userId,
          name: user.fullName || user.username || "User",
          email: user.emailAddresses[0]?.emailAddress || "",
          image: user.imageUrl,
        }}
      />
    </div>
  );
}
