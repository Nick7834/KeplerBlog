import { ProfileDetail } from "@/components/shared/profileDetail";
import { redirect } from "next/navigation";

export default async function Profile({ params }: { params: Promise<{ id: string }> }) {

    const { id: id } = await params;
    
    const isValidObjectId = /^[a-f\d]{24}$/i.test(id);
    if (!isValidObjectId) {
      redirect('/');
    }

    return (
      <div>
          <ProfileDetail idUser={id} className="mt-[clamp(1.25rem,0.368rem+3.53vw,3.125rem)]" />
      </div>
    );
}