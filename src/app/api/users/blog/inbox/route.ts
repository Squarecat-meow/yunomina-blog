import { sendApiError } from "@/utils/apiHandler/sendApiError";
import { NextRequest, NextResponse } from "next/server";
import { AP } from "activitypub-core-types";
import { parseRequest, ParseResponse, verifySignature } from "http-signature";
import { ClientRequest } from "http";
import {
  createHash,
  createVerify,
  privateDecrypt,
  publicDecrypt,
} from "crypto";

async function fetchActorInformation(
  actorUrl: string
): Promise<AP.Actor | null> {
  try {
    const response = await fetch(actorUrl, {
      headers: {
        "Content-type": "application/activity+json",
        Accept: "application/activity+json",
      },
      signal: AbortSignal.timeout(5000), // kill after 5 seconds
    });

    return await response.json();
  } catch (error) {
    console.log("Unable to fetch actor information", actorUrl);
  }
  return null;
}

function hashAndVerify(
  signature: ParseResponse,
  actor: AP.Actor,
  headerSignature: string
) {
  const hashedSignature = createHash("sha256")
    .update(signature.signingString)
    .digest("base64");
  const decryptedHash = publicDecrypt(
    actor.publicKey!.publicKeyPem,
    Buffer.from(signature.params.signature, "base64")
  ).toString("base64");

  console.log(hashedSignature);

  // const verifier = createVerify("sha256");
  // verifier.write(signature.signingString);
  // verifier.end();

  // console.log(
  //   verifier.verify(
  //     actor.publicKey!.publicKeyPem,
  //     signature.params.signature,
  //     "base64"
  //   )
  // );

  // console.log("hashed Signature: ", hashedSignature);
  // console.log("decrypted Signature: ", decryptedSignature);

  // if (hashedSignature === decryptedSignature) return true;
  // else return false;
}

export async function POST(req: NextRequest) {
  const a = new Map<string, string>([]);
  const h = req.headers.entries();
  for (const e of h) {
    const [k, v] = e;
    a.set(k, v);
  }

  const he = Object.fromEntries(a);
  const newHeader = {} as ClientRequest;
  Object.assign(newHeader, { headers: he });
  Object.assign(newHeader, { method: req.method });
  Object.assign(newHeader, { url: req.url });
  Object.assign(newHeader, { httpVersion: "HTTP/1.1" });

  const signature = parseRequest(newHeader);
  if (!signature) return sendApiError(401, "HTTP 시그니쳐가 없어요!");
  const actorInformation = await fetchActorInformation(signature.params.keyId);
  if (!actorInformation || !actorInformation.publicKey)
    return sendApiError(401, "액터 정보를 가져올 수 없어요!");

  //const isVerified = hashAndVerify(signature, actorInformation, he.signature);

  // const isVerified = verifySignature(
  //   signature,
  //   actorInformation.publicKey.publicKeyPem
  // );

  console.log(signature);
  console.log(actorInformation.publicKey.publicKeyPem);

  const verifier = createVerify(signature.params.algorithm)
    .update(signature.signingString)
    .end();
  const isVerified = verifier.verify(
    actorInformation.publicKey.publicKeyPem,
    signature.signingString,
    "base64"
  );

  if (isVerified === false) {
    console.log("검증에 실패했어요! ", isVerified);
    return sendApiError(401, "검증에 실패했어요!");
  }

  console.log(isVerified);

  return NextResponse.json("성공!");
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    "@context": "https://www.w3.org/ns/activitystreams",
    summary: "놋치미나 블로그의 Inbox",
    type: "OrderedCollection",
    totalItems: 0,
    orderedItems: [],
  });
}
