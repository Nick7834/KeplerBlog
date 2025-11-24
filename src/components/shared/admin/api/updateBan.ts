import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export async function updateBan(
  id: string,
  reason: string,
  queryClient: QueryClient,
  category: "post" | "user"
) {
  try {
    if (category === "user") {
      const resp = await axios.patch(`/api/admin/banUser/${id}`, { reason });

      if (resp.status === 200) {
        toast.success(resp.data.message);
      }

      if (resp.status === 400) {
        toast.error(resp.data.message);
      }

      queryClient.invalidateQueries({ queryKey: ["usersAdmin"] });
    }

    if (category === "post") {
      const resp = await axios.patch(`/api/admin/banPost/${id}`, { reason });

      if (resp.status === 200) {
        toast.success(resp.data.message);
      }

      if (resp.status === 400) {
        toast.error(resp.data.message);
      }

      queryClient.invalidateQueries({ queryKey: ["postsAdmin"] });
    }
  } catch (err) {
    toast.error("Something went wrong");
    console.error(err);
  }
}
