import { MiNoteDto } from "@/app/_dto/MiNote.dto";
import { useCallback, useEffect, useState } from "react";
import MiNote from "./note";
import { MiUserDto } from "@/app/_dto/MiUser.dto";
import MiName from "./nameComponent";
import { SiMisskey } from "react-icons/si";

type TimelineProps = {
  handle: string;
};

export default function MisskeyTimeline({ handle }: TimelineProps) {
  const [notes, setNotes] = useState<MiNoteDto[]>();
  const [hostAndUsername, setHostAndUsername] = useState<{
    host: string;
    username: string;
  }>({ host: "", username: "" });
  const [profile, setProfile] = useState<MiUserDto>();
  const fetchFirstTenNotes = async (host: string, username: string) => {
    const userRes = await fetch(
      `https://${host}/api/users/search-by-username-and-host`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          limit: 2,
          detail: true,
          username: username,
          host: host,
        }),
      }
    );
    const accountId = await userRes.json().then((res) => res[0].id);

    const noteRes = await fetch(`https://${host}/api/users/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: accountId,
        withReplies: true,
        withRenotes: true,
        limit: 10,
        withFiles: false,
      }),
    });
    const firstTenNotes = (await noteRes.json()) as MiNoteDto[];

    return firstTenNotes;
  };

  const misskeyHandleRegex = (handle: string) => {
    const hostRegex = new RegExp(/(:?@)[^@\s\n\r\t]+$/g);
    const usernameRegex = new RegExp(/(?<=@)[\w]+(?=@)/g);
    const host = handle.match(hostRegex)?.[0].replace("@", "");
    const username = handle.match(usernameRegex)?.[0];
    return { host, username };
  };

  const startWebSocket = (host: string, username: string) => {
    const ws = new WebSocket(
      `wss://${host}/streaming?i=${process.env.NEXT_PUBLIC_MISSKEY_STREAMING_TOKEN_SERAFUKU}`
    );

    ws.onopen = () => {
      console.log("웹소켓이 열렸어요!");
      ws.send(
        JSON.stringify({
          type: "connect",
          body: { channel: "homeTimeline", id: "3" },
        })
      );
    };
    ws.onmessage = (msg) => {
      const note = JSON.parse(msg.data)?.body.body as MiNoteDto;

      if (note.user.username === username) {
        setNotes((prevNote) => [note, ...(prevNote ? prevNote : [])]);
      } else {
        return;
      }
    };
    ws.onclose = (e: CloseEvent) => {
      if (e.wasClean) {
        console.log("웹소켓이 깨끗하게 닫혔어요");
      } else {
        console.log("웹소켓이 지저분하게 닫혔어요!");
        startWebSocket(host, username);
      }
    };
  };

  const fn = useCallback(async (host: string, username: string) => {
    const firstTenNotes = await fetchFirstTenNotes(host, username);
    setNotes(firstTenNotes);
    startWebSocket(host, username);
    const res = await fetch(
      `https://${host}/api/users/search-by-username-and-host`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          limit: 2,
          detail: true,
          username: username,
          host: host,
        }),
      }
    );
    const serverProfile = (await res.json()) as MiUserDto[];
    setProfile(serverProfile[0]);
  }, []);

  useEffect(() => {
    if (handle && handle !== "") {
      const { host, username } = misskeyHandleRegex(handle);
      if (!host || !username) return;

      setHostAndUsername({ host: host, username: username });
      fn(host, username);
    }
  }, [fn, handle]);

  return (
    <div className="overflow-y-scroll rounded-box border border-base-300 shadow w-full desktop:h-[48rem]">
      {profile && profile.avatarUrl && (
        <div className="w-full flex justify-center py-2 border-b border-base-300">
          <div className="text-lg flex items-center gap-1">
            <img
              src={profile.avatarUrl}
              alt="Misskey user avatar"
              className="h-12 rounded-full"
            />
            <MiName
              name={profile.name}
              host={hostAndUsername.host}
              instanceType={profile.instance?.softwareName ?? "serafuku.moe"}
              size={6}
            />
            <span>의</span>
            <SiMisskey size={24} fill="#739900" />
          </div>
        </div>
      )}
      {notes ? (
        <>
          {notes.map((note) => (
            <div key={note.id} className="w-full">
              <MiNote note={note} />
            </div>
          ))}
        </>
      ) : (
        <div className="w-full h-full flex justify-center">
          <span className="loading loading-spinner" />
        </div>
      )}
    </div>
  );
}
