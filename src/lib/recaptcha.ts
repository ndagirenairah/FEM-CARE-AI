const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const MIN_SCORE = 0.5;

type RecaptchaResponse = {
  success: boolean;
  score?: number;
  action?: string;
};

export async function verifyRecaptcha(token: unknown, expectedAction: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }
  if (typeof token !== "string" || token.length < 20 || token.length > 4096) {
    return false;
  }

  const body = new URLSearchParams({ secret, response: token });
  const response = await fetch(VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });
  if (!response.ok) return false;

  const result = (await response.json()) as RecaptchaResponse;
  return result.success === true && result.action === expectedAction && (result.score ?? 0) >= MIN_SCORE;
}
