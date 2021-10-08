// An identifier used by the the Web Messaging API to identify the
// correct Spreadsheet Viewer instance where events are coming from.

const $symbol: unique symbol = Symbol('sv id');

// A special nominal type that enforces users not to pass raw strings around -
// the values have to be encapsulated in this type and can only be
// deconstructed using functions in this file.
//
// This was done to ensure that only `SvId` values would be allowed to be
// passed in to certain functions, as `SvId` serves as a pretty important
// security measure. (e.g. it would be possible to send messages to the
// JavaScript API from any cross-origin frame on the host page).
export type SvId = {
  [$symbol]: string
};

export const create = (value: string): SvId => ({ [$symbol]: value });
export const value = (svId: SvId): string => svId[$symbol];
