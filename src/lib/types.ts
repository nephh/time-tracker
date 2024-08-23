// This is a temporary fix for the User typescript error. Waiting for Lucia devs to respond.
import type { User } from "lucia";

export interface CurrentUser extends User {
  username: string;
}
