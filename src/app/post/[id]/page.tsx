import { PostDetails } from "@/components/shared/postDetailsId";
import { redirect } from "next/navigation";

export default async function PostDetail({ params }: { params: Promise<{ id: string }> }) {

    const { id: id } = await params;

    if(!id) redirect('/');

    const isValidObjectId = /^[a-f\d]{24}$/i.test(id);
    if (!isValidObjectId) redirect('/');

    return (
        <div>
           <PostDetails idPost={id}  />
        </div>
    );
}