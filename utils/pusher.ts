// utils/pusher.ts
import Pusher from "pusher-js";

export const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
  forceTLS: true,
  wsHost: "127.0.0.1",
  wsPort: 6001,
});

if (process.env.NODE_ENV === "development") {
  // ambil tipe connection secara aman dari prototype Pusher
  type PusherConnection = (typeof Pusher)["prototype"]["connection"];

  const conn = (pusher as unknown as { connection: PusherConnection }).connection;

  conn.bind("connected", () => {
    // jangan pakai any — log connection object atau socket id kalau tersedia
    console.info("Pusher connected:", conn);
  });

  conn.bind("error", (err: unknown) => {
    console.warn("Pusher error:", err);
  });
}
