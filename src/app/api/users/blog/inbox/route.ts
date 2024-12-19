import { sendApiError } from "@/utils/apiHandler/sendApiError";
import { NextRequest, NextResponse } from "next/server";
import { AP } from "activitypub-core-types";
import { verify } from "crypto";

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

function parseSignature(signature: string) {
  const parseRegex = /"[^"]*"/g;
  const parsedSignature = signature.match(parseRegex);
  if (!parsedSignature) return;

  const signatureObject = {
    keyId: parsedSignature[0].replaceAll('"', ""),
    algorithm: parsedSignature[1].replaceAll('"', ""),
    signature: parsedSignature[3].replaceAll('"', ""),
  };

  return signatureObject;
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const dataBuffer = Buffer.from(JSON.stringify(data));
  const signature = req.headers.get("signature");
  if (!signature) return sendApiError(401, "HTTP 시그니쳐가 없어요!");
  const signatureObject = parseSignature(signature);
  if (!signatureObject)
    return sendApiError(400, "HTTP 시그니쳐가 맞지 않아요!");

  const actorInformation = await fetchActorInformation(signatureObject.keyId);
  if (!actorInformation || !actorInformation.publicKey)
    return sendApiError(401, "액터 정보를 가져올 수 없어요!");
  const keyBuffer = Buffer.from(signatureObject.signature);

  const isVerified = verify(
    signatureObject.algorithm,
    dataBuffer,
    actorInformation.publicKey.publicKeyPem,
    keyBuffer
  );

  if (isVerified === false || typeof isVerified !== "boolean") {
    console.log("검증에 실패했어요! ", isVerified);
    return sendApiError(405, "검증에 실패했어요!");
  }

  console.log(isVerified);

  return NextResponse.json("성공!");
}
