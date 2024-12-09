export interface MiNoteDto {
  id: string;
  createdAt: Date;
  cw: string | null;
  files: [
    {
      id: string;
      name: string;
      properties: {
        width: number;
        height: number;
      };
      thumbnailUrl: string;
      url: string;
    }
  ];
  renote: {
    createdAt: Date;
    cw: string | null;
    id: string;
    text: string;
    user: {
      instance: {
        softwareName: string;
      };
      avatarUrl: string;
      id: string;
      name: string;
      username: string;
      host: string;
    };
  } | null;
  reply: {
    createdAt: Date;
    cw: string | null;
    files: [
      {
        id: string;
        name: string;
        properties: {
          width: number;
          height: number;
        };
        thumbnailUrl: string;
        url: string;
      }
    ];
    id: string;
    text: string;
    user: {
      instance: {
        softwareName: string;
      };
      avatarUrl: string;
      id: string;
      name: string;
      username: string;
      host: string;
    };
  } | null;
  text: string;
  user: {
    instance: {
      softwareName: string;
    };
    avatarUrl: string;
    id: string;
    name: string;
    username: string;
    host: string;
  };
  userId: string;
}
