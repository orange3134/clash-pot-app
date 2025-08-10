import { Match } from "../types";
import { saveMatch } from "./storage";

/**
 * 選手の支払い状況を更新する
 */
export function updateFighterPaymentStatus(
  match: Match,
  fighterId: string,
  isPaid: boolean
): Match {
  const updatedMatch = {
    ...match,
    paymentStatus: {
      fighters: {
        ...match.paymentStatus?.fighters,
        [fighterId]: isPaid,
      },
      bettors: match.paymentStatus?.bettors || {},
    },
  };

  saveMatch(updatedMatch);
  return updatedMatch;
}

/**
 * ベッターの支払い状況を更新する
 */
export function updateBettorPaymentStatus(
  match: Match,
  bettorId: string,
  isPaid: boolean
): Match {
  const updatedMatch = {
    ...match,
    paymentStatus: {
      fighters: match.paymentStatus?.fighters || {},
      bettors: {
        ...match.paymentStatus?.bettors,
        [bettorId]: isPaid,
      },
    },
  };

  saveMatch(updatedMatch);
  return updatedMatch;
}

/**
 * 選手の支払い状況を取得する
 */
export function getFighterPaymentStatus(
  match: Match,
  fighterId: string
): boolean {
  return match.paymentStatus?.fighters?.[fighterId] || false;
}

/**
 * ベッターの支払い状況を取得する
 */
export function getBettorPaymentStatus(
  match: Match,
  bettorId: string
): boolean {
  return match.paymentStatus?.bettors?.[bettorId] || false;
}
