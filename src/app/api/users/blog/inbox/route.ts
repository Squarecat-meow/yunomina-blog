import { sendApiError } from "@/utils/apiHandler/sendApiError";
import { NextRequest, NextResponse } from "next/server";
import { AP } from "activitypub-core-types";
import { parse, ParseResponse, verifySignature } from "http-signature";
import { ClientRequest } from "http";

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

function verify(signature: ParseResponse, publicKeyJson: AP.Actor) {
  let signatureValid;

  try {
    // Verify the signature
    signatureValid = verifySignature(
      signature,
      publicKeyJson.publicKey!.publicKeyPem
    );
  } catch (error) {
    console.log("Signature Verification error", error);
  }

  return signatureValid;
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
  Object.assign(newHeader, { httpVersion: "HTTP/2.0" });

  const signature = parse(newHeader);
  if (!signature) return sendApiError(401, "HTTP 시그니쳐가 없어요!");
  // const signatureObject = parseSignature(signature);
  // if (!signatureObject)
  //   return sendApiError(400, "HTTP 시그니쳐가 맞지 않아요!");

  const actorInformation = await fetchActorInformation(signature.params.keyId);
  if (!actorInformation || !actorInformation.publicKey)
    return sendApiError(401, "액터 정보를 가져올 수 없어요!");
  const isVerified = verify(signature, actorInformation);

  if (isVerified === false || typeof isVerified !== "boolean") {
    console.log("검증에 실패했어요! ", isVerified);
    return sendApiError(405, "검증에 실패했어요!");
  }

  console.log(isVerified);

  return NextResponse.json("성공!");
}
