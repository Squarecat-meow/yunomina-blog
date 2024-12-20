import { MiNoteDto } from "@/app/_dto/MiNote.dto";
import { FaRetweet } from "react-icons/fa";
import MiName from "./nameComponent";

type NoteProps = {
  note: MiNoteDto;
};

export default function MiNote({ note }: NoteProps) {
  return (
    <div className="p-2 border-b border-base-300 border-collapse">
      {note.renote ? (
        <>
          <div className="flex items-center gap-2 mb-1">
            <img
              src={note.user.avatarUrl}
              alt={`${note.user.username} avatar`}
              className="w-6 h-6 object-cover rounded-full"
            />
            <FaRetweet />
            <div className="text-xs flex items-center gap-1">
              <MiName
                size={6}
                instanceType={
                  note.user.instance
                    ? note.user.instance.softwareName
                    : "misskey"
                }
                name={note.user.name}
                host={note.user.host}
              />
              <span> 님이 리노트</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <img
                src={note.renote.user.avatarUrl}
                alt={`${note.renote.user.username} avatar`}
                className="w-10 h-10 object-cover rounded-full"
              />
              <div className="flex flex-col">
                <span className="text-xs font-thin">
                  @{note.renote.user.username}
                </span>
                <span className="text-sm">
                  <MiName
                    size={6}
                    instanceType={
                      note.user.instance
                        ? note.user.instance.softwareName
                        : "misskey"
                    }
                    name={note.renote.user.name}
                    host={note.user.host}
                  />
                </span>
              </div>
            </div>
            <p className="prose break-all whitespace-pre-line">
              {note.renote.text}
            </p>
            {note.renote.files.length > 0 && (
              <>
                {note.renote.files.map((el) => (
                  <div key={el.id} className="flex justify-center h-36">
                    <img
                      src={el.thumbnailUrl}
                      alt={el.name}
                      className="object-contain"
                    />
                  </div>
                ))}
              </>
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center gap-2">
          <img
            src={note.user.avatarUrl}
            alt={`${note.user.username} avatar`}
            className="w-10 h-10 object-cover rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-xs font-thin">@{note.user.username}</span>
            <div className="text-sm">
              <MiName
                size={6}
                instanceType={
                  note.user.instance
                    ? note.user.instance.softwareName
                    : "misskey"
                }
                name={note.user.name}
                host={note.user.host}
              />
            </div>
          </div>
        </div>
      )}
      {note.cw !== null ? (
        <>
          <div className="collapse collapse-arrow border border-base-300 my-2">
            <input type="checkbox" />
            <div className="collapse-title flex items-center px-2 prose">
              <p className="w-[calc(100%-2rem)]">{note.cw}</p>
            </div>
            <div className="collapse-content px-2">
              <p className="prose break-all whitespace-pre-line">{note.text}</p>
              {note.files.length > 0 && (
                <>
                  {note.files.map((el) => (
                    <div key={el.id} className="flex justify-center h-36">
                      <img
                        src={el.thumbnailUrl}
                        alt={el.name}
                        className="object-contain"
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="prose break-all leading-normal whitespace-pre-line">
            {note.text}
          </p>
          {note.files.length > 0 && (
            <>
              {note.files.map((el) => (
                <div key={el.id} className="flex justify-center h-36">
                  <img
                    src={el.thumbnailUrl}
                    alt={el.name}
                    className="object-contain"
                  />
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}
