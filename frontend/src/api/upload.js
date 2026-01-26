import api from "./axios";

export async function uploadImage(file, folder = "misc") {
  const fd = new FormData();
  fd.append("file", file);

  const { data } = await api.post(`/uploads?folder=${encodeURIComponent(folder)}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data.url; // "/uploads/...."
}
