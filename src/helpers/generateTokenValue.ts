// Generate a random 8 digit number as the email token
export function generateEmailToken(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}
